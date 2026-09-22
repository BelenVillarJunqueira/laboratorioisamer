import { Product, CarouselSlide, StoreCMS, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    order: 1,
    brand: 'H2Derm',
    sku: 'LUM-CREM-001',
    name: 'Crema Hidratante Facial Intensiva Hydra-Deep 72H',
    tagline: 'Hidratación multicapa profunda con Ácido Hialurónico, Ceramidas y Niacinamida',
    category: 'Cremas',
    price: 21900,
    originalPrice: 28500,
    discountPercentage: 23,
    rating: 4.9,
    reviewsCount: 164,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'
    ],
    badges: ['Más Vendido', 'Hidratación 72h', 'Cruelty Free'],
    description: 'La crema hidratante facial insigne formulada con una matriz trifásica de Ácido Hialurónico de alto y bajo peso molecular junto a tres ceramidas esenciales que sellan la humedad natural de la piel. Repara la barrera cutánea sin dejar rastro graso ni comedogénico.',
    benefits: [
      'Hasta 72 horas de hidratación profunda y continua',
      'Refuerza la barrera de defensa natural y previene la pérdida de agua',
      'Textura en emulsión sedosa de absorción instantánea',
      'Apta para todo tipo de piel, incluso las más sensibles y reactivas'
    ],
    howToUse: 'Aplicar por la mañana y por la noche sobre rostro y cuello limpios, luego del serum. Masajear suavemente con movimientos ascendentes hasta su total absorción.',
    stock: 48,
    featured: true,
    motherDaySpecial: true
  },
  {
    id: 'prod-2',
    order: 2,
    brand: 'H2Derm',
    sku: 'LUM-SERU-002',
    name: 'Serum con ADN liposomado & Crema hidratante con ácido hialurónico',
    tagline: 'Vitamina C Pura 12%, Ácido Ferúlico y Vitamina E para luminosidad y firmeza',
    category: 'Serums',
    price: 24900,
    originalPrice: 32000,
    discountPercentage: 22,
    rating: 5.0,
    reviewsCount: 189,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80'
    ],
    badges: ['Efecto Glow', 'Antioxidante 24h', 'Fórmula Pura'],
    description: 'El elixir concentrado que devuelve la vitalidad y luz al rostro opaco o cansado. Su potente sinergia de Vitamina C estabilizada al 12% junto a Ácido Ferúlico neutraliza el daño de la radiación y polución urbana, reduciendo manchitas y emparejando el tono de la piel.',
    benefits: [
      'Luminosidad radiante y efecto piel fresca desde la primera semana',
      'Aclara manchas solares y unifica la tonalidad del cutis',
      'Estimula la producción natural de colágeno y elastina'
    ],
    howToUse: 'Colocar de 4 a 5 gotas en la palma de la mano cada mañana. Presionar con suavidad sobre mejillas, frente y barbilla. Continuar con la crema hidratante y protector solar.',
    stock: 55,
    featured: true,
    motherDaySpecial: true
  },
  {
    id: 'prod-3',
    order: 3,
    brand: 'H2Derm',
    sku: 'LUM-OJOS-003',
    name: 'Contorno de Ojos Reparador Antifatiga Total Eye Lift',
    tagline: 'Desinflama bolsas, disminuye ojeras oscuras y alisa líneas con Cafeína & Péptidos',
    category: 'Ojos',
    price: 18900,
    originalPrice: 24000,
    discountPercentage: 21,
    rating: 4.8,
    reviewsCount: 132,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1512290900672-1f0236a00dfb?w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80'
    ],
    badges: ['Efecto Frío', 'Antiojeras', 'Oftalmológico'],
    description: 'Tratamiento ultra específico para la delicada piel periorbital. Su fórmula botánica combina micro-cafeína encapsulada que drena toxinas y descongestiona la mirada, con un complejo de tripéptidos tensores y aplicador metálico criogénico que aporta frescura inmediata.',
    benefits: [
      'Reduce notablemente la pigmentación de ojeras vasculares y marrones',
      'Descongestiona bolsas matutinas con efecto frío inmediato',
      'Suaviza líneas de expresión y aporta firmeza',
      'Textura ligera no grasa que no irrita ni corre el maquillaje'
    ],
    howToUse: 'Presionar suavemente el aplicador y distribuir una pequeña cantidad en el hueso orbital inferior y superior. Dar toquecitos con el dedo anular desde adentro hacia afuera.',
    stock: 42,
    featured: true,
    motherDaySpecial: true
  },
  {
    id: 'prod-4',
    order: 4,
    brand: 'H2Derm',
    sku: 'LUM-GEL-004',
    name: 'Gel Facial Limpiador Equilibrante Pure Botanics',
    tagline: 'Purifica poros en profundidad con Extracto de Árbol de Té, Centella y Aloe Vera',
    category: 'Limpieza',
    price: 16500,
    originalPrice: 21000,
    discountPercentage: 21,
    rating: 4.9,
    reviewsCount: 118,
    image: 'https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'
    ],
    badges: ['pH Neutro 5.5', 'Sin Sulfatos', 'Purificante'],
    description: 'Un limpiador suave en gel que se transforma en una espuma microfina y sedosa. Elimina impurezas, sudor, polución urbana y restos de maquillaje respetando el manto hidrolipídico sin dejar sensación de tirantez ni resequedad.',
    benefits: [
      'Limpia profundamente y destapa los poros obstruidos',
      'Calma rojeces e irritaciones gracias al extracto orgánico de Centella Asiática',
      'Fórmula libre de sulfatos, parabenos, alcohol y perfumes artificiales',
      'Deja la piel aterciopelada, fresca y preparada para recibir tu serum'
    ],
    howToUse: 'Humedecer el rostro con agua tibia. Masajear una pulsación de gel en movimientos circulares sobre rostro y cuello durante 60 segundos. Enjuagar con abundante agua.',
    stock: 65,
    featured: true,
    motherDaySpecial: true
  },
  {
    id: 'prod-5',
    order: 5,
    brand: 'H2Derm',
    sku: 'LUM-MICE-005',
    name: 'Serum DMEA y Cafeina',
    tagline: 'Ayuda a la firmeza y tension de la piel para lucir más jovén',
    category: 'Serums',
    price: 15900,
    originalPrice: 20500,
    discountPercentage: 22,
    rating: 4.9,
    reviewsCount: 145,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
      'https://images.unsplash.com/photo-1512290900672-1f0236a00dfb?w=800&q=80'
    ],
    badges: ['Firmeza', 'Cafeina', 'Efecto Lifting'],
    description: 'Devolvele la firmeza y juventud a tu rostro. Nuestro sérum con DMAE y cafeína combina el poder de un efecto lifting inmediato con una acción descongestiva profunda. Reducí la flacidez, suavizá líneas de expresión y lucí una piel visiblemente más tensa, tonificada y radiante.',
    benefits: [
      'Rejuvenece la piel, su textura y color',
      'Tonifica y equilibra la piel dejando un aroma floral sutil y fresco',
      'No deja película grasa ni pegajosa en el cutis',
      'Ideal para rostro completo, cuello y escote'
    ],
    howToUse: 'Aplicar 4 gotas por la mañana y noche sobre la piel limpia antes de la crema hidratante.',
    stock: 50,
    featured: true,
    motherDaySpecial: true
  },
  {
    id: 'prod-6',
    order: 6,
    brand: 'H2Derm',
    sku: 'LUM-PACK-006',
    name: 'Set Rutina Facial Completa Día de la Madre 5-en-1',
    tagline: 'Pack de lujo: Crema Hidratante + Serum Glow + Contorno + Gel Limpiador + Agua Micelar',
    category: 'Packs',
    price: 68900,
    originalPrice: 98000,
    discountPercentage: 30,
    rating: 5.0,
    reviewsCount: 215,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'
    ],
    badges: ['Especial Mamá', 'Rutina 5 Pasos', 'Ahorro 30%'],
    description: 'El regalo definitivo para consentir a mamá en su día con una experiencia de spa facial en casa. Contiene los 5 pasos esenciales del cuidado del rostro: Agua Micelar + Gel Limpiador + Serum Vitamina C + Contorno de Ojos + Crema Hidratante 72H.',
    benefits: [
      'Rutina facial dermatológica completa de día y de noche',
      'Ahorro del 30% comprando la colección completa',
      'Packaging de lujo festivo listo para obsequiar a mamá'
    ],
    howToUse: 'Paso 1: Desmaquillar con Agua Micelar. Paso 2: Limpiar con Gel Facial. Paso 3: Tratar con Serum Glow. Paso 4: Revitalizar con Contorno de Ojos. Paso 5: Sellar e hidratar con Crema 72H.',
    stock: 35,
    featured: true,
    motherDaySpecial: true
  },
  {
    id: 'prod-7',
    order: 7,
    brand: 'H2Derm',
    sku: 'LUM-PEEL-007',
    name: 'Peeling Enzimático Exfoliante Frutos Rojos & Papaya',
    tagline: 'Exfoliación suave sin gránulos abrasivos para piel de porcelana',
    category: 'Limpieza',
    price: 19500,
    originalPrice: 24500,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 89,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['Peeling Suave', 'Enzimático', 'Glow Inmediato'],
    description: 'Fórmula exfoliante biológica a base de papaína y extracto de frambuesa que disuelve las células muertas superficiales sin irritar ni frotar.',
    benefits: [
      'Piel infinitamente suave y luminosa en solo 5 minutos',
      'Mejora la penetración de tus serums diarios',
      'Apto para pieles sensibles que no toleran exfoliantes físicos'
    ],
    howToUse: 'Aplicar una capa fina sobre rostro limpio y seco. Dejar actuar 5 minutos y enjuagar con agua tibia. Usar 1 a 2 veces por semana.',
    stock: 40,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'prod-8',
    order: 8,
    brand: 'H2Derm',
    sku: 'LUM-ACID-008',
    name: 'Elixir Facial Escualano Vegetal & Rosa Mosqueta Pura',
    tagline: 'Aceite seco regenerador ultra nutritivo toque sedoso',
    category: 'Serums',
    price: 23500,
    originalPrice: 29000,
    discountPercentage: 19,
    rating: 4.9,
    reviewsCount: 104,
    image: 'https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1512290900672-1f0236a00dfb?w=800&q=80'
    ],
    badges: ['100% Orgánico', 'Aceite Seco', 'Nutrición'],
    description: 'Gotas de nutrición intensiva obtenidas por prensado en frío de rosa mosqueta patagónica y escualano derivado de la oliva. Nutre en profundidad sin sensación grasa.',
    benefits: [
      'Atenúa cicatrices y líneas finas de deshidratación',
      'Aporta elasticidad y suavidad aterciopelada inmediata',
      'Ideal para sellar tu rutina de noche o mezclar con tu base'
    ],
    howToUse: 'Presionar 2 a 3 gotas sobre rostro y cuello como paso final de tu rutina nocturna.',
    stock: 35,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'prod-9',
    order: 9,
    brand: 'H2Derm',
    sku: 'LUM-MASC-009',
    name: 'Máscara Facial Nocturna Hidrogel Colágeno Puro',
    tagline: 'Efecto descanso 8 horas con Ácido Hialurónico y Péptidos Tensores',
    category: 'Cremas',
    price: 18500,
    originalPrice: 23000,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 96,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['Sleeping Mask', 'Colágeno', 'Hidrogel'],
    description: 'Máscara cremosa de absorción lenta que repara la piel mientras dormís. Al despertar, el cutis se siente jugoso, descansado y visiblemente revitalizado.',
    benefits: [
      'Recupera pieles fatigadas por el estrés o la falta de sueño',
      'Sella la hidratación durante toda la noche',
      'No mancha la almohada gracias a su absorción invisible'
    ],
    howToUse: 'Aplicar como último paso nocturno 2 veces por semana y dejar actuar toda la noche. Enjuagar por la mañana.',
    stock: 45,
    featured: false,
    motherDaySpecial: true
  },
  {
    id: 'prod-10',
    order: 10,
    brand: 'H2Derm',
    sku: 'LUM-MIST-010',
    name: 'Bruma Facial Refrescante con Agua de Rosas & Niacinamida',
    tagline: 'Hidrata, fija el maquillaje e ilumina el rostro en cualquier momento',
    category: 'Limpieza',
    price: 14900,
    originalPrice: 18500,
    discountPercentage: 19,
    rating: 4.8,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80'
    ],
    badges: ['Agua de Rosas', 'Fijador de MakeUp', 'Glow Natural'],
    description: 'Destilado botánico de rosas orgánicas con niacinamida y aloe vera que aporta una dosis express de hidratación y calma a lo largo del día.',
    benefits: [
      'Revitaliza el cutis apagado en cuestión de segundos',
      'Prolonga la duración del maquillaje evitando cuarteaduras',
      'Aroma sutil y natural a pétalos de rosa'
    ],
    howToUse: 'Vaporizar a 20 cm del rostro con los ojos cerrados antes del maquillaje o durante el día.',
    stock: 60,
    featured: false,
    motherDaySpecial: false
  }
];

