import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_SLIDES, INITIAL_CMS, INITIAL_ORDERS } from './src/data/initialData';
import { Product, CarouselSlide, StoreCMS, Order, PixelEventLog, PushNotification } from './src/types';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase payload limit for image/video uploads and large store.json imports
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Directories and file persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');
const DATA_BACKUP_FILE = path.join(DATA_DIR, 'store.backup.json');
const DATA_LAST_BACKUP_FILE = path.join(DATA_DIR, 'store.backup.last.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists and is served statically
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper: Extract huge base64 images into actual files in /public/uploads/
// This avoids 10MB+ strings bloating store.json and crashing browser localStorage!
function sanitizeAndExtractBase64Image(dataUri: string, prefix = 'img'): string {
  if (!dataUri || typeof dataUri !== 'string') return dataUri;
  if (!dataUri.startsWith('data:image/')) return dataUri;

  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    const match = dataUri.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!match) return dataUri;

    let ext = match[1].toLowerCase();
    if (ext === 'jpeg') ext = 'jpg';
    if (ext === 'svg+xml') ext = 'svg';

    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Error extracting base64 image to disk:', err);
    return dataUri;
  }
}

function cleanProductBase64Images(product: Product): Product {
  const cleaned = { ...product };
  if (cleaned.image && cleaned.image.startsWith('data:image/')) {
    cleaned.image = sanitizeAndExtractBase64Image(cleaned.image, `prod-${cleaned.id || 'img'}`);
  }
  if (Array.isArray(cleaned.secondaryImages)) {
    cleaned.secondaryImages = cleaned.secondaryImages.map((img, i) =>
      img && img.startsWith('data:image/')
        ? sanitizeAndExtractBase64Image(img, `prod-${cleaned.id || 'sec'}-${i}`)
        : img
    );
  }
  return cleaned;
}

interface StoredData {
  products: Product[];
  slides: CarouselSlide[];
  cms: StoreCMS;
  orders: Order[];
  pixelLogs: PixelEventLog[];
  pushNotifications: PushNotification[];
  subscribersCount: number;
}

function loadData(): StoredData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let raw: string | null = null;

    if (fs.existsSync(DATA_FILE)) {
      try {
        const candidate = fs.readFileSync(DATA_FILE, 'utf-8');
        if (candidate && candidate.trim().length > 10) {
          raw = candidate;
        }
      } catch (e) {
        console.warn('Error reading DATA_FILE, attempting backup fallback:', e);
      }
    }

    // Fail-safe: if DATA_FILE is unreadable, attempt recovery from backup files
    if (!raw && fs.existsSync(DATA_BACKUP_FILE)) {
      try {
        raw = fs.readFileSync(DATA_BACKUP_FILE, 'utf-8');
        console.log('Successfully recovered data from DATA_BACKUP_FILE');
      } catch {}
    }
    if (!raw && fs.existsSync(DATA_LAST_BACKUP_FILE)) {
      try {
        raw = fs.readFileSync(DATA_LAST_BACKUP_FILE, 'utf-8');
        console.log('Successfully recovered data from DATA_LAST_BACKUP_FILE');
      } catch {}
    }

    if (raw) {
      const parsed = JSON.parse(raw);
      const rawProducts = Array.isArray(parsed.products) ? parsed.products : (Array.isArray(parsed) ? parsed : []);
      let storedProducts: Product[] = [];

      if (rawProducts.length > 0) {
        storedProducts = rawProducts.map((p: any, idx: number) => {
          const cleaned = cleanProductBase64Images(p);
          return {
            ...cleaned,
            brand: (cleaned.brand && cleaned.brand !== 'ISAMER' && cleaned.brand !== 'ISAMER') ? cleaned.brand : 'H2Derm',
            order: typeof cleaned.order === 'number' ? cleaned.order : (idx + 1)
          };
        });
      } else {
        storedProducts = INITIAL_PRODUCTS.map((p: Product, idx: number) => ({
          ...p,
          brand: (p.brand && p.brand !== 'ISAMER' && p.brand !== 'ISAMER') ? p.brand : 'H2Derm',
          order: typeof p.order === 'number' ? p.order : (idx + 1)
        }));
      }

      // Merge CMS settings safely
      const mergedCms: StoreCMS = {
        ...INITIAL_CMS,
        ...(parsed.cms || {}),
        createYourBrand: {
          ...INITIAL_CMS.createYourBrand,
          ...(parsed.cms?.createYourBrand || {})
        },
        enableMothersDay: parsed.cms?.enableMothersDay !== undefined
          ? parsed.cms.enableMothersDay
          : INITIAL_CMS.enableMothersDay
      };

      return {
        products: storedProducts,
        slides: parsed.slides && parsed.slides.length > 0 ? parsed.slides : INITIAL_SLIDES,
        cms: mergedCms,
        orders: parsed.orders || INITIAL_ORDERS,
        pixelLogs: parsed.pixelLogs || [],
        pushNotifications: parsed.pushNotifications || [],
        subscribersCount: parsed.subscribersCount || 142
      };
    }
  } catch (err) {
    console.error('Error loading stored data:', err);
  }

  // Fallback defaults ONLY if no stored data exists at all. DO NOT overwrite existing disk file!
  return {
    products: INITIAL_PRODUCTS,
    slides: INITIAL_SLIDES,
    cms: INITIAL_CMS,
    orders: INITIAL_ORDERS,
    pixelLogs: [
      {
        id: 'pix-1',
        eventName: 'PageView',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        data: { url: '/', referrer: 'https://www.instagram.com/' }
      }
    ],
    pushNotifications: [
      {
        id: 'push-1',
        title: '¡Especial Día de la Madre activado! 🌸',
        body: '3 y 6 cuotas en toda la línea Rostro. ¡Enviamos a todo el país!',
        sentAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    subscribersCount: 184
  };
}

let saveTimeout: NodeJS.Timeout | null = null;
function debouncedSaveData() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveData(storeState);
  }, 1000);
}

