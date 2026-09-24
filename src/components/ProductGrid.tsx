import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Layers } from 'lucide-react';
import { Product, ProductBrand, OFFICIAL_CATEGORIES } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
  searchQuery: string;
  selectedBrand?: string;
  onSelectBrand?: (brand: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onOpenDetail,
  searchQuery,
  selectedBrand: controlledBrand,
  onSelectBrand: controlledSetBrand
}) => {
  const [internalBrand, setInternalBrand] = useState<string>('Todas');
  const selectedBrand = controlledBrand !== undefined ? controlledBrand : internalBrand;
  const setSelectedBrand = (brand: string) => {
    if (controlledSetBrand) {
      controlledSetBrand(brand);
    } else {
      setInternalBrand(brand);
    }
  };

  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  // Reset category filter when switching brand
  useEffect(() => {
    setActiveCategory('Todos');
  }, [selectedBrand]);

  const brands: { id: string; label: string; tag?: string }[] = [
    { id: 'Todas', label: 'Todas las Marcas' },
    { id: 'H2Derm', label: 'H2Derm', tag: 'Principal' },
    { id: 'SoftCare', label: 'SoftCare', tag: 'Premium' },
    { id: 'Mimitos', label: 'Mimitos', tag: 'Niños' },
    { id: 'Le Salon', label: 'Le Salón', tag: 'Barberías' }
  ];

  const normalizeText = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // Full set of categories requested:
  // 'Cremas' | 'Serums' | 'Ojos' | 'Limpieza' | 'Packs' | 'Capilar' | 'Corporal' | 'Aceites' | 'Gel' | 'Bebés/Kids'
  // plus any custom ones from products
  const extraCategories = Array.from(
    new Set(
      products
        .map(p => p.category?.trim())
        .filter((cat): cat is string => Boolean(cat && !OFFICIAL_CATEGORIES.some(oc => oc.toLowerCase() === cat.toLowerCase())))
    )
  );

  const categories = [
    'Todos',
    ...(products.some(p => p.motherDaySpecial) ? ['Especial Mamá'] : []),
    ...OFFICIAL_CATEGORIES,
    ...extraCategories
  ];

  const filteredProducts = [...products]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .filter(product => {
    // Brand match (ISAMER LAB is the laboratory/store, not a product brand)
    const prodBrand = product.brand || 'H2Derm';
    const matchBrand =
      selectedBrand === 'Todas' ||
      normalizeText(prodBrand) === normalizeText(selectedBrand) ||
      (normalizeText(selectedBrand).includes('salon') && normalizeText(prodBrand).includes('salon')) ||
      (normalizeText(selectedBrand).includes('soft') && normalizeText(prodBrand).includes('soft')) ||
      (normalizeText(selectedBrand).includes('mimito') && normalizeText(prodBrand).includes('mimit'));

    // Category match
    const matchCategory =
      activeCategory === 'Todos' ||
      (activeCategory === 'Especial Mamá' && product.motherDaySpecial) ||
      (product.category && product.category.toLowerCase().trim() === activeCategory.toLowerCase().trim());

    // Search query match
    const matchSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchBrand && matchCategory && matchSearch;
  });

  return (
    <section id="productos" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-pink-100 text-[#E6007E] text-xs uppercase font-extrabold tracking-widest px-3.5 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Laboratorio Oficial • Catálogo Multimarca</span>
        </div>
        <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Nuestras Líneas y Productos
        </h2>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Explorá las fórmulas desarrolladas con estándares farmacéuticos de alta eficacia: 
          <strong> H2Derm</strong>, <strong>SoftCare</strong>, <strong>Mimitos</strong> y <strong>Le Salon</strong>.
        </p>
      </div>

      {/* Brand Selection Tabs: Natural wrapping on all screens so nothing gets cut off */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pb-2 mb-4 px-2 max-w-4xl mx-auto">
        {brands.map((b) => {
          const isActive = selectedBrand === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.id)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs select-none active:scale-95 ${
                isActive
                  ? 'bg-[#221F20] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{b.label}</span>
              {b.tag && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-[#E6007E] text-white' : 'bg-cyan-100 text-cyan-800'
                }`}>
                  {b.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category Pills Filter: Wrapped grid/flex so ALL categories are 100% visible in desktop, tablet and mobile */}
      <div className="w-full mb-8">
        <div 
          id="categories-container"
          className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-2 max-w-5xl mx-auto"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count = products.filter(p => {
              const prodBrand = p.brand || 'H2Derm';
              const matchBrand =
                selectedBrand === 'Todas' ||
                normalizeText(prodBrand) === normalizeText(selectedBrand) ||
                (normalizeText(selectedBrand).includes('salon') && normalizeText(prodBrand).includes('salon')) ||
                (normalizeText(selectedBrand).includes('soft') && normalizeText(prodBrand).includes('soft')) ||
                (normalizeText(selectedBrand).includes('mimito') && normalizeText(prodBrand).includes('mimit'));
              
              if (!matchBrand) return false;
              if (cat === 'Todos') return true;
              if (cat === 'Especial Mamá') return Boolean(p.motherDaySpecial);
              return p.category?.toLowerCase().trim() === cat.toLowerCase().trim();
            }).length;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs select-none active:scale-95 ${
                  isActive
                    ? 'bg-[#E6007E] text-white shadow-md shadow-pink-500/25 ring-2 ring-[#E6007E]/30 font-bold'
                    : 'bg-white text-gray-700 hover:bg-pink-50 hover:text-[#E6007E] border border-gray-200'
                }`}
              >
                {cat === 'Especial Mamá' && <Heart className="w-3 h-3 inline fill-current text-pink-300" />}
                <span>{cat}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid: Responsive 3 cols on large, 2 cols on tablet, 1-2 on mobile */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-pink-50/50 rounded-3xl border border-dashed border-pink-200 max-w-md mx-auto p-6">
          <p className="text-gray-800 font-bold text-base mb-1">
            {activeCategory !== 'Todos'
              ? `No hay productos aún en la categoría "${activeCategory}" para ${selectedBrand}.`
              : `No se encontraron productos con ese criterio en ${selectedBrand}.`}
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Podés agregar cosméticos a esta categoría desde el Panel de Administración o ver el catálogo completo.
          </p>
          <button
            onClick={() => {
              setSelectedBrand('Todas');
              setActiveCategory('Todos');
            }}
            className="px-4 py-2 bg-[#E6007E] hover:bg-[#C9006B] text-white rounded-full text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Limpiar filtros y ver todos los productos
          </button>
        </div>
      )}
    </section>
  );
};
