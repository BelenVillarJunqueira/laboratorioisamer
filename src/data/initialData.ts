import { Product, CarouselSlide, StoreCMS, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // MARCA 1: H2Derm (LÍNEA ESTRELLA - 10 PRODUCTOS)
  // Dermocosmética Clínica Avanzada & Regeneración
  // ==========================================
  {
    id: 'h2d-001',
    brand: 'H2Derm',
    sku: 'H2D-HYAL-001',
    name: 'H2Derm - Serum Hialurónico Biomimético Ultra-Plump 3D',
    tagline: 'Ácido Hialurónico Puro 2.5% Multimolecular & Pantenol B5',
    category: 'Serums',
    price: 27900,
    originalPrice: 34900,
    discountPercentage: 20,
    rating: 5.0,
    reviewsCount: 248,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['Línea Estrella', 'Ácido Hialurónico 3D', 'Clínicamente Testeado'],
    description: 'El estandarte clínico de H2Derm. Formulado con triple peso molecular de ácido hialurónico biomimético que penetra desde la epidermis hasta las capas profundas, rellenando arrugas y restaurando el volumen hídrico al instante.',
    benefits: [
      'Efecto relleno y turgencia visible desde los 15 minutos de aplicación',
      'Hidrata en 3 niveles de profundidad cutánea sin efecto rebote',
      'Refuerza la síntesis endógena de colágeno y elastina',
      'Fórmula estéril libre de siliconas y fragancias sintéticas'
    ],
    howToUse: 'Aplicar 4 gotas por la mañana y por la noche sobre la piel húmeda. Masajear con suaves presiones ascendentes.',
    stock: 75,
    featured: true,
    motherDaySpecial: true
  },
  {
    id: 'h2d-002',
    brand: 'H2Derm',
    sku: 'H2D-CERA-002',
    name: 'H2Derm - Crema Reparadora Barrier Cream Cera-Repair',
    tagline: 'Triple Ceramidas Esenciales I, III, VI y Fitoesfingosina',
    category: 'Cremas',
    price: 26500,
    originalPrice: 33000,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 182,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80'
    ],
    badges: ['Barrera Cutánea', 'Dermocosmética', 'Calma Inmediata'],
    description: 'Tratamiento dermo-reparador intensivo para pieles comprometidas, sensibilizadas o con barrera debilitada por tratamientos dermatológicos. Sella la humedad natural y previene el envejecimiento prematuro.',
    benefits: [
      'Restaura la barrera lipídica en 48 horas continuas',
      'Alivia picazón, ardor y descamación instantáneamente',
      'Textura biomimética no comedogénica de absorción progresiva',
      'Apta para pieles con rosácea o tendencia atópica'
    ],
    howToUse: 'Extender suavemente sobre rostro, cuello y escote luego del serum reparador.',
    stock: 60,
    featured: true,
    motherDaySpecial: true
  },
  {
    id: 'h2d-003',
    brand: 'H2Derm',
    sku: 'H2D-NIAC-003',
    name: 'H2Derm - Concentrado Niacinamida Pura 10% + Zinc PCA',
    tagline: 'Regula el sebo, minimiza poros dilatados y unifica el tono',
    category: 'Serums',
    price: 25900,
    originalPrice: 31500,
    discountPercentage: 18,
    rating: 4.9,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'
    ],
    badges: ['Poros & Tono', 'Control Seborregulador', 'Anti-Rojeces'],
    description: 'Potente booster concentrado para refinar la textura cutánea. La vitamina B3 de grado médico al 10% combinada con Zinc PCA descongestiona los poros, atenúa manchas post-inflamatorias y equilibra el brillo indeseado.',
    benefits: [
      'Reduce el tamaño aparente de los poros en 14 días',
      'Disminuye la producción sebácea sin resecar la epidermis',
      'Atenúa manchas y rojeces residuales de imperfecciones',
      'Mejora notablemente la textura y luminosidad natural'
    ],
    howToUse: 'Colocar 3 a 4 gotas cada mañana y noche antes de tu hidratante habitual.',
    stock: 50,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'h2d-004',
    brand: 'H2Derm',
    sku: 'H2D-RETI-004',
    name: 'H2Derm - Serum Retinol Liposomado 0.3% Night Renew',
    tagline: 'Regeneración celular nocturna intensiva sin irritación',
    category: 'Serums',
    price: 29900,
    originalPrice: 38000,
    discountPercentage: 21,
    rating: 5.0,
    reviewsCount: 164,
    image: 'https://images.unsplash.com/photo-1512290900672-1f0236a00dfb?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80'
    ],
    badges: ['Alta Potencia', 'Retinol Liposomado', 'Noche'],
    description: 'Tecnología de encapsulación liposomada que libera el retinol puro de forma gradual durante la noche, maximizando la renovación celular y la síntesis de colágeno sin provocar descamación ni enrojecimiento.',
    benefits: [
      'Atenúa arrugas de expresión profundas y micro-relieve',
      'Acelera la renovación celular epidérmica',
      'Alta tolerancia dérmica gracias a su sistema liposomado',
      'Despierta con la piel más firme, lisa y luminosa'
    ],
    howToUse: 'Uso exclusivo nocturno. Iniciar 2 a 3 veces por semana e incrementar gradualmente. Aplicar siempre protector solar al día siguiente.',
    stock: 45,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'h2d-005',
    brand: 'H2Derm',
    sku: 'H2D-SOLA-005',
    name: 'H2Derm - Fotoprotector FPS 50+ Invisible Dry-Touch',
    tagline: 'Filtro Solar Amplio Espectro UVA/UVB con Niacinamida y Toque Seco',
    category: 'Cremas',
    price: 24500,
    originalPrice: 30000,
    discountPercentage: 18,
    rating: 4.9,
    reviewsCount: 198,
    image: 'https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['FPS 50+ Real', 'Toque Seco', 'No Comedogénico'],
    description: 'Protector solar facial de textura emulsión ultraligera que se absorbe al instante sin residuo blanco ni oleosidad. Protección fotoestable contra rayos UVA, UVB, luz azul y polución urbana.',
    benefits: [
      'Máxima protección FPS 50+ con filtros fotoestables europeos',
      'Efecto mate sedoso ideal como pre-base de maquillaje',
      'Resistente al agua y al sudor',
      'No pica en los ojos ni irrita pieles sensibles'
    ],
    howToUse: 'Aplicar generosamente sobre el rostro 20 minutos antes de la exposición solar. Reaplicar cada 2 a 3 horas.',
    stock: 80,
    featured: true,
    motherDaySpecial: true
  },
  {
    id: 'h2d-006',
    brand: 'H2Derm',
    sku: 'H2D-OJOS-006',
    name: 'H2Derm - Contorno Dermo-Tensor Péptidos & Cafeína Activa',
    tagline: 'Lifting periocular, drenaje linfático de bolsas y corrección de ojeras',
    category: 'Ojos',
    price: 23900,
    originalPrice: 29500,
    discountPercentage: 19,
    rating: 4.8,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1512290900672-1f0236a00dfb?w=800&q=80'
    ],
    badges: ['Efecto Tensor', 'Anti-Bolsas', 'Cafeína 5%'],
    description: 'Tratamiento clínico avanzado para la zona periorbital. Combina péptidos biomiméticos tensores y cafeína de alta pureza para desinflamar bolsas, iluminar ojeras pigmentarias y tonificar párpados caídos.',
    benefits: [
      'Drenaje y descongestión de bolsas en minutos',
      'Ilumina la mirada reduciendo el tono azulado y violáceo',
      'Estimula la microcirculación periocular',
      'Textura en sérum gel refrescante de absorción instantánea'
    ],
    howToUse: 'Colocar una gota en la yema de los dedos y masajear con pequeños toques alrededor del contorno de ojos.',
    stock: 55,
    featured: true,
    motherDaySpecial: true
  },
  {
    id: 'h2d-007',
    brand: 'H2Derm',
    sku: 'H2D-LIMP-007',
    name: 'H2Derm - Gel Limpiador Dermopurificante pH 5.5 Syndet',
    tagline: 'Limpieza clínica profunda sin jabón que preserva el manto hidrolipídico',
    category: 'Limpieza',
    price: 18900,
    originalPrice: 23500,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 153,
    image: 'https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'
    ],
    badges: ['Syndet Sin Jabón', 'pH 5.5 Fisiológico', 'Pieles Sensibles'],
    description: 'Limpiador dermatológico formulado con tensioactivos syndet biocompatibles. Purifica los poros de toxinas, maquillaje y partículas de contaminación sin agredir la flora bacteriana natural de la piel.',
    benefits: [
      'Limpia eficazmente sin provocar sensación de tirantez',
      'Controla el exceso de oleosidad respetando la hidratación',
      'Sin sulfatos abrasivos, parabenos ni perfumes',
      'Apto para uso diario en rostro, ojos y cuello'
    ],
    howToUse: 'Masajear sobre el rostro humedecido durante 60 segundos y enjuagar con agua tibia.',
    stock: 70,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'h2d-008',
    brand: 'H2Derm',
    sku: 'H2D-CICA-008',
    name: 'H2Derm - Bálsamo Cicatrizante Post-Tratamiento Cica-Repair',
    tagline: 'Centella Asiática Pura, Madecassoside y Cobre-Zinc',
    category: 'Cremas',
    price: 22900,
    originalPrice: 28000,
    discountPercentage: 18,
    rating: 5.0,
    reviewsCount: 129,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['Cica Repair', 'Post-Peeling & Láser', 'Regenerador'],
    description: 'Fórmula de rescate dermatológico que acelera la regeneración epidérmica en pieles lesionadas, agrietadas o sometidas a peelings, láser y microdermoabrasión.',
    benefits: [
      'Acelera hasta 3 veces la regeneración del tejido epitelial',
      'Crea una película protectora aislante antibacteriana',
      'Calma irritaciones severas y ardor al instante',
      'Hipoalergénico y testado en pieles reactivas'
    ],
    howToUse: 'Aplicar 2 veces al día sobre las zonas secas o agredidas con suave masaje protector.',
    stock: 40,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'h2d-009',
    brand: 'H2Derm',
    sku: 'H2D-BRUM-009',
    name: 'H2Derm - Bruma Termal Descongestiva Calming Mist',
    tagline: 'Agua Termal Enriquecida con Ectoína & Manzanilla Orgánica',
    category: 'Limpieza',
    price: 17500,
    originalPrice: 21900,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 115,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'
    ],
    badges: ['Agua Termal', 'Anti-Polución', 'Efecto Refrescante'],
    description: 'Bruma micro-pulverizada rica en oligoelementos minerales y ectoína protectora celular. Fija el maquillaje, hidrata a demanda y refresca la piel durante todo el día.',
    benefits: [
      'Alivio térmico inmediato para pieles acaloradas o con rubor',
      'Protege contra el estrés ambiental y el aire acondicionado',
      'Microdifusión ultrafina que no humedece en exceso el maquillaje',
      'Sensación de frescura y calma en cualquier momento del día'
    ],
    howToUse: 'Pulverizar a 20 cm del rostro con los ojos cerrados. Dejar secar al aire.',
    stock: 65,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'h2d-010',
    brand: 'H2Derm',
    sku: 'H2D-PACK-010',
    name: 'H2Derm - Set Protocolo Clínico Renovación Facial Completa',
    tagline: 'Pack Estrella: Serum Hialurónico 3D + Barrier Cream + Niacinamida 10% + Protector Solar',
    category: 'Packs',
    price: 79900,
    originalPrice: 112000,
    discountPercentage: 29,
    rating: 5.0,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['Pack Estrella H2Derm', 'Ahorro 29%', 'Envío Gratis'],
    description: 'La experiencia clínica más completa de H2Derm. El protocolo dermocosmético definitivo que incluye los 4 pasos clave para transformar la salud, densidad y brillo de la piel con un descuento exclusivo.',
    benefits: [
      'Rutina dermatológica completa para mañana y noche',
      'Incluye neceser térmico de laboratorio de edición limitada',
      'Ahorro de más de $32.000 comprando el protocolo completo',
      'Envío prioritario bonificado a todo el país'
    ],
    howToUse: 'Día: Limpieza + Niacinamida + Barrier Cream + FPS 50. Noche: Limpieza + Serum Hialurónico 3D + Barrier Cream.',
    stock: 30,
    featured: true,
    motherDaySpecial: true
  },

  // ==========================================
  // MARCA 2: LUMÉA (RUTINA FACIAL BOTÁNICA - 10 PRODUCTOS)
  // Preservando los 6 productos creados por el usuario
  // ==========================================
  {
    id: 'prod-1',
    brand: 'LUMÉA',
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
    description: 'La crema hidratante facial insigne de LUMÉA. Formulada con una matriz trifásica de Ácido Hialurónico de alto y bajo peso molecular junto a tres ceramidas esenciales que sellan la humedad natural de la piel. Repara la barrera cutánea sin dejar rastro graso ni comedogénico.',
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
    brand: 'LUMÉA',
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
    description: 'El elixir concentrado de LUMÉA que devuelve la vitalidad y luz al rostro opaco o cansado. Su potente sinergia de Vitamina C estabilizada al 12% junto a Ácido Ferúlico neutraliza el daño de la radiación y polución urbana, reduciendo manchitas y emparejando el tono de la piel.',
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
    brand: 'LUMÉA',
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
    brand: 'LUMÉA',
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
    brand: 'LUMÉA',
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
    brand: 'LUMÉA',
    sku: 'LUM-PACK-006',
    name: 'Set Rutina Facial Completa Día de la Madre LUMÉA 5-en-1',
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
    description: 'El regalo definitivo para consentir a mamá en su día con una experiencia de spa facial en casa. Contiene los 5 pasos esenciales del cuidado del rostro LUMÉA: Agua Micelar + Gel Limpiador + Serum Vitamina C + Contorno de Ojos + Crema Hidratante 72H.',
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
    brand: 'LUMÉA',
    sku: 'LUM-PEEL-007',
    name: 'LUMÉA - Peeling Enzimático Exfoliante Frutos Rojos & Papaya',
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
    brand: 'LUMÉA',
    sku: 'LUM-ACID-008',
    name: 'LUMÉA - Elixir Facial Escualano Vegetal & Rosa Mosqueta Pura',
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
    brand: 'LUMÉA',
    sku: 'LUM-MASC-009',
    name: 'LUMÉA - Máscara Facial Nocturna Hidrogel Colágeno Puro',
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
    brand: 'LUMÉA',
    sku: 'LUM-MIST-010',
    name: 'LUMÉA - Bruma Facial Refrescante con Agua de Rosas & Niacinamida',
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
  },

  // ==========================================
  // MARCA 3: MIMITOS (LÍNEA BEBÉS & NIÑOS - 10 PRODUCTOS)
  // Fórmulas ultrasuaves, hipoalergénicas y pediátricas
  // ==========================================
  {
    id: 'mim-001',
    brand: 'Mimitos',
    sku: 'MIM-OLEO-001',
    name: 'Mimitos - Óleo Calcáreo Natural con Manzanilla & Caléndula',
    tagline: 'Emulsión limpiadora para cada cambio de pañal con cera virgen de abejas',
    category: 'Bebés/Kids',
    price: 13900,
    originalPrice: 17500,
    discountPercentage: 20,
    rating: 5.0,
    reviewsCount: 176,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80'
    ],
    badges: ['Hipoalergénico', 'Pediátrico', 'Sin Parabenos'],
    description: 'El clásico infaltable para el cuidado del bebé. Formulado con agua de cal y aceites emolientes naturales que neutralizan la acidez de la orina y protegen la piel de la zona del pañal.',
    benefits: [
      'Limpia con suavidad sin necesidad de enjuague',
      'Previene paspaduras y rojeces por roce del pañal',
      'Calma irritaciones con caléndula orgánica',
      'Fórmula 100% libre de alcohol, colorantes y fragancias fuertes'
    ],
    howToUse: 'Agitar antes de usar. Aplicar con un algodón sobre la zona del pañal en cada cambio.',
    stock: 90,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'mim-002',
    brand: 'Mimitos',
    sku: 'MIM-PASP-002',
    name: 'Mimitos - Crema Protectora Anti-Raspaduras con Óxido de Zinc 15%',
    tagline: 'Barrera impermeable de alivio inmediato contra dermatitis del pañal',
    category: 'Bebés/Kids',
    price: 14500,
    originalPrice: 18000,
    discountPercentage: 19,
    rating: 4.9,
    reviewsCount: 143,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80'
    ],
    badges: ['Óxido de Zinc 15%', 'Alivio Rápido', 'Test Dermatológico'],
    description: 'Pomada densa protectora con alta concentración de óxido de zinc y pantenol. Forma un escudo protector contra la humedad y alivia el ardor desde la primera aplicación.',
    benefits: [
      'Alivia el enrojecimiento y la paspadura en horas',
      'Crea una barrera transpirable e impermeable',
      'Fácil de extender y limpiar'
    ],
    howToUse: 'Aplicar una capa generosa sobre la piel limpia y seca en cada cambio de pañal, especialmente antes de dormir.',
    stock: 80,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'mim-003',
    brand: 'Mimitos',
    sku: 'MIM-SHAM-003',
    name: 'Mimitos - Shampoo Suave Sin Lágrimas con Extracto de Avena',
    tagline: 'Cabello suave, brillante y cuero cabelludo protegido sin irritar los ojitos',
    category: 'Bebés/Kids',
    price: 12900,
    originalPrice: 16000,
    discountPercentage: 19,
    rating: 4.9,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80'
    ],
    badges: ['Sin Lágrimas', 'Extracto de Avena', 'Oftalmológico'],
    description: 'Shampoo ultradelicado diseñado para el baño diario del bebé. Su espuma ligera limpia con ternura sin arder en los ojos y desenreda el cabello fino sin tirones.',
    benefits: [
      'Comprobado oftalmológicamente: no pica ni irrita los ojos',
      'Aroma sutil y reconfortante',
      'Deja el cabello brillante, sedoso y fácil de peinar'
    ],
    howToUse: 'Aplicar sobre el cabello húmedo del bebé, masajear suavemente hasta formar espuma y enjuagar con abundante agua tibia.',
    stock: 75,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'mim-004',
    brand: 'Mimitos',
    sku: 'MIM-ESP-004',
    name: 'Mimitos - Baño de Espuma Relajante Dulces Sueños Lavanda',
    tagline: 'Vapor reconfortante con lavanda y manzanilla para inducir un sueño reparador',
    category: 'Bebés/Kids',
    price: 13500,
    originalPrice: 17000,
    discountPercentage: 20,
    rating: 5.0,
    reviewsCount: 156,
    image: 'https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80'
    ],
    badges: ['Aroma Lavanda', 'Dulces Sueños', 'Espuma Sedosa'],
    description: 'Baño de inmersión relajante formulado para la rutina previa al descanso nocturno. Sus vapores de lavanda y manzanilla calman al bebé y preparan su cuerpo para dormir plácidamente.',
    benefits: [
      'Ayuda a calmar el llanto y la sobreexcitación del día',
      'Genera burbujas suaves y cremosas que cuidan la piel',
      'No altera el pH natural del bebé'
    ],
    howToUse: 'Verter dos tapitas directamente bajo el chorro de agua tibia de la bañadera para crear abundante espuma.',
    stock: 65,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'mim-005',
    brand: 'Mimitos',
    sku: 'MIM-COLO-005',
    name: 'Mimitos - Colonia Infantil Sin Alcohol Flores de Azahar & Vainilla',
    tagline: 'Fragancia fresca, tierna y segura para la ropita y la piel del bebé',
    category: 'Bebés/Kids',
    price: 14900,
    originalPrice: 18500,
    discountPercentage: 19,
    rating: 4.9,
    reviewsCount: 184,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80'
    ],
    badges: ['0% Alcohol', 'Aroma Tradicional', 'No Mancha'],
    description: 'La inconfundible colonia de bebé Mimitos formulada sin alcohol. Un aroma tierno a flores de azahar, toques cítricos suaves y fondo empolvado que dura horas en su ropita.',
    benefits: [
      'Fórmula base acuosa que no reseca ni irrita la piel',
      'Aroma adorable que acompaña los recuerdos de la infancia',
      'No mancha prendas de algodón ni sábanas'
    ],
    howToUse: 'Vaporizar suavemente sobre las manitos de mamá para perfumar la cabecita del bebé o directamente sobre su ropita.',
    stock: 90,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'mim-006',
    brand: 'Mimitos',
    sku: 'MIM-EMUL-006',
    name: 'Mimitos - Emulsión Hidratante Corporal Extra Suave con Karité',
    tagline: 'Humectación ligera 24h con Aceite de Almendras Dulces y Karité',
    category: 'Bebés/Kids',
    price: 15500,
    originalPrice: 19500,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80'
    ],
    badges: ['Almendras Dulces', 'Rápida Absorción', 'Nutrición Diaria'],
    description: 'Loción corporal de absorción instantánea para después del baño. Protege la barrera cutánea inmadura del recién nacido y previene la piel seca o descamada.',
    benefits: [
      'Hidrata sin dejar sensación pegajosa',
      'Fortalece la piel ante cambios de clima y roces',
      'Ideal para aplicar luego del baño con caricias relajantes'
    ],
    howToUse: 'Distribuir con suaves masajes por todo el cuerpito del bebé luego de secarlo con la toalla.',
    stock: 70,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'mim-007',
    brand: 'Mimitos',
    sku: 'MIM-JABO-007',
    name: 'Mimitos - Jabón Líquido Cremoso Cabeza a Pies pH Neutro',
    tagline: 'Limpieza integral para cuerpo y cabello en un solo paso fácil',
    category: 'Bebés/Kids',
    price: 12500,
    originalPrice: 15500,
    discountPercentage: 19,
    rating: 4.9,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80'
    ],
    badges: ['2 en 1', 'Cuerpo & Cabello', 'Dermatológico'],
    description: 'Fórmula versátil con dosificador que facilita el baño del bebé. Limpia el cuero cabelludo y el cuerpo entero respetando la delicadeza de su piel recién nacida.',
    benefits: [
      'Dosificador con bomba fácil de usar con una sola mano',
      'Espuma cremosa y rendidora',
      'Sin colorantes ni sulfatos pesados'
    ],
    howToUse: 'Colocar una pequeña cantidad en una esponja suave o en la mano y lavar suavemente al bebé de la cabeza a los pies.',
    stock: 85,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'mim-008',
    brand: 'Mimitos',
    sku: 'MIM-ACEI-008',
    name: 'Mimitos - Aceite de Masajes Shantala con Caléndula Pura',
    tagline: 'Nutrición pura para aliviar cólicos y conectar con el bebé a través del tacto',
    category: 'Bebés/Kids',
    price: 16500,
    originalPrice: 20500,
    discountPercentage: 20,
    rating: 5.0,
    reviewsCount: 134,
    image: 'https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80'
    ],
    badges: ['Masajes Shantala', 'Alivia Cólicos', 'Aceite Vegetal Puro'],
    description: 'Aceite 100% vegetal macerado con flores de caléndula y manzanilla. Perfecto para masajes relajantes Shantala en la pancita para calmar cólicos y gases.',
    benefits: [
      'Deslizamiento suave que no satura la piel',
      'Alivia la tensión abdominal y favorece la digestión del bebé',
      'Excelente también para remover suavemente la costra láctea'
    ],
    howToUse: 'Entibiar unas gotas frotando las palmas de las manos y realizar masajes circulares en sentido horario en la pancita.',
    stock: 50,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'mim-009',
    brand: 'Mimitos',
    sku: 'MIM-MEJI-009',
    name: 'Mimitos - Bálsamo Protector Labios y Mejillas Antifrío & Saliva',
    tagline: 'Stick nutritivo con manteca de cacao y caléndula para caritas expuestas',
    category: 'Bebés/Kids',
    price: 11900,
    originalPrice: 14900,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80'
    ],
    badges: ['Anti-Viento', 'Para Dientes & Saliva', 'En Barra'],
    description: 'Stick protector ultra práctico para llevar en la pañalera. Protege las mejillas y labios del bebé contra la irritación provocada por la baba en época de dentición y el frío invernal.',
    benefits: [
      'Formato stick fácil de aplicar sin ensuciar los dedos',
      'Protege contra el viento y la resequedad por frío',
      'Ingredientes 100% de grado alimenticio seguros para el bebé'
    ],
    howToUse: 'Deslizar sobre labios y mejillas antes de salir al exterior o cuando haya salivación abundante.',
    stock: 60,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'mim-010',
    brand: 'Mimitos',
    sku: 'MIM-PACK-010',
    name: 'Mimitos - Set Bienvenida al Mundo Canastita de Cuidados',
    tagline: 'Kit de Regalo Recién Nacido: Óleo + Crema Paspaduras + Shampoo + Colonia + Jabón',
    category: 'Packs',
    price: 59900,
    originalPrice: 78000,
    discountPercentage: 23,
    rating: 5.0,
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
    ],
    badges: ['Regalo Nacimiento', 'Canastita Completa', 'Ahorro 23%'],
    description: 'El obsequio soñado para baby showers y recién nacidos. Incluye los 5 productos indispensables para el cuidado diario del bebé en una hermosa presentación de tela.',
    benefits: [
      'Contiene todo lo que una mamá necesita desde el primer día en la clínica',
      'Productos testeados pediátrica y dermatológicamente',
      'Excelente relación precio-calidad con más de $18.000 de ahorro'
    ],
    howToUse: 'Ideal para colocar en la cómoda del cambiador y tener cada esencial al alcance de la mano.',
    stock: 40,
    featured: true,
    motherDaySpecial: true
  },

  // ==========================================
  // MARCA 4: SOFTCARE (NUTRICIÓN CORPORAL & BIENESTAR - 10 PRODUCTOS)
  // Emulsiones fundentes, mantecas y exfoliantes
  // ==========================================
  {
    id: 'sfc-001',
    brand: 'SoftCare',
    sku: 'SFC-KARI-001',
    name: 'SoftCare - Emulsión Corporal Ultrahidratante Manteca de Karité & Vainilla',
    tagline: 'Nutrición profunda 48h con Karité Puro y Aceite de Coco Virgen',
    category: 'Corporal',
    price: 18900,
    originalPrice: 23500,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 165,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'
    ],
    badges: ['Karité Africano', '48h Hidratación', 'Piel Seca'],
    description: 'Emulsión corporal rica pero de rápida absorción que rescata las pieles más secas y tirantes. Su exquisito aroma cálido a vainilla y notas de coco brinda una experiencia de confort total.',
    benefits: [
      'Nutre intensamente codos, rodillas y piernas resecas',
      'Restaura la elasticidad y sedosidad de la piel al instante',
      'Textura envolvente que no mancha la ropa'
    ],
    howToUse: 'Aplicar diariamente luego de la ducha con masajes circulares por todo el cuerpo.',
    stock: 75,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'sfc-002',
    brand: 'SoftCare',
    sku: 'SFC-MANO-002',
    name: 'SoftCare - Crema Reparadora de Manos & Uñas con Urea 10%',
    tagline: 'Efecto guante protector contra resequedad, alcohol en gel y frío',
    category: 'Corporal',
    price: 12900,
    originalPrice: 16000,
    discountPercentage: 19,
    rating: 5.0,
    reviewsCount: 188,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['Urea 10%', 'Efecto Guante', 'Fortalece Uñas'],
    description: 'Fórmula concentrada con urea al 10% y alantoína que repara grietas, asperezas y cutículas secas en las manos expuestas a lavados constantes o químicos.',
    benefits: [
      'Alivio inmediato para manos ásperas y agrietadas',
      'Absorción rápida sin dejar sensación pegajosa en teclados o celulares',
      'Fortalece las uñas quebradizas'
    ],
    howToUse: 'Masajear una pequeña cantidad en manos, dedos y cutículas varias veces al día.',
    stock: 85,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'sfc-003',
    brand: 'SoftCare',
    sku: 'SFC-EXFO-003',
    name: 'SoftCare - Exfoliante Corporal Pulidor Café Arábica & Aceite de Coco',
    tagline: 'Remueve células muertas, activa la microcirculación y combate la celulitis',
    category: 'Corporal',
    price: 17900,
    originalPrice: 22500,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['Café Arábica', 'Anti-Celulitis', 'Piel de Seda'],
    description: 'Exfoliante revitalizante con granos de café arábica molido, azúcar moreno y aceite de coco virgen. Estimula la circulación linfática y deja la piel aterciopelada y tonificada.',
    benefits: [
      'Suaviza la textura de la piel desde la primera ducha',
      'Ayuda a reducir la apariencia de piel de naranja',
      'Previene vellos encarnados en piernas y zona de bikini'
    ],
    howToUse: 'Frotar con movimientos circulares en la ducha sobre muslos, glúteos y brazos durante 3 minutos. Enjuagar.',
    stock: 55,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'sfc-004',
    brand: 'SoftCare',
    sku: 'SFC-CRIO-004',
    name: 'SoftCare - Gel Criogénico Reafirmante con Centella & Mentol',
    tagline: 'Efecto frío tonificante para piernas cansadas, drenaje y reducción',
    category: 'Corporal',
    price: 19500,
    originalPrice: 24500,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 120,
    image: 'https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
    ],
    badges: ['Efecto Frío', 'Piernas Ligeras', 'Centella Asiática'],
    description: 'Gel lipo-reductor y descongestivo con mentol puro y extracto de centella asiática. Produce un enfriamiento controlado que estimula la vasoconstricción y el retorno venoso.',
    benefits: [
      'Alivio express para piernas pesadas al final del día',
      'Tonifica y reafirma la zona abdominal y muslos',
      'Sensación helada revitalizante'
    ],
    howToUse: 'Aplicar con masajes enérgicos ascendentes desde los tobillos hasta la cadera. No enjuagar.',
    stock: 60,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'sfc-005',
    brand: 'SoftCare',
    sku: 'SFC-COLA-005',
    name: 'SoftCare - Loción Corporal Reafirmante Colágeno & Elastina',
    tagline: 'Elasticidad y tersura para devolver la turgencia a la piel del cuerpo',
    category: 'Corporal',
    price: 18500,
    originalPrice: 23000,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 135,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['Colágeno Puro', 'Firmeza Corporal', 'Anti-Estrías'],
    description: 'Emulsión fluida enriquecida con colágeno hidrolizado, elastina y vitamina E. Especialmente recomendada para prevenir la flacidez dérmica y mejorar la tonicidad.',
    benefits: [
      'Mejora notablemente la firmeza y elasticidad corporal',
      'Ayuda a prevenir y atenuar estrías recientes',
      'Textura ligera y perfume limpio y elegante'
    ],
    howToUse: 'Aplicar por la mañana y noche con masajes circulares en abdomen, brazos y piernas.',
    stock: 65,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'sfc-006',
    brand: 'SoftCare',
    sku: 'SFC-BATT-006',
    name: 'SoftCare - Manteca Corporal Batida Soufflé Karité & Almendras',
    tagline: 'Textura mousse fundente ultra nutritiva para un ritual de spa en casa',
    category: 'Corporal',
    price: 21900,
    originalPrice: 27000,
    discountPercentage: 19,
    rating: 5.0,
    reviewsCount: 172,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80'
    ],
    badges: ['Textura Soufflé', 'Spa en Casa', 'Edición Lujo'],
    description: 'Nuestra manteca corporal batida como un merengue cremoso. Al contacto con la piel se transforma en un aceite sedoso que penetra hasta las capas más secas sin dejar pesadez.',
    benefits: [
      'Experiencia sensorial inigualable de suavidad',
      'Fragancia sutil a flores de almendro que perdura todo el día',
      'Cura talones secos, codos ásperos y cutículas'
    ],
    howToUse: 'Tomar una nuez de manteca, calentar entre las palmas y masajear generosamente.',
    stock: 45,
    featured: true,
    motherDaySpecial: true
  },
  {
    id: 'sfc-007',
    brand: 'SoftCare',
    sku: 'SFC-PIES-007',
    name: 'SoftCare - Crema Regeneradora para Talones y Pies Secos con Ácido Láctico',
    tagline: 'Disuelve durezas, repara grietas y refresca con Aceite de Árbol de Té y Menta',
    category: 'Corporal',
    price: 13900,
    originalPrice: 17500,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 114,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['Pies Suaves', 'Ácido Láctico', 'Efecto Fresco'],
    description: 'Tratamiento intensivo para talones agrietados y plantas de pies resecas. Combina ácido láctico exfoliante suave y aceite de árbol de té purificante.',
    benefits: [
      'Transforma talones ásperos en piel suave en 7 noches',
      'Efecto desodorante y refrescante con aroma a menta piperita',
      'Alivia la pesadez en las plantas de los pies'
    ],
    howToUse: 'Aplicar por la noche sobre los pies limpios y colocarse medias de algodón para potenciar el efecto.',
    stock: 70,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'sfc-008',
    brand: 'SoftCare',
    sku: 'SFC-SHIM-008',
    name: 'SoftCare - Aceite Seco Iluminador Shimmer Dorado Coco & Jojoba',
    tagline: 'Partículas minerales doradas que realzan el bronceado y perfuman la piel',
    category: 'Corporal',
    price: 22500,
    originalPrice: 28000,
    discountPercentage: 20,
    rating: 5.0,
    reviewsCount: 158,
    image: 'https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'
    ],
    badges: ['Glow Dorado', 'Aceite Seco', 'No Graso'],
    description: 'Aceite corporal embellecedor con micro-micas de oro mineral. Aporta un destello sutil y elegante en clavículas, hombros y piernas, resaltando el tono dorado natural de la piel.',
    benefits: [
      'Efecto glow resplandeciente sin sensación aceitosa',
      'No mancha la ropa ni transfiere brillantina gruesa',
      'Nutre con aceites de jojoba y almendras dulces'
    ],
    howToUse: 'Agitar enérgicamente antes de usar y extender con las manos en escote, hombros y piernas.',
    stock: 50,
    featured: true,
    motherDaySpecial: true
  },
  {
    id: 'sfc-009',
    brand: 'SoftCare',
    sku: 'SFC-SPLA-009',
    name: 'SoftCare - Bruma Corporal Refrescante Body Splash Flores Blancas & Pera',
    tagline: 'Fragancia chispeante, limpia y fresca para perfumar el cuerpo todo el día',
    category: 'Corporal',
    price: 14500,
    originalPrice: 18000,
    discountPercentage: 19,
    rating: 4.8,
    reviewsCount: 126,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80'
    ],
    badges: ['Body Splash', 'Aroma Fresco', 'Larga Duración'],
    description: 'Splash perfumado de notas florales blancas, jazmín y pera verde jugosa. Una explosión de frescura para vaporizar generosamente luego del baño o antes de salir.',
    benefits: [
      'Sensación de frescura revitalizante instantánea',
      'Formulado con aloe vera hidratante',
      'Ideal para reaplicar a lo largo del día'
    ],
    howToUse: 'Vaporizar a 15 cm sobre cuello, muñecas y todo el cuerpo.',
    stock: 80,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'sfc-010',
    brand: 'SoftCare',
    sku: 'SFC-PACK-010',
    name: 'SoftCare - Set Spa Corporal Completo Nutrición Profunda 4-en-1',
    tagline: 'Kit Spa: Manteca Batida + Exfoliante de Café + Crema de Manos + Shimmer Dorado',
    category: 'Packs',
    price: 64900,
    originalPrice: 85000,
    discountPercentage: 24,
    rating: 5.0,
    reviewsCount: 195,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'
    ],
    badges: ['Set Spa de Lujo', 'Ahorro 24%', 'Regalo Perfecto'],
    description: 'El set definitivo para transformar tu baño diario en un auténtico spa cinco estrellas. Incluye los 4 favoritos de SoftCare para renovar, nutrir, proteger e iluminar la piel del cuerpo.',
    benefits: [
      'Ritual corporal completo de 4 pasos de bienestar',
      'Caja de presentación premium lista para regalo',
      'Ahorro de más de $20.000 comprando el pack'
    ],
    howToUse: 'Paso 1: Exfoliar en la ducha. Paso 2: Nutrir con Manteca Batida. Paso 3: Proteger manos. Paso 4: Iluminar con Shimmer.',
    stock: 35,
    featured: true,
    motherDaySpecial: true
  },

  // ==========================================
  // MARCA 5: LE SALON (ALTA COSMÉTICA CAPILAR PROFESIONAL - 10 PRODUCTOS)
  // Fórmulas de peluquería, keratina, botox y nutrición
  // ==========================================
  {
    id: 'les-001',
    brand: 'Le Salon',
    sku: 'LES-MASC-001',
    name: 'Le Salon - Máscara Nutrición Intensiva Keratina Biomimética & Argán',
    tagline: 'Reparación de la fibra capilar dañada, decolorada o con frizz extremo',
    category: 'Capilar',
    price: 24900,
    originalPrice: 31000,
    discountPercentage: 20,
    rating: 5.0,
    reviewsCount: 224,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['Keratina Pura', 'Línea Salón', 'Reparación Total'],
    description: 'Tratamiento profesional de peluquería que rellena las fisuras de la cutícula dañada por tinturas, planchita y decoloración. Devuelve la resistencia mecánica, el brillo y la suavidad original al cabello.',
    benefits: [
      'Rellena la fibra capilar desde el interior en 10 minutos',
      'Elimina el frizz y sella la cutícula abierta',
      'No deja el cabello pesado ni grasoso'
    ],
    howToUse: 'Aplicar sobre largos y puntas escurridos luego del shampoo. Masajear mechón por mechón, dejar actuar 10 minutos y enjuagar.',
    stock: 70,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'les-002',
    brand: 'Le Salon',
    sku: 'LES-PUNT-002',
    name: 'Le Salon - Serum Reparador Sellador de Puntas Aceite de Argán & Macadamia',
    tagline: 'Blindaje anti-quiebre, suavidad de seda y brillo espejo sin peso',
    category: 'Capilar',
    price: 18900,
    originalPrice: 23500,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 198,
    image: 'https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'
    ],
    badges: ['Puntas Abiertas', 'Brillo Espejo', 'Toque Seco'],
    description: 'Elixir capilar toque seco concentrado en aceites nobles de argán marroquí y macadamia. Sella puntas florecidas y aporta un brillo deslumbrante al peinado.',
    benefits: [
      'Sella instantáneamente las puntas abiertas y resecas',
      'Protege contra el calor de secadores y planchas',
      'Controla pelos rebeldes con acabado no graso'
    ],
    howToUse: 'Frotar 2 a 3 gotas en las palmas y distribuir de medios a puntas sobre cabello húmedo o seco.',
    stock: 80,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'les-003',
    brand: 'Le Salon',
    sku: 'LES-BOTO-003',
    name: 'Le Salon - Tratamiento Botox Capilar Efecto Lifting Sin Formol',
    tagline: 'Relleno de masa capilar con Ácido Hialurónico y Colágeno para cabellos finos',
    category: 'Capilar',
    price: 27900,
    originalPrice: 35000,
    discountPercentage: 20,
    rating: 5.0,
    reviewsCount: 186,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80'
    ],
    badges: ['Sin Formol', 'Efecto Botox', 'Alineación Térmica'],
    description: 'Tratamiento premium termo-activo libre de químicos tóxicos ni formol. Rejuvenece la hebra capilar devolviendo densidad, cuerpo y un alineamiento suave y disciplinado.',
    benefits: [
      '100% libre de formol, vapores molestos o picazón',
      'Aporta cuerpo a cabellos afinados o envejecidos',
      'Facilita el peinado reduciendo el tiempo de secado a la mitad'
    ],
    howToUse: 'Lavar con shampoo neutro, aplicar mecha a mecha, reposar 20 minutos, enjuagar al 80% y secar con secador activando el calor.',
    stock: 50,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'les-004',
    brand: 'Le Salon',
    sku: 'LES-MATI-004',
    name: 'Le Salon - Shampoo Matizador Violeta Anti-Amarillo Cabellos Rubios & Canas',
    tagline: 'Neutraliza tonos cobrizos y anaranjados para rubios platinados y grises luminosos',
    category: 'Capilar',
    price: 19500,
    originalPrice: 24000,
    discountPercentage: 19,
    rating: 4.9,
    reviewsCount: 172,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80'
    ],
    badges: ['Anti-Amarillo', 'Rubios & Canas', 'Pigmento Violeta'],
    description: 'Shampoo con micropigmentos violetas puros que neutralizan los reflejos amarillos indeseados en cabellos decolorados, con mechas o canas naturales, sin resecar.',
    benefits: [
      'Mantiene el rubio frío y cenizo como recién salido de la peluquería',
      'Realza el brillo plateado de las canas',
      'Fórmula hidratante que no deja el pelo duro'
    ],
    howToUse: 'Masajear sobre cabello mojado, dejar actuar entre 3 y 5 minutos según la intensidad deseada y enjuagar bien.',
    stock: 65,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'les-005',
    brand: 'Le Salon',
    sku: 'LES-TERM-005',
    name: 'Le Salon - Protector Térmico & Escudo Anti-Humedad Termo-Activo 230°C',
    tagline: 'Blindaje térmico contra calor de planchita y secador con filtro UV',
    category: 'Capilar',
    price: 17500,
    originalPrice: 22000,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 160,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['Protección 230°C', 'Anti-Frizz 72h', 'Filtro UV'],
    description: 'Spray ligero bifásico que crea una barrera invisible protegiendo la cutícula del impacto térmico extremo de planchitas y secadores hasta 230°C. Repele la humedad ambiental.',
    benefits: [
      'Evita que el calor queme la fibra capilar',
      'Mantiene el lacio o las ondas intactas en días lluviosos',
      'Aporta sedosidad y brillo reluciente'
    ],
    howToUse: 'Rociar uniformemente sobre cabello húmedo o seco antes de usar herramientas de calor.',
    stock: 75,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'les-006',
    brand: 'Le Salon',
    sku: 'LES-AMPO-006',
    name: 'Le Salon - Ampollas Concentradas Shock de Brillo y Fuerza (Caja x 6)',
    tagline: 'Dosis intensiva de aminoácidos y caviar botánico para rescate capilar en 3 min',
    category: 'Capilar',
    price: 21900,
    originalPrice: 27500,
    discountPercentage: 20,
    rating: 5.0,
    reviewsCount: 145,
    image: 'https://images.unsplash.com/photo-1512290900672-1f0236a00dfb?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80'
    ],
    badges: ['Shock en 3 Minutos', 'Caja x 6 Unidades', 'Efecto Espejo'],
    description: 'Tratamiento en monodosis ultra concentradas. Al emulsionar con agua tibia genera una crema tibia que repara el cabello dañado en tiempo récord.',
    benefits: [
      'Rescate inmediato para cabellos quebradizos o elásticos',
      'Transformación visible desde la primera ampolla',
      'Caja con 6 ampollas para 6 semanas de tratamiento'
    ],
    howToUse: 'Disolver el contenido de una ampolla en 3 partes de agua tibia hasta lograr crema, aplicar en largos, reposar 3 minutos y enjuagar.',
    stock: 50,
    featured: false,
    motherDaySpecial: true
  },
  {
    id: 'les-007',
    brand: 'Le Salon',
    sku: 'LES-SHDE-007',
    name: 'Le Salon - Shampoo Purificante Detox Cuero Cabelludo con Ácido Salicílico',
    tagline: 'Limpia residuos de fijadores, controla gratitud y remueve escamas',
    category: 'Capilar',
    price: 16900,
    originalPrice: 21000,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
    ],
    badges: ['Detox Capilar', 'Ácido Salicílico', 'Raíces Limpias'],
    description: 'Shampoo micelar desintoxicante que oxigena el folículo piloso, purificando el cuero cabelludo de siliconas acumuladas, exceso de sebo y contaminación.',
    benefits: [
      'Mantiene el cabello limpio y liviano por más tiempo',
      'Despega las raíces aportando volumen natural',
      'Calma picazón y descamaciones'
    ],
    howToUse: 'Usar 1 a 2 veces por semana alternando con tu shampoo habitual.',
    stock: 60,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'les-008',
    brand: 'Le Salon',
    sku: 'LES-ACON-008',
    name: 'Le Salon - Acondicionador Hidratación Ácida Sellador pH 3.5',
    tagline: 'Cierra las cutículas, prolonga el color de la tintura y desenreda al instante',
    category: 'Capilar',
    price: 17500,
    originalPrice: 21500,
    discountPercentage: 19,
    rating: 4.9,
    reviewsCount: 130,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['pH Ácido 3.5', 'Post-Coloración', 'Desenredo Fácil'],
    description: 'Acondicionador post-técnico formulado con pH ácido para restablecer el equilibrio luego de procesos de coloración y alisados. Sella la cutícula evitando que se fugue el pigmento.',
    benefits: [
      'Prolonga la duración y brillo de tu coloración',
      'Desenreda sin tirones en 60 segundos',
      'Sensación de suavidad extrema al tacto'
    ],
    howToUse: 'Aplicar de medios a puntas luego del shampoo, dejar actuar 1 minuto y enjuagar.',
    stock: 70,
    featured: false,
    motherDaySpecial: false
  },
  {
    id: 'les-009',
    brand: 'Le Salon',
    sku: 'LES-RIZO-009',
    name: 'Le Salon - Crema para Peinar Rizos Definidos con Manteca de Mango',
    tagline: 'Definición elástica, hidratación sin efecto acartonado y memoria de rulo',
    category: 'Capilar',
    price: 18900,
    originalPrice: 23500,
    discountPercentage: 20,
    rating: 5.0,
    reviewsCount: 168,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'
    ],
    badges: ['Método Curly', 'Manteca de Mango', 'Rulos Definidos'],
    description: 'Crema definidora apta método curly libre de sulfatos pesados, siliconas insolubles y parabenos. Aporta elasticidad, hidratación y definición sin dejar durezas.',
    benefits: [
      'Rizos flexibles, con movimiento y sin frizz',
      'Memoria de rulo que dura hasta 3 días',
      'Nutre profundamente la hebra capilar con manteca de mango'
    ],
    howToUse: 'Aplicar con técnica de scrunch sobre cabello húmedo seccionado y dejar secar al aire o con difusor.',
    stock: 55,
    featured: true,
    motherDaySpecial: false
  },
  {
    id: 'les-010',
    brand: 'Le Salon',
    sku: 'LES-PACK-010',
    name: 'Le Salon - Set Profesional de Reconstrucción Capilar 3 Pasos',
    tagline: 'Kit Salón: Shampoo Keratina + Máscara Nutrición Biomimética + Serum Sellador de Puntas',
    category: 'Packs',
    price: 61900,
    originalPrice: 82000,
    discountPercentage: 25,
    rating: 5.0,
    reviewsCount: 240,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ],
    badges: ['Tratamiento Completo', 'Ahorro 25%', 'Calidad Profesional'],
    description: 'El trío indispensable de Le Salon para transformar cabellos secos o castigados en una melena de revista. Resultados de salón desde la primera aplicación en casa.',
    benefits: [
      'Los 3 pasos esenciales de nutrición, blindaje y sellado',
      'Ahorro del 25% respecto a los productos individuales',
      'Regalo ideal con presentación de alta cosmética'
    ],
    howToUse: 'Paso 1: Lavar con Shampoo. Paso 2: Tratar 10 minutos con Máscara. Paso 3: Sellar con 2 gotas de Serum.',
    stock: 40,
    featured: true,
    motherDaySpecial: true
  }
];