let isInternalSave = false;

function reloadStoreFromDisk() {
  if (isInternalSave) return;
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      if (raw && raw.trim().length > 10) {
        const parsed = JSON.parse(raw);
        if (parsed.products && Array.isArray(parsed.products)) {
          storeState.products = parsed.products.map((p: any, idx: number) => ({
            ...p,
            order: typeof p.order === 'number' ? p.order : (idx + 1)
          }));
        }
        if (parsed.cms) {
          storeState.cms = { ...storeState.cms, ...parsed.cms };
        }
        if (parsed.slides && Array.isArray(parsed.slides)) {
          storeState.slides = parsed.slides;
        }
        if (parsed.orders && Array.isArray(parsed.orders)) {
          storeState.orders = parsed.orders;
        }
        console.log('[STORE WATCHER] Cambios externos detectados en data/store.json y cargados en memoria con éxito.');
      }
    }
  } catch (err) {
    // Ignore temporary partial writes
  }
}

// Watch data folder for manual edits in VS Code so they are immediately loaded into memory
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.watch(DATA_DIR, (eventType, filename) => {
    if (filename === 'store.json' && !isInternalSave) {
      setTimeout(reloadStoreFromDisk, 300);
    }
  });
} catch (wErr) {
  console.warn('Watch on data dir could not be established:', wErr);
}

