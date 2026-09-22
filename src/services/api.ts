import { Product, CarouselSlide, StoreCMS, Order, PixelEventLog, PushNotification } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SLIDES, INITIAL_CMS, INITIAL_ORDERS } from '../data/initialData';

// API Client that talks to the Express backend
export const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}: no se pudo actualizar el producto`);
    }
    const data = await res.json();
    return data.product;
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}: no se pudo crear el producto`);
    }
    const data = await res.json();
    return data.product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async reorderProducts(products: Product[]): Promise<Product[]> {
    const res = await fetch('/api/products/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products })
    });
    if (!res.ok) throw new Error('Error al reordenar productos');
    const data = await res.json();
    return data.products;
  },

  async updateAllProducts(products: Product[]): Promise<Product[]> {
    const res = await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(products)
    });
    if (!res.ok) throw new Error('Error al actualizar productos');
    const data = await res.json();
    return data.products;
  },

  // Slides
  async getSlides(): Promise<CarouselSlide[]> {
    try {
      const res = await fetch('/api/slides');
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return INITIAL_SLIDES;
    }
  },

  async updateSlides(slides: CarouselSlide[]): Promise<CarouselSlide[]> {
    const res = await fetch('/api/slides', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slides)
    });
    if (!res.ok) throw new Error('Error al actualizar carrusel');
    const data = await res.json();
    return data.slides;
  },

  async addSlide(slide: Partial<CarouselSlide>): Promise<CarouselSlide> {
    const res = await fetch('/api/slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slide)
    });
    if (!res.ok) throw new Error('Error al agregar slide');
    const data = await res.json();
    return data.slide;
  },

  async deleteSlide(id: string): Promise<CarouselSlide[]> {
    const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar slide');
    const data = await res.json();
    return data.slides;
  },

  // CMS
  async getCMS(): Promise<StoreCMS> {
    try {
      const res = await fetch('/api/cms');
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return INITIAL_CMS;
    }
  },

  async updateCMS(updates: Partial<StoreCMS>): Promise<StoreCMS> {
    const res = await fetch('/api/cms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Error al guardar configuración');
    const data = await res.json();
    return data.cms;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
      return INITIAL_ORDERS;
    }
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error('Error al registrar pedido');
    const data = await res.json();
    return data.order;
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Error al actualizar pedido');
    const data = await res.json();
    return data.order;
  },

  async trackOrder(query: string): Promise<Order> {
    const res = await fetch(`/api/orders/track/${encodeURIComponent(query)}`);
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Pedido no encontrado' }));
      throw new Error(error.error || 'No pudimos localizar un pedido con ese dato.');
    }
    const data = await res.json();
    return data.order;
  },

  // Upload file from PC (images/videos)
  async uploadMedia(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const fileData = reader.result as string;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileData,
              fileName: file.name,
              fileType: file.type
            })
          });
          if (!res.ok) throw new Error('Error al subir archivo');
          const data = await res.json();
          resolve(data.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo en el navegador'));
      reader.readAsDataURL(file);
    });
  },

  // Mercado Pago
  async createMercadoPagoPreference(items: any[], total: number) {
    const res = await fetch('/api/mercadopago/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, total })
    });
    return await res.json();
  },

  async processMercadoPagoPayment(paymentDetails: any) {
    const res = await fetch('/api/mercadopago/process-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentDetails)
    });
    return await res.json();
  },

  // Pixel events
  async logPixelEvent(eventName: PixelEventLog['eventName'], data?: Record<string, any>) {
    try {
      await fetch('/api/pixel/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, data })
      });
    } catch {
      // Non-blocking
    }
  },

  async getPixelStats() {
    const res = await fetch('/api/pixel/stats');
    return await res.json();
  },

  // Push Notifications
  async subscribePush() {
    const res = await fetch('/api/push/subscribe', { method: 'POST' });
    return await res.json();
  },

  async getPushList() {
    const res = await fetch('/api/push/list');
    return await res.json();
  },

  async sendPushNotification(title: string, body: string, url?: string) {
    const res = await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, url })
    });
    return await res.json();
  },

  // Analytics
  async getAnalytics() {
    const res = await fetch('/api/analytics');
    return await res.json();
  },

  // Backup & Code Persistence
  async getBackupData() {
    const res = await fetch('/api/admin/backup');
    if (!res.ok) throw new Error('Error al generar copia de seguridad');
    return await res.json();
  },

  async restoreBackup(backupData: any) {
    const res = await fetch('/api/admin/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backupData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al restaurar respaldo');
    }
    return await res.json();
  },

  async syncCode() {
    const res = await fetch('/api/admin/sync-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al sincronizar con el código fuente');
    }
    return await res.json();
  }
};
