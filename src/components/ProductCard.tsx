import React, { useState } from 'react';
import { ShoppingBag, Star, Eye, Check, Sparkles } from 'lucide-react';
import { Product, ProductShade } from '../types';
import { formatCurrency, calculateInstallments } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedShade?: string) => void;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onOpenDetail }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const displayImage =
    isHovered && product.secondaryImages && product.secondaryImages.length > 0
      ? product.secondaryImages[0]
      : product.image;

  const installments = calculateInstallments(product.price, 3);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-2xl border border-[#F0E6E9] hover:border-[#E6007E]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Box */}
      <div
        onClick={() => onOpenDetail(product)}
        className="relative aspect-square w-full overflow-hidden bg-[#FAF5F7] cursor-pointer"
      >
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 items-start">
          {product.brand && (
            <div className="flex items-center gap-1 flex-wrap">
              <span className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs ${
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
                <span className="bg-amber-400 text-neutral-950 font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-0.5 border border-amber-300">
                  ★ Premium
                </span>
              )}
            </div>
          )}
          {product.motherDaySpecial && (
            <span className="bg-[#E6007E] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Especial Mamá
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="bg-[#221F20] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shadow-xs">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Quick view button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(product);
          }}
          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="Vista rápida del producto"
          aria-label="Ver detalles"
        >
          <Eye className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Content Box */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#9E8B92] font-semibold uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetail(product)}
            className="font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 cursor-pointer hover:text-[#E6007E] transition-colors"
          >
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-gray-500 line-clamp-2">
            {product.tagline}
          </p>
        </div>

        {/* Price & Cart Button Area */}
        <div className="pt-4 border-t border-gray-100 mt-4 space-y-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-black text-gray-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-600 font-medium mt-0.5">
              Hasta 3 cuotas fijas de <strong className="text-gray-900 font-bold">{formatCurrency(installments.perInstallment)}</strong>
            </p>
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAdd}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-[#221F20] hover:bg-[#E6007E] text-white hover:shadow-pink-500/20 active:scale-98'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Agregado al carrito!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Agregar al Carrito</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};