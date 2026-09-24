import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Shield, Bell, Sparkles, HeartHandshake, PackageCheck, MessageCircle, Baby, Scissors } from 'lucide-react';
import { StoreCMS } from '../types';

interface HeaderProps {
  cms: StoreCMS;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenAdminAuth: () => void;
  onOpenPushModal: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onSelectBrand?: (brand: string) => void;
  activeBrand?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cms,
  cartCount,
  onOpenCart,
  onOpenTracking,
  onOpenAdminAuth,
  onOpenPushModal,
  onSearchChange,
  searchQuery,
  onSelectBrand,
  activeBrand = 'Todas'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleBrandClick = (brand: string) => {
    if (onSelectBrand) {
      onSelectBrand(brand);
    }
    const el = document.getElementById('productos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#F0E6E9] shadow-xs">
      {/* Top Announcement Bar */}
      {cms.announcementActive && (
        <div id="top-announcement-bar" className="w-full bg-linear-to-r from-[#E6007E] via-[#C9006B] to-[#7B0044] text-white py-2 px-3 text-xs sm:text-sm font-medium tracking-wide flex items-center justify-between text-center overflow-hidden">
          <div className="mx-auto flex items-center gap-2 justify-center max-w-5xl">
            <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse text-amber-200" />
            <span className="truncate">{cms.announcementBar}</span>
          </div>
          <button
            onClick={onOpenPushModal}
            title="Activar notificaciones de ofertas"
            className="hidden sm:flex items-center gap-1 text-[11px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full transition-colors shrink-0"
          >
            <Bell className="w-3 h-3" />
            <span>Alertas</span>
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-[#221F20] hover:text-[#E6007E] rounded-md focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo / Brand Name */}
          <div className="flex flex-col items-start sm:items-center min-w-0">
            <a href="#" className="flex flex-col group items-start sm:items-center">
              <span className="font-['Playfair_Display'] text-xl sm:text-3xl font-extrabold tracking-tight text-[#1C1917] group-hover:text-[#E6007E] transition-colors leading-none truncate">
                {cms.storeName || 'ISAMER'}
              </span>
              <span className="text-[10px] sm:text-[12px] uppercase tracking-[0.3em] text-[#9E8B92] font-bold mt-1">
                {cms.storeTagline || 'LAB'}
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-sm font-semibold text-[#3C3836]">
            <button
              onClick={() => handleBrandClick('Todas')}
              className={`hover:text-[#E6007E] transition-colors relative py-1 cursor-pointer ${
                activeBrand === 'Todas' ? 'text-[#E6007E] font-bold' : ''
              }`}
            >
              Línea Rostro 
            </button>

            {/* SoftCare -> Redirige a SoftCare (con tag Premium) */}
            <button
              id="nav-softcare-btn"
              onClick={() => handleBrandClick('SoftCare')}
              className={`hover:text-[#E6007E] transition-all flex items-center gap-1.5 py-1 px-2.5 rounded-full cursor-pointer ${
                activeBrand === 'SoftCare'
                  ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200 shadow-xs'
                  : 'text-[#3C3836] hover:bg-purple-50/70'
              }`}
              title="Línea SoftCare - Dermo-cuidado Premium"
            >
              <span>SoftCare</span>

            </button>

            {/* Cuidado Niños -> Redirige a Mimitos */}
            <button
              id="nav-cuidado-ninos-btn"
              onClick={() => handleBrandClick('Mimitos')}
              className={`hover:text-[#E6007E] transition-all flex items-center gap-1.5 py-1 px-2.5 rounded-full cursor-pointer ${
                activeBrand === 'Mimitos'
                  ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200 shadow-xs'
                  : 'text-[#3C3836] hover:bg-sky-50/70'
              }`}
              title="Cuidado Niños y Bebés - Redirige a marca Mimitos"
            >
              <Baby className="w-4 h-4 text-sky-500" />
              <span>Cuidado Niños</span>
            </button>

            {/* Barberías -> Redirige a Le Salón */}
            <button
              id="nav-barberias-btn"
              onClick={() => handleBrandClick('Le Salon')}
              className={`hover:text-[#E6007E] transition-all flex items-center gap-1.5 py-1 px-2.5 rounded-full cursor-pointer ${
                activeBrand === 'Le Salon'
                  ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200 shadow-xs'
                  : 'text-[#3C3836] hover:bg-amber-50/70'
              }`}
              title="Barberías y Salón - Redirige a marca Le Salón"
            >
              <Scissors className="w-4 h-4 text-amber-600" />
              <span>Barberías</span>
            </button>

            <a
              href="#especial-madre"
              className="hover:text-[#E6007E] transition-colors flex items-center gap-1.5 text-[#E6007E] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E6007E]" />
              Especial Mamá
            </a>
            <button
              onClick={onOpenTracking}
              className="hover:text-[#E6007E] transition-colors flex items-center gap-1.5 cursor-pointer text-[#5C5355]"
            >
              <PackageCheck className="w-4 h-4 text-[#E6007E]" />
              Seguimiento de Pedido
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Toggle */}
            <div className="relative">
              {/* Desktop search bar */}
              <div className="hidden sm:block">
                {showSearchBar ? (
                  <div className="flex items-center bg-[#F7F3F4] rounded-full px-3 py-1.5 border border-[#E9D9DF] w-48 sm:w-60">
                    <Search className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="Buscar cremas, aceites..."
                      className="w-full bg-transparent text-xs text-gray-800 focus:outline-none"
                      autoFocus
                    />
                    <button onClick={() => setShowSearchBar(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    id="search-icon-btn"
                    onClick={() => setShowSearchBar(true)}
                    className="p-2 text-gray-700 hover:text-[#E6007E] rounded-full hover:bg-pink-50 transition-colors"
                    aria-label="Buscar productos"
                    title="Buscar en la tienda"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Mobile search toggle button */}
              <button
                id="search-icon-btn-mobile"
                onClick={() => setShowSearchBar(!showSearchBar)}
                className="sm:hidden p-2 text-gray-700 hover:text-[#E6007E] rounded-full hover:bg-pink-50 transition-colors"
                aria-label="Buscar productos"
                title="Buscar en la tienda"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Quick WhatsApp contact */}
            <a
              href={`https://wa.me/${cms.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('¡Hola! Quisiera consultar sobre la línea de rostro para el Día de la Madre.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex p-2 text-emerald-600 hover:text-emerald-700 rounded-full hover:bg-emerald-50 transition-colors"
              title="Atención WhatsApp inmediata"
              aria-label="Contactar por WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            {/* Tracking mobile quick trigger */}
            <button
              onClick={onOpenTracking}
              className="lg:hidden p-2 text-gray-700 hover:text-[#E6007E] rounded-full hover:bg-pink-50 transition-colors"
              title="Seguimiento de pedidos"
              aria-label="Seguimiento de pedidos"
            >
              <PackageCheck className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2.5 bg-[#221F20] text-white hover:bg-[#E6007E] rounded-full transition-all shadow-sm flex items-center justify-center"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E6007E] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Discreet Admin Lock Button */}
            <button
              id="admin-entry-lock-btn"
              onClick={onOpenAdminAuth}
              className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title="Panel de Administración (Acceso restringido)"
              aria-label="Panel de Administración"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Bar (when toggled on mobile) */}
      {showSearchBar && (
        <div className="sm:hidden px-4 py-2.5 bg-white border-t border-[#F0E6E9] flex items-center gap-2">
          <div className="flex-1 flex items-center bg-[#F7F3F4] rounded-full px-3 py-1.5 border border-[#E9D9DF]">
            <Search className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar cremas, aceites, serums..."
              className="w-full bg-transparent text-xs text-gray-800 focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')} className="text-gray-400 hover:text-gray-600 mr-1">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowSearchBar(false)}
            className="text-xs font-bold text-[#E6007E] px-2 py-1"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#F0E6E9] px-5 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3 font-medium text-gray-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleBrandClick('Todas');
              }}
              className="w-full text-left text-base hover:text-[#E6007E] py-2 border-b border-gray-100 flex items-center justify-between cursor-pointer"
            >
              <span>Colección Rostro (Todas)</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Exclusivo</span>
            </button>

            {/* SoftCare -> SoftCare (Línea Premium) */}
            <button
              id="mobile-nav-softcare-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                handleBrandClick('SoftCare');
              }}
              className="w-full text-left text-base hover:text-[#E6007E] py-2 border-b border-gray-100 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 shrink-0 font-bold text-xs">
                  SC
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 leading-tight">SoftCare</span>
                  <span className="text-xs text-gray-500">Dermo-cuidado corporal y facial</span>
                </div>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded-full border border-purple-200">
                Premium
              </span>
            </button>

            {/* Cuidado Niños -> Mimitos */}
            <button
              id="mobile-nav-cuidado-ninos-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                handleBrandClick('Mimitos');
              }}
              className="w-full text-left text-base hover:text-[#E6007E] py-2 border-b border-gray-100 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                  <Baby className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 leading-tight">Cuidado Niños</span>
                  <span className="text-xs text-gray-500">Línea pediátrica y suave</span>
                </div>
              </div>
              <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                Marca Mimitos
              </span>
            </button>

            {/* Barberías -> Le Salón */}
            <button
              id="mobile-nav-barberias-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                handleBrandClick('Le Salon');
              }}
              className="w-full text-left text-base hover:text-[#E6007E] py-2 border-b border-gray-100 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <Scissors className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 leading-tight">Barberías</span>
                  <span className="text-xs text-gray-500">Peluquería & cuidado capilar</span>
                </div>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                Marca Le Salón
              </span>
            </button>
            <a
              href="#especial-madre"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-[#E6007E] font-semibold py-2 border-b border-gray-100 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Especial Día de la Madre 2025</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracking();
              }}
              className="text-left text-base hover:text-[#E6007E] py-2 border-b border-gray-100 flex items-center gap-2"
            >
              <PackageCheck className="w-4 h-4 text-[#E6007E]" />
              <span>Seguimiento de mi Pedido</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPushModal();
              }}
              className="text-left text-base hover:text-[#E6007E] py-2 border-b border-gray-100 flex items-center gap-2 text-gray-600"
            >
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Activar Notificaciones Push</span>
            </button>
            <a
              href={`https://wa.me/${cms.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hola! Quisiera asesoramiento sobre los productos de rostro.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-left text-base text-emerald-600 font-semibold py-2 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Asesoría por WhatsApp</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminAuth();
              }}
              className="text-xs text-gray-400 text-left pt-2 flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Acceso Administrador</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