export const INITIAL_SLIDES: CarouselSlide[] = [
  {
    id: 'slide-1',
    title: 'H2Derm • Dermocosmética Clínica Avanzada',
    subtitle: 'Nuestra línea estrella de alta concentración: Ácido Hialurónico Biomimético, Niacinamida 10% y Fórmulas Reparadoras',
    highlightText: '⭐ Lanzamiento Exclusivo | Resultados Visibles Desde la 1ª Aplicación',
    badge: 'LÍNEA ESTRELLA 2026',
    buttonText: 'Ver Productos H2Derm',
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
  storeName: 'LUMÉA Laboratorio Cosmético',
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
  mothersDayPromoDiscount: 'Packs de regalo con 30% OFF ',
  freeShippingThreshold: 25000,
  adminPin: 'lumeanosotros',
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
  footerAbout: 'Laboratorio de alta cosmética y catálogo multimarca: H2Derm, LUMÉA, Mimitos, SoftCare y Le Salon. Fórmulas dermatológicas desarrolladas en Argentina con los más altos estándares de pureza y biotecnología.'
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
        productName: 'Set Rutina Facial Completa Día de la Madre LUMÉA 5-en-1',
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
        productId: 'h2d-001',
        productName: 'H2Derm - Serum Hialurónico Biomimético Ultra-Plump 3D',
        productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
        quantity: 1,
        unitPrice: 27900,
        totalPrice: 27900
      }
    ],
    subtotal: 27900,
    discount: 2790,
    total: 25110,
    trackingCode: 'OCA-TRACK-4910293',
    carrierName: 'OCA Envíos',
    bankReceiptImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
    notes: 'Transferencia verificada con comprobante',
    metaSource: 'Facebook Ads - H2Derm'
  }
];