export const INITIAL_SLIDES: CarouselSlide[] = [
  {
    id: 'slide-1',
    title: 'H2Derm • Dermocosmética Clínica Avanzada',
    subtitle: 'Nuestra línea de alta concentración: Ácido Hialurónico Biomimético, Niacinamida 10% y Fórmulas Reparadoras',
    highlightText: '⭐ Lanzamiento Exclusivo | Resultados Visibles Desde la 1ª Aplicación',
    badge: 'LÍNEA DESTACADA 2026',
    buttonText: 'Ver Productos',
    buttonLink: '#productos',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1600&q=85',
    textColor: 'light',
    align: 'left',
    active: true,
    order: 1
  },
  {
    id: 'slide-2',
    title: 'Especial Día de la Madre en LUMÉA',
    subtitle: 'El regalo más hermoso para mamá: Piel radiante, hidratada y llena de vida',
    highlightText: 'Hasta 30% OFF en Sets de Rutina Facial + 3 y 6 Cuotas',
    badge: 'Campaña Oficial 2026',
    buttonText: 'Ver Rutina Facial Completa',
    buttonLink: '#productos',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=85',
    textColor: 'light',
    align: 'left',
    active: true,
    order: 2
  },
  {
    id: 'slide-3',
    title: 'Crea tu Marca con Nuestro Laboratorio',
    subtitle: 'Tu sueño se puede hacer realidad: Desarrollamos tu propia línea de cosmética personalizada con packaging y formulación a medida',
    highlightText: '🧪 Fórmulas Exclusivas • Lotes Accesibles • Asesoría Técnica',
    badge: 'MARCA BLANCA & LABORATORIO',
    buttonText: 'Consultar por WhatsApp',
    buttonLink: '#crea-tu-marca',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600&q=85',
    textColor: 'light',
    align: 'center',
    active: true,
    order: 3
  }
];

