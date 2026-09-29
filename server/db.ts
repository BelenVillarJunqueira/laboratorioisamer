import type { MongoClient as MongoClientType, Db as DbType } from 'mongodb';
import type { Pool as PoolType } from 'pg';

export interface DbStatus {
    isConnected: boolean;
    type: 'mongodb' | 'postgres' | 'local_disk';
    details: string;
    databaseUrlSet: boolean;
    providerName?: string;
}

// Database clients
let mongoClient: MongoClientType | any = null;
let mongoDb: DbType | any = null;
let pgPool: PoolType | any = null;

let activeDbType: 'mongodb' | 'postgres' | 'local_disk' = 'local_disk';
let isDbConnected = false;
let connectionError: string | null = null;

function getMongoUri(): string | null {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL;
    if (uri && (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))) {
        return uri.trim();
    }
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl && (dbUrl.startsWith('mongodb://') || dbUrl.startsWith('mongodb+srv://'))) {
        return dbUrl.trim();
    }
    return null;
}

function getPostgresUri(): string | null {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PG_CONNECTION_STRING;
    if (url && (url.startsWith('postgres://') || url.startsWith('postgresql://'))) {
        return url.trim();
    }
    return null;
}

// Extract database name from mongo URI or fallback to 'isamer_store'
function getMongoDatabaseName(uri: string): string {
    try {
        const parsed = new URL(uri.replace('mongodb+srv://', 'http://').replace('mongodb://', 'http://'));
        const pathname = parsed.pathname.replace(/^\//, '').split('?')[0];
        if (pathname && pathname.length > 0) {
            return pathname;
        }
    } catch { }
    return 'isamer_store';
}

export async function initDb(): Promise<boolean> {
    const mongoUri = getMongoUri();
    const postgresUri = getPostgresUri();

    // 1. Try MongoDB first (MongoDB Atlas Free Tier - Never expires)
    if (mongoUri) {
        try {
            if (mongoClient) {
                await mongoClient.close().catch(() => { });
            }

            let MongoClientClass: any;
            try {
                const mongoPkg = await import('mongodb');
                MongoClientClass = mongoPkg.MongoClient;
            } catch (loadErr: any) {
                throw new Error(`Módulo mongodb no encontrado en node_modules. Ejecutá 'npm install' en tu terminal. (${loadErr.message})`);
            }

            mongoClient = new MongoClientClass(mongoUri, {
                serverSelectionTimeoutMS: 8000,
                connectTimeoutMS: 10000,
                maxPoolSize: 10
            });

            await mongoClient.connect();
            const dbName = getMongoDatabaseName(mongoUri);
            mongoDb = mongoClient.db(dbName);

            // Verify connection with ping
            await mongoDb.command({ ping: 1 });

            // Create indexes for high performance
            await mongoDb.collection('store_data').createIndex({ _id: 1 });
            await mongoDb.collection('store_images').createIndex({ filename: 1 });

            activeDbType = 'mongodb';
            isDbConnected = true;
            connectionError = null;
            console.log(`✅ [MONGODB] Conexión exitosa a MongoDB Atlas (${dbName}). Persistencia 100% permanente sin vencimiento de 30 días.`);
            return true;
        } catch (mErr: any) {
            console.error('⚠️ [MONGODB] Error al conectar a MongoDB:', mErr.message);
            connectionError = `MongoDB: ${mErr.message}`;
            isDbConnected = false;
            activeDbType = 'local_disk';
            // Continue to check Postgres fallback if available
        }
    }

    // 2. Try PostgreSQL if configured
    if (postgresUri) {
        try {
            if (pgPool) {
                await pgPool.end().catch(() => { });
            }

            let PoolClass: any;
            try {
                const pgPkg = await import('pg');
                PoolClass = pgPkg.Pool || (pgPkg as any).default?.Pool || pgPkg.default;
            } catch (loadErr: any) {
                throw new Error(`Módulo pg no encontrado en node_modules. Ejecutá 'npm install' en tu terminal. (${loadErr.message})`);
            }

            const isLocalhost = postgresUri.includes('localhost') || postgresUri.includes('127.0.0.1');

            pgPool = new PoolClass({
                connectionString: postgresUri,
                ssl: isLocalhost ? false : { rejectUnauthorized: false },
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 6000
            });

            pgPool.on('error', (err: any) => {
                console.error('[POSTGRES POOL ERROR]:', err.message);
                isDbConnected = false;
                connectionError = err.message;
            });

            const client = await pgPool.connect();
            try {
                await client.query(`
          CREATE TABLE IF NOT EXISTS store_data (
            key VARCHAR(50) PRIMARY KEY,
            data JSONB NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);

                await client.query(`
          CREATE TABLE IF NOT EXISTS store_images (
            filename VARCHAR(255) PRIMARY KEY,
            data TEXT NOT NULL,
            mime_type VARCHAR(100) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);

                activeDbType = 'postgres';
                isDbConnected = true;
                connectionError = null;
                console.log('✅ [POSTGRES] Conexión exitosa a PostgreSQL.');
                return true;
            } finally {
                client.release();
            }
        } catch (pgErr: any) {
            console.error('⚠️ [POSTGRES] Error al conectar a PostgreSQL:', pgErr.message);
            connectionError = `PostgreSQL: ${pgErr.message}`;
            isDbConnected = false;
            activeDbType = 'local_disk';
        }
    }

    // Fallback: local disk
    activeDbType = 'local_disk';
    isDbConnected = false;
    console.log('[DATABASE] Ninguna base de datos remota activa. Usando persistencia en disco local (data/store.json).');
    return false;
}

export async function loadDbState(): Promise<any | null> {
    // MongoDB
    if (activeDbType === 'mongodb' && mongoDb && isDbConnected) {
        try {
            const doc = await mongoDb.collection('store_data').findOne({ _id: 'storeState' as any });
            if (doc && doc.data && typeof doc.data === 'object') {
                return doc.data;
            }
            return null;
        } catch (err: any) {
            console.error('[MONGODB] Error reading storeState:', err.message);
            return null;
        }
    }

    // PostgreSQL
    if (activeDbType === 'postgres' && pgPool && isDbConnected) {
        try {
            const res = await pgPool.query(`SELECT data FROM store_data WHERE key = 'storeState' LIMIT 1;`);
            if (res.rows && res.rows.length > 0) {
                const data = res.rows[0].data;
                if (data && typeof data === 'object') {
                    return data;
                }
            }
            return null;
        } catch (err: any) {
            console.error('[POSTGRES] Error reading storeState:', err.message);
            return null;
        }
    }

    return null;
}

export async function saveDbState(data: any): Promise<boolean> {
    // MongoDB
    if (activeDbType === 'mongodb' && mongoDb && isDbConnected) {
        try {
            await mongoDb.collection('store_data').updateOne(
                { _id: 'storeState' as any },
                { $set: { data, updatedAt: new Date() } },
                { upsert: true }
            );
            return true;
        } catch (err: any) {
            console.error('[MONGODB] Error saving storeState:', err.message);
            return false;
        }
    }

    // PostgreSQL
    if (activeDbType === 'postgres' && pgPool && isDbConnected) {
        try {
            await pgPool.query(
                `INSERT INTO store_data (key, data, updated_at)
         VALUES ('storeState', $1, NOW())
         ON CONFLICT (key) DO UPDATE
         SET data = EXCLUDED.data, updated_at = NOW();`,
                [JSON.stringify(data)]
            );
            return true;
        } catch (err: any) {
            console.error('[POSTGRES] Error saving storeState:', err.message);
            return false;
        }
    }

    return false;
}

export async function saveDbImage(filename: string, base64Data: string, mimeType: string): Promise<boolean> {
    // MongoDB
    if (activeDbType === 'mongodb' && mongoDb && isDbConnected) {
        try {
            await mongoDb.collection('store_images').updateOne(
                { _id: filename as any },
                {
                    $set: {
                        filename,
                        data: base64Data,
                        mime_type: mimeType,
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            );
            return true;
        } catch (err: any) {
            console.error('[MONGODB] Error saving image:', err.message);
            return false;
        }
    }

    // PostgreSQL
    if (activeDbType === 'postgres' && pgPool && isDbConnected) {
        try {
            await pgPool.query(
                `INSERT INTO store_images (filename, data, mime_type, created_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (filename) DO UPDATE
         SET data = EXCLUDED.data, mime_type = EXCLUDED.mime_type;`,
                [filename, base64Data, mimeType]
            );
            return true;
        } catch (err: any) {
            console.error('[POSTGRES] Error saving image to DB:', err.message);
            return false;
        }
    }

    return false;
}

export async function getDbImage(filename: string): Promise<{ data: string; mime_type: string } | null> {
    // MongoDB
    if (activeDbType === 'mongodb' && mongoDb && isDbConnected) {
        try {
            const doc = await mongoDb.collection('store_images').findOne({ _id: filename as any });
            if (doc && doc.data) {
                return {
                    data: doc.data as string,
                    mime_type: (doc.mime_type as string) || 'image/jpeg'
                };
            }
            return null;
        } catch (err: any) {
            console.error('[MONGODB] Error fetching image:', err.message);
            return null;
        }
    }

    // PostgreSQL
    if (activeDbType === 'postgres' && pgPool && isDbConnected) {
        try {
            const res = await pgPool.query(
                `SELECT data, mime_type FROM store_images WHERE filename = $1 LIMIT 1;`,
                [filename]
            );
            if (res.rows && res.rows.length > 0) {
                return {
                    data: res.rows[0].data,
                    mime_type: res.rows[0].mime_type
                };
            }
            return null;
        } catch (err: any) {
            console.error('[POSTGRES] Error fetching image from DB:', err.message);
            return null;
        }
    }

    return null;
}

export function getDbStatus(): DbStatus {
    if (isDbConnected && activeDbType === 'mongodb') {
        return {
            isConnected: true,
            type: 'mongodb',
            providerName: 'MongoDB Atlas',
            details: 'Conectado a MongoDB Atlas (Gratis permanente - No vence). Catálogo e imágenes 100% protegidos.',
            databaseUrlSet: true
        };
    }

    if (isDbConnected && activeDbType === 'postgres') {
        return {
            isConnected: true,
            type: 'postgres',
            providerName: 'PostgreSQL Cloud',
            details: 'Conectado a PostgreSQL en la nube.',
            databaseUrlSet: true
        };
    }

    return {
        isConnected: false,
        type: 'local_disk',
        providerName: 'Disco Local (Temporal)',
        details: connectionError || 'Usando almacenamiento en disco local (data/store.json). Conectá MongoDB Atlas para persistencia ilimitada y gratuita.',
        databaseUrlSet: !!(getMongoUri() || getPostgresUri())
    };
}