function saveData(data: StoredData) {
  try {
    isInternalSave = true;
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // 1. Sanitize any base64 images into physical files to keep JSON file lightweight
    const sanitizedProducts = data.products.map(p => cleanProductBase64Images(p));
    const safeData: StoredData = {
      ...data,
      products: sanitizedProducts
    };

    // 2. Keep historical backup before overwriting
    if (fs.existsSync(DATA_FILE)) {
      try {
        fs.copyFileSync(DATA_FILE, DATA_LAST_BACKUP_FILE);
      } catch {}
    }

    // 3. Atomic write using temporary file to prevent corruption if process is interrupted
    const jsonString = JSON.stringify(safeData, null, 2);
    const tmpFile = `${DATA_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tmpFile, jsonString, 'utf-8');
    fs.renameSync(tmpFile, DATA_FILE);

    // 4. Update long-term backup
    if (safeData.products && safeData.products.length > 0) {
      try {
        fs.writeFileSync(DATA_BACKUP_FILE, jsonString, 'utf-8');
      } catch {}
    }
  } catch (err) {
    console.error('Error saving data to file:', err);
  } finally {
    setTimeout(() => {
      isInternalSave = false;
    }, 600);
  }
}

let storeState = loadData();

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Products API
app.get('/api/products', (req, res) => {
  const sorted = [...storeState.products].sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json(sorted);
});

// Batch update products or save full list
app.put('/api/products', (req, res) => {
  if (Array.isArray(req.body)) {
    storeState.products = req.body.map((p: any, idx: number) => ({
      ...p,
      brand: (p.brand && p.brand !== 'ISAMER') ? p.brand : 'H2Derm',
      order: typeof p.order === 'number' ? p.order : (idx + 1)
    }));
    saveData(storeState);
    return res.json({ success: true, products: storeState.products });
  }
  res.status(400).json({ error: 'Se requiere un arreglo de productos' });
});

// Reorder products endpoint
app.put('/api/products/reorder', (req, res) => {
  const { products, productIds } = req.body;
  if (Array.isArray(products)) {
    storeState.products = products.map((p: any, idx: number) => ({
      ...p,
      brand: (p.brand && p.brand !== 'ISAMER') ? p.brand : 'H2Derm',
      order: idx + 1
    }));
    saveData(storeState);
    return res.json({ success: true, products: storeState.products });
  }
  if (Array.isArray(productIds)) {
    const map = new Map(storeState.products.map((p: Product) => [p.id, p]));
    const reordered: Product[] = [];
    productIds.forEach((id: string, idx: number) => {
      const p = map.get(id);
      if (p) {
        p.order = idx + 1;
        reordered.push(p);
        map.delete(id);
      }
    });
    // Append any unmentioned products
    for (const remaining of map.values()) {
      remaining.order = reordered.length + 1;
      reordered.push(remaining);
    }
    storeState.products = reordered;
    saveData(storeState);
    return res.json({ success: true, products: storeState.products });
  }
  res.status(400).json({ error: 'Se requiere products o productIds' });
});

app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct: Partial<Product> = req.body || {};

    // 1. Match by ID
    let index = storeState.products.findIndex(p => p.id === id);

    // 2. If not found by ID, try matching by SKU
    if (index === -1 && updatedProduct.sku) {
      index = storeState.products.findIndex(p => p.sku === updatedProduct.sku);
    }

    // 3. If not found by SKU, try matching by exact name
    if (index === -1 && updatedProduct.name) {
      index = storeState.products.findIndex(
        p => p.name.trim().toLowerCase() === updatedProduct.name!.trim().toLowerCase()
      );
    }

    const brandToUse = (updatedProduct.brand && updatedProduct.brand !== 'ISAMER')
      ? updatedProduct.brand
      : (index !== -1 && storeState.products[index].brand !== 'ISAMER' ? storeState.products[index].brand : 'H2Derm');

    if (index !== -1) {
      // Update existing product
      storeState.products[index] = {
        ...storeState.products[index],
        ...updatedProduct,
        id: storeState.products[index].id || id,
        brand: brandToUse,
        price: typeof updatedProduct.price === 'number' ? updatedProduct.price : (Number(updatedProduct.price) || 0),
        stock: typeof updatedProduct.stock === 'number' ? updatedProduct.stock : (Number(updatedProduct.stock) || 0)
      };
      saveData(storeState);
      return res.json({ success: true, product: storeState.products[index] });
    }

    // 4. UPSERT: Product did not exist on server — create and add it immediately so NO product is ever rejected or lost!
    const newProduct: Product = {
      id: id || updatedProduct.id || 'prod-' + Date.now(),
      brand: brandToUse,
      order: typeof updatedProduct.order === 'number' ? updatedProduct.order : storeState.products.length + 1,
      sku: updatedProduct.sku || `SKU-${Date.now().toString().slice(-4)}`,
      name: updatedProduct.name || 'Nuevo Producto',
      tagline: updatedProduct.tagline || '',
      category: updatedProduct.category || 'Cremas',
      price: typeof updatedProduct.price === 'number' ? updatedProduct.price : (Number(updatedProduct.price) || 0),
      originalPrice: typeof updatedProduct.originalPrice === 'number' ? updatedProduct.originalPrice : (Number(updatedProduct.originalPrice) || 0),
      discountPercentage: typeof updatedProduct.discountPercentage === 'number' ? updatedProduct.discountPercentage : 0,
      rating: updatedProduct.rating || 5.0,
      reviewsCount: updatedProduct.reviewsCount || 1,
      image: updatedProduct.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
      secondaryImages: updatedProduct.secondaryImages || [],
      badges: updatedProduct.badges || [],
      description: updatedProduct.description || '',
      benefits: updatedProduct.benefits || [],
      howToUse: updatedProduct.howToUse || '',
      stock: typeof updatedProduct.stock === 'number' ? updatedProduct.stock : 50,
      featured: !!updatedProduct.featured,
      motherDaySpecial: !!updatedProduct.motherDaySpecial,
      video: updatedProduct.video
    };

    storeState.products.push(newProduct);
    saveData(storeState);
    return res.json({ success: true, product: newProduct });
  } catch (err: any) {
    console.error('Error in PUT /api/products/:id:', err);
    res.status(500).json({ error: 'Error al guardar el producto: ' + err.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const brandToUse = (req.body.brand && req.body.brand !== 'ISAMER') ? req.body.brand : 'H2Derm';
    const prodId = req.body.id || 'prod-' + Date.now();

    // Check if ID already exists, if so update it
    const existingIdx = storeState.products.findIndex(p => p.id === prodId);
    if (existingIdx !== -1) {
      storeState.products[existingIdx] = {
        ...storeState.products[existingIdx],
        ...req.body,
        brand: brandToUse
      };
      saveData(storeState);
      return res.json({ success: true, product: storeState.products[existingIdx] });
    }

    // Re-index existing products so new product becomes order #1
    storeState.products.forEach((p, idx) => {
      p.order = idx + 2;
    });

    const newProduct: Product = {
      ...req.body,
      id: prodId,
      brand: brandToUse,
      order: 1,
      price: typeof req.body.price === 'number' ? req.body.price : (Number(req.body.price) || 0),
      stock: typeof req.body.stock === 'number' ? req.body.stock : (Number(req.body.stock) || 50),
      rating: req.body.rating || 5.0,
      reviewsCount: req.body.reviewsCount || 1,
      secondaryImages: req.body.secondaryImages || [],
      badges: req.body.badges || [],
      benefits: req.body.benefits || []
    };

    storeState.products.unshift(newProduct);
    saveData(storeState);
    res.status(201).json({ success: true, product: newProduct });
  } catch (err: any) {
    res.status(500).json({ error: 'Error al crear producto: ' + err.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  storeState.products = storeState.products.filter(p => p.id !== id);
  // Re-index remaining products
  storeState.products.forEach((p, idx) => {
    p.order = idx + 1;
  });
  saveData(storeState);
  res.json({ success: true });
});

// Carousel Slides API
app.get('/api/slides', (req, res) => {
  const sorted = [...storeState.slides].sort((a, b) => a.order - b.order);
  res.json(sorted);
});

app.put('/api/slides', (req, res) => {
  if (Array.isArray(req.body)) {
    storeState.slides = req.body;
    saveData(storeState);
    return res.json({ success: true, slides: storeState.slides });
  }
  res.status(400).json({ error: 'Array of slides required' });
});

app.post('/api/slides', (req, res) => {
  const newSlide: CarouselSlide = {
    ...req.body,
    id: 'slide-' + Date.now(),
    order: storeState.slides.length + 1,
    active: true
  };
  storeState.slides.push(newSlide);
  saveData(storeState);
  res.status(201).json({ success: true, slide: newSlide });
});

app.delete('/api/slides/:id', (req, res) => {
  const { id } = req.params;
  storeState.slides = storeState.slides.filter(s => s.id !== id);
  // Re-index orders
  storeState.slides.forEach((s, idx) => {
    s.order = idx + 1;
  });
  saveData(storeState);
  res.json({ success: true, slides: storeState.slides });
});

// Store CMS API
app.get('/api/cms', (req, res) => {
  const mergedCms = { ...storeState.cms };
  if (!mergedCms.mercadoPagoConfig) {
    mergedCms.mercadoPagoConfig = {
      publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY || '',
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
      sandboxMode: false,
      enabled: true
    };
  } else {
    mergedCms.mercadoPagoConfig = {
      ...mergedCms.mercadoPagoConfig,
      publicKey: mergedCms.mercadoPagoConfig.publicKey || process.env.MERCADO_PAGO_PUBLIC_KEY || '',
      accessToken: mergedCms.mercadoPagoConfig.accessToken || process.env.MERCADO_PAGO_ACCESS_TOKEN || ''
    };
  }
  res.json(mergedCms);
});

app.put('/api/cms', (req, res) => {
  storeState.cms = {
    ...storeState.cms,
    ...req.body
  };
  saveData(storeState);
  res.json({ success: true, cms: storeState.cms });
});

// Direct image upload endpoint: converts image data directly to static URL
app.post('/api/admin/upload-image', (req, res) => {
  try {
    const { dataUri, name } = req.body;
    if (!dataUri) {
      return res.status(400).json({ error: 'dataUri de imagen requerido' });
    }
    const cleanUrl = sanitizeAndExtractBase64Image(dataUri, name ? `img-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : 'upload');
    res.json({ success: true, url: cleanUrl });
  } catch (err: any) {
    res.status(500).json({ error: 'Error al subir imagen: ' + err.message });
  }
});

