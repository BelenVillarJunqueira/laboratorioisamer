export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

export function calculateInstallments(price: number, installmentsCount: number = 3): { count: number; perInstallment: number } {
  return {
    count: installmentsCount,
    perInstallment: Math.round(price / installmentsCount)
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
    `¡Hola ${customerName}! Te escribimos de Luméa Cosmética respecto a tu pedido #${orderNumber} por ${formatCurrency(total)}. `
  );
  return `https://wa.me/${cleanPhone}?text=${message}`;
}