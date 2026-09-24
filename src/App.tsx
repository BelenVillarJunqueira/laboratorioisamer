import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { MothersDayBanner } from './components/MothersDayBanner';
import { ProductGrid } from './components/ProductGrid';
import { CreateYourBrandSection } from './components/CreateYourBrandSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { PushNotificationManager } from './components/PushNotificationManager';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Product, CarouselSlide, StoreCMS, Order } from './types';
import { INITIAL_PRODUCTS, INITIAL_SLIDES, INITIAL_CMS, INITIAL_ORDERS } from './data/initialData';
import { persistentStorage } from './utils/persistentStorage';
import { api } from './services/api';
import { MessageCircle } from 'lucide-react';

export default function App() {
  const [initialData] = useState(() => persistentStorage.getInitialState());
  const [cms, setCms] = useState<StoreCMS>(initialData.cms);
  const [products, setProducts] = useState<Product[]>(initialData.products);
  const [slides, setSlides] = useState<CarouselSlide[]>(initialData.slides);
  const [orders, setOrders] = useState<Order[]>(initialData.orders);

  const handleProductsUpdated = (updated: Product[]) => {
    setProducts(updated);
    persistentStorage.saveProducts(updated);
  };

  const handleCmsUpdated = (updated: StoreCMS) => {
    setCms(updated);
    persistentStorage.saveCMS(updated);
  };

  const handleSlidesUpdated = (updated: CarouselSlide[]) => {
    setSlides(updated);
    persistentStorage.saveSlides(updated);
  };

  const handleOrdersUpdated = (updated: Order[]) => {
    setOrders(updated);
  };

  // Cart state persisted locally
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('isamer_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingInitialCode, setTrackingInitialCode] = useState<string | undefined>();
  const [isPushModalOpen, setIsPushModalOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Search filter & Brand navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('Todas');
  const pageViewLoggedRef = useRef(false);

  const handleSelectBrand = (brand: string) => {
    setSelectedBrand(brand);
    const el = document.getElementById('productos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Initial load from backend API with localStorage fail-safe
  useEffect(() => {
    // Fetch products: Server is the single source of truth
    api.getProducts().then(serverProds => {
      if (Array.isArray(serverProds) && serverProds.length > 0) {
        setProducts(serverProds);
        persistentStorage.saveProducts(serverProds);
      }
    }).catch(() => {
      const local = persistentStorage.getInitialState();
      if (local.products && local.products.length > 0) {
        setProducts(local.products);
      }
    });

    // Fetch slides
    api.getSlides().then(serverSlides => {
      if (Array.isArray(serverSlides) && serverSlides.length > 0) {
        setSlides(serverSlides);
        persistentStorage.saveSlides(serverSlides);
      }
    }).catch(() => {});

    // Fetch CMS
    api.getCMS().then(serverCms => {
      if (serverCms) {
        setCms(prev => {
          const merged = { ...prev, ...serverCms };
          persistentStorage.saveCMS(merged);
          return merged;
        });
      }
    }).catch(() => {});

    // Fetch orders
    api.getOrders().then(setOrders).catch(() => {});

    // Fire Meta Pixel PageView only once
    if (!pageViewLoggedRef.current) {
      pageViewLoggedRef.current = true;
      api.logPixelEvent('PageView', {
        url: window.location.href,
        referrer: document.referrer
      }).catch(() => {});
    }

    // Check if URL has #admin hash
    if (window.location.hash === '#admin') {
      setIsAdminAuthOpen(true);
    }

    // Keyboard shortcut to open admin: Ctrl+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminAuthOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('isamer_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Cart operations
  const handleAddToCart = (product: Product, selectedShade?: string, quantity: number = 1) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && item.selectedShade === selectedShade
      );
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, selectedShade, quantity }];
    });

    // Log to Meta Pixel
    api.logPixelEvent('AddToCart', {
      content_name: product.name,
      content_id: product.id,
      value: product.price * quantity,
      currency: 'ARS',
      shade: selectedShade
    });
  };

  const handleUpdateCartQuantity = (productId: string, shade: string | undefined, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId && item.selectedShade === shade) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string, shade?: string) => {
    setCartItems(prev =>
      prev.filter(item => !(item.product.id === productId && item.selectedShade === shade))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Quick buy flow
  const handleInstantBuy = (product: Product, selectedShade?: string, quantity: number = 1) => {
    handleAddToCart(product, selectedShade, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Open detail with Pixel event
  const handleOpenDetail = (product: Product) => {
    setDetailProduct(product);
    api.logPixelEvent('ViewContent', {
      content_name: product.name,
      content_id: product.id,
      value: product.price,
      currency: 'ARS'
    });
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFB] text-[#221F20]">
      {/* Main Header */}
      <Header
        cms={cms}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => {
          setTrackingInitialCode(undefined);
          setIsTrackingOpen(true);
        }}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        onOpenPushModal={() => setIsPushModalOpen(true)}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        onSelectBrand={handleSelectBrand}
        activeBrand={selectedBrand}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Dynamic Image & Video Carousel */}
        <HeroCarousel
          slides={slides}
          onCtaClick={() => {
            const el = document.getElementById('productos');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Special Mother's Day Banner (Can be toggled off from Admin CMS) */}
        {cms.enableMothersDay !== false && (
          <MothersDayBanner
            cms={cms}
            onExplorePack={() => {
              const pack = products.find(p => p.category === 'Packs') || products[0];
              if (pack) handleOpenDetail(pack);
            }}
          />
        )}

        {/* Multi-brand Laboratory Catalog */}
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
          onOpenDetail={handleOpenDetail}
          searchQuery={searchQuery}
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
        />

        {/* Crea tu marca con nosotros Section */}
        <CreateYourBrandSection cms={cms} />
      </main>

      {/* Footer */}
      <Footer
        cms={cms}
        onOpenTracking={() => {
          setTrackingInitialCode(undefined);
          setIsTrackingOpen(true);
        }}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={`https://wa.me/${cms.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
          '¡Hola! Me gustaría hacer una consulta sobre la línea de rostro.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-30 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        title="Consultar por WhatsApp"
        aria-label="Atención por WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      {/* Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={handleAddToCart}
          onInstantBuy={handleInstantBuy}
        />
      )}

      {/* Slide-over Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onProceedToCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
          freeShippingThreshold={cms.freeShippingThreshold}
        />
      )}

      {/* Multi-step Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cartItems}
          cms={cms}
          onOrderCompleted={(order) => {
            setOrders(prev => [order, ...prev]);
          }}
          onClearCart={handleClearCart}
          onOpenTrackingWithCode={(code) => {
            setTrackingInitialCode(code);
            setIsTrackingOpen(true);
          }}
        />
      )}

      {/* Real-time Order Tracker Modal */}
      {isTrackingOpen && (
        <OrderTrackerModal
          isOpen={isTrackingOpen}
          onClose={() => setIsTrackingOpen(false)}
          initialCode={trackingInitialCode}
          whatsappNumber={cms.whatsappNumber}
        />
      )}

      {/* Push Notifications Modal */}
      {isPushModalOpen && (
        <PushNotificationManager
          isOpen={isPushModalOpen}
          onClose={() => setIsPushModalOpen(false)}
          onNotificationClick={() => {
            const el = document.getElementById('productos');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* Hidden Admin PIN Auth Modal */}
      {isAdminAuthOpen && (
        <AdminAuthModal
          isOpen={isAdminAuthOpen}
          onClose={() => setIsAdminAuthOpen(false)}
          correctPin={cms.adminPin || 'isamernosotros'}
          onAuthenticated={() => setIsAdminDashboardOpen(true)}
        />
      )}

      {/* Hidden Admin Dashboard */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
          cms={cms}
          onCmsUpdated={handleCmsUpdated}
          products={products}
          onProductsUpdated={handleProductsUpdated}
          slides={slides}
          onSlidesUpdated={handleSlidesUpdated}
          orders={orders}
          onOrdersUpdated={handleOrdersUpdated}
        />
      )}
    </div>
  );
}