// Backup & Persistence Sync APIs
app.get('/api/admin/backup', (req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename="store.json"');
  res.setHeader('Content-Type', 'application/json');
  res.json({
    version: '1.0',
    exportDate: new Date().toISOString(),
    products: storeState.products,
    slides: storeState.slides,
    cms: storeState.cms,
    orders: storeState.orders
  });
});

app.post('/api/admin/restore', (req, res) => {
  try {
    const raw = req.body;
    let payload = raw.storeState || raw.data || raw;

    // Handle if sent as string
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (parseErr: any) {
        return res.status(400).json({ error: 'El contenido recibido no es un JSON válido: ' + parseErr.message });
      }
    }

    if (!payload || (!payload.products && !Array.isArray(payload))) {
      return res.status(400).json({ error: 'Formato de respaldo no válido. Debe contener una lista de productos.' });
    }

    const rawProductsList = Array.isArray(payload) ? payload : (payload.products || []);
    
    if (!Array.isArray(rawProductsList) || rawProductsList.length === 0) {
      return res.status(400).json({ error: 'No se encontraron productos en el archivo proporcionado.' });
    }

    // Clean and extract all Base64 images to physical files in /uploads/
    const cleanedProducts: Product[] = rawProductsList.map((p: any, idx: number) => {
      const sanitized = cleanProductBase64Images(p);
      return {
        ...sanitized,
        id: sanitized.id || `prod-${Date.now()}-${idx}`,
        name: sanitized.name || 'Producto sin nombre',
        price: typeof sanitized.price === 'number' ? sanitized.price : (Number(sanitized.price) || 0),
        originalPrice: typeof sanitized.originalPrice === 'number' ? sanitized.originalPrice : (Number(sanitized.originalPrice) || sanitized.price || 0),
        category: sanitized.category || 'Cremas',
        brand: (sanitized.brand && sanitized.brand !== 'ISAMER' && sanitized.brand !== 'ISAMER') ? sanitized.brand : (sanitized.brand || 'H2Derm'),
        stock: typeof sanitized.stock === 'number' ? sanitized.stock : (Number(sanitized.stock) || 50),
        order: typeof sanitized.order === 'number' ? sanitized.order : (idx + 1)
      };
    });

    const newSlides = payload.slides && payload.slides.length > 0 ? payload.slides : storeState.slides;
    const newCms = payload.cms ? { ...storeState.cms, ...payload.cms } : storeState.cms;
    const newOrders = Array.isArray(payload.orders) ? payload.orders : storeState.orders;

    storeState = {
      ...storeState,
      products: cleanedProducts,
      slides: newSlides,
      cms: newCms,
      orders: newOrders
    };

    saveData(storeState);

    console.log(`[RESTORE] Successfully restored ${cleanedProducts.length} products to store.json`);

    res.json({
      success: true,
      count: cleanedProducts.length,
      message: `¡Copia de seguridad restaurada correctamente con ${cleanedProducts.length} productos!`,
      products: storeState.products,
      slides: storeState.slides,
      cms: storeState.cms,
      orders: storeState.orders
    });
  } catch (err: any) {
    console.error('Error in /api/admin/restore:', err);
    res.status(500).json({ error: 'Error al restaurar respaldo: ' + err.message });
  }
});

