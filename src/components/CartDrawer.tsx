import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatters';

export interface CartItem {
  product: Product;
  selectedShade?: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, shade: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, shade?: string) => void;
  onProceedToCheckout: () => void;
  freeShippingThreshold: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  freeShippingThreshold
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E6007E]" />
              <h2 className="text-lg font-bold text-gray-900 font-['Playfair_Display']">
                Tu Carrito de Compras
              </h2>
              <span className="text-xs bg-pink-100 text-[#E6007E] font-bold px-2 py-0.5 rounded-full">
                {cartItems.reduce((total, i) => total + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-pink-50/70 p-3.5 border-b border-pink-100/60">
            <div className="flex items-center justify-between text-xs text-gray-700 font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#E6007E]" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-bold">¡Felicidades! Tenés Envío GRATIS</span>
                ) : (
                  <span>
                    Te faltan <strong className="text-[#E6007E]">{formatCurrency(amountNeededForFreeShipping)}</strong> para Envío Gratis
                  </span>
                )}
              </span>
              <span className="font-bold text-gray-800">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-pink-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#E6007E] h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-[#E6007E]">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-800">El carrito está vacío</h3>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Descubrí nuestros 6 productos destacados para el rostro inspirados en la línea Luméa profesional.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-2 bg-[#221F20] hover:bg-[#E6007E] text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors"
                >
                  Explorar Productos
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedShade || 'default'}-${index}`}
                  className="flex gap-3.5 p-3 rounded-2xl bg-neutral-50/80 border border-neutral-100"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-white shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedShade)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.selectedShade && (
                        <p className="text-[11px] text-[#E6007E] font-medium">
                          Tono: {item.selectedShade}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedShade, -1)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedShade, 1)}
                          className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Area */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-white space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Envío</span>
                  <span className={amountNeededForFreeShipping === 0 ? 'text-emerald-600 font-bold' : 'text-gray-800'}>
                    {amountNeededForFreeShipping === 0 ? 'GRATIS' : 'Calculado en el checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total Estimado</span>
                  <span className="text-[#E6007E] text-lg">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Abonando por transferencia tenés un 10% de descuento directo.</span>
              </div>

              <button
                id="cart-proceed-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#E6007E] hover:bg-[#C9006B] text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-pink-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Iniciar Compra Segura</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-800 font-medium"
              >
                Seguir mirando productos
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};