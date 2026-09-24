export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

// Realistic interest rates for installment plans with financing (ej: Mercado Pago / Tarjetas de crédito bancarias)
// 3 cuotas: ~15% recargo financiero, 6 cuotas: ~28% recargo financiero
export const INSTALLMENT_RATES: Record<number, number> = {
  1: 0,     // 1 pago sin recargo
  3: 0.15,  // 3 cuotas fijas (15% interés financiero)
  6: 0.28   // 6 cuotas fijas (28% interés financiero)
};

export function calculateInstallments(
  price: number,
  installmentsCount: number = 3,
  withInterest: boolean = true
): { count: number; perInstallment: number; totalWithInterest: number; interestPercentage: number } {
  const rate = withInterest ? (INSTALLMENT_RATES[installmentsCount] ?? 0.15) : 0;
  const totalWithInterest = Math.round(price * (1 + rate));
  return {
    count: installmentsCount,
    perInstallment: Math.round(totalWithInterest / installmentsCount),
    totalWithInterest,
    interestPercentage: Math.round(rate * 100)
  };
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return isoString;
  }
}

export function createWhatsAppOrderLink(phone: string, orderNumber: string, customerName: string, total: number): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const message = encodeURIComponent(
    `¡Hola ${customerName}! Te escribimos de ISAMER Lab Cosmética respecto a tu pedido #${orderNumber} por ${formatCurrency(total)}. `
  );
  return `https://wa.me/${cleanPhone}?text=${message}`;
}