app.post('/api/admin/sync-code', (req, res) => {
  try {
    saveData(storeState);

    res.json({
      success: true,
      message: '¡Catálogo sincronizado exitosamente con la base de datos persistente!'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Error al sincronizar con código: ' + err.message });
  }
});

// Full store synchronization endpoint (atomic save of products, cms, slides, orders)
app.post('/api/sync-full', (req, res) => {
  try {
    const { products, cms, slides, orders } = req.body;
    if (Array.isArray(products) && products.length > 0) {
      storeState.products = products.map((p: any, idx: number) => ({
        ...p,
        brand: (p.brand && p.brand !== 'ISAMER' && p.brand !== 'ISAMER') ? p.brand : (p.brand || 'H2Derm'),
        order: typeof p.order === 'number' ? p.order : (idx + 1)
      }));
    }
    if (cms && typeof cms === 'object') {
      storeState.cms = {
        ...storeState.cms,
        ...cms
      };
    }
    if (Array.isArray(slides) && slides.length > 0) {
      storeState.slides = slides;
    }
    if (Array.isArray(orders)) {
      storeState.orders = orders;
    }
    saveData(storeState);
    res.json({
      success: true,
      message: 'Todos los datos (catálogo, textos, carrusel y pedidos) guardados con éxito',
      productsCount: storeState.products.length
    });
  } catch (err: any) {
    console.error('Error in /api/sync-full:', err);
    res.status(500).json({ error: 'Error al sincronizar datos: ' + err.message });
  }
});

// Orders API
app.get('/api/orders', (req, res) => {
  res.json(storeState.orders);
});

app.post('/api/orders', (req, res) => {
  const orderCount = storeState.orders.length + 8495;
  const orderNumber = `LUM-${orderCount}`;

  const newOrder: Order = {
    ...req.body,
    id: 'ord-' + Date.now(),
    orderNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: req.body.status || (req.body.paymentMethod === 'transferencia' ? 'Pendiente' : 'En preparación'),
    paymentStatus: req.body.paymentStatus || (req.body.paymentMethod === 'transferencia' ? 'pending' : 'approved')
  };

  storeState.orders.unshift(newOrder);

  // Auto-log purchase to Pixel
  const pixelLog: PixelEventLog = {
    id: 'pix-' + Date.now(),
    eventName: 'Purchase',
    timestamp: new Date().toISOString(),
    data: {
      order_id: orderNumber,
      value: newOrder.total,
      currency: 'ARS',
      num_items: newOrder.items.length,
      customer_email: newOrder.customerEmail
    }
  };
  storeState.pixelLogs.unshift(pixelLog);

  saveData(storeState);
  res.status(201).json({ success: true, order: newOrder });
});

app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const index = storeState.orders.findIndex(o => o.id === id || o.orderNumber === id);

  if (index !== -1) {
    storeState.orders[index] = {
      ...storeState.orders[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    saveData(storeState);
    return res.json({ success: true, order: storeState.orders[index] });
  }
  res.status(404).json({ error: 'Pedido no encontrado' });
});

// Order tracking search endpoint
app.get('/api/orders/track/:query', (req, res) => {
  const query = req.params.query.trim().toLowerCase();
  const order = storeState.orders.find(o => 
    o.orderNumber.toLowerCase() === query ||
    (o.trackingCode && o.trackingCode.toLowerCase() === query) ||
    o.customerEmail.toLowerCase() === query ||
    o.customerPhone.includes(query) ||
    o.customerDni === query
  );

  if (!order) {
    return res.status(404).json({ error: 'No se encontró ningún pedido con ese código o dato.' });
  }

  res.json({ success: true, order });
});

// Media upload endpoint (Saves base64 data to physical file in /public/uploads/)
app.post('/api/upload', (req, res) => {
  const { fileData, fileName, fileType } = req.body;
  if (!fileData) {
    return res.status(400).json({ error: 'fileData is required' });
  }

  try {
    // If it's a base64 Data URI, extract and save to /public/uploads/
    if (typeof fileData === 'string' && fileData.startsWith('data:')) {
      const cleanUrl = sanitizeAndExtractBase64Image(fileData, (fileName || 'img').replace(/[^a-zA-Z0-9_-]/g, ''));
      return res.json({
        success: true,
        url: cleanUrl,
        fileName: fileName || 'media_' + Date.now(),
        fileType: fileType || 'image/jpeg'
      });
    }

    // Already a standard URL
    res.json({
      success: true,
      url: fileData,
      fileName: fileName || 'media_' + Date.now(),
      fileType: fileType || 'image/jpeg'
    });
  } catch (uploadErr: any) {
    console.error('Error processing upload:', uploadErr);
    res.status(500).json({ error: 'Error al procesar archivo: ' + uploadErr.message });
  }
});

// Mercado Pago Preference Generator & Payment Processing
app.post('/api/mercadopago/create-preference', async (req, res) => {
  try {
    const { items, payer, total, orderNumber } = req.body;
    
    // Retrieve token from CMS configuration or environment variables
    const accessToken = 
      storeState.cms.mercadoPagoConfig?.accessToken?.trim() || 
      process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim() || 
      '';
    
    const isSandbox = !!storeState.cms.mercadoPagoConfig?.sandboxMode;
    const publicKey = storeState.cms.mercadoPagoConfig?.publicKey || process.env.MERCADO_PAGO_PUBLIC_KEY || '';

    // If an Access Token is configured, call Mercado Pago official API
    if (accessToken && accessToken.length > 10 && !accessToken.includes('00000000')) {
      const baseUrl = req.headers.origin || `http://localhost:${PORT}`;

      // Build MP preference payload
      const mpItems = Array.isArray(items) && items.length > 0
        ? items.map(item => ({
            id: String(item.productId || item.id || 'item-1'),
            title: String(item.productName || item.title || 'Producto ISAMER LAB'),
            description: item.shade ? `Tono: ${item.shade}` : 'Cosmética dermatológica',
            picture_url: item.productImage || undefined,
            quantity: Number(item.quantity) || 1,
            currency_id: 'ARS',
            unit_price: Number(item.unitPrice || (total / (items.length || 1)))
          }))
        : [{
            id: 'order-' + (orderNumber || Date.now()),
            title: `Pedido ${orderNumber || 'LUM-ONLINE'}`,
            quantity: 1,
            currency_id: 'ARS',
            unit_price: Number(total)
          }];

      const mpPayload = {
        items: mpItems,
        payer: payer ? {
          name: payer.name || undefined,
          email: payer.email || undefined,
          phone: payer.phone ? { number: payer.phone } : undefined,
          identification: payer.dni ? { type: 'DNI', number: payer.dni } : undefined,
          address: payer.address ? {
            street_name: payer.address.street || '',
            street_number: Number(payer.address.number) || 0,
            zip_code: payer.address.postalCode || ''
          } : undefined
        } : undefined,
        back_urls: {
          success: `${baseUrl}/?payment_status=approved&order=${orderNumber || ''}`,
          pending: `${baseUrl}/?payment_status=pending&order=${orderNumber || ''}`,
          failure: `${baseUrl}/?payment_status=failure&order=${orderNumber || ''}`
        },
        auto_return: 'approved',
        external_reference: orderNumber || `ORD-${Date.now()}`,
        statement_descriptor: 'ISAMER LAB',
        payment_methods: {
          installments: 6 // Allow up to 6 installments with card/MP interest
        }
      };

      try {
        const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(mpPayload)
        });

        if (mpRes.ok) {
          const mpData = await mpRes.json();
          const initPoint = isSandbox ? (mpData.sandbox_init_point || mpData.init_point) : mpData.init_point;
          
          return res.json({
            success: true,
            isLive: true,
            preferenceId: mpData.id,
            init_point: initPoint,
            sandbox_init_point: mpData.sandbox_init_point || mpData.init_point,
            publicKey,
            sandbox: isSandbox,
            amount: total
          });
        } else {
          const errBody = await mpRes.text();
          console.warn('Mercado Pago API error response:', mpRes.status, errBody);
          // Fall back to generated link so flow is never blocked
        }
      } catch (mpFetchErr) {
        console.error('Mercado Pago API network call failed:', mpFetchErr);
      }
    }

    // Direct checkout link for seamless redirection
    const prefId = 'MP-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const fallbackInitPoint = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${prefId}`;

    res.json({
      success: true,
      isLive: false,
      preferenceId: prefId,
      init_point: fallbackInitPoint,
      sandbox_init_point: fallbackInitPoint,
      publicKey: storeState.cms.mercadoPagoConfig.publicKey,
      sandbox: storeState.cms.mercadoPagoConfig.sandboxMode,
      amount: total
    });
  } catch (err: any) {
    console.error('Error creating Mercado Pago preference:', err);
    res.status(500).json({ error: 'Error al generar preferencia de Mercado Pago: ' + err.message });
  }
});

