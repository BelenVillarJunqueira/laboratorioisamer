declare module 'mongodb' {
    export class MongoClient {
        constructor(url: string, options?: any);
        connect(): Promise<this>;
        close(): Promise<void>;
        db(name?: string): Db;
    }
    export interface Db {
        collection(name: string): any;
        command(cmd: any): Promise<any>;
    }
}

declare module 'pg' {
    export class Pool {
        constructor(config?: any);
        connect(): Promise<any>;
        query(text: string, params?: any[]): Promise<any>;
        end(): Promise<void>;
        on(event: string, listener: (...args: any[]) => void): this;
    }
    const pg: any;
    export default pg;
}
