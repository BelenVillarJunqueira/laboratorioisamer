import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Building2, Smartphone, ShieldCheck, ArrowRight, Upload, Copy, Check, Sparkles, AlertCircle, ExternalLink, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StoreCMS, Order } from '../types';
import { CartItem } from './CartDrawer';
import { formatCurrency, calculateInstallments } from '../utils/formatters';
import { api } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cms: StoreCMS;
  onOrderCompleted: (order: Order) => void;
  onClearCart: () => void;
  onOpenTrackingWithCode: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  cms,
  onOrderCompleted,
  onClearCart,
  onOpenTrackingWithCode
}) => {
  const [step, setStep] = useState<'info' | 'payment' | 'confirmation'>('info');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [mpPaymentUrl, setMpPaymentUrl] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dni: '',
    street: '',
    number: '',
    apartment: '',
    city: '',
    province: 'Buenos Aires',
    postalCode: '',
    shippingMethod: 'standard' as 'standard' | 'express',
    paymentMethod: 'mercadopago' as 'mercadopago' | 'transferencia' | 'tarjeta_credito' | 'tarjeta_debito',
    notes: '',
    // Card fields
    cardNumber: '',
    cardHolder: '',
    cardExpiry: '',
    cardCvv: '',
    installments: 3,
    // Bank receipt
    receiptImage: ''
  });

  const [receiptFileName, setReceiptFileName] = useState<string>('');

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const isFreeShipping = subtotal >= cms.freeShippingThreshold;
  const shippingCost = formData.shippingMethod === 'express' ? 4900 : (isFreeShipping ? 0 : 3500);

  // 10% discount on bank transfer
  const discountAmount =
    formData.paymentMethod === 'transferencia'
      ? Math.round(subtotal * ((cms.bankConfig.discountPercentage || 10) / 100))
      : 0;

  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setReceiptFileName(file.name);
      const url = await api.uploadMedia(file);
      setFormData(prev => ({ ...prev, receiptImage: url }));
    } catch {
      alert('Error al subir el comprobante. Podés enviarlo por WhatsApp al finalizar.');
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.number || !formData.postalCode) {
      alert('Por favor completá los datos obligatorios de envío.');
      return;
    }
    // Fire initiate checkout event to Meta Pixel
    api.logPixelEvent('InitiateCheckout', {
      value: total,
      currency: 'ARS',
      num_items: cartItems.length
    });
    setStep('payment');
  };

  const handleFinalizeOrder = async () => {
    setLoading(true);
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        shade: item.selectedShade,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity
      }));

      // Generate realistic carrier tracking code
      const randomTrackDigits = Math.floor(10000000 + Math.random() * 90000000);
      const isExpress = formData.shippingMethod === 'express';
      const carrierName = isExpress ? 'OCA Express Prioritario' : 'Correo Argentino';
      const trackingCode = isExpress ? `OCA-${randomTrackDigits}` : `AR-${randomTrackDigits}`;

      // Calculate final total based on payment method and installments
      let finalTotal = total;
      if (formData.paymentMethod === 'tarjeta_credito' && formData.installments > 1) {
        const installmentInfo = calculateInstallments(total, formData.installments, true);
        finalTotal = installmentInfo.totalWithInterest;
      }

      const isMP = formData.paymentMethod === 'mercadopago';

      const newOrderPayload: Partial<Order> = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerDni: formData.dni,
        shippingAddress: {
          street: formData.street,
          number: formData.number,
          apartment: formData.apartment,
          city: formData.city || 'CABA',
          province: formData.province,
          postalCode: formData.postalCode
        },
        shippingMethod: formData.shippingMethod,
        shippingCost,
        paymentMethod: formData.paymentMethod,
        paymentStatus: isMP ? 'pending' : (formData.paymentMethod === 'transferencia' ? 'pending' : 'approved'),
        status: isMP ? 'Pendiente' : (formData.paymentMethod === 'transferencia' ? 'Pendiente' : 'En preparación'),
        items: orderItems,
        subtotal,
        discount: discountAmount,
        total: finalTotal,
        bankReceiptImage: formData.receiptImage,
        trackingCode,
        carrierName,
        notes: formData.notes
      };

      const order = await api.createOrder(newOrderPayload);
      setCreatedOrder(order);
      onOrderCompleted(order);
      onClearCart();

      // If user selected Mercado Pago, redirect to actual Mercado Pago platform
      if (isMP) {
        try {
          const prefResponse = await api.createMercadoPagoPreference({
            items: orderItems,
            total: finalTotal,
            payer: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              dni: formData.dni,
              address: {
                street: formData.street,
                number: formData.number,
                postalCode: formData.postalCode
              }
            },
            orderNumber: order.orderNumber
          });

          const redirectUrl = prefResponse.init_point || prefResponse.sandbox_init_point;
          if (redirectUrl) {
            setMpPaymentUrl(redirectUrl);
            // Save last pending order number in localStorage for tracker
            try {
              localStorage.setItem('isamer_last_order', order.orderNumber);
            } catch {
              // ignore
            }

            // Attempt redirect, or let confirmation view provide direct button if popup blocked
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, 800);
          }
        } catch (mpErr) {
          console.error('Error connecting to Mercado Pago gateway:', mpErr);
        }
      }

      setStep('confirmation');

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } catch {
      alert('Hubo un inconveniente al procesar el pedido. Intentá nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-auto">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-pink-50/50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E6007E] text-white flex items-center justify-center font-bold text-xs">
              {step === 'info' ? '1' : step === 'payment' ? '2' : '✓'}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                {step === 'info'
                  ? 'Datos de Envío y Contacto'
                  : step === 'payment'
                  ? 'Pasarela de Pago'
                  : '¡Compra Confirmada con Éxito!'}
              </h3>
              <p className="text-[11px] text-gray-500">
                {step === 'confirmation' ? 'Tu pedido ya está siendo preparado' : 'Paso seguro con cifrado SSL'}
              </p>
            </div>
          </div>
          {step !== 'confirmation' && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          
          {/* STEP 1: INFO & SHIPPING */}
          {step === 'info' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Información Personal
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Florencia Benítez"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      DNI / CUIT (para factura y correo) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 38192048"
                      value={formData.dni}
                      onChange={e => setFormData({ ...formData, dni: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email de confirmación *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nombre@gmail.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Teléfono Celular / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 11 5555 1234"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Dirección de Entrega
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Calle *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Av. Santa Fe"
                      value={formData.street}
                      onChange={e => setFormData({ ...formData, street: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="3420"
                      value={formData.number}
                      onChange={e => setFormData({ ...formData, number: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Piso / Dpto (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="4 B"
                      value={formData.apartment}
                      onChange={e => setFormData({ ...formData, apartment: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="1425"
                      value={formData.postalCode}
                      onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Provincia *
                    </label>
                    <select
                      value={formData.province}
                      onChange={e => setFormData({ ...formData, province: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] outline-none bg-white"
                    >
                      <option value="Buenos Aires">Buenos Aires</option>
                      <option value="CABA">CABA</option>
                      <option value="Córdoba">Córdoba</option>
                      <option value="Santa Fe">Santa Fe</option>
                      <option value="La Pampa">La Pampa</option>
                      <option value="Mendoza">Mendoza</option>
                      <option value="Tucumán">Tucumán</option>
                      <option value="Entre Ríos">Entre Ríos</option>
                      <option value="Salta">Salta</option>
                      <option value="Chaco">Chaco</option>
                      <option value="Corrientes">Corrientes</option>
                      <option value="Misiones">Misiones</option>
                      <option value="San Juan">San Juan</option>
                      <option value="San Luis">San Luis</option>
                      <option value="Chaco">Chaco</option>
                      <option value="Jujuy">Jujuy</option>
                      <option value="Río Negro">Río Negro</option>
                      <option value="Neuquén">Neuquén</option>
                      <option value="Otras Provincias">Otras Provincias</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Dedicatoria especial o notas para empaque de regalo:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 'Para mamá con mucho amor, de parte de Lara'"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E] outline-none"
                  />
                </div>
              </div>

              {/* Shipping Method Options */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Método de Envío
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      formData.shippingMethod === 'standard'
                        ? 'border-[#E6007E] bg-pink-50/50 ring-1 ring-[#E6007E]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={() => setFormData({ ...formData, shippingMethod: 'standard' })}
                      className="mt-0.5 text-[#E6007E]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-900 block">Envío Estándar a Domicilio</span>
                      <span className="text-gray-500">Correo Argentino / OCA (3 a 5 días)</span>
                      <span className="font-bold text-emerald-600 block mt-1">
                        {isFreeShipping ? '¡GRATIS!' : formatCurrency(3500)}
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      formData.shippingMethod === 'express'
                        ? 'border-[#E6007E] bg-pink-50/50 ring-1 ring-[#E6007E]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={() => setFormData({ ...formData, shippingMethod: 'express' })}
                      className="mt-0.5 text-[#E6007E]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-900 block">Envío Prioritario Express</span>
                      <span className="text-gray-500">Despacho en el día (24 a 48 hs)</span>
                      <span className="font-bold text-gray-900 block mt-1">
                        {formatCurrency(4900)}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                <span className="text-sm font-extrabold text-gray-900">
                  Total a pagar: <span className="text-[#E6007E]">{formatCurrency(total)}</span>
                </span>
                <button
                  type="submit"
                  className="bg-[#E6007E] hover:bg-[#C9006B] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all"
                >
                  <span>Continuar al Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT GATEWAY */}
          {step === 'payment' && (
            <div className="space-y-6">
              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'mercadopago' })}
                  className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                    formData.paymentMethod === 'mercadopago'
                      ? 'border-[#009EE3] bg-[#009EE3]/10 ring-2 ring-[#009EE3]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#009EE3]" />
                  <span className="text-xs font-bold text-gray-900 text-center">Mercado Pago</span>
                  <span className="text-[10px] text-[#009EE3] font-medium">Dev / Sandbox</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'transferencia' })}
                  className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                    formData.paymentMethod === 'transferencia'
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-gray-900 text-center">Transferencia</span>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">10% OFF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'tarjeta_credito' })}
                  className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                    formData.paymentMethod === 'tarjeta_credito'
                      ? 'border-[#E6007E] bg-pink-50 ring-2 ring-[#E6007E]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#E6007E]" />
                  <span className="text-xs font-bold text-gray-900 text-center">Tarjetas</span>
                  <span className="text-[10px] text-pink-600 font-medium">3/6 Cuotas</span>
                </button>
              </div>

              {/* MERCADO PAGO INTEGRATION DETAILS */}
              {formData.paymentMethod === 'mercadopago' && (
                <div className="bg-[#009EE3]/5 border border-[#009EE3]/20 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#009EE3] text-white flex items-center justify-center font-bold text-xs">
                        MP
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Mercado Pago Checkout</h4>
                        <p className="text-[10px] text-gray-500">Credenciales de desarrollador conectadas</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                      Sandbox / Dev Mode
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Pagá de forma protegida con tu cuenta de Mercado Pago, dinero disponible, tarjeta guardada o generá cupón de pago con acreditación inmediata.
                  </p>

                  <div className="bg-white p-3 rounded-xl border border-gray-100 text-xs space-y-1">
                    <div className="flex justify-between text-gray-500 text-[11px]">
                      <span>Public Key configurada:</span>
                      <span className="font-mono text-gray-800 truncate max-w-50">
                        {cms.mercadoPagoConfig.publicKey}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-[11px]">
                      <span>Estado:</span>
                      <span className="text-emerald-600 font-bold">Listo para procesar pagos</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TRANSFERENCIA BANCARIA DETAILS */}
              {formData.paymentMethod === 'transferencia' && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-700" />
                      <span>Datos para Transferencia / Depósito</span>
                    </h4>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                      10% OFF Aplicado
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-3.5 border border-emerald-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span className="text-gray-500">Banco:</span>
                      <span className="font-bold text-gray-900">{cms.bankConfig.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span className="text-gray-500">Titular de la cuenta:</span>
                      <span className="font-bold text-gray-900">{cms.bankConfig.accountHolder}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span className="text-gray-500">Alias:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#E6007E]">{cms.bankConfig.alias}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(cms.bankConfig.alias, 'alias')}
                          className="p-1 hover:bg-gray-100 rounded-sm text-gray-500"
                          title="Copiar alias"
                        >
                          {copiedField === 'alias' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span className="text-gray-500">CBU:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-gray-800 text-[11px]">{cms.bankConfig.cbu}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(cms.bankConfig.cbu, 'cbu')}
                          className="p-1 hover:bg-gray-100 rounded-sm text-gray-500"
                          title="Copiar CBU"
                        >
                          {copiedField === 'cbu' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-500">CUIT:</span>
                      <span className="font-mono text-gray-700">{cms.bankConfig.cuit}</span>
                    </div>
                  </div>

                  {/* Upload Receipt From PC */}
                  <div className="pt-1">
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Adjuntar comprobante de transferencia desde tu PC (Opcional):
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{receiptFileName ? 'Cambiar archivo' : 'Subir Comprobante (JPG, PNG, PDF)'}</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleReceiptUpload}
                          className="hidden"
                        />
                      </label>
                      {receiptFileName && (
                        <span className="text-xs text-emerald-700 font-medium truncate max-w-45">
                          ✓ {receiptFileName}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      También podés enviarlo por WhatsApp indicando tu número de pedido.
                    </span>
                  </div>
                </div>
              )}

              {/* TARJETAS DE CRÉDITO/DÉBITO */}
              {formData.paymentMethod === 'tarjeta_credito' && (
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900">Datos de la Tarjeta</h4>
                    <span className="text-[11px] text-emerald-600 font-bold">3 y 6 Cuotas </span>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
                        Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        placeholder="•••• •••• •••• ••••"
                        maxLength={19}
                        value={formData.cardNumber}
                        onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#E6007E] outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
                        Nombre y Apellido como figura en la tarjeta
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: FLORENCIA BENITEZ"
                        value={formData.cardHolder}
                        onChange={e => setFormData({ ...formData, cardHolder: e.target.value.toUpperCase() })}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#E6007E] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
                          Vencimiento (MM/AA)
                        </label>
                        <input
                          type="text"
                          placeholder="08/28"
                          maxLength={5}
                          value={formData.cardExpiry}
                          onChange={e => setFormData({ ...formData, cardExpiry: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#E6007E] outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
                          CVV / Código de Seguridad
                        </label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          value={formData.cardCvv}
                          onChange={e => setFormData({ ...formData, cardCvv: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#E6007E] outline-none font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-0.5">
                        Seleccionar Cuotas con Tarjeta
                      </label>
                      <select
                        value={formData.installments}
                        onChange={e => setFormData({ ...formData, installments: Number(e.target.value) })}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#E6007E] outline-none"
                      >
                        <option value={1}>1 pago al contado de {formatCurrency(total)}</option>
                        <option value={3}>
                          3 cuotas fijas de {formatCurrency(calculateInstallments(total, 3, true).perInstallment)} (Total: {formatCurrency(calculateInstallments(total, 3, true).totalWithInterest)})
                        </option>
                        <option value={6}>
                          6 cuotas fijas de {formatCurrency(calculateInstallments(total, 6, true).perInstallment)} (Total: {formatCurrency(calculateInstallments(total, 6, true).totalWithInterest)})
                        </option>
                      </select>
                      <p className="text-[10px] text-gray-500 mt-1">
                        * Planes en cuotas calculados con tasa de financiación bancaria estándar.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Price Box */}
              <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Descuento Transferencia (10%):</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Envío ({formData.shippingMethod === 'express' ? 'Express Prioritario' : 'Estándar'}):</span>
                  <span className={shippingCost === 0 ? 'text-emerald-700 font-bold' : ''}>
                    {shippingCost === 0 ? 'GRATIS' : formatCurrency(shippingCost)}
                  </span>
                </div>
                {formData.paymentMethod === 'tarjeta_credito' && formData.installments > 1 && (
                  <div className="flex justify-between text-amber-700 text-xs font-semibold pt-1 border-t border-pink-200/50">
                    <span>Interés financiero ({formData.installments} cuotas):</span>
                    <span>+{formatCurrency(calculateInstallments(total, formData.installments, true).totalWithInterest - total)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-pink-200">
                  <span>Total Final:</span>
                  <span className="text-[#E6007E]">
                    {formatCurrency(
                      formData.paymentMethod === 'tarjeta_credito' && formData.installments > 1
                        ? calculateInstallments(total, formData.installments, true).totalWithInterest
                        : total
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="text-xs text-gray-500 hover:text-gray-800 font-medium"
                >
                  ← Volver a datos
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleFinalizeOrder}
                  className={`text-white text-xs sm:text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 ${
                    formData.paymentMethod === 'mercadopago'
                      ? 'bg-[#009EE3] hover:bg-[#0081ba] shadow-blue-500/20'
                      : 'bg-[#E6007E] hover:bg-[#C9006B] shadow-pink-500/25'
                  }`}
                >
                  {loading ? (
                    <span>{formData.paymentMethod === 'mercadopago' ? 'Conectando con Mercado Pago...' : 'Procesando pedido...'}</span>
                  ) : (
                    <>
                      {formData.paymentMethod === 'mercadopago' ? (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          <span>Pagar en Mercado Pago ({formatCurrency(total)})</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>
                            Confirmar y Pagar{' '}
                            {formatCurrency(
                              formData.paymentMethod === 'tarjeta_credito' && formData.installments > 1
                                ? calculateInstallments(total, formData.installments, true).totalWithInterest
                                : total
                            )}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION */}
          {step === 'confirmation' && createdOrder && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">
                  ¡Pedido Recibido con Éxito!
                </span>
                <h3 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-black text-gray-900">
                  ¡Muchas Gracias por tu Compra!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                  Enviamos el detalle y comprobante a <strong>{createdOrder.customerEmail}</strong>.
                </p>
              </div>

              {/* Order summary badge */}
              <div className="bg-pink-50/70 p-5 rounded-2xl border border-pink-100 max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Número de Pedido:</span>
                  <span className="font-mono font-black text-[#E6007E] text-base">{createdOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Estado inicial:</span>
                  <span className="bg-white px-2 py-0.5 rounded-full text-emerald-700 font-bold border border-emerald-200">
                    {createdOrder.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Método de pago:</span>
                  <span className="font-medium text-gray-800 capitalize">{createdOrder.paymentMethod.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-pink-200">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-black text-[#E6007E] text-sm">{formatCurrency(createdOrder.total)}</span>
                </div>
              </div>

              {/* Mercado Pago direct redirect / button */}
              {createdOrder.paymentMethod === 'mercadopago' && mpPaymentUrl && (
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 max-w-md mx-auto text-center space-y-2.5">
                  <div className="text-xs font-bold text-[#009EE3] uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Pasarela de Pago Mercado Pago</span>
                  </div>
                  <p className="text-xs text-sky-900">
                    Si no se abrió la ventana automáticamente, hacé clic en el botón para completar el pago de forma segura:
                  </p>
                  <a
                    href={mpPaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#009EE3] hover:bg-[#0081ba] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-xs sm:text-sm w-full cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Abrir Plataforma de Mercado Pago</span>
                  </a>
                </div>
              )}

              {/* Direct Buttons: Track Order or Share on WhatsApp */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenTrackingWithCode(createdOrder.orderNumber);
                  }}
                  className="w-full sm:w-auto bg-[#221F20] hover:bg-[#E6007E] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-all"
                >
                  Seguir mi Pedido en Tiempo Real
                </button>
                <a
                  href={`https://wa.me/${cms.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `¡Hola! Acabo de realizar el pedido ${createdOrder.orderNumber} por ${formatCurrency(createdOrder.total)}. Quisiera confirmar la entrega.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Notificar por WhatsApp</span>
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};