app.post('/api/mercadopago/process-payment', (req, res) => {
  const { token, issuer_id, payment_method_id, transaction_amount, installments, payer } = req.body;
  
  // Simulating instant authorization for development credentials
  const paymentId = Math.floor(1000000000 + Math.random() * 9000000000);
  
  res.json({
    status: 'approved',
    status_detail: 'accredited',
    id: paymentId,
    date_approved: new Date().toISOString(),
    transaction_amount,
    payment_method_id,
    installments: installments || 1,
    statement_descriptor: 'ISAMER LAB'
  });
});

// Meta Ads & Pixel API (In-memory analytics, does not touch store.json to prevent disk overwriting)
app.post('/api/pixel/log', (req, res) => {
  const { eventName, data } = req.body;
  const log: PixelEventLog = {
    id: 'pix-' + Date.now(),
    eventName: eventName || 'PageView',
    timestamp: new Date().toISOString(),
    data: data || {}
  };
  storeState.pixelLogs.unshift(log);
  if (storeState.pixelLogs.length > 200) {
    storeState.pixelLogs.pop();
  }
  // DO NOT write to store.json on every single PageView/refresh!
  res.json({ success: true, log });
});

app.get('/api/pixel/stats', (req, res) => {
  const eventCounts: Record<string, number> = {
    PageView: 0,
    ViewContent: 0,
    AddToCart: 0,
    InitiateCheckout: 0,
    Purchase: 0
  };

  storeState.pixelLogs.forEach(log => {
    if (eventCounts[log.eventName] !== undefined) {
      eventCounts[log.eventName]++;
    }
  });

  const totalSales = storeState.orders
    .filter(o => o.paymentStatus === 'approved')
    .reduce((sum, o) => sum + o.total, 0);

  res.json({
    pixelId: storeState.cms.metaAdsConfig.pixelId,
    enabled: storeState.cms.metaAdsConfig.enabled,
    eventCounts,
    totalSales,
    recentLogs: storeState.pixelLogs.slice(0, 30)
  });
});

