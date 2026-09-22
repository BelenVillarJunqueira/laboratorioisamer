import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_SLIDES, INITIAL_CMS, INITIAL_ORDERS } from './src/data/initialData';
import { Product, CarouselSlide, StoreCMS, Order, PixelEventLog, PushNotification } from './src/types';

const app = express();
const PORT = 3000;

// Increase payload limit for image/video uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure data directory exists for persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

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
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        products: parsed.products || INITIAL_PRODUCTS,
        slides: parsed.slides || INITIAL_SLIDES,
        cms: parsed.cms || INITIAL_CMS,
        orders: parsed.orders || INITIAL_ORDERS,
        pixelLogs: parsed.pixelLogs || [],
        pushNotifications: parsed.pushNotifications || [],
        subscribersCount: parsed.subscribersCount || 142
      };
    }
  } catch (err) {
    console.error('Error loading stored data, using initial defaults:', err);
  }

  const initial: StoredData = {
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
      },
      {
        id: 'pix-2',
        eventName: 'ViewContent',
        timestamp: new Date(Date.now() - 2800000).toISOString(),
        data: { content_name: 'Base Líquida Resist 24H', value: 18900, currency: 'ARS' }
      },
      {
        id: 'pix-3',
        eventName: 'AddToCart',
        timestamp: new Date(Date.now() - 1400000).toISOString(),
        data: { content_name: 'Set Día de la Madre', value: 39900, currency: 'ARS' }
      },
      {
        id: 'pix-4',
        eventName: 'Purchase',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        data: { value: 39900, currency: 'ARS', order_id: 'LUM-8492' }
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
  saveData(initial);
  return initial;
}

let saveTimeout: NodeJS.Timeout | null = null;
function debouncedSaveData() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveData(storeState);
  }, 3000);
}

function saveData(data: StoredData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data to file:', err);
  }
}

let storeState = loadData();

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Products API
app.get('/api/products', (req, res) => {
  res.json(storeState.products);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const updatedProduct: Partial<Product> = req.body;
  const index = storeState.products.findIndex(p => p.id === id);

  if (index !== -1) {
    storeState.products[index] = {
      ...storeState.products[index],
      ...updatedProduct
    };
    saveData(storeState);
    return res.json({ success: true, product: storeState.products[index] });
  }
  res.status(404).json({ error: 'Producto no encontrado' });
});

app.post('/api/products', (req, res) => {
  const newProduct: Product = {
    ...req.body,
    id: 'prod-' + Date.now(),
    rating: req.body.rating || 5.0,
    reviewsCount: req.body.reviewsCount || 1,
    shades: req.body.shades || []
  };
  storeState.products.push(newProduct);
  saveData(storeState);
  res.status(201).json({ success: true, product: newProduct });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  storeState.products = storeState.products.filter(p => p.id !== id);
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
  res.json(storeState.cms);
});

app.put('/api/cms', (req, res) => {
  storeState.cms = {
    ...storeState.cms,
    ...req.body
  };
  saveData(storeState);
  res.json({ success: true, cms: storeState.cms });
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

// Media upload endpoint (Handles base64 data URLs & file uploads)
app.post('/api/upload', (req, res) => {
  const { fileData, fileName, fileType } = req.body;
  if (!fileData) {
    return res.status(400).json({ error: 'fileData is required' });
  }

  // Base64 storage returns directly or saves to public folder
  // Returning the Data URI guarantees instant preview, persistence in DB and Render compatibility
  res.json({
    success: true,
    url: fileData,
    fileName: fileName || 'media_' + Date.now(),
    fileType: fileType || 'image/jpeg'
  });
});

// Mercado Pago Payment Processing Simulation & Preference Generator
app.post('/api/mercadopago/create-preference', (req, res) => {
  const { items, payer, total } = req.body;
  const preferenceId = 'MP-PREF-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  
  // Real or sandbox preference response
  res.json({
    success: true,
    preferenceId,
    init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`,
    sandbox_init_point: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`,
    publicKey: storeState.cms.mercadoPagoConfig.publicKey,
    sandbox: storeState.cms.mercadoPagoConfig.sandboxMode,
    amount: total
  });
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
    statement_descriptor: 'LUMÉA COSMETICA'
  });
});

// Meta Ads & Pixel API
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
  debouncedSaveData();
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
    title: title || 'Novedad en LUMÉA Cosmética',
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
          ignored: ['**/data/**', '**/data/store.json', '**/dist/**', '**/.git/**']
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