export const INITIAL_CMS: StoreCMS = {
  storeName: 'LUMÉA & Laboratorio Cosmético',
  storeTagline: 'Laboratorio de Cosmética & Catálogo Multimarca',
  announcementBar: '💖 ¡ESPECIAL DÍA DE LA MADRE EN LUMÉA! 3 y 6 CUOTAS + ENVÍOS A TODO EL PAÍS ',
  announcementActive: true,
  enableMothersDay: true,
  whatsappNumber: '5493515056742',
  instagramHandle: '@lumeacosmetica',
  emailContact: 'contacto@lumea.com.ar',
  mothersDayPromoTitle: 'Celebrá a Mamá con el Cuidado que su Piel Merece',
  mothersDayPromoSubtitle: 'Regalale a mamá una experiencia de spa facial en su hogar: Crema Hidratante, Serum Luminoso, Contorno de Ojos, Gel Facial y Agua Micelar en un pack exclusivo.',
  mothersDayPromoBanner: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=85',
  mothersDayPromoDiscount: 'Packs de regalo con 30% OFF y tarjeta con dedicatoria personalizada',
  freeShippingThreshold: 25000,
  adminPin: 'lumea2025',
  createYourBrand: {
    title: 'Crea tu marca con nosotros',
    subtitle: 'Desarrollo integral de productos cosméticos en nuestro laboratorio',
    description: 'Tu sueño se puede hacer realidad, crea tu propia marca de productos con nuestro laboratorio.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=85',
    whatsappMessage: '¡Hola! Quiero información para crear mi propia marca de productos con su laboratorio.',
    enabled: true
  },
  bankConfig: {
    bankName: 'Banco Galicia',
    accountHolder: 'LUMÉA Cosmética ',
    cbu: '0070327530004092450465',
    alias: 'rbvillar3.gal',
    cuit: '23-37066549-4',
    discountPercentage: 10,
    whatsappNoticeNumber: '5493515056742'
  },
  mercadoPagoConfig: {
    publicKey: 'TEST-33981827-0402-4a0e-bc21-82791827bfae',
    accessToken: 'TEST-8291029384758291-031514-f89a9182738491028374659102938475-102938475',
    sandboxMode: true,
    enabled: true
  },
  metaAdsConfig: {
    pixelId: '948271029482719',
    conversionsApiToken: 'EAABwz_fake_meta_conversions_api_token_sample_123',
    testEventCode: 'TEST98231',
    enabled: true
  },
  footerAbout: 'Laboratorio de cosmética dermatológica. Fórmulas desarrolladas en Argentina con los más altos estándares de pureza y biotecnología.'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'LUM-8492',
    createdAt: '2026-09-14T18:22:00Z',
    updatedAt: '2026-09-15T10:15:00Z',
    customerName: 'Florencia Benítez',
    customerEmail: 'flor.benitez@gmail.com',
    customerPhone: '1148291023',
    customerDni: '38192048',
    shippingAddress: {
      street: 'Av. Santa Fe',
      number: '3420',
      apartment: '4 B',
      city: 'Palermo, CABA',
      province: 'Buenos Aires',
      postalCode: '1425'
    },
    shippingMethod: 'standard',
    shippingCost: 0,
    paymentMethod: 'mercadopago',
    paymentStatus: 'approved',
    status: 'En camino',
    items: [
      {
        productId: 'prod-6',
        productName: 'Set Rutina Facial Completa Día de la Madre 5-en-1',
        productImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
        quantity: 1,
        unitPrice: 68900,
        totalPrice: 68900
      }
    ],
    subtotal: 68900,
    discount: 0,
    total: 68900,
    trackingCode: 'AR-CORREO-928174829',
    carrierName: 'Correo Argentino Express',
    notes: 'Empacar pack de lujo',
    metaSource: 'Instagram Ads - Campaña Día de la Madre LUMÉA'
  },
  {
    id: 'ord-1002',
    orderNumber: 'LUM-8493',
    createdAt: '2026-09-15T11:45:00Z',
    updatedAt: '2026-09-15T12:00:00Z',
    customerName: 'Camila Rodríguez',
    customerEmail: 'cami.rodriguez@outlook.com',
    customerPhone: '3515829102',
    customerDni: '40192847',
    shippingAddress: {
      street: 'Bv. San Juan',
      number: '780',
      apartment: '',
      city: 'Córdoba Capital',
      province: 'Córdoba',
      postalCode: '5000'
    },
    shippingMethod: 'standard',
    shippingCost: 0,
    paymentMethod: 'transferencia',
    paymentStatus: 'approved',
    status: 'En preparación',
    items: [
      {
        productId: 'prod-1',
        productName: 'Crema Hidratante Facial Intensiva Hydra-Deep 72H',
        productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
        quantity: 1,
        unitPrice: 21900,
        totalPrice: 21900
      }
    ],
    subtotal: 21900,
    discount: 2190,
    total: 19710,
    trackingCode: 'OCA-TRACK-4910293',
    carrierName: 'OCA Envíos',
    bankReceiptImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
    notes: 'Transferencia verificada con comprobante',
    metaSource: 'Facebook Ads'
  }
];