// Push Notifications API
app.post('/api/push/subscribe', (req, res) => {
  storeState.subscribersCount = (storeState.subscribersCount || 100) + 1;
  saveData(storeState);
  res.json({ success: true, subscribersCount: storeState.subscribersCount });
});

app.get('/api/push/list', (req, res) => {
  res.json({
    subscribersCount: storeState.subscribersCount,
    notifications: storeState.pushNotifications
  });
});

app.post('/api/push/send', (req, res) => {
  const { title, body, icon, url } = req.body;
  const notification: PushNotification = {
    id: 'push-' + Date.now(),
    title: title || 'Novedad en ISAMER LAB',
    body: body || 'Descubrí nuevas ofertas exclusivas.',
    icon: icon || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&q=80',
    url: url || '/',
    sentAt: new Date().toISOString()
  };

  storeState.pushNotifications.unshift(notification);
  saveData(storeState);
  res.json({ success: true, notification, recipientCount: storeState.subscribersCount });
});

// Analytics Dashboard API
app.get('/api/analytics', (req, res) => {
  const totalOrders = storeState.orders.length;
  const approvedOrders = storeState.orders.filter(o => o.paymentStatus === 'approved');
  const totalRevenue = approvedOrders.reduce((sum, o) => sum + o.total, 0);
  const averageTicket = approvedOrders.length > 0 ? Math.round(totalRevenue / approvedOrders.length) : 0;

  // By payment method
  const paymentMethodsBreakdown = {
    mercadopago: storeState.orders.filter(o => o.paymentMethod === 'mercadopago').length,
    transferencia: storeState.orders.filter(o => o.paymentMethod === 'transferencia').length,
    tarjeta_credito: storeState.orders.filter(o => o.paymentMethod === 'tarjeta_credito').length,
    tarjeta_debito: storeState.orders.filter(o => o.paymentMethod === 'tarjeta_debito').length
  };

  // Top products
  const productSalesMap: Record<string, { name: string; count: number; revenue: number }> = {};
  storeState.orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.productName, count: 0, revenue: 0 };
      }
      productSalesMap[item.productId].count += item.quantity;
      productSalesMap[item.productId].revenue += item.totalPrice;
    });
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);

  res.json({
    totalOrders,
    totalRevenue,
    averageTicket,
    paymentMethodsBreakdown,
    topProducts,
    subscribersCount: storeState.subscribersCount,
    pixelEventsCount: storeState.pixelLogs.length
  });
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          ignored: ['**/data/**', '**/data/store.json', '**/dist/**', '**/.git/**', '**/src/data/initialData.ts']
        }
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();