import React, { useState, useEffect } from 'react';
import { X, Search, Package, CheckCircle2, Clock, Truck, Home, AlertCircle, Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  whatsappNumber: string;
}

const STATUS_STEPS: OrderStatus[] = [
  'Pendiente',
  'Pagado',
  'En preparación',
  'En camino',
  'Entregado'
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialCode,
  whatsappNumber
}) => {
  const [query, setQuery] = useState(initialCode || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  useEffect(() => {
    if (initialCode && isOpen) {
      handleSearch(initialCode);
    }
  }, [initialCode, isOpen]);

  const handleSearch = async (codeToSearch?: string) => {
    const searchTerm = (codeToSearch || query).trim();
    if (!searchTerm) return;
    setLoading(true);
    setError(null);
    try {
      const foundOrder = await api.trackOrder(searchTerm);
      setOrder(foundOrder);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || 'No se encontró ningún pedido con ese código o dato.');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelado') return -1;
    return STATUS_STEPS.indexOf(status);
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  const copyTrackingCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-pink-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E6007E] text-white flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                Seguimiento de Pedido en Tiempo Real
              </h3>
              <p className="text-[11px] text-gray-500">
                Consultá el estado de tu compra con tu código o email
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input bar */}
        <div className="p-6 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ingresá tu Nº de pedido (ej: LUM-8492) o tu Email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#221F20] hover:bg-[#E6007E] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {/* Quick example tags if empty */}
          {!order && !loading && !error && (
            <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100/60 text-xs text-gray-600 space-y-2">
              <span className="font-bold text-gray-800 block">¿No sabés qué número ingresar?</span>
              <p>Revisá el email de confirmación que recibiste al completar la compra:</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['LUM-8492', 'LUM-8493', 'LUM-8494'].map(sample => (
                  <button
                    key={sample}
                    onClick={() => {
                      setQuery(sample);
                      handleSearch(sample);
                    }}
                    className="bg-white hover:bg-pink-100 border border-pink-200 text-[#E6007E] font-mono font-bold px-2.5 py-1 rounded-lg transition-colors text-xs"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error notice */}
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Order Found Details */}
          {order && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Order Info Card */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">PEDIDO</span>
                  <span className="font-mono font-black text-[#E6007E] text-base">{order.orderNumber}</span>
                  <span className="text-gray-500 block text-[11px]">Fecha: {formatDate(order.createdAt)}</span>
                </div>

                <div className="text-right">
                  <span className="text-gray-400 block text-[10px]">DESTINATARIA</span>
                  <span className="font-bold text-gray-900">{order.customerName}</span>
                  <span className="text-gray-500 block text-[11px]">{order.shippingAddress.city}, {order.shippingAddress.province}</span>
                </div>
              </div>

              {/* Real-time visual progress step bar */}
              <div className="py-2">
                <div className="text-xs font-bold text-gray-800 mb-4 flex items-center justify-between">
                  <span>ESTADO EN TIEMPO REAL:</span>
                  <span className="bg-[#E6007E] text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {order.status}
                  </span>
                </div>

                {order.status === 'Cancelado' ? (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium text-center">
                    Este pedido ha sido cancelado o reembolsado.
                  </div>
                ) : (
                  <div className="relative">
                    <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                    
                    <div className="grid grid-cols-5 gap-1 relative z-10 text-center">
                      {STATUS_STEPS.map((stepName, sIdx) => {
                        const isDone = sIdx <= currentStepIdx;
                        const isCurrent = sIdx === currentStepIdx;

                        return (
                          <div key={stepName} className="flex flex-col items-center">
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-[#E6007E] text-white ring-2 ring-pink-200'
                                  : 'bg-gray-200 text-gray-400'
                              } ${isCurrent ? 'scale-110 shadow-md animate-pulse' : ''}`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : sIdx + 1}
                            </div>
                            <span
                              className={`text-[9px] sm:text-[11px] mt-1.5 leading-tight ${
                                isCurrent
                                  ? 'font-bold text-[#E6007E]'
                                  : isDone
                                  ? 'font-semibold text-gray-800'
                                  : 'text-gray-400'
                              }`}
                            >
                              {stepName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Tracking courier code if shipped */}
              {order.trackingCode && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-emerald-800 font-bold block flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-700" />
                        Despachado con {order.carrierName || 'Correo Argentino'}
                      </span>
                      <span className="font-mono text-gray-700 text-[11px] block mt-0.5">
                        Código de guía: <strong className="text-gray-900 text-xs">{order.trackingCode}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyTrackingCode(order.trackingCode!)}
                        className="px-3 py-1.5 bg-white hover:bg-emerald-100 rounded-lg text-emerald-800 font-semibold border border-emerald-300 flex items-center gap-1 transition-colors text-[11px]"
                      >
                        {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTracking ? '¡Copiado!' : 'Copiar código'}</span>
                      </button>

                      <a
                        href={
                          order.carrierName?.toLowerCase().includes('oca')
                            ? `https://www.oca.com.ar/`
                            : `https://www.correoargentino.com.ar/formularios/e-commerce`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors text-[11px] shadow-xs"
                      >
                        <span>Portal de {order.carrierName?.toLowerCase().includes('oca') ? 'OCA' : 'Correo Arg.'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-700/90 pt-1 border-t border-emerald-200/60">
                    💡 Podés pegar este código de guía directamente en el portal oficial de envíos para ver el trayecto y la sucursal de distribución asignada.
                  </p>
                </div>
              )}

              {/* Items summary */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-gray-800 block">Productos en el paquete:</span>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover bg-gray-50" />
                        <div>
                          <span className="font-bold text-gray-900 block line-clamp-1">{item.productName}</span>
                          {item.shade && <span className="text-gray-500 text-[11px]">Tono: {item.shade}</span>}
                        </div>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Support button */}
              <div className="pt-2 flex justify-end">
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `¡Hola! Quisiera consultar sobre el envío de mi pedido #${order.orderNumber}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar con atención al cliente</span>
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
