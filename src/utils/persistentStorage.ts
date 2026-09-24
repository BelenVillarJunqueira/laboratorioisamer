import { Product, StoreCMS, CarouselSlide, Order } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CMS, INITIAL_SLIDES, INITIAL_ORDERS } from '../data/initialData';

const KEYS = {
    PRODUCTS: 'isamer_products_v3',
    CMS: 'isamer_cms_v3',
    SLIDES: 'isamer_slides_v3',
    ORDERS: 'isamer_orders_v3',
    LAST_SAVED: 'isamer_last_saved_timestamp_v3'
};

export interface LocalStoreState {
    products: Product[];
    cms: StoreCMS;
    slides: CarouselSlide[];
    orders: Order[];
    lastSaved: number;
}

export const persistentStorage = {
    // Read immediate cached data synchronously on startup (instant load, 0 flicker)
    getInitialState(): { products: Product[]; cms: StoreCMS; slides: CarouselSlide[]; orders: Order[] } {
        try {
            const rawProducts = localStorage.getItem(KEYS.PRODUCTS);
            const rawCms = localStorage.getItem(KEYS.CMS);
            const rawSlides = localStorage.getItem(KEYS.SLIDES);
            const rawOrders = localStorage.getItem(KEYS.ORDERS);

            const products = rawProducts ? JSON.parse(rawProducts) : INITIAL_PRODUCTS;
            const cms = rawCms ? { ...INITIAL_CMS, ...JSON.parse(rawCms) } : INITIAL_CMS;
            const slides = rawSlides ? JSON.parse(rawSlides) : INITIAL_SLIDES;
            const orders = rawOrders ? JSON.parse(rawOrders) : INITIAL_ORDERS;

            return {
                products: Array.isArray(products) && products.length > 0 ? products : INITIAL_PRODUCTS,
                cms: cms || INITIAL_CMS,
                slides: Array.isArray(slides) && slides.length > 0 ? slides : INITIAL_SLIDES,
                orders: Array.isArray(orders) ? orders : INITIAL_ORDERS
            };
        } catch {
            return {
                products: INITIAL_PRODUCTS,
                cms: INITIAL_CMS,
                slides: INITIAL_SLIDES,
                orders: INITIAL_ORDERS
            };
        }
    },

    // Save current products to browser local storage safely (never crashes if localStorage quota is tight)
    saveProducts(products: Product[]) {
        // Helper to sanitize base64 strings so browser doesn't throw QuotaExceededError (5MB limit)
        const prepareForLocalStorage = (list: Product[]) => {
            return list.map(p => {
                const isBase64Img = p.image && p.image.startsWith('data:');
                return {
                    ...p,
                    image: isBase64Img ? (p.secondaryImages?.[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80') : p.image,
                    secondaryImages: p.secondaryImages?.filter(img => !img.startsWith('data:')) || []
                };
            });
        };

        try {
            localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
            localStorage.setItem(KEYS.LAST_SAVED, Date.now().toString());
            localStorage.setItem('isamer_products_cache', JSON.stringify(products));
            localStorage.setItem('isamer_catalog_backup', JSON.stringify({
                timestamp: new Date().toISOString(),
                count: products.length,
                products
            }));
        } catch {
            // Quota exceeded: use sanitized lightweight version
            try {
                const lightweight = prepareForLocalStorage(products);
                localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(lightweight));
                localStorage.setItem('isamer_products_cache', JSON.stringify(lightweight));
                localStorage.setItem('isamer_catalog_backup', JSON.stringify({
                    timestamp: new Date().toISOString(),
                    count: lightweight.length,
                    products: lightweight
                }));
            } catch (inner) {
                console.warn('localStorage full, skipping local cache (server holds full database):', inner);
            }
        }
    },

    // Save current CMS settings to browser local storage
    saveCMS(cms: StoreCMS) {
        try {
            localStorage.setItem(KEYS.CMS, JSON.stringify(cms));
            localStorage.setItem(KEYS.LAST_SAVED, Date.now().toString());
        } catch (e) {
            console.warn('Error saving CMS to localStorage:', e);
        }
    },

    // Save current slides to browser local storage
    saveSlides(slides: CarouselSlide[]) {
        try {
            localStorage.setItem(KEYS.SLIDES, JSON.stringify(slides));
            localStorage.setItem(KEYS.LAST_SAVED, Date.now().toString());
        } catch (e) {
            console.warn('Error saving slides to localStorage:', e);
        }
    },

    // Save full state all at once
    saveAll(data: { products?: Product[]; cms?: StoreCMS; slides?: CarouselSlide[]; orders?: Order[] }) {
        if (data.products) this.saveProducts(data.products);
        if (data.cms) this.saveCMS(data.cms);
        if (data.slides) this.saveSlides(data.slides);
        if (data.orders) {
            try {
                localStorage.setItem(KEYS.ORDERS, JSON.stringify(data.orders));
            } catch { }
        }
    },

    getLastSavedTimestamp(): number {
        try {
            const ts = localStorage.getItem(KEYS.LAST_SAVED);
            return ts ? parseInt(ts, 10) : 0;
        } catch {
            return 0;
        }
    }
};