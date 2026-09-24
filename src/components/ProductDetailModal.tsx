import React, { useState } from 'react';
import { X, Star, Check, Sparkles, Shield, Truck, Heart, ArrowRight } from 'lucide-react';
import { Product, ProductShade } from '../types';
import { formatCurrency, calculateInstallments } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedShade?: string, quantity?: number) => void;
  onInstantBuy: (product: Product, selectedShade?: string, quantity?: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onInstantBuy
}) => {
  const [activeImage, setActiveImage] = useState<string>(product?.image || '');
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Sync active image when product changes
  React.useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setIsVideoActive(false);
    }
  }, [product]);

  if (!product) return null;

  const images = [product.image, ...(product.secondaryImages || [])].filter(Boolean);
  const installments = calculateInstallments(product.price, 3);

  const handleAdd = () => {
    onAddToCart(product, undefined, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    onInstantBuy(product, undefined, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#F0E6E9] my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-gray-500 hover:text-gray-900 bg-white/80 hover:bg-white rounded-full shadow-xs transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Visual Gallery Column */}
          <div className="md:col-span-6 bg-[#FAF5F7] p-6 flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-xs">
              {isVideoActive && product.video ? (
                <video
                  src={product.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Brand and Tag Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 items-start">
                {product.brand && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-xs font-black px-3 py-1 rounded-full shadow-xs ${
                      product.brand === 'H2Derm'
                        ? 'bg-cyan-700 text-white'
                        : product.brand === 'Mimitos'
                        ? 'bg-amber-500 text-white'
                        : product.brand === 'Le Salon'
                        ? 'bg-purple-700 text-white'
                        : product.brand === 'SoftCare'
                        ? 'bg-rose-600 text-white'
                        : 'bg-neutral-800 text-white'
                    }`}>
                      {product.brand}
                    </span>
                    {(product.brand === 'SoftCare' || product.badges?.some(b => b.toLowerCase().includes('premium'))) && (
                      <span className="bg-amber-400 text-neutral-950 font-black text-[10px] px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-0.5 border border-amber-300">
                        ★ Línea Premium
                      </span>
                    )}
                  </div>
                )}
                {product.motherDaySpecial && (
                  <div className="bg-[#E6007E] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Especial Mamá
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails + Video Toggle */}
            <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1 items-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImage(img);
                    setIsVideoActive(false);
                  }}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    !isVideoActive && activeImage === img ? 'border-[#E6007E] scale-95 ring-2 ring-pink-300' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={`Foto ${idx + 1}`}
                >
                  <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}

              {product.video && (
                <button
                  onClick={() => setIsVideoActive(true)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 flex flex-col items-center justify-center bg-neutral-900 text-white text-[10px] font-bold ${
                    isVideoActive ? 'border-[#E6007E] ring-2 ring-pink-300' : 'border-neutral-700 opacity-80 hover:opacity-100'
                  }`}
                  title="Ver Reel / Video"
                >
                  <span>▶ Reel</span>
                  <span className="text-[9px] text-[#FF80BF]">Video</span>
                </button>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              
              {/* Brand & Category & Code */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="uppercase font-bold tracking-wider text-[#E6007E]">
                  {product.brand ? `${product.brand} • ` : ''}{product.category}
                </span>
                <span>SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-800">{product.rating}</span>
                <span className="text-xs text-gray-500">({product.reviewsCount} opiniones verificadas)</span>
              </div>

              {/* Price block */}
              <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-100/80">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <span className="bg-[#E6007E] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-700 font-semibold mt-1">
                  ✓ 3 cuotas fijas de {formatCurrency(installments.perInstallment)} con tarjeta o Mercado Pago
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  10% de descuento abonando por Transferencia Bancaria
                </p>
              </div>

              {/* Tagline / Subtitle */}
              {product.tagline && (
                <p className="text-sm font-medium text-gray-700">
                  {product.tagline}
                </p>
              )}

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Benefits list */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Beneficios Clave:</h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {product.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#E6007E] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* How to use */}
              {product.howToUse && (
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-xs text-neutral-600">
                  <span className="font-bold text-neutral-800 block mb-0.5">Modo de aplicación:</span>
                  {product.howToUse}
                </div>
              )}

            </div>

            {/* Quantity and Actions */}
            <div className="pt-6 border-t border-gray-100 mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAdd}
                  className="flex-1 py-3 px-4 bg-white border-2 border-[#221F20] text-[#221F20] hover:bg-gray-50 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {addedNotice ? <Check className="w-4 h-4 text-emerald-600" /> : null}
                  <span>{addedNotice ? '¡Añadido!' : 'Añadir al Carrito'}</span>
                </button>
              </div>

              <button
                id="modal-buy-now-btn"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-4 bg-[#E6007E] hover:bg-[#C9006B] text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Comprar Ahora con Mercado Pago</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  Compra 100% Segura
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-pink-600" />
                  Envío Express a domicilio
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};