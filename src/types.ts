export interface ProductShade {
  name: string;
  hex: string;
  toneCode?: string;
}

export type ProductBrand = 'H2Derm' | 'Mimitos' | 'SoftCare' | 'Le Salon' | string;

export interface Product {
  id: string;
  brand: ProductBrand;
  name: string;
  tagline: string;
  category: 'Cremas' | 'Serums' | 'Ojos' | 'Limpieza' | 'Packs' | 'Capilar' | 'Aceites' | 'Bebés/Kids' | string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  image: string;
  video?: string;
  secondaryImages?: string[];
  badges: string[];
  description: string;
  benefits: string[];
  howToUse: string;
  shades?: ProductShade[];
  stock: number;
  featured: boolean;
  motherDaySpecial: boolean;
  sku: string;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  highlightText: string;
  badge: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  video?: string;
  textColor: 'light' | 'dark';
  align: 'left' | 'center' | 'right';
  active: boolean;
  order: number;
}

export interface BankConfig {
  bankName: string;
  accountHolder: string;
  cbu: string;
  alias: string;
  cuit: string;
  discountPercentage: number;
  whatsappNoticeNumber: string;
}

export interface MercadoPagoConfig {
  publicKey: string;
  accessToken: string;
  sandboxMode: boolean;
  enabled: boolean;
}

export interface MetaAdsConfig {
  pixelId: string;
  conversionsApiToken: string;
  testEventCode?: string;
  enabled: boolean;
}

export interface CreateYourBrandCMS {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  whatsappMessage: string;
  enabled: boolean;
}

export interface StoreCMS {
  storeName: string;
  storeTagline: string;
  announcementBar: string;
  announcementActive: boolean;
  enableMothersDay: boolean;
  whatsappNumber: string;
  instagramHandle: string;
  emailContact: string;
  mothersDayPromoTitle: string;
  mothersDayPromoSubtitle: string;
  mothersDayPromoBanner: string;
  mothersDayPromoDiscount: string;
  freeShippingThreshold: number;
  adminPin: string;
  createYourBrand: CreateYourBrandCMS;
  bankConfig: BankConfig;
  mercadoPagoConfig: MercadoPagoConfig;
  metaAdsConfig: MetaAdsConfig;
  footerAbout: string;
}

export type OrderStatus = 'Pendiente' | 'Pagado' | 'En preparación' | 'En camino' | 'Entregado' | 'Cancelado';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  shade?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDni: string;
  shippingAddress: {
    street: string;
    number: string;
    apartment?: string;
    city: string;
    province: string;
    postalCode: string;
  };
  shippingMethod: 'standard' | 'express';
  shippingCost: number;
  paymentMethod: 'mercadopago' | 'transferencia' | 'tarjeta_credito' | 'tarjeta_debito';
  paymentStatus: 'pending' | 'approved' | 'rejected' | 'in_process';
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  trackingCode?: string;
  carrierName?: string;
  bankReceiptImage?: string;
  notes?: string;
  metaSource?: string;
}

export interface PixelEventLog {
  id: string;
  eventName: 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';
  timestamp: string;
  data: Record<string, any>;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  sentAt: string;
}

export const APP_TYPES_LOADED = true;

