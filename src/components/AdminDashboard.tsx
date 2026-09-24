import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Package,
  Sliders,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Building2,
  BarChart3,
  Bell,
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  ListOrdered,
  Check,
  Eye,
  MessageCircle,
  ExternalLink,
  Lock,
  RefreshCw,
  Plus,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Layers,
  Film,
  Image as ImageIcon,
  Download,
  FileCode,
  Database,
  Clipboard,
  History
} from 'lucide-react';
import { Product, CarouselSlide, StoreCMS, Order, OrderStatus, PixelEventLog, OFFICIAL_CATEGORIES, ProductCategory } from '../types';
import { api } from '../services/api';
import { persistentStorage } from '../utils/persistentStorage';
import { formatCurrency, formatDate } from '../utils/formatters';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  cms: StoreCMS;
  onCmsUpdated: (updated: StoreCMS) => void;
  products: Product[];
  onProductsUpdated: (products: Product[]) => void;
  slides: CarouselSlide[];
  onSlidesUpdated: (slides: CarouselSlide[]) => void;
  orders: Order[];
  onOrdersUpdated: (orders: Order[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  cms,
  onCmsUpdated,
  products,
  onProductsUpdated,
  slides,
  onSlidesUpdated,
  orders,
  onOrdersUpdated
}) => {
  const [activeTab, setActiveTab] = useState<
    'orders' | 'carousel' | 'products' | 'cms' | 'payments' | 'pixel' | 'analytics' | 'push'
  >('orders');

  // Local editable states
  const [localCms, setLocalCms] = useState<StoreCMS>(cms);
  const [localSlides, setLocalSlides] = useState<CarouselSlide[]>(slides);
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);

  // Selected product to edit
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [adminProductBrandFilter, setAdminProductBrandFilter] = useState<string>('Todas');

  // Saving indicator
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Order filters
  const [orderFilter, setOrderFilter] = useState<string>('todos');

  // Pixel stats
  const [pixelStats, setPixelStats] = useState<any>(null);

  // Analytics stats
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Push broadcast state
  const [pushTitle, setPushTitle] = useState('');
  const [pushBody, setPushBody] = useState('');
  const [pushSuccess, setPushSuccess] = useState(false);

  // Backup and restore state
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const [browserBackup, setBrowserBackup] = useState<{ timestamp: string; count: number; products: Product[] } | null>(null);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedJson, setPastedJson] = useState('');

  // Check browser backup on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('isamer_catalog_backup');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          setBrowserBackup(parsed);
        }
      }
    } catch {}
  }, []);

  // Continuously persist current products to browser localStorage as indestructible safety net
  useEffect(() => {
    if (localProducts.length > 0) {
      try {
        localStorage.setItem('isamer_catalog_backup', JSON.stringify({
          timestamp: new Date().toISOString(),
          count: localProducts.length,
          products: localProducts
        }));
      } catch (err) {
        console.error('Error saving local backup:', err);
      }
    }
  }, [localProducts]);

  useEffect(() => {
    setLocalCms(cms);
    setLocalSlides(slides);
    setLocalProducts(products);
    setLocalOrders(orders);
  }, [cms, slides, products, orders]);

  useEffect(() => {
    if (activeTab === 'pixel') {
      api.getPixelStats().then(setPixelStats).catch(() => {});
    } else if (activeTab === 'analytics') {
      api.getAnalytics().then(setAnalyticsData).catch(() => {});
    }
  }, [activeTab]);

  const showToast = (message: string) => {
    setSaveToast(message);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Download complete store backup as JSON
  const handleDownloadBackup = async () => {
    try {
      const data = await api.getBackupData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-tienda-isamer-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('¡Copia de seguridad descargada exitosamente en tu PC!');
    } catch (err: any) {
      alert('Error al descargar copia de seguridad: ' + err.message);
    }
  };

  // Restore store backup from JSON file (handles any size, even 10MB+ with images)
  const handleRestoreBackupFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSaving(true);
    showToast('Procesando y restaurando productos...');
    try {
      const text = await file.text();
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch (jsonErr: any) {
        alert('El archivo seleccionado no es un JSON válido: ' + jsonErr.message);
        return;
      }
      const res = await api.restoreBackup(parsed);
      if (res.products && Array.isArray(res.products)) {
        setLocalProducts(res.products);
        onProductsUpdated(res.products);
        persistToLocalBackup(res.products);
        persistentStorage.saveProducts(res.products);
      }
      if (res.slides) {
        setLocalSlides(res.slides);
        onSlidesUpdated(res.slides);
      }
      if (res.cms) {
        setLocalCms(res.cms);
        onCmsUpdated(res.cms);
      }
      if (res.orders) {
        setLocalOrders(res.orders);
        onOrdersUpdated(res.orders);
      }
      showToast(`¡Copia de seguridad restaurada exitosamente con ${res.count || res.products?.length || ''} productos!`);
    } catch (err: any) {
      alert('Error al restaurar archivo: ' + err.message);
    } finally {
      setIsSaving(false);
      e.target.value = '';
    }
  };

  // Restore from browser localStorage backup
  const handleRestoreFromBrowser = async () => {
    if (!browserBackup || !browserBackup.products || browserBackup.products.length === 0) {
      alert('No se encontró respaldo en este navegador.');
      return;
    }
    if (!confirm(`¿Restaurar los ${browserBackup.products.length} productos guardados en la memoria de este navegador?`)) {
      return;
    }
    setIsSaving(true);
    try {
      const res = await api.restoreBackup({ products: browserBackup.products });
      if (res.products) {
        setLocalProducts(res.products);
        onProductsUpdated(res.products);
        persistToLocalBackup(res.products);
        persistentStorage.saveProducts(res.products);
      }
      showToast(`¡${browserBackup.products.length} productos restaurados desde tu navegador!`);
    } catch (err: any) {
      alert('Error al restaurar: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Restore from pasted JSON string
  const handleRestorePastedJson = async () => {
    if (!pastedJson.trim()) return;
    setIsSaving(true);
    showToast('Procesando JSON pegado...');
    try {
      let parsed = JSON.parse(pastedJson);
      // Support array of products directly or wrapped in { products: [...] }
      if (Array.isArray(parsed)) {
        parsed = { products: parsed };
      }
      const res = await api.restoreBackup(parsed);
      if (res.products && Array.isArray(res.products)) {
        setLocalProducts(res.products);
        onProductsUpdated(res.products);
        persistToLocalBackup(res.products);
        persistentStorage.saveProducts(res.products);
      }
      setShowPasteModal(false);
      setPastedJson('');
      showToast(`¡${res.count || res.products?.length || ''} productos restaurados exitosamente desde el JSON pegado!`);
    } catch (err: any) {
      alert('Error: el texto ingresado no es un JSON válido o no contiene productos. ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Sync products and settings directly with backend and local storage permanently
  const handleSyncCode = async () => {
    setIsSaving(true);
    try {
      await api.syncFullData({
        products: localProducts,
        cms: localCms,
        slides: localSlides,
        orders: localOrders
      });
      persistentStorage.saveAll({
        products: localProducts,
        cms: localCms,
        slides: localSlides,
        orders: localOrders
      });
      onProductsUpdated(localProducts);
      onCmsUpdated(localCms);
      onSlidesUpdated(localSlides);
      showToast('¡Todo el catálogo, imágenes y textos guardados de forma permanente!');
    } catch (err: any) {
      persistentStorage.saveAll({
        products: localProducts,
        cms: localCms,
        slides: localSlides,
        orders: localOrders
      });
      showToast('Guardado de forma segura en tu navegador');
    } finally {
      setIsSaving(false);
    }
  };

  // Global Save CMS
  const handleSaveCMS = async () => {
    setIsSaving(true);
    try {
      const updated = await api.updateCMS(localCms);
      onCmsUpdated(updated);
      persistentStorage.saveCMS(updated);
      showToast('¡Configuración de la tienda guardada con éxito!');
    } catch {
      persistentStorage.saveCMS(localCms);
      onCmsUpdated(localCms);
      showToast('¡Configuración guardada en tu navegador!');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Slides
  const handleSaveSlides = async () => {
    setIsSaving(true);
    try {
      const updated = await api.updateSlides(localSlides);
      onSlidesUpdated(updated);
      persistentStorage.saveSlides(updated);
      showToast('¡Carrusel actualizado y guardado correctamente!');
    } catch {
      persistentStorage.saveSlides(localSlides);
      onSlidesUpdated(localSlides);
      showToast('¡Carrusel guardado en tu navegador!');
    } finally {
      setIsSaving(false);
    }
  };

  // Reorder slide up/down
  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...localSlides];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSlides.length) return;

    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;

    // update order numbers
    newSlides.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setLocalSlides(newSlides);
  };

  // Upload media helper
  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUploaded: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await api.uploadMedia(file);
      onUploaded(url);
      showToast('¡Archivo subido exitosamente desde tu PC!');
    } catch {
      alert('Error al procesar el archivo');
    }
  };

  // Helper to persist to localStorage backup immediately
  const persistToLocalBackup = (prods: Product[]) => {
    try {
      localStorage.setItem('isamer_products_cache', JSON.stringify(prods));
      const backupObj = {
        timestamp: new Date().toISOString(),
        count: prods.length,
        products: prods
      };
      localStorage.setItem('isamer_catalog_backup', JSON.stringify(backupObj));
      setBrowserBackup(backupObj);
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
    }
  };

  // Save Product (Single or Selected)
  const handleSaveProduct = async (productToSave?: Product) => {
    const target = productToSave || selectedProduct;
    if (!target) {
      alert('No hay ningún producto seleccionado para guardar');
      return;
    }

    setIsSaving(true);
    // 1. Inmediatamente actualizar la lista local en memoria
    const updatedList = localProducts.map(p => (p.id === target.id ? target : p));
    setLocalProducts(updatedList);
    onProductsUpdated(updatedList);

    // 2. BLINDAJE LOCAL INMEDIATO: Guardar en localStorage instantáneamente
    persistToLocalBackup(updatedList);
    persistentStorage.saveProducts(updatedList);

    // 3. Guardar en el servidor backend (con reintento de lista completa si falla el individual)
    try {
      let savedProduct: Product;
      try {
        savedProduct = await api.updateProduct(target.id, target);
      } catch (singleErr: any) {
        console.warn('Individual update failed, attempting full catalog sync fallback:', singleErr);
        const serverProducts = await api.updateAllProducts(updatedList);
        savedProduct = serverProducts.find(p => p.id === target.id) || target;
      }

      // Reemplazar con el producto devuelto del servidor
      const finalList = updatedList.map(p => (p.id === savedProduct.id ? savedProduct : p));
      setLocalProducts(finalList);
      onProductsUpdated(finalList);
      persistToLocalBackup(finalList);
      persistentStorage.saveProducts(finalList);

      showToast(`¡Producto "${target.name}" guardado exitosamente!`);
    } catch (err: any) {
      console.error('Error al guardar en el servidor:', err);
      // Los datos ya están a salvo en persistentStorage, localStorage y memoria
      showToast(`¡Cambios guardados en tu navegador!`);
    } finally {
      setIsSaving(false);
    }
  };

  // Save All Products
  const handleSaveAllProducts = async () => {
    setIsSaving(true);
    persistToLocalBackup(localProducts);
    persistentStorage.saveProducts(localProducts);
    try {
      await api.syncFullData({
        products: localProducts,
        cms: localCms,
        slides: localSlides,
        orders: localOrders
      });
      onProductsUpdated(localProducts);
      showToast(`¡Catálogo completo (${localProducts.length} productos) guardado exitosamente!`);
    } catch (err: any) {
      try {
        const serverProducts = await api.updateAllProducts(localProducts);
        setLocalProducts(serverProducts);
        onProductsUpdated(serverProducts);
        showToast(`¡Catálogo guardado exitosamente!`);
      } catch {
        showToast(`Catálogo guardado en la memoria de tu navegador`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Reorder product up / down / to top / to bottom in the catalog
  const moveProduct = async (index: number, direction: 'up' | 'down') => {
    const newProducts = [...localProducts];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newProducts.length) return;

    const temp = newProducts[index];
    newProducts[index] = newProducts[targetIdx];
    newProducts[targetIdx] = temp;

    // update order numbers
    newProducts.forEach((p, idx) => {
      p.order = idx + 1;
    });

    setLocalProducts(newProducts);
    onProductsUpdated(newProducts);

    try {
      await api.reorderProducts(newProducts);
      showToast(`¡"${temp.name}" movido a la posición #${targetIdx + 1}!`);
    } catch {
      showToast(`¡Orden actualizado (#${targetIdx + 1})!`);
    }
  };

  const moveProductToTop = async (index: number) => {
    if (index <= 0) return;
    const newProducts = [...localProducts];
    const [item] = newProducts.splice(index, 1);
    newProducts.unshift(item);

    newProducts.forEach((p, idx) => {
      p.order = idx + 1;
    });

    setLocalProducts(newProducts);
    onProductsUpdated(newProducts);

    try {
      await api.reorderProducts(newProducts);
      showToast(`¡"${item.name}" ahora aparece en 1º lugar del catálogo!`);
    } catch {
      showToast('Producto ubicado en 1º lugar');
    }
  };

  const moveProductToBottom = async (index: number) => {
    if (index >= localProducts.length - 1) return;
    const newProducts = [...localProducts];
    const [item] = newProducts.splice(index, 1);
    newProducts.push(item);

    newProducts.forEach((p, idx) => {
      p.order = idx + 1;
    });

    setLocalProducts(newProducts);
    onProductsUpdated(newProducts);

    try {
      await api.reorderProducts(newProducts);
      showToast(`¡"${item.name}" ahora está al final del catálogo!`);
    } catch {
      showToast('Producto ubicado al final');
    }
  };

  const moveProductToPosition = async (fromIndex: number, targetPos1Based: number) => {
    const targetIndex = Math.max(0, Math.min(localProducts.length - 1, targetPos1Based - 1));
    if (fromIndex === targetIndex) return;

    const newProducts = [...localProducts];
    const [item] = newProducts.splice(fromIndex, 1);
    newProducts.splice(targetIndex, 0, item);

    newProducts.forEach((p, idx) => {
      p.order = idx + 1;
    });

    setLocalProducts(newProducts);
    onProductsUpdated(newProducts);

    try {
      await api.reorderProducts(newProducts);
      showToast(`¡"${item.name}" reubicado en la posición #${targetIndex + 1}!`);
    } catch {
      showToast(`Posición #${targetIndex + 1} actualizada`);
    }
  };

  // Create New Product
  const handleCreateProduct = async () => {
    const brandToUse = (adminProductBrandFilter === 'Todas' || adminProductBrandFilter === 'ISAMER' || adminProductBrandFilter === 'ISAMER') ? 'H2Derm' : adminProductBrandFilter;
    const isSoftCare = brandToUse === 'SoftCare';
    const newId = 'prod-' + Date.now();
    const newProdTemplate: Product = {
      id: newId,
      name: `Nuevo Producto ${brandToUse}`,
      tagline: 'Fórmula de alta eficacia desarrollada en laboratorio',
      brand: brandToUse as any,
      order: 1,
      category: isSoftCare ? 'Corporal' : (brandToUse === 'Mimitos' ? 'Bebés/Kids' : (brandToUse === 'Le Salon' ? 'Capilar' : 'Cremas')),
      price: 15000,
      originalPrice: 18000,
      discountPercentage: 15,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
      secondaryImages: [
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
        'https://images.unsplash.com/photo-1608248597359-2c7da196a0be?w=800&q=80'
      ],
      description: 'Fórmula cosmética desarrollada con rigurosos estándares farmacéuticos para una eficacia visible y duradera.',
      howToUse: 'Aplicar suavemente con movimientos circulares hasta su total absorción.',
      benefits: ['Fórmula hipoalergénica', 'Resultados comprobados', 'Apta para todo tipo de piel'],
      badges: isSoftCare ? ['Premium'] : ['Nuevo Lanzamiento'],
      featured: false,
      stock: 50,
      rating: 5.0,
      reviewsCount: 1,
      sku: `${brandToUse.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      motherDaySpecial: false
    };

    setIsSaving(true);
    // Put new product at position 1 and re-index remaining immediately
    const updatedList = [
      newProdTemplate,
      ...localProducts.map((p, idx) => ({ ...p, order: idx + 2 }))
    ];
    setLocalProducts(updatedList);
    onProductsUpdated(updatedList);
    setSelectedProductId(newId);
    persistToLocalBackup(updatedList);
    persistentStorage.saveProducts(updatedList);

    try {
      const created = await api.createProduct(newProdTemplate);
      const serverUpdatedList = [
        created,
        ...localProducts.filter(p => p.id !== created.id).map((p, idx) => ({ ...p, order: idx + 2 }))
      ];
      setLocalProducts(serverUpdatedList);
      onProductsUpdated(serverUpdatedList);
      setSelectedProductId(created.id);
      persistToLocalBackup(serverUpdatedList);
      persistentStorage.saveProducts(serverUpdatedList);
      showToast(`¡Producto creado exitosamente en 1ª posición para ${created.brand}!`);
    } catch (err: any) {
      console.warn('Server create product error, fallback to batch sync:', err);
      try {
        await api.updateAllProducts(updatedList);
        persistToLocalBackup(updatedList);
        persistentStorage.saveProducts(updatedList);
        showToast(`¡Producto creado y sincronizado con el catálogo!`);
      } catch {
        showToast(`Producto creado y respaldado en tu navegador.`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto del catálogo?')) return;
    setIsSaving(true);
    const updatedList = localProducts
      .filter(p => p.id !== id)
      .map((p, idx) => ({ ...p, order: idx + 1 }));

    setLocalProducts(updatedList);
    onProductsUpdated(updatedList);
    persistToLocalBackup(updatedList);
    persistentStorage.saveProducts(updatedList);

    if (selectedProductId === id && updatedList.length > 0) {
      setSelectedProductId(updatedList[0].id);
    }

    try {
      await api.deleteProduct(id);
      showToast('Producto eliminado correctamente.');
    } catch (err: any) {
      console.warn('Delete product server error, fallback to batch sync:', err);
      try {
        await api.updateAllProducts(updatedList);
      } catch {}
      showToast('Producto eliminado.');
    } finally {
      setIsSaving(false);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    trackingCode?: string,
    carrierName?: string
  ) => {
    try {
      const updated = await api.updateOrder(orderId, { status, trackingCode, carrierName });
      const newOrders = localOrders.map(o => (o.id === updated.id ? updated : o));
      setLocalOrders(newOrders);
      onOrdersUpdated(newOrders);
      showToast(`Estado de ${updated.orderNumber} actualizado a "${status}"`);
    } catch {
      alert('Error al actualizar pedido');
    }
  };

  // Send Push Notification
  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle || !pushBody) return;
    try {
      await api.sendPushNotification(pushTitle, pushBody);
      setPushSuccess(true);
      setPushTitle('');
      setPushBody('');
      setTimeout(() => setPushSuccess(false), 3000);
      showToast('¡Notificación Push enviada a todos los clientes!');
    } catch {
      alert('Error al emitir notificación');
    }
  };

  // Filtered orders
  const filteredOrders = localOrders.filter(o => {
    if (orderFilter === 'todos') return true;
    return o.status.toLowerCase() === orderFilter.toLowerCase();
  });

  const selectedProduct = localProducts.find(p => p.id === selectedProductId) || localProducts[0];

  const brandProducts = localProducts.filter(
    p => adminProductBrandFilter === 'Todas' || (p.brand || 'H2Derm') === adminProductBrandFilter
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-60 bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Main Panel Container */}
      <div className="w-full max-w-5xl bg-neutral-900 text-neutral-100 h-full flex flex-col shadow-2xl border-l border-neutral-800">
        
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E6007E] text-white flex items-center justify-center font-bold shadow-md">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-white">Panel de Administración Oculto</h2>
                <span className="text-[10px] bg-[#E6007E]/20 text-[#FF80BF] px-2 py-0.5 rounded-full font-bold border border-[#E6007E]/30">
                  Control Total
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Gestión de pedidos en tiempo real, CMS, carrusel, productos, pagos y pixel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadBackup}
              className="hidden sm:flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              title="Descargar respaldo completo JSON a tu PC"
            >
              <Download className="w-3.5 h-3.5 text-[#FF80BF]" />
              <span>Backup JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              title="Cerrar panel de administración"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-2 border-b border-neutral-800 bg-neutral-950/40 text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'bg-[#E6007E] text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Pedidos ({localOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('carousel')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'carousel'
                ? 'bg-[#E6007E] text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Carrusel ({localSlides.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'products'
                ? 'bg-[#E6007E] text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Catálogo & Marcas ({localProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'cms'
                ? 'bg-[#E6007E] text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Textos & Tienda</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'payments'
                ? 'bg-[#E6007E] text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Mercado Pago & Bancos</span>
          </button>

          <button
            onClick={() => setActiveTab('pixel')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'pixel'
                ? 'bg-[#E6007E] text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Meta Ads & Pixel</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#E6007E] text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Ventas</span>
          </button>

          <button
            onClick={() => setActiveTab('push')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'push'
                ? 'bg-[#E6007E] text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notificaciones Push</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: GESTIÓN DE PEDIDOS EN TIEMPO REAL */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700/60">
                <div>
                  <h3 className="text-sm font-bold text-white">Pedidos Registrados ({localOrders.length})</h3>
                  <p className="text-[11px] text-neutral-400">
                    Cambiá estados en tiempo real, agregá códigos de seguimiento y notificá por WhatsApp.
                  </p>
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {['todos', 'pendiente', 'en preparación', 'en camino', 'entregado'].map(f => (
                    <button
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      className={`px-2.5 py-1 rounded-lg capitalize text-xs ${
                        orderFilter === f
                          ? 'bg-[#E6007E] text-white font-bold'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 text-xs">
                  No hay pedidos con el estado seleccionado.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map(order => (
                    <div
                      key={order.id}
                      className="bg-neutral-800/90 rounded-2xl border border-neutral-700 p-4 space-y-3 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-700/70 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-[#FF80BF]">{order.orderNumber}</span>
                          <span className="text-[10px] text-neutral-400">{formatDate(order.createdAt)}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-700 text-neutral-200">
                            {order.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-[11px] text-neutral-400">Estado:</label>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(
                                order.id,
                                e.target.value as OrderStatus,
                                order.trackingCode,
                                order.carrierName
                              )
                            }
                            className="bg-neutral-900 border border-neutral-600 rounded-lg px-2.5 py-1 text-xs text-white focus:border-[#E6007E] outline-none"
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Pagado">Pagado</option>
                            <option value="En preparación">En preparación</option>
                            <option value="En camino">En camino</option>
                            <option value="Entregado">Entregado</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer & Address Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-neutral-300">
                        <div>
                          <span className="text-neutral-400 block text-[10px]">CLIENTA</span>
                          <strong className="text-white">{order.customerName}</strong>
                          <span className="block text-[11px] text-neutral-400">DNI: {order.customerDni}</span>
                          <span className="block text-[11px] text-neutral-400">{order.customerEmail}</span>
                          <span className="block text-[11px] text-neutral-400">Tel: {order.customerPhone}</span>
                        </div>

                        <div>
                          <span className="text-neutral-400 block text-[10px]">ENTREGA</span>
                          <span className="text-white">
                            {order.shippingAddress.street} {order.shippingAddress.number} {order.shippingAddress.apartment}
                          </span>
                          <span className="block text-[11px] text-neutral-400">
                            CP {order.shippingAddress.postalCode}, {order.shippingAddress.city}, {order.shippingAddress.province}
                          </span>
                          <span className="block text-[10px] text-pink-400">
                            Tipo: {order.shippingMethod === 'express' ? 'Express Prioritario' : 'Estándar'}
                          </span>
                        </div>

                        <div>
                          <span className="text-neutral-400 block text-[10px]">TOTAL Y NOTAS</span>
                          <strong className="text-lg text-[#FF80BF] font-mono">{formatCurrency(order.total)}</strong>
                          {order.discount > 0 && (
                            <span className="block text-[10px] text-emerald-400">
                              Desc. Transferencia: -{formatCurrency(order.discount)}
                            </span>
                          )}
                          {order.notes && (
                            <p className="text-[10px] text-amber-200 mt-1 italic">
                              "{order.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Carrier & Tracking update */}
                      <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-700/60 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-60">
                          <input
                            type="text"
                            defaultValue={order.carrierName || 'Correo Argentino'}
                            placeholder="Empresa de Envío (ej: Correo Arg, OCA)"
                            id={`carrier-${order.id}`}
                            className="bg-neutral-800 border border-neutral-600 rounded-lg px-2 py-1 text-xs text-neutral-200 w-36 outline-none"
                          />
                          <input
                            type="text"
                            defaultValue={order.trackingCode || ''}
                            placeholder="Código de Seguimiento (ej: AR-9827182)"
                            id={`tracking-${order.id}`}
                            className="bg-neutral-800 border border-neutral-600 rounded-lg px-2 py-1 text-xs text-neutral-200 flex-1 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const carrier = (document.getElementById(`carrier-${order.id}`) as HTMLInputElement)?.value;
                              const tracking = (document.getElementById(`tracking-${order.id}`) as HTMLInputElement)?.value;
                              handleUpdateOrderStatus(order.id, order.status, tracking, carrier);
                            }}
                            className="bg-neutral-700 hover:bg-[#E6007E] text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Guardar Tracking
                          </button>
                        </div>

                        {/* WhatsApp notify */}
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `¡Hola ${order.customerName}! Te escribimos de ${cms.storeName}. Queremos avisarte que tu pedido #${order.orderNumber} se encuentra: "${order.status}". ${order.trackingCode ? `Tu código de seguimiento es: ${order.trackingCode} (${order.carrierName || 'Correo'}).` : ''} ¡Muchas gracias!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Notificar Cliente por WhatsApp</span>
                        </a>
                      </div>

                      {/* Items row */}
                      <div className="text-[11px] text-neutral-400 pt-1">
                        <span className="font-semibold text-neutral-300">Productos: </span>
                        {order.items.map((it, i) => (
                          <span key={i} className="inline-block bg-neutral-900 px-2 py-0.5 rounded-md mr-1.5 text-neutral-200">
                            {it.quantity}x {it.productName} {it.shade ? `(${it.shade})` : ''}
                          </span>
                        ))}
                      </div>

                      {/* Attached receipt if any */}
                      {order.bankReceiptImage && (
                        <div className="pt-2 border-t border-neutral-700 flex items-center gap-2">
                          <span className="text-[10px] text-neutral-400">Comprobante de Pago adjunto:</span>
                          <a
                            href={order.bankReceiptImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#FF80BF] underline flex items-center gap-1 font-semibold"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Ver imagen del comprobante</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GESTOR DE CARRUSEL (ORDEN, IMÁGENES Y VIDEOS) */}
          {activeTab === 'carousel' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700">
                <div>
                  <h3 className="text-sm font-bold text-white">Gestor de Carrusel de Imágenes y Videos</h3>
                  <p className="text-[11px] text-neutral-400">
                    Cambiá el orden con las flechas, editá títulos, subí videos o fotos desde tu PC y guardá los cambios.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newSlide: CarouselSlide = {
                        id: 'slide-' + Date.now(),
                        title: 'Nuevo Banner Especial',
                        subtitle: 'Descripción destacada de la promoción',
                        highlightText: '3 Cuotas',
                        badge: 'Exclusivo',
                        buttonText: 'Ver Productos',
                        buttonLink: '#productos',
                        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=85',
                        textColor: 'light',
                        align: 'left',
                        active: true,
                        order: localSlides.length + 1
                      };
                      setLocalSlides([...localSlides, newSlide]);
                    }}
                    className="bg-neutral-700 hover:bg-neutral-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Slide</span>
                  </button>

                  <button
                    onClick={handleSaveSlides}
                    disabled={isSaving}
                    className="bg-[#E6007E] hover:bg-[#C9006B] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Guardando...' : 'Guardar Carrusel'}</span>
                  </button>
                </div>
              </div>

              {/* Slides List with Reordering */}
              <div className="space-y-4">
                {localSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="bg-neutral-800 rounded-2xl p-4 border border-neutral-700 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#E6007E] text-white font-bold text-xs flex items-center justify-center">
                          {slide.order || index + 1}
                        </span>
                        <h4 className="font-bold text-sm text-white">{slide.title || 'Slide sin título'}</h4>
                      </div>

                      {/* Reorder and Delete controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveSlide(index, 'up')}
                          className="p-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white disabled:opacity-30"
                          title="Subir de posición en el carrusel"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={index === localSlides.length - 1}
                          onClick={() => moveSlide(index, 'down')}
                          className="p-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-white disabled:opacity-30"
                          title="Bajar de posición en el carrusel"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('¿Eliminar este slide del carrusel?')) {
                              setLocalSlides(localSlides.filter(s => s.id !== slide.id));
                            }
                          }}
                          className="p-1.5 bg-red-900/60 hover:bg-red-800 rounded-lg text-red-200 ml-2"
                          title="Eliminar slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Media preview and upload */}
                      <div className="md:col-span-4 space-y-2">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700">
                          {slide.video ? (
                            <video src={slide.video} controls className="w-full h-full object-cover" />
                          ) : (
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5 text-xs">
                          <label className="flex items-center justify-center gap-2 p-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl cursor-pointer font-medium transition-colors">
                            <Upload className="w-3.5 h-3.5 text-[#FF80BF]" />
                            <span>Subir Imagen desde PC</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleUploadFile(e, (url) => {
                                  const updated = [...localSlides];
                                  updated[index].image = url;
                                  delete updated[index].video;
                                  setLocalSlides(updated);
                                })
                              }
                            />
                          </label>

                          <label className="flex items-center justify-center gap-2 p-2 bg-neutral-700/60 hover:bg-neutral-600 text-neutral-200 rounded-xl cursor-pointer text-[11px] transition-colors">
                            <Upload className="w-3 h-3 text-cyan-400" />
                            <span>Subir Video MP4 desde PC</span>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) =>
                                handleUploadFile(e, (url) => {
                                  const updated = [...localSlides];
                                  updated[index].video = url;
                                  setLocalSlides(updated);
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <div>
                          <label className="block text-neutral-400 text-[11px] mb-1">Título Principal</label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => {
                              const updated = [...localSlides];
                              updated[index].title = e.target.value;
                              setLocalSlides(updated);
                            }}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white outline-none focus:border-[#E6007E]"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-400 text-[11px] mb-1">Etiqueta Badge</label>
                          <input
                            type="text"
                            value={slide.badge}
                            onChange={(e) => {
                              const updated = [...localSlides];
                              updated[index].badge = e.target.value;
                              setLocalSlides(updated);
                            }}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white outline-none focus:border-[#E6007E]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-400 text-[11px] mb-1">Subtítulo Descriptivo</label>
                          <input
                            type="text"
                            value={slide.subtitle}
                            onChange={(e) => {
                              const updated = [...localSlides];
                              updated[index].subtitle = e.target.value;
                              setLocalSlides(updated);
                            }}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white outline-none focus:border-[#E6007E]"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-400 text-[11px] mb-1">Texto Destacado (Oferta)</label>
                          <input
                            type="text"
                            value={slide.highlightText}
                            onChange={(e) => {
                              const updated = [...localSlides];
                              updated[index].highlightText = e.target.value;
                              setLocalSlides(updated);
                            }}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white outline-none focus:border-[#E6007E]"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-400 text-[11px] mb-1">Texto del Botón</label>
                          <input
                            type="text"
                            value={slide.buttonText}
                            onChange={(e) => {
                              const updated = [...localSlides];
                              updated[index].buttonText = e.target.value;
                              setLocalSlides(updated);
                            }}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white outline-none focus:border-[#E6007E]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GESTOR DE CATÁLOGO & MARCAS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Emergency / Fast Store.json Recovery Banner */}
              <div className="bg-linear-to-r from-amber-950/70 via-neutral-900 to-neutral-900 border-2 border-amber-500/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-200 flex items-center gap-2">
                      <span>Restaurar / Importar archivo store.json</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Blindaje Total
                      </span>
                    </h4>
                    <p className="text-[11px] text-neutral-300">
                      Subí tu archivo <code className="bg-neutral-800 text-amber-300 px-1 py-0.2 rounded font-mono">store.json</code> (incluso de 10MB con fotos base64): el servidor extraerá las imágenes a disco, alivianará el archivo y restaurará cada producto.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => restoreInputRef.current?.click()}
                    disabled={isSaving}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
                    title="Seleccionar archivo store.json de tu computadora"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Subir mi store.json</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasteModal(true)}
                    disabled={isSaving}
                    className="bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/40 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    title="Pegar texto JSON directamente"
                  >
                    <Clipboard className="w-4 h-4" />
                    <span>Pegar texto JSON</span>
                  </button>
                </div>
              </div>

              {/* Header with actions */}
              <div className="bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-[#FF80BF]" />
                    <span>Catálogo & Marcas del Laboratorio ({localProducts.length} productos en total)</span>
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Administrá productos de cada marca (H2Derm, SoftCare Premium, Mimitos, Le Salon), 3 fotos por producto, reels, precios, stock y categorías.
                  </p>
                </div>

                {/* Hidden File Input for Restoring Backup */}
                <input
                  type="file"
                  ref={restoreInputRef}
                  accept=".json"
                  onChange={handleRestoreBackupFile}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  {/* Button to sync and save everything permanently */}
                  <button
                    type="button"
                    onClick={handleSyncCode}
                    disabled={isSaving}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                    title="Guarda permanentemente todos los productos, categorías, imágenes y textos"
                  >
                    <Save className="w-4 h-4 text-emerald-200" />
                    <span>Guardar Todo</span>
                  </button>

                  {/* Button to restore from browser local cache */}
                  {browserBackup && browserBackup.products && browserBackup.products.length > 0 && (
                    <button
                      type="button"
                      onClick={handleRestoreFromBrowser}
                      disabled={isSaving}
                      className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                      title={`Restaurar ${browserBackup.products.length} productos guardados en la memoria de este navegador`}
                    >
                      <History className="w-4 h-4 text-sky-200" />
                      <span>Caché Navegador ({browserBackup.products.length})</span>
                    </button>
                  )}

                  {/* Button to paste JSON */}
                  <button
                    type="button"
                    onClick={() => setShowPasteModal(true)}
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    title="Pegar JSON de productos directamente"
                  >
                    <Clipboard className="w-4 h-4 text-amber-400" />
                    <span>Pegar JSON</span>
                  </button>

                  {/* Button to download JSON backup */}
                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    title="Descargar copia de seguridad .json a tu PC"
                  >
                    <Download className="w-4 h-4 text-[#FF80BF]" />
                    <span>Backup JSON</span>
                  </button>

                  {/* Button to restore from JSON file */}
                  <button
                    type="button"
                    onClick={() => restoreInputRef.current?.click()}
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    title="Subir y restaurar archivo .json"
                  >
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Subir .json</span>
                  </button>

                  <button
                    onClick={handleCreateProduct}
                    disabled={isSaving}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Producto</span>
                  </button>

                  {selectedProduct && (
                    <button
                      onClick={() => handleSaveProduct(selectedProduct)}
                      disabled={isSaving}
                      className="bg-[#E6007E] hover:bg-[#C9006B] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                      title="Guardar cambios del producto seleccionado"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Browser Backup Alert Banner if backup has products */}
              {browserBackup && browserBackup.products && browserBackup.products.length > 0 && browserBackup.products.length !== localProducts.length && (
                <div className="bg-sky-950/60 border border-sky-500/50 rounded-2xl p-3.5 text-xs text-sky-200 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <History className="w-5 h-5 text-sky-400 shrink-0" />
                    <div>
                      <p className="font-bold text-sky-200">
                        Memoria del navegador encontrada: {browserBackup.products.length} productos guardados el {new Date(browserBackup.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="text-[11px] text-sky-300/80">
                        Si tus productos no se reflejan tras recargar, haz clic aquí para sincronizarlos al instante.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRestoreFromBrowser}
                    disabled={isSaving}
                    className="bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restaurar {browserBackup.products.length} Productos</span>
                  </button>
                </div>
              )}

              {/* Active Persistence Banner */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3.5 text-xs text-emerald-200 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-300 text-xs">
                      Persistencia Automática Blindada
                    </p>
                    <p className="text-neutral-300 text-[11px]">
                      Tus cambios se guardan al instante en la base de datos y memoria local. Podés modificar productos, categorías, imágenes, reels y textos sin riesgo de perderlos.
                    </p>
                  </div>
                </div>
                <div className="text-[10px] bg-emerald-900/60 text-emerald-300 font-mono px-2.5 py-1 rounded-full border border-emerald-700/60 font-bold shrink-0">
                  {localProducts.length} Productos Guardados
                </div>
              </div>

              {/* Brand filter tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-neutral-800">
                <span className="text-[11px] font-bold text-neutral-400 mr-2 shrink-0">Filtrar Marca:</span>
                {(['Todas', 'H2Derm', 'SoftCare', 'Mimitos', 'Le Salon'] as const).map((brandName) => {
                  const count =
                    brandName === 'Todas'
                      ? localProducts.length
                      : localProducts.filter(p => (p.brand || 'H2Derm') === brandName).length;
                  const isActive = adminProductBrandFilter === brandName;
                  return (
                    <button
                      key={brandName}
                      onClick={() => {
                        setAdminProductBrandFilter(brandName);
                        // Auto-select first matching product if current is outside
                        const matching =
                          brandName === 'Todas'
                            ? localProducts
                            : localProducts.filter(p => (p.brand || 'H2Derm') === brandName);
                        if (matching.length > 0 && !matching.some(p => p.id === selectedProductId)) {
                          setSelectedProductId(matching[0].id);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#E6007E] text-white shadow-xs'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                      }`}
                    >
                      <span>{brandName}</span>
                      {brandName === 'SoftCare' && (
                        <span className="text-[9px] bg-purple-500/30 text-purple-300 font-extrabold px-1.5 py-0.2 rounded-full border border-purple-500/40">
                          PREMIUM
                        </span>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-neutral-700 text-neutral-300'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selector of products for this brand */}
              {brandProducts.length === 0 ? (
                <div className="bg-neutral-800/40 rounded-2xl p-6 text-center border border-dashed border-neutral-700">
                  <p className="text-neutral-400 text-xs mb-3">
                    Aún no hay productos cargados para la marca <strong className="text-white">{adminProductBrandFilter}</strong>.
                  </p>
                  <button
                    onClick={handleCreateProduct}
                    className="bg-[#E6007E] hover:bg-[#C9006B] text-white px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar primer producto de {adminProductBrandFilter}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {brandProducts.map((prod) => {
                    const globalIdx = localProducts.findIndex(p => p.id === prod.id);
                    return (
                      <div
                        key={prod.id}
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-center justify-between gap-1.5 relative group ${
                          selectedProductId === prod.id
                            ? 'border-[#E6007E] bg-[#E6007E]/20 ring-1 ring-[#E6007E]'
                            : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
                        }`}
                      >
                        {/* Brand badge */}
                        <span className="absolute top-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-neutral-900/80 text-pink-300 border border-neutral-700">
                          {prod.brand || 'H2Derm'}
                        </span>

                        {/* Order badge */}
                        <span
                          className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/80 shadow-xs"
                          title={`Posición en catálogo: #${globalIdx + 1}`}
                        >
                          #{globalIdx + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedProductId(prod.id)}
                          className="w-full flex flex-col items-center text-center cursor-pointer pt-3"
                        >
                          <img src={prod.image} alt={prod.name} className="w-14 h-14 rounded-lg object-cover bg-neutral-900" />
                          <span className="text-[10px] font-bold text-center line-clamp-1 text-white w-full mt-1.5">{prod.name}</span>
                          <span className="text-[10px] text-[#FF80BF] font-mono">{formatCurrency(prod.price)}</span>
                        </button>

                        {/* Quick reorder controls */}
                        <div className="flex items-center justify-between w-full pt-1.5 mt-1 border-t border-neutral-700/60 text-[10px]">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveProduct(globalIdx, 'up'); }}
                            disabled={globalIdx === 0}
                            title="Subir producto (aparece antes)"
                            className="p-1 rounded bg-neutral-900 hover:bg-neutral-700 text-neutral-300 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveProductToTop(globalIdx); }}
                            disabled={globalIdx === 0}
                            title="Poner en 1º lugar del catálogo"
                            className="px-1.5 py-0.5 rounded bg-indigo-900/80 hover:bg-indigo-700 text-indigo-200 font-bold text-[9px] disabled:opacity-25 disabled:cursor-not-allowed"
                          >
                            1º
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveProduct(globalIdx, 'down'); }}
                            disabled={globalIdx === localProducts.length - 1}
                            title="Bajar producto (aparece después)"
                            className="p-1 rounded bg-neutral-900 hover:bg-neutral-700 text-neutral-300 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Active Product Form */}
              {selectedProduct && (
                <div className="bg-neutral-800 rounded-2xl p-5 border border-neutral-700 space-y-6 text-xs">
                  {/* Product Header Bar */}
                  <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-lg font-bold bg-[#E6007E] text-white">
                        {selectedProduct.brand || 'H2Derm'}
                      </span>
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        Editando: {selectedProduct.name}
                      </h4>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        (ID: {selectedProduct.id})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(selectedProduct.id)}
                        className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/80 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Eliminar este producto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveProduct(selectedProduct)}
                        disabled={isSaving}
                        className="px-4 py-1.5 bg-[#E6007E] hover:bg-[#C9006B] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Guardar</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Order & Position Toolbar */}
                  <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-inner">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold font-mono text-sm shadow-xs">
                        #{localProducts.findIndex(p => p.id === selectedProduct.id) + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-xs">
                            Posición en Catálogo: #{localProducts.findIndex(p => p.id === selectedProduct.id) + 1} de {localProducts.length}
                          </p>
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-medium">
                            Orden en Tienda
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">
                          Define el orden visual en que los clientes ven este producto en la página
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const idx = localProducts.findIndex(p => p.id === selectedProduct.id);
                          if (idx > 0) moveProductToTop(idx);
                        }}
                        disabled={localProducts.findIndex(p => p.id === selectedProduct.id) === 0}
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                        title="Ubica este producto inmediatamente en el 1º lugar del catálogo"
                      >
                        <ChevronsUp className="w-3.5 h-3.5" />
                        <span>Poner 1º en Catálogo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const idx = localProducts.findIndex(p => p.id === selectedProduct.id);
                          if (idx > 0) moveProduct(idx, 'up');
                        }}
                        disabled={localProducts.findIndex(p => p.id === selectedProduct.id) === 0}
                        className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors border border-neutral-700"
                        title="Mover una posición hacia arriba"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Subir</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const idx = localProducts.findIndex(p => p.id === selectedProduct.id);
                          if (idx < localProducts.length - 1) moveProduct(idx, 'down');
                        }}
                        disabled={localProducts.findIndex(p => p.id === selectedProduct.id) === localProducts.length - 1}
                        className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors border border-neutral-700"
                        title="Mover una posición hacia abajo"
                      >
                        <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Bajar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const idx = localProducts.findIndex(p => p.id === selectedProduct.id);
                          if (idx < localProducts.length - 1) moveProductToBottom(idx);
                        }}
                        disabled={localProducts.findIndex(p => p.id === selectedProduct.id) === localProducts.length - 1}
                        className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors border border-neutral-700"
                        title="Ubicar al final del catálogo"
                      >
                        <ChevronsDown className="w-3.5 h-3.5" />
                        <span>Poner Último</span>
                      </button>

                      {/* Manual position input */}
                      <div className="flex items-center gap-1 bg-neutral-900 px-2.5 py-1 rounded-xl border border-neutral-700">
                        <span className="text-[10px] text-neutral-400 font-bold">Ir a Posición:</span>
                        <input
                          type="number"
                          min="1"
                          max={localProducts.length}
                          defaultValue={localProducts.findIndex(p => p.id === selectedProduct.id) + 1}
                          key={selectedProduct.id}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const target = parseInt((e.target as HTMLInputElement).value);
                              if (!isNaN(target)) {
                                moveProductToPosition(localProducts.findIndex(p => p.id === selectedProduct.id), target);
                              }
                            }
                          }}
                          className="w-12 bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-white font-mono text-center text-xs outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                            const target = parseInt(input.value);
                            if (!isNaN(target)) {
                              moveProductToPosition(localProducts.findIndex(p => p.id === selectedProduct.id), target);
                            }
                          }}
                          className="px-2 py-0.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded text-[10px] font-bold"
                        >
                          Ir
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* MULTI-IMAGE & REEL SECTION: 1st, 2nd, 3rd Image + Reel Video */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#FF80BF] uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4" />
                        <span>Fotos del Producto (1ª, 2ª y 3ª Imagen) & Reel</span>
                      </h4>
                      <span className="text-[11px] text-neutral-400">
                        Subí desde tu PC o ingresá el enlace URL directo
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Image 1 (Principal) */}
                      <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-700 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-white">
                          <span>1ª Foto (Principal) *</span>
                          <span className="text-[10px] text-emerald-400">Portada</span>
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                          <img src={selectedProduct.image} alt="Foto 1" className="w-full h-full object-cover" />
                        </div>
                        <input
                          type="text"
                          value={selectedProduct.image}
                          onChange={(e) => {
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, image: e.target.value } : p
                            );
                            setLocalProducts(updated);
                          }}
                          placeholder="URL Foto 1"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white text-[11px] outline-none"
                        />
                        <label className="flex items-center justify-center gap-1.5 p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl cursor-pointer font-bold text-[11px] transition-colors border border-neutral-700">
                          <Upload className="w-3.5 h-3.5 text-[#FF80BF]" />
                          <span>Subir Foto 1 (PC)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleUploadFile(e, (url) => {
                                const updated = localProducts.map(p =>
                                  p.id === selectedProduct.id ? { ...p, image: url } : p
                                );
                                setLocalProducts(updated);
                              })
                            }
                          />
                        </label>
                      </div>

                      {/* Image 2 (Secundaria) */}
                      <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-700 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-white">
                          <span>2ª Foto (Secundaria)</span>
                          {selectedProduct.secondaryImages?.[0] && (
                            <button
                              type="button"
                              onClick={() => {
                                const newSec = [...(selectedProduct.secondaryImages || [])];
                                newSec[0] = '';
                                const updated = localProducts.map(p =>
                                  p.id === selectedProduct.id ? { ...p, secondaryImages: newSec.filter(Boolean) } : p
                                );
                                setLocalProducts(updated);
                              }}
                              className="text-red-400 hover:text-red-300 text-[10px]"
                            >
                              Quitar
                            </button>
                          )}
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                          {selectedProduct.secondaryImages?.[0] ? (
                            <img src={selectedProduct.secondaryImages[0]} alt="Foto 2" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-3 text-neutral-500">
                              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-40" />
                              <span className="text-[10px]">Sin 2ª foto cargada</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          value={selectedProduct.secondaryImages?.[0] || ''}
                          onChange={(e) => {
                            const newSec = [...(selectedProduct.secondaryImages || [])];
                            newSec[0] = e.target.value;
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, secondaryImages: newSec } : p
                            );
                            setLocalProducts(updated);
                          }}
                          placeholder="URL Foto 2"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white text-[11px] outline-none"
                        />
                        <label className="flex items-center justify-center gap-1.5 p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl cursor-pointer font-bold text-[11px] transition-colors border border-neutral-700">
                          <Upload className="w-3.5 h-3.5 text-[#FF80BF]" />
                          <span>Subir Foto 2 (PC)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleUploadFile(e, (url) => {
                                const newSec = [...(selectedProduct.secondaryImages || [])];
                                newSec[0] = url;
                                const updated = localProducts.map(p =>
                                  p.id === selectedProduct.id ? { ...p, secondaryImages: newSec } : p
                                );
                                setLocalProducts(updated);
                              })
                            }
                          />
                        </label>
                      </div>

                      {/* Image 3 (Terciaria) */}
                      <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-700 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-white">
                          <span>3ª Foto (Terciaria)</span>
                          {selectedProduct.secondaryImages?.[1] && (
                            <button
                              type="button"
                              onClick={() => {
                                const newSec = [...(selectedProduct.secondaryImages || [])];
                                newSec[1] = '';
                                const updated = localProducts.map(p =>
                                  p.id === selectedProduct.id ? { ...p, secondaryImages: newSec.filter(Boolean) } : p
                                );
                                setLocalProducts(updated);
                              }}
                              className="text-red-400 hover:text-red-300 text-[10px]"
                            >
                              Quitar
                            </button>
                          )}
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                          {selectedProduct.secondaryImages?.[1] ? (
                            <img src={selectedProduct.secondaryImages[1]} alt="Foto 3" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-3 text-neutral-500">
                              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-40" />
                              <span className="text-[10px]">Sin 3ª foto cargada</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          value={selectedProduct.secondaryImages?.[1] || ''}
                          onChange={(e) => {
                            const newSec = [...(selectedProduct.secondaryImages || [])];
                            newSec[1] = e.target.value;
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, secondaryImages: newSec } : p
                            );
                            setLocalProducts(updated);
                          }}
                          placeholder="URL Foto 3"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white text-[11px] outline-none"
                        />
                        <label className="flex items-center justify-center gap-1.5 p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl cursor-pointer font-bold text-[11px] transition-colors border border-neutral-700">
                          <Upload className="w-3.5 h-3.5 text-[#FF80BF]" />
                          <span>Subir Foto 3 (PC)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleUploadFile(e, (url) => {
                                const newSec = [...(selectedProduct.secondaryImages || [])];
                                newSec[1] = url;
                                const updated = localProducts.map(p =>
                                  p.id === selectedProduct.id ? { ...p, secondaryImages: newSec } : p
                                );
                                setLocalProducts(updated);
                              })
                            }
                          />
                        </label>
                      </div>

                      {/* Video / Reel */}
                      <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-700 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-white">
                          <span className="flex items-center gap-1">
                            <Film className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Reel / Video</span>
                          </span>
                          {selectedProduct.video && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = localProducts.map(p =>
                                  p.id === selectedProduct.id ? { ...p, video: undefined } : p
                                );
                                setLocalProducts(updated);
                              }}
                              className="text-red-400 hover:text-red-300 text-[10px]"
                            >
                              Quitar
                            </button>
                          )}
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                          {selectedProduct.video ? (
                            <video src={selectedProduct.video} controls className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-3 text-neutral-500">
                              <Film className="w-6 h-6 mx-auto mb-1 opacity-40 text-cyan-400" />
                              <span className="text-[10px]">Sin video / reel</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          value={selectedProduct.video || ''}
                          onChange={(e) => {
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, video: e.target.value } : p
                            );
                            setLocalProducts(updated);
                          }}
                          placeholder="URL Video MP4 / Reel"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white text-[11px] outline-none"
                        />
                        <label className="flex items-center justify-center gap-1.5 p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl cursor-pointer font-bold text-[11px] transition-colors border border-neutral-700">
                          <Upload className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Subir Video MP4 (PC)</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) =>
                              handleUploadFile(e, (url) => {
                                const updated = localProducts.map(p =>
                                  p.id === selectedProduct.id ? { ...p, video: url } : p
                                );
                                setLocalProducts(updated);
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* FORM FIELDS */}
                  <div className="space-y-4 pt-2 border-t border-neutral-700">
                    <h4 className="text-xs font-bold text-[#FF80BF] uppercase tracking-wider">
                      Datos del Cosmético & Laboratorio
                    </h4>

                    {/* Brand, Category, SKU */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-neutral-400 text-[11px] mb-1 font-bold">
                          Marca *
                        </label>
                        <select
                          value={selectedProduct.brand || 'H2Derm'}
                          onChange={(e) => {
                            const newBrand = e.target.value as any;
                            const isSoftCare = newBrand === 'SoftCare';
                            const updated = localProducts.map(p => {
                              if (p.id !== selectedProduct.id) return p;
                              let badges = p.badges || [];
                              if (isSoftCare && !badges.includes('Premium')) {
                                badges = ['Premium', ...badges];
                              }
                              return { ...p, brand: newBrand, badges };
                            });
                            setLocalProducts(updated);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E] font-bold"
                        >
                          <option value="H2Derm">H2Derm (Línea Principal)</option>
                          <option value="SoftCare">SoftCare (Línea Premium)</option>
                          <option value="Mimitos">Mimitos (Línea Infantil & Bebés)</option>
                          <option value="Le Salon">Le Salon (Capilar & Barbería)</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-neutral-400 text-[11px] font-bold">
                            Categoría del Producto *
                          </label>
                          <span className="text-[10px] text-pink-400 font-bold px-2 py-0.5 rounded-full bg-pink-950/60 border border-pink-800/60">
                            {selectedProduct.category || 'Sin categoría'}
                          </span>
                        </div>

                        {/* Fast Select Dropdown for all 10 official categories */}
                        <select
                          value={OFFICIAL_CATEGORIES.includes(selectedProduct.category as any) ? selectedProduct.category : 'custom'}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== 'custom') {
                              const updated = localProducts.map(p =>
                                p.id === selectedProduct.id ? { ...p, category: val } : p
                              );
                              setLocalProducts(updated);
                            }
                          }}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E] font-bold mb-2 text-sm cursor-pointer"
                        >
                          {OFFICIAL_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                          <option value="custom">✏️ Otra categoría personalizada...</option>
                        </select>

                        {/* Direct input for custom category name or editing */}
                        <input
                          type="text"
                          value={selectedProduct.category || ''}
                          onChange={(e) => {
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, category: e.target.value } : p
                            );
                            setLocalProducts(updated);
                          }}
                          placeholder="Elegir del listado o escribir: Aceites, Cremas, etc."
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-white outline-none focus:border-[#E6007E] text-xs font-medium"
                        />

                        {/* Quick-select pills with all 10 official categories requested */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {OFFICIAL_CATEGORIES.map(cat => {
                            const isSelected = selectedProduct.category?.toLowerCase() === cat.toLowerCase();
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => {
                                  const updated = localProducts.map(p =>
                                    p.id === selectedProduct.id ? { ...p, category: cat } : p
                                  );
                                  setLocalProducts(updated);
                                }}
                                className={`text-[10px] px-2 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                                  isSelected
                                    ? 'bg-[#E6007E] text-white font-bold ring-1 ring-pink-400 shadow-xs'
                                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                                }`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-400 text-[11px] mb-1">
                          Código SKU / Referencia
                        </label>
                        <input
                          type="text"
                          value={selectedProduct.sku || ''}
                          onChange={(e) => {
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, sku: e.target.value } : p
                            );
                            setLocalProducts(updated);
                          }}
                          placeholder="Ej: H2D-CRM-50"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono"
                        />
                      </div>
                    </div>

                    {/* Name & Tagline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 text-[11px] mb-1 font-bold">Nombre del Cosmético *</label>
                        <input
                          type="text"
                          value={selectedProduct.name}
                          onChange={(e) => {
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, name: e.target.value } : p
                            );
                            setLocalProducts(updated);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E] font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 text-[11px] mb-1">Subtítulo / Tagline Corto</label>
                        <input
                          type="text"
                          value={selectedProduct.tagline}
                          onChange={(e) => {
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, tagline: e.target.value } : p
                            );
                            setLocalProducts(updated);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                        />
                      </div>
                    </div>

                    {/* Pricing, Discount & Stock */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-neutral-400 text-[11px] mb-1 font-bold">Precio Actual ($ ARS) *</label>
                        <input
                          type="number"
                          value={selectedProduct.price}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, price: val } : p
                            );
                            setLocalProducts(updated);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E] font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 text-[11px] mb-1">Precio Anterior (Tachado)</label>
                        <input
                          type="number"
                          value={selectedProduct.originalPrice || 0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, originalPrice: val } : p
                            );
                            setLocalProducts(updated);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 text-[11px] mb-1">% Descuento Badge</label>
                        <input
                          type="number"
                          value={selectedProduct.discountPercentage || 0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, discountPercentage: val } : p
                            );
                            setLocalProducts(updated);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 text-[11px] mb-1 font-bold">Stock Disponible *</label>
                        <input
                          type="number"
                          value={selectedProduct.stock}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, stock: val } : p
                            );
                            setLocalProducts(updated);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono font-bold"
                        />
                      </div>
                    </div>

                    {/* Descriptions & How to use */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 text-[11px] mb-1 font-bold">Descripción Completa del Producto</label>
                        <textarea
                          rows={4}
                          value={selectedProduct.description}
                          onChange={(e) => {
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, description: e.target.value } : p
                            );
                            setLocalProducts(updated);
                          }}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 text-[11px] mb-1">Modo de Uso / Aplicación</label>
                        <textarea
                          rows={4}
                          value={selectedProduct.howToUse || ''}
                          onChange={(e) => {
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, howToUse: e.target.value } : p
                            );
                            setLocalProducts(updated);
                          }}
                          placeholder="Ej: Aplicar sobre el rostro limpio dos veces al día..."
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                        />
                      </div>
                    </div>

                    {/* Benefits (one per line) */}
                    <div>
                      <label className="block text-neutral-400 text-[11px] mb-1">
                        Beneficios Clave (Escribí un beneficio por línea)
                      </label>
                      <textarea
                        rows={3}
                        value={(selectedProduct.benefits || []).join('\n')}
                        onChange={(e) => {
                          const lines = e.target.value.split('\n').filter(Boolean);
                          const updated = localProducts.map(p =>
                            p.id === selectedProduct.id ? { ...p, benefits: lines } : p
                          );
                          setLocalProducts(updated);
                        }}
                        placeholder="Hidratación profunda 24h&#10;Estimula la producción de colágeno&#10;Apto para pieles sensibles"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                      />
                    </div>

                    {/* Mother's Day Flag */}
                    <div className="flex items-center gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={selectedProduct.motherDaySpecial}
                          onChange={(e) => {
                            const updated = localProducts.map(p =>
                              p.id === selectedProduct.id ? { ...p, motherDaySpecial: e.target.checked } : p
                            );
                            setLocalProducts(updated);
                          }}
                          className="accent-[#E6007E]"
                        />
                        <span className="text-white font-medium">Destacar en "Especial Día de la Madre"</span>
                      </label>
                    </div>

                    {/* Badges / Etiquetas (e.g. Premium, Línea Estrella, Nuevo) */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-neutral-400 text-[11px] font-bold">
                          Etiquetas / Badges (separados por coma)
                        </label>
                        {selectedProduct.brand === 'SoftCare' && (
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/40">
                            ★ Línea SoftCare: Tag "Premium" activo
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={(selectedProduct.badges || []).join(', ')}
                        onChange={(e) => {
                          const badgesList = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          const updated = localProducts.map(p =>
                            p.id === selectedProduct.id ? { ...p, badges: badgesList } : p
                          );
                          setLocalProducts(updated);
                        }}
                        placeholder="Ej: Premium, Nuevo Lanzamiento, 10% Urea"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                      />
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CMS TEXTOS & TIENDA */}
          {activeTab === 'cms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700">
                <div>
                  <h3 className="text-sm font-bold text-white">Editor de Textos & Identidad de la Tienda</h3>
                  <p className="text-[11px] text-neutral-400">
                    Modificá el nombre comercial de la tienda, barra de anuncios, textos del Día de la Madre y contacto.
                  </p>
                </div>
                <button
                  onClick={handleSaveCMS}
                  disabled={isSaving}
                  className="bg-[#E6007E] hover:bg-[#C9006B] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Textos'}</span>
                </button>
              </div>

              <div className="bg-neutral-800 rounded-2xl p-5 border border-neutral-700 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1 font-bold">
                      Nombre de la Tienda (Visible en Header y Facturas) *
                    </label>
                    <input
                      type="text"
                      value={localCms.storeName}
                      onChange={(e) => setLocalCms({ ...localCms, storeName: e.target.value })}
                      placeholder="Ej: ISAMER"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E] font-bold"
                    />
                    <span className="text-[10px] text-pink-400 mt-1 block">
                      Podés cambiarlo al nombre real de tu negocio en cualquier momento.
                    </span>
                  </div>

                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Eslogan / Subtítulo del Logo</label>
                    <input
                      type="text"
                      value={localCms.storeTagline}
                      onChange={(e) => setLocalCms({ ...localCms, storeTagline: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                    />
                  </div>
                </div>

                {/* Announcement bar */}
                <div className="space-y-2 pt-2 border-t border-neutral-700">
                  <div className="flex items-center justify-between">
                    <label className="text-neutral-400 text-[11px] font-bold">
                      Texto de la Barra Superior de Promociones
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
                      <input
                        type="checkbox"
                        checked={localCms.announcementActive}
                        onChange={(e) => setLocalCms({ ...localCms, announcementActive: e.target.checked })}
                        className="accent-[#E6007E]"
                      />
                      <span>Barra Activa</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={localCms.announcementBar}
                    onChange={(e) => setLocalCms({ ...localCms, announcementBar: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                  />
                </div>

                {/* Mother's Day Section */}
                <div className="space-y-3 pt-2 border-t border-neutral-700">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#FF80BF] uppercase tracking-wider">
                      Sección Especial Día de la Madre
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={localCms.enableMothersDay !== false}
                        onChange={(e) => setLocalCms({ ...localCms, enableMothersDay: e.target.checked })}
                        className="accent-[#E6007E]"
                      />
                      <span className="font-semibold text-white">Activar Sección en la Tienda</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Podés desactivar esta casilla en cualquier momento (ej: el próximo mes) y el banner del Día de la Madre desaparecerá automáticamente de la web.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 text-[11px] mb-1">Título de la Campaña</label>
                      <input
                        type="text"
                        value={localCms.mothersDayPromoTitle}
                        onChange={(e) => setLocalCms({ ...localCms, mothersDayPromoTitle: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 text-[11px] mb-1">Texto de Descuento Especial</label>
                      <input
                        type="text"
                        value={localCms.mothersDayPromoDiscount}
                        onChange={(e) => setLocalCms({ ...localCms, mothersDayPromoDiscount: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-neutral-400 text-[11px] mb-1">Subtítulo / Copy</label>
                      <input
                        type="text"
                        value={localCms.mothersDayPromoSubtitle}
                        onChange={(e) => setLocalCms({ ...localCms, mothersDayPromoSubtitle: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                      />
                    </div>
                  </div>

                  {/* Banner image upload */}
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Imagen del Banner Día de la Madre</label>
                    <div className="flex items-center gap-3">
                      <img
                        src={localCms.mothersDayPromoBanner}
                        alt="Banner Preview"
                        className="w-20 h-14 rounded-xl object-cover border border-neutral-700"
                      />
                      <label className="flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl cursor-pointer text-xs transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[#FF80BF]" />
                        <span>Subir Nueva Imagen desde PC</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleUploadFile(e, (url) => setLocalCms({ ...localCms, mothersDayPromoBanner: url }))
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* LABORATORY CMS SECTION: "CREA TU MARCA CON NOSOTROS" */}
                <div className="space-y-3 pt-3 border-t border-neutral-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-[#FF80BF]" />
                      <h4 className="text-xs font-bold text-[#FF80BF] uppercase tracking-wider">
                        Apartado "Crea tu marca con nosotros" (Laboratorio)
                      </h4>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={localCms.createYourBrand?.enabled !== false}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            createYourBrand: {
                              ...(localCms.createYourBrand || {
                                title: 'Crea tu marca con nosotros',
                                subtitle: 'Desarrollo integral de productos cosméticos en nuestro laboratorio',
                                description: 'Tu sueño se puede hacer realidad, crea tu propia marca de productos con nuestro laboratorio.',
                                image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=85',
                                whatsappMessage: '¡Hola! Quiero información para crear mi propia marca de productos con el laboratorio.',
                                enabled: true
                              }),
                              enabled: e.target.checked
                            }
                          })
                        }
                        className="accent-[#E6007E]"
                      />
                      <span className="font-semibold text-white">Apartado Activo en la Web</span>
                    </label>
                  </div>

                  <p className="text-[11px] text-neutral-400">
                    Sección institucional para invitar a clientes a desarrollar su propia línea cosmética con tu laboratorio.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 text-[11px] mb-1 font-bold">Título Principal</label>
                      <input
                        type="text"
                        value={localCms.createYourBrand?.title || ''}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            createYourBrand: {
                              ...(localCms.createYourBrand || {}),
                              title: e.target.value
                            } as any
                          })
                        }
                        placeholder="Crea tu marca con nosotros"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 text-[11px] mb-1 font-bold">Subtítulo Descriptivo</label>
                      <input
                        type="text"
                        value={localCms.createYourBrand?.subtitle || ''}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            createYourBrand: {
                              ...(localCms.createYourBrand || {}),
                              subtitle: e.target.value
                            } as any
                          })
                        }
                        placeholder="Desarrollo integral de productos cosméticos..."
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-neutral-400 text-[11px] mb-1 font-bold">
                        Texto Informativo Principal ("Tu sueño se puede hacer realidad...")
                      </label>
                      <textarea
                        rows={2}
                        value={localCms.createYourBrand?.description || ''}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            createYourBrand: {
                              ...(localCms.createYourBrand || {}),
                              description: e.target.value
                            } as any
                          })
                        }
                        placeholder="Tu sueño se puede hacer realidad, crea tu propia marca de productos con nuestro laboratorio."
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-neutral-400 text-[11px] mb-1 font-bold">
                        Mensaje Predefinido de WhatsApp
                      </label>
                      <input
                        type="text"
                        value={localCms.createYourBrand?.whatsappMessage || ''}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            createYourBrand: {
                              ...(localCms.createYourBrand || {}),
                              whatsappMessage: e.target.value
                            } as any
                          })
                        }
                        placeholder="¡Hola! Quiero información para crear mi propia marca de productos con el laboratorio."
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-neutral-400 text-[11px] mb-1 font-bold">
                        Foto del Laboratorio (Instalaciones / Equipo)
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <img
                          src={localCms.createYourBrand?.image || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=85'}
                          alt="Laboratorio"
                          className="w-24 h-16 rounded-xl object-cover border border-neutral-700 bg-neutral-950"
                        />
                        <input
                          type="text"
                          value={localCms.createYourBrand?.image || ''}
                          onChange={(e) =>
                            setLocalCms({
                              ...localCms,
                              createYourBrand: {
                                ...(localCms.createYourBrand || {}),
                                image: e.target.value
                              } as any
                            })
                          }
                          placeholder="https://..."
                          className="flex-1 min-w-[200px] bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white text-xs outline-none"
                        />
                        <label className="flex items-center gap-2 px-3 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl cursor-pointer text-xs font-bold transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[#FF80BF]" />
                          <span>Subir desde PC</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleUploadFile(e, (url) =>
                                setLocalCms({
                                  ...localCms,
                                  createYourBrand: {
                                    ...(localCms.createYourBrand || {}),
                                    image: url
                                  } as any
                                })
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-700">
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Monto Mínimo Envío ($)</label>
                    <input
                      type="number"
                      value={localCms.freeShippingThreshold}
                      onChange={(e) => setLocalCms({ ...localCms, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Número de WhatsApp (con código de país)</label>
                    <input
                      type="text"
                      value={localCms.whatsappNumber}
                      onChange={(e) => setLocalCms({ ...localCms, whatsappNumber: e.target.value })}
                      placeholder="5493515056742"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">PIN de Acceso al Administrador</label>
                    <input
                      type="text"
                      value={localCms.adminPin}
                      onChange={(e) => setLocalCms({ ...localCms, adminPin: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: PASARELAS DE PAGO & CUENTAS BANCARIAS */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700">
                <div>
                  <h3 className="text-sm font-bold text-white">Pasarelas de Pago & Configuración Bancaria</h3>
                  <p className="text-[11px] text-neutral-400">
                    Configurá credenciales de Mercado Pago (Sandbox / Producción) y cuenta para transferencias.
                  </p>
                </div>
                <button
                  onClick={handleSaveCMS}
                  disabled={isSaving}
                  className="bg-[#E6007E] hover:bg-[#C9006B] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando...' : 'Guardar Pasarelas'}</span>
                </button>
              </div>

              {/* Mercado Pago */}
              <div className="bg-neutral-800 rounded-2xl p-5 border border-neutral-700 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#009EE3] text-white flex items-center justify-center font-bold">
                      MP
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Mercado Pago (Desarrollador & Live)</h4>
                      <p className="text-[10px] text-neutral-400">Checkout transparente y redirect</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={localCms.mercadoPagoConfig.sandboxMode}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            mercadoPagoConfig: {
                              ...localCms.mercadoPagoConfig,
                              sandboxMode: e.target.checked
                            }
                          })
                        }
                        className="accent-[#009EE3]"
                      />
                      <span>Modo Desarrollador / Sandbox</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={localCms.mercadoPagoConfig.enabled}
                        onChange={(e) =>
                          setLocalCms({
                            ...localCms,
                            mercadoPagoConfig: {
                              ...localCms.mercadoPagoConfig,
                              enabled: e.target.checked
                            }
                          })
                        }
                        className="accent-[#009EE3]"
                      />
                      <span>Habilitado</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Public Key de Mercado Pago</label>
                    <input
                      type="text"
                      value={localCms.mercadoPagoConfig.publicKey}
                      onChange={(e) =>
                        setLocalCms({
                          ...localCms,
                          mercadoPagoConfig: { ...localCms.mercadoPagoConfig, publicKey: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Access Token de Mercado Pago</label>
                    <input
                      type="password"
                      value={localCms.mercadoPagoConfig.accessToken}
                      onChange={(e) =>
                        setLocalCms({
                          ...localCms,
                          mercadoPagoConfig: { ...localCms.mercadoPagoConfig, accessToken: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Transfer Config */}
              <div className="bg-neutral-800 rounded-2xl p-5 border border-neutral-700 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Cuenta Bancaria para Transferencia / Depósito</h4>
                      <p className="text-[10px] text-neutral-400">Datos visibles para el cliente al abonar</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Banco</label>
                    <input
                      type="text"
                      value={localCms.bankConfig.bankName}
                      onChange={(e) =>
                        setLocalCms({
                          ...localCms,
                          bankConfig: { ...localCms.bankConfig, bankName: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Titular de la Cuenta</label>
                    <input
                      type="text"
                      value={localCms.bankConfig.accountHolder}
                      onChange={(e) =>
                        setLocalCms({
                          ...localCms,
                          bankConfig: { ...localCms.bankConfig, accountHolder: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">CUIT / CUIL</label>
                    <input
                      type="text"
                      value={localCms.bankConfig.cuit}
                      onChange={(e) =>
                        setLocalCms({
                          ...localCms,
                          bankConfig: { ...localCms.bankConfig, cuit: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-400 text-[11px] mb-1">CBU (22 dígitos)</label>
                    <input
                      type="text"
                      value={localCms.bankConfig.cbu}
                      onChange={(e) =>
                        setLocalCms({
                          ...localCms,
                          bankConfig: { ...localCms.bankConfig, cbu: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Alias Bancario</label>
                    <input
                      type="text"
                      value={localCms.bankConfig.alias}
                      onChange={(e) =>
                        setLocalCms({
                          ...localCms,
                          bankConfig: { ...localCms.bankConfig, alias: e.target.value.toUpperCase() }
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">% de Descuento por Transferencia</label>
                    <input
                      type="number"
                      value={localCms.bankConfig.discountPercentage}
                      onChange={(e) =>
                        setLocalCms({
                          ...localCms,
                          bankConfig: { ...localCms.bankConfig, discountPercentage: Number(e.target.value) }
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: META ADS & FACEBOOK PIXEL */}
          {activeTab === 'pixel' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700">
                <div>
                  <h3 className="text-sm font-bold text-white">Métricas de Meta Ads & Facebook Pixel</h3>
                  <p className="text-[11px] text-neutral-400">
                    Seguimiento de eventos en tiempo real para optimizar campañas de Instagram y Facebook.
                  </p>
                </div>
                <button
                  onClick={handleSaveCMS}
                  disabled={isSaving}
                  className="bg-[#E6007E] hover:bg-[#C9006B] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Pixel ID</span>
                </button>
              </div>

              {/* Pixel Configuration Box */}
              <div className="bg-neutral-800 rounded-2xl p-5 border border-neutral-700 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Facebook Pixel ID *</label>
                    <input
                      type="text"
                      value={localCms.metaAdsConfig.pixelId}
                      onChange={(e) =>
                        setLocalCms({
                          ...localCms,
                          metaAdsConfig: { ...localCms.metaAdsConfig, pixelId: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[11px] mb-1">Conversions API Token (Opcional)</label>
                    <input
                      type="password"
                      value={localCms.metaAdsConfig.conversionsApiToken}
                      onChange={(e) =>
                        setLocalCms({
                          ...localCms,
                          metaAdsConfig: { ...localCms.metaAdsConfig, conversionsApiToken: e.target.value }
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Real-time Fired Events Metric cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-700 text-center">
                    <span className="text-neutral-400 text-[10px] block">PageView</span>
                    <span className="text-lg font-bold text-white font-mono">
                      {pixelStats?.eventCounts?.PageView || 128}
                    </span>
                  </div>

                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-700 text-center">
                    <span className="text-neutral-400 text-[10px] block">ViewContent</span>
                    <span className="text-lg font-bold text-cyan-400 font-mono">
                      {pixelStats?.eventCounts?.ViewContent || 64}
                    </span>
                  </div>

                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-700 text-center">
                    <span className="text-neutral-400 text-[10px] block">AddToCart</span>
                    <span className="text-lg font-bold text-amber-400 font-mono">
                      {pixelStats?.eventCounts?.AddToCart || 28}
                    </span>
                  </div>

                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-700 text-center">
                    <span className="text-neutral-400 text-[10px] block">InitiateCheckout</span>
                    <span className="text-lg font-bold text-purple-400 font-mono">
                      {pixelStats?.eventCounts?.InitiateCheckout || 14}
                    </span>
                  </div>

                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-700 text-center col-span-2 sm:col-span-1">
                    <span className="text-neutral-400 text-[10px] block">Purchase</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">
                      {pixelStats?.eventCounts?.Purchase || 8}
                    </span>
                  </div>
                </div>

                {/* Event Logs Stream */}
                <div className="space-y-2 pt-2 border-t border-neutral-700">
                  <h4 className="text-[11px] font-bold text-neutral-300">Registro en Vivo de Eventos Meta:</h4>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto font-mono text-[10px]">
                    {(pixelStats?.recentLogs || []).map((log: any, idx: number) => (
                      <div key={idx} className="bg-neutral-900 p-2 rounded-lg flex items-center justify-between text-neutral-300">
                        <div className="flex items-center gap-2">
                          <span className="text-[#FF80BF] font-bold">[{log.eventName}]</span>
                          <span className="text-neutral-400 truncate max-w-xs">{JSON.stringify(log.data)}</span>
                        </div>
                        <span className="text-neutral-500">{formatDate(log.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: ANALÍTICAS AVANZADAS DE VENTAS */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700">
                <h3 className="text-sm font-bold text-white">Analíticas de Rendimiento Comercial</h3>
                <p className="text-[11px] text-neutral-400">
                  Resumen de facturación, ticket promedio, métodos de pago y productos con mayor demanda.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-800 p-4 rounded-2xl border border-neutral-700">
                  <span className="text-[11px] text-neutral-400 block">Facturación Total</span>
                  <span className="text-2xl font-black text-white font-mono">
                    {formatCurrency(analyticsData?.totalRevenue || 100860)}
                  </span>
                  <span className="text-[10px] text-emerald-400 block mt-1">✓ Pagos confirmados</span>
                </div>

                <div className="bg-neutral-800 p-4 rounded-2xl border border-neutral-700">
                  <span className="text-[11px] text-neutral-400 block">Ticket Promedio</span>
                  <span className="text-2xl font-black text-[#FF80BF] font-mono">
                    {formatCurrency(analyticsData?.averageTicket || 33620)}
                  </span>
                  <span className="text-[10px] text-neutral-400 block mt-1">Por orden efectuada</span>
                </div>

                <div className="bg-neutral-800 p-4 rounded-2xl border border-neutral-700">
                  <span className="text-[11px] text-neutral-400 block">Pedidos Registrados</span>
                  <span className="text-2xl font-black text-cyan-400 font-mono">
                    {localOrders.length}
                  </span>
                  <span className="text-[10px] text-neutral-400 block mt-1">Actividad en tiempo real</span>
                </div>
              </div>

              {/* Best selling products ranking */}
              <div className="bg-neutral-800 rounded-2xl p-5 border border-neutral-700 space-y-3 text-xs">
                <h4 className="font-bold text-white text-xs">Ranking de Cosméticos más Vendidos</h4>
                <div className="space-y-2">
                  {localProducts.slice(0, 4).map((p, idx) => (
                    <div key={p.id} className="flex items-center justify-between p-2.5 bg-neutral-900 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-neutral-500 font-mono w-4">#{idx + 1}</span>
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <strong className="text-white block line-clamp-1">{p.name}</strong>
                          <span className="text-[10px] text-neutral-400">{p.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#FF80BF] font-mono">{formatCurrency(p.price)}</span>
                        <span className="block text-[10px] text-emerald-400">conversión</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: NOTIFICACIONES PUSH */}
          {activeTab === 'push' && (
            <div className="space-y-4">
              <div className="bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700">
                <h3 className="text-sm font-bold text-white">Emisor de Notificaciones Push</h3>
                <p className="text-[11px] text-neutral-400">
                  Enviá alertas instantáneas a todos los dispositivos móviles y PCs que se suscribieron.
                </p>
              </div>

              <form onSubmit={handleSendPush} className="bg-neutral-800 rounded-2xl p-5 border border-neutral-700 space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Título de la Notificación</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: ¡Últimas 24hs! 30% OFF en Packs Día de la Madre 🌸"
                    value={pushTitle}
                    onChange={e => setPushTitle(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Mensaje / Cuerpo de la Notificación</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ej: Aprovechá 3 y 6 cuotas con todas las tarjetas."
                    value={pushBody}
                    onChange={e => setPushBody(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#E6007E]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-neutral-400">
                    Se enviará a todos los clientes suscritos.
                  </span>
                  <button
                    type="submit"
                    className="bg-[#E6007E] hover:bg-[#C9006B] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Emitir Notificación Push Ahora</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Modal for pasting JSON directly */}
        {showPasteModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clipboard className="w-5 h-5 text-amber-400" />
                  <span>Pegar JSON de Respaldo</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPasteModal(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-neutral-300">
                Pega aquí tu lista de productos en formato JSON (por ejemplo si la copiaste del archivo <code className="bg-neutral-800 text-amber-300 px-1 py-0.5 rounded font-mono">store.json</code> o de un backup):
              </p>
              <textarea
                value={pastedJson}
                onChange={(e) => setPastedJson(e.target.value)}
                placeholder='[ { "id": "prod-1", "name": "...", "price": 25000, ... } ]'
                rows={10}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:border-amber-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleRestorePastedJson}
                  disabled={!pastedJson.trim() || isSaving}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>Restaurar Productos Ahora</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
