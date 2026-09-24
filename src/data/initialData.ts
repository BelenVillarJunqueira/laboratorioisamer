import { Product, CarouselSlide, StoreCMS, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "h2d-001",
    "brand": "H2Derm",
    "sku": "H2D-HYAL-001",
    "name": "H2Derm - Serum Hialurónico Biomimético Ultra-Plump 3D",
    "tagline": "Ácido Hialurónico Puro 2.5% Multimolecular & Pantenol B5",
    "category": "Serums",
    "price": 27900,
    "originalPrice": 34900,
    "discountPercentage": 20,
    "rating": 5,
    "reviewsCount": 248,
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    "badges": [
      "Línea Estrella",
      "Ácido Hialurónico 3D",
      "Clínicamente Testeado"
    ],
    "description": "El estandarte clínico de H2Derm. Formulado con triple peso molecular de ácido hialurónico biomimético que penetra desde la epidermis hasta las capas profundas, rellenando arrugas y restaurando el volumen hídrico al instante.",
    "benefits": [
      "Efecto relleno y turgencia visible desde los 15 minutos de aplicación",
      "Hidrata en 3 niveles de profundidad cutánea sin efecto rebote",
      "Refuerza la síntesis endógena de colágeno y elastina",
      "Fórmula estéril libre de siliconas y fragancias sintéticas"
    ],
    "howToUse": "Aplicar 4 gotas por la mañana y por la noche sobre la piel húmeda. Masajear con suaves presiones ascendentes.",
    "stock": 75,
    "featured": true,
    "motherDaySpecial": true,
    "order": 1
  },
  {
    "id": "h2d-002",
    "brand": "H2Derm",
    "sku": "H2D-CERA-002",
    "name": "H2Derm - Crema Reparadora Barrier Cream Cera-Repair",
    "tagline": "Triple Ceramidas Esenciales I, III, VI y Fitoesfingosina",
    "category": "Cremas",
    "price": 26500,
    "originalPrice": 33000,
    "discountPercentage": 20,
    "rating": 4.9,
    "reviewsCount": 182,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80"
    ],
    "badges": [
      "Barrera Cutánea",
      "Dermocosmética",
      "Calma Inmediata"
    ],
    "description": "Tratamiento dermo-reparador intensivo para pieles comprometidas, sensibilizadas o con barrera debilitada por tratamientos dermatológicos. Sella la humedad natural y previene el envejecimiento prematuro.",
    "benefits": [
      "Restaura la barrera lipídica en 48 horas continuas",
      "Alivia picazón, ardor y descamación instantáneamente",
      "Textura biomimética no comedogénica de absorción progresiva",
      "Apta para pieles con rosácea o tendencia atópica"
    ],
    "howToUse": "Extender suavemente sobre rostro, cuello y escote luego del serum reparador.",
    "stock": 60,
    "featured": true,
    "motherDaySpecial": true,
    "order": 2
  },
  {
    "id": "h2d-003",
    "brand": "H2Derm",
    "sku": "H2D-NIAC-003",
    "name": "H2Derm - Concentrado Niacinamida Pura 10% + Zinc PCA",
    "tagline": "Regula el sebo, minimiza poros dilatados y unifica el tono",
    "category": "Serums",
    "price": 25900,
    "originalPrice": 31500,
    "discountPercentage": 18,
    "rating": 4.9,
    "reviewsCount": 210,
    "image": "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"
    ],
    "badges": [
      "Poros & Tono",
      "Control Seborregulador",
      "Anti-Rojeces"
    ],
    "description": "Potente booster concentrado para refinar la textura cutánea. La vitamina B3 de grado médico al 10% combinada con Zinc PCA descongestiona los poros, atenúa manchas post-inflamatorias y equilibra el brillo indeseado.",
    "benefits": [
      "Reduce el tamaño aparente de los poros en 14 días",
      "Disminuye la producción sebácea sin resecar la epidermis",
      "Atenúa manchas y rojeces residuales de imperfecciones",
      "Mejora notablemente la textura y luminosidad natural"
    ],
    "howToUse": "Colocar 3 a 4 gotas cada mañana y noche antes de tu hidratante habitual.",
    "stock": 50,
    "featured": true,
    "motherDaySpecial": false,
    "order": 3
  },
  {
    "id": "h2d-004",
    "brand": "H2Derm",
    "sku": "H2D-RETI-004",
    "name": "H2Derm - Serum Retinol Liposomado 0.3% Night Renew",
    "tagline": "Regeneración celular nocturna intensiva sin irritación",
    "category": "Serums",
    "price": 29900,
    "originalPrice": 38000,
    "discountPercentage": 21,
    "rating": 5,
    "reviewsCount": 164,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"
    ],
    "badges": [
      "Anti-Age Clínico",
      "Retinol Puro Encapsulado",
      "Fórmula Nocturna"
    ],
    "description": "Complejo renovador celular desarrollado con tecnología de microencapsulación lipídica que libera el retinol puro de forma gradual, estimulando la renovación epidérmica y la síntesis de colágeno sin provocar enrojecimiento.",
    "benefits": [
      "Atenúa arrugas marcadas y líneas de expresión profundas",
      "Mejora la firmeza, tonicidad y elasticidad facial",
      "Promueve el recambio celular nocturno acelerado",
      "Microcápsulas de liberación prolongada que cuidan la piel sensible"
    ],
    "howToUse": "Uso exclusivo nocturno. Iniciar 2 noches por semana y aumentar según tolerancia. Aplicar siempre protector solar al día siguiente.",
    "stock": 40,
    "featured": true,
    "motherDaySpecial": false,
    "order": 4
  },
  {
    "id": "h2d-005",
    "brand": "H2Derm",
    "sku": "H2D-OJOS-005",
    "name": "H2Derm - Contorno de Ojos Peptide Matrix & Cafeína 5%",
    "tagline": "Drenaje periocular, descongestión de bolsas y corrección de ojeras",
    "category": "Ojos",
    "price": 23900,
    "originalPrice": 29500,
    "discountPercentage": 19,
    "rating": 4.8,
    "reviewsCount": 156,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    "badges": [
      "Mirada Descansada",
      "Drenaje Linfático",
      "Oftalmológicamente Testeado"
    ],
    "description": "Tratamiento avanzado para la zona periorbicular. La sinergia de tetrapéptidos tensores y cafeína de alta pureza disuelve los cúmulos grasos y activa la microcirculación capilar de la mirada.",
    "benefits": [
      "Descongestiona bolsas perioculares en 10 minutos",
      "Aclara sombras oscuras de ojeras vasculares y pigmentarias",
      "Efecto lifting en párpados caídos y patas de gallo",
      "Aplicador cerámico refrescante que activa la circulación"
    ],
    "howToUse": "Colocar un grano de arroz en el hueso orbital y dar toquecitos con la yema del dedo anular desde el lagrimal hacia las sienes.",
    "stock": 55,
    "featured": true,
    "motherDaySpecial": true,
    "order": 5
  },
  {
    "id": "h2d-006",
    "brand": "H2Derm",
    "sku": "H2D-CLEAN-006",
    "name": "H2Derm - Gel Limpiador Dermocosmético pH 5.5 Syndet",
    "tagline": "Limpieza suave sin sulfatos con Alantoína y Agua Termal",
    "category": "Limpieza",
    "price": 18900,
    "originalPrice": 23000,
    "discountPercentage": 18,
    "rating": 4.9,
    "reviewsCount": 198,
    "image": "https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    "badges": [
      "pH Fisiológico 5.5",
      "Sin Sulfatos",
      "Hipoalergénico"
    ],
    "description": "Gel limpiador espumoso syndet formulado para respetar el manto ácido fisiológico de la piel. Remueve impurezas, polución urbana y maquillaje sin arrastrar la barrera lipídica ni dejar tirantez.",
    "benefits": [
      "Limpia en profundidad sin resecar ni alterar la microbiota",
      "Acción calmante y antiirritante gracias a la Alantoína",
      "Apto para rostro, contorno de ojos y cuello",
      "Textura gel sedosa de enjuague rápido y limpio"
    ],
    "howToUse": "Emulsionar con agua tibia en las manos hasta formar espuma suave. Masajear 60 segundos y enjuagar con abundante agua.",
    "stock": 70,
    "featured": false,
    "motherDaySpecial": false,
    "order": 6
  },
  {
    "id": "h2d-007",
    "brand": "H2Derm",
    "sku": "H2D-MICE-007",
    "name": "H2Derm - Agua Micelar Dermatológica Regeneradora 400ml",
    "tagline": "Micelas biomiméticas de alta tolerancia con Extracto de Té Blanco",
    "category": "Limpieza",
    "price": 16900,
    "originalPrice": 21000,
    "discountPercentage": 20,
    "rating": 4.8,
    "reviewsCount": 142,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"
    ],
    "badges": [
      "400ml Formato Maxi",
      "Sin Enjuague",
      "Desmaquilla Ojos y Labios"
    ],
    "description": "Solución micelar de grado dermatológico capaz de atrapar micropartículas de suciedad y restos de maquillaje waterproof con suavidad absoluta. No requiere frotar ni enjuagar.",
    "benefits": [
      "Remueve hasta el 99% de partículas contaminantes y maquillaje resistente",
      "Tonifica y reconforta pieles reactivas y sensibles",
      "Fórmula pura sin fragancia, sin alcohol y sin jabón",
      "Tamaño profesional de 400ml de larga duración"
    ],
    "howToUse": "Impregnar un disco de algodón y pasar suavemente sobre rostro, ojos y labios sin presionar ni frotar.",
    "stock": 65,
    "featured": false,
    "motherDaySpecial": true,
    "order": 7
  },
  {
    "id": "h2d-008",
    "brand": "H2Derm",
    "sku": "H2D-PACK-008",
    "name": "H2Derm - Pack Clínico Dúo Renovador Hialurónico + Barrier Cream",
    "tagline": "Tratamiento completo de hidratación profunda y reparación de barrera",
    "category": "Packs",
    "price": 48900,
    "originalPrice": 67900,
    "discountPercentage": 28,
    "rating": 5,
    "reviewsCount": 176,
    "image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    "badges": [
      "Ahorro 28%",
      "Dúo Esencial",
      "Edición Regalo"
    ],
    "description": "El combo más vendido de H2Derm en un estuche de lujo. Combina el Serum Hialurónico Biomimético con la Crema Reparadora Barrier Cream para una piel perfectamente rellenada, protegida e hiperhidratada.",
    "benefits": [
      "Paso 1: Relleno hídrico profundo con ácido hialurónico 3D",
      "Paso 2: Sellado oclusivo y regeneración lipídica con ceramidas",
      "Ahorro de casi un 30% frente a la compra individual",
      "Ideal para iniciar una rutina clínica en casa"
    ],
    "howToUse": "Paso 1: Serum en rostro húmedo. Paso 2: Crema barrier para sellar la hidratación.",
    "stock": 45,
    "featured": true,
    "motherDaySpecial": true,
    "order": 8
  },
  {
    "id": "h2d-009",
    "brand": "H2Derm",
    "sku": "H2D-VITC-009",
    "name": "H2Derm - Booster Vitamina C Pura 15% + Ácido Ferúlico",
    "tagline": "Antioxidante de máxima potencia para brillo radiante y antimanchas",
    "category": "Serums",
    "price": 28500,
    "originalPrice": 36000,
    "discountPercentage": 21,
    "rating": 4.9,
    "reviewsCount": 165,
    "image": "https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80"
    ],
    "badges": [
      "Vitamina C 15%",
      "Efecto Glow",
      "Antioxidante Clínico"
    ],
    "description": "Fórmula de estabilidad superior con ácido L-ascórbico puro estabilizado con ácido ferúlico y vitamina E. Neutraliza el estrés oxidativo solar y las manchas oscuras.",
    "benefits": [
      "Unifica el tono y difumina manchas pigmentarias en 4 semanas",
      "Estimula la síntesis de colágeno devolviendo luminosidad viva",
      "Acción foto-protectora sinérgica bajo el bloqueador solar"
    ],
    "howToUse": "Colocar 4 gotas por la mañana sobre rostro limpio y cuello. Continuar con protector solar.",
    "stock": 50,
    "featured": true,
    "motherDaySpecial": true,
    "order": 9
  },
  {
    "id": "h2d-021",
    "brand": "H2Derm",
    "sku": "H2D-OIL-021",
    "name": "H2Derm - Aceite Facial Botánico Escualano & Rosa Mosqueta Pura",
    "tagline": "Elixir lipídico regenerador para luminosidad y nutrición profunda",
    "category": "Aceites",
    "price": 27500,
    "originalPrice": 34000,
    "discountPercentage": 19,
    "rating": 5.0,
    "reviewsCount": 89,
    "image": "https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    "badges": [
      "100% Puro & Orgánico",
      "Prensado en Frío",
      "No Comedogénico"
    ],
    "description": "Exclusiva fórmula de aceites botánicos biocompatibles con la epidermis humana. Combina escualano vegetal obtenido de la oliva y rosa mosqueta patagónica de primera presión en frío.",
    "benefits": [
      "Nutre intensamente sin dejar sensación grasa ni obstruir poros",
      "Atenúa cicatrices, manchas y líneas finas de deshidratación",
      "Sella la hidratación celular actuando como escudo lipídico",
      "Ideal para masajes faciales con Gua Sha o rodillo de jade"
    ],
    "howToUse": "Aplicar de 2 a 3 gotas como último paso de la rutina nocturna o mezclar con tu crema habitual.",
    "stock": 40,
    "featured": true,
    "motherDaySpecial": true,
    "order": 10
  },
  {
    "id": "h2d-022",
    "brand": "H2Derm",
    "sku": "H2D-GEL-022",
    "name": "H2Derm - Gel Hidratante Facial Ultra-Ligero Hydra-Infusion",
    "tagline": "Frescura inmediata y textura aqua-gel libre de aceites",
    "category": "Gel",
    "price": 24900,
    "originalPrice": 31000,
    "discountPercentage": 20,
    "rating": 4.9,
    "reviewsCount": 112,
    "image": "https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    "badges": [
      "Oil-Free",
      "Aqua Gel",
      "Efecto Mate"
    ],
    "description": "Tratamiento hidro-regulador en textura gel acuoso que sacia la sed cutánea al instante con absorción inmediata y acabado mate sedoso.",
    "benefits": [
      "Hidratación continua durante 24 horas sin aportar brillo",
      "Fórmula no oclusiva especial para pieles mixtas a grasas",
      "Sensación refrescante que descongestiona la piel estresada"
    ],
    "howToUse": "Aplicar por la mañana y noche con suaves toques sobre rostro y cuello limpios.",
    "stock": 55,
    "featured": true,
    "motherDaySpecial": false,
    "order": 11
  },
  {
    "id": "h2d-010",
    "brand": "H2Derm",
    "sku": "H2D-MASC-010",
    "name": "H2Derm - Mascarilla Reparadora Nocturna Bio-Cellulose Mask",
    "tagline": "Regeneración intensiva en monodosis con Pantenol y Centella Asiática",
    "category": "Cremas",
    "price": 12500,
    "originalPrice": 15500,
    "discountPercentage": 19,
    "rating": 4.9,
    "reviewsCount": 88,
    "image": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    "badges": [
      "Bio-Cellulose",
      "Efecto Spa Clínico",
      "Rescate Inmediato"
    ],
    "description": "Mascarilla de biocelulosa estéril impregnada en suero de alta densidad con extracto puro de Centella Asiática, Madecassoside y Pantenol para calmar pieles ultraestresadas.",
    "benefits": [
      "Adhesión de segunda piel con absorción 10 veces superior al algodón",
      "Baja la temperatura cutánea y aplaca rojeces al instante",
      "Ideal post-peeling, sol intenso o viajes prolongados"
    ],
    "howToUse": "Desplegar sobre el rostro limpio y dejar actuar de 20 a 30 minutos. Retirar y masajear el suero remanente.",
    "stock": 80,
    "featured": false,
    "motherDaySpecial": false,
    "order": 10
  },
  {
    "id": "soft-001",
    "brand": "SoftCare",
    "sku": "SOFT-BODY-001",
    "name": "SoftCare - Emulsión Corporal Hidratante Nutri-Repair Urea 10%",
    "tagline": "Hidratación corporal 48h con Manteca de Karité Pura y Urea Dermo-Activa",
    "category": "Corporal",
    "price": 18900,
    "originalPrice": 24500,
    "discountPercentage": 23,
    "rating": 5,
    "reviewsCount": 194,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"
    ],
    "badges": [
      "Premium",
      "Línea Dermo-Cuidado",
      "Urea 10%"
    ],
    "description": "Emulsión corporal rica pero de absorción inmediata. Desarrollada por SoftCare con un 10% de urea de grado cosmético y manteca de karité orgánica, diseñada para transformar pieles muy secas, rugosas o escamadas en piel suave y sedosa.",
    "benefits": [
      "Hidratación continua comprobada hasta por 48 horas",
      "Alivia la aspereza en codos, rodillas y piernas de frutilla",
      "Textura aterciopelada que permite vestirse inmediatamente sin pegajosidad",
      "Aroma suave hipoalergénico con notas limpias de algodón"
    ],
    "howToUse": "Aplicar generosamente sobre todo el cuerpo luego del baño con la piel ligeramente húmeda.",
    "stock": 85,
    "featured": true,
    "motherDaySpecial": true,
    "order": 11
  },
  {
    "id": "soft-002",
    "brand": "SoftCare",
    "sku": "SOFT-HANDS-002",
    "name": "SoftCare - Crema de Manos y Uñas Reparadora Cica-Hand",
    "tagline": "Nutrición intensa con Aceite de Almendras Dulces, Vitamina E & Queratina",
    "category": "Corporal",
    "price": 9900,
    "originalPrice": 12900,
    "discountPercentage": 23,
    "rating": 4.9,
    "reviewsCount": 220,
    "image": "https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    "badges": [
      "Premium",
      "Guante Protector",
      "Manos de Seda"
    ],
    "description": "Crema de manos de formulación premium con efecto guante invisible. Protege de la deshidratación causada por lavados frecuentes, alcohol en gel y bajas temperaturas, reforzando cutículas y uñas frágiles.",
    "benefits": [
      "Crea una barrera protectora invisible no grasa",
      "Fortalece uñas quebradizas y suaviza cutículas resecas",
      "Efecto confort instantáneo que devuelve la elasticidad a la piel",
      "Tamaño ideal para cartera o escritorio"
    ],
    "howToUse": "Colocar una pequeña cantidad en el dorso de las manos y masajear hasta las puntas de los dedos.",
    "stock": 120,
    "featured": true,
    "motherDaySpecial": true,
    "order": 12
  },
  {
    "id": "soft-003",
    "brand": "SoftCare",
    "sku": "SOFT-BALM-003",
    "name": "SoftCare - Bálsamo Dermo-Calmante Multiuso Cica-Balm B5",
    "tagline": "Reparador epidérmico intensivo con Pantenol 5%, Zinc & Madecassoside",
    "category": "Cremas",
    "price": 16500,
    "originalPrice": 21000,
    "discountPercentage": 21,
    "rating": 4.9,
    "reviewsCount": 168,
    "image": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    "badges": [
      "Premium",
      "SOS Reparación",
      "Bálsamo Multiuso"
    ],
    "description": "El infaltable del hogar. Bálsamo dermo-reparador formulado para zonas irritadas, labios agrietados, rozaduras, tatuajes recién curados o quemaduras solares superficiales.",
    "benefits": [
      "Calma el ardor y la irritación en cuestión de segundos",
      "Acelera la recuperación natural de la piel agrietada",
      "Apto para toda la familia: adultos, niños y bebés",
      "Textura bálsamo protectora resistente al agua"
    ],
    "howToUse": "Aplicar 2 a 3 veces al día en la zona localizada limpia y seca.",
    "stock": 90,
    "featured": false,
    "motherDaySpecial": false,
    "order": 13
  },
  {
    "id": "soft-004",
    "brand": "SoftCare",
    "sku": "SOFT-OIL-004",
    "name": "SoftCare - Aceite Seco Nutritivo Satin Oil con Argán & Macadamia",
    "tagline": "Toque seco satinado para cuerpo, cabello y escote con destellos luminosos",
    "category": "Corporal",
    "price": 22900,
    "originalPrice": 28900,
    "discountPercentage": 20,
    "rating": 4.8,
    "reviewsCount": 135,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80"
    ],
    "badges": [
      "Premium",
      "Toque Seco",
      "Luminosidad Dorada"
    ],
    "description": "Aceite botánico sublimador multiusos enriquecido con aceites preciosos de primera prensión. Aporta una suavidad irresistible y un brillo sutil y elegante sin engrasar la ropa.",
    "benefits": [
      "Nutre y embellece piernas, brazos y clavículas",
      "Controla el frizz y aporta brillo de seda a las puntas del cabello",
      "Fragancia envolvente con notas de vainilla dulce y flores blancas"
    ],
    "howToUse": "Vaporizar sobre las manos y extender sobre el cuerpo o aplicar unas gotas sobre las puntas del cabello seco.",
    "stock": 40,
    "featured": true,
    "motherDaySpecial": true,
    "order": 14
  },
  {
    "id": "soft-005",
    "brand": "SoftCare",
    "sku": "SOFT-SCRUB-005",
    "name": "SoftCare - Exfoliante Corporal Exfoliating Scrub Azúcar & Coco",
    "tagline": "Exfoliación dermo-suave con Cristales Naturales & Aceite de Coco Virgen",
    "category": "Corporal",
    "price": 17500,
    "originalPrice": 22000,
    "discountPercentage": 20,
    "rating": 4.9,
    "reviewsCount": 110,
    "image": "https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"
    ],
    "badges": [
      "Premium",
      "Exfoliante Natural",
      "Piel de Melocotón"
    ],
    "description": "Tratamiento renovador corporal formulado con partículas exfoliantes biodegradables de azúcar orgánico y manteca de coco. Desprende las células muertas superficiales dejando la piel renovada y sedosa.",
    "benefits": [
      "Elimina células secas e impurezas sin lastimar la piel",
      "Previene vellos encarnados antes y después de la depilación",
      "Prepara la piel para absorber mejor las cremas hidratantes"
    ],
    "howToUse": "Masajear sobre la piel húmeda en la ducha con movimientos circulares y enjuagar con agua tibia.",
    "stock": 55,
    "featured": false,
    "motherDaySpecial": false,
    "order": 15
  },
  {
    "id": "soft-006",
    "brand": "SoftCare",
    "sku": "SOFT-MIST-006",
    "name": "SoftCare - Bruma Corporal Hidratante Body Mist Seda & Jazmín",
    "tagline": "Refrescante rocío hidratante con Ácido Hialurónico y Glicerina Vegetal",
    "category": "Corporal",
    "price": 14900,
    "originalPrice": 18900,
    "discountPercentage": 21,
    "rating": 4.8,
    "reviewsCount": 95,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
    ],
    "badges": [
      "Premium",
      "Body Splash",
      "Frescura 24h"
    ],
    "description": "Bruma ultra liviana para perfumar e hidratar la piel al mismo tiempo. Su rocío microscópico envuelve el cuerpo en una caricia perfumada y refrescante durante todo el día.",
    "benefits": [
      "Aroma floral fresco duradero sin alcohol agresivo",
      "Aporta una dosis express de hidratación y alivio al calor",
      "Ideal para rociar sobre la piel después de la ducha o en el bolso"
    ],
    "howToUse": "Rociar a 15 cm del cuerpo cuantas veces desees a lo largo de la jornada.",
    "stock": 65,
    "featured": false,
    "motherDaySpecial": true,
    "order": 16
  },
  {
    "id": "mim-001",
    "brand": "Mimitos",
    "sku": "MIM-SHAMP-001",
    "name": "Mimitos - Shampoo Infantil Extra Suave Sin Lágrimas 350ml",
    "tagline": "Fórmula pura con Manzanilla, Caléndula & Avena Orgánica",
    "category": "Bebés/Kids",
    "price": 13900,
    "originalPrice": 17500,
    "discountPercentage": 20,
    "rating": 5,
    "reviewsCount": 230,
    "image": "https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"
    ],
    "badges": [
      "No Lágrimas",
      "Hipoalergénico",
      "Test Dermatológico"
    ],
    "description": "El clásico más tierno y seguro para la cabecita de tu bebé o niño. Su fórmula con pH neutro está diseñada para no arder en los ojitos y dejar el cabello súper brillante, suave y fácil de peinar.",
    "benefits": [
      "Fórmula dermatológica y pediátricamente testeada",
      "No arde en los ojos, probado bajo control oftalmológico",
      "Realza los reflejos dorados y el brillo natural del pelo infantil",
      "Libre de parabenos, colorantes artificiales y siliconas"
    ],
    "howToUse": "Colocar una pequeña cantidad en el cabello mojado, masajear con suavidad y enjuagar con agua tibia.",
    "stock": 95,
    "featured": true,
    "motherDaySpecial": false,
    "order": 17
  },
  {
    "id": "mim-002",
    "brand": "Mimitos",
    "sku": "MIM-COLO-002",
    "name": "Mimitos - Colonia Infantil Sin Alcohol Dulces Sueños 200ml",
    "tagline": "Fragancia tierna e inocente con Flores de Naranjo & Notas Cítricas Suaves",
    "category": "Bebés/Kids",
    "price": 14500,
    "originalPrice": 18500,
    "discountPercentage": 21,
    "rating": 4.9,
    "reviewsCount": 185,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80"
    ],
    "badges": [
      "Sin Alcohol",
      "Aroma Inolvidable",
      "Piel Sensible"
    ],
    "description": "Una caricia olfativa que perdura en la memoria. Nuestra colonia sin alcohol cuida la delicada barrera cutánea del bebé y perfuma su ropita y sábanas con frescura y dulzura.",
    "benefits": [
      "No reseca ni mancha la piel ni las prendas",
      "Aroma tierno y relajante que acompaña el descanso del bebé",
      "Frasco con pico dosificador antiderrame seguro"
    ],
    "howToUse": "Colocar unas gotitas en las palmas de las manos de mamá/papá y frotar suavemente sobre la ropita o cabellito del niño.",
    "stock": 80,
    "featured": true,
    "motherDaySpecial": true,
    "order": 18
  },
  {
    "id": "mim-003",
    "brand": "Mimitos",
    "sku": "MIM-BATH-003",
    "name": "Mimitos - Jabón Líquido Espumoso Baby Bath 2-en-1 Cuerpo & Pelo",
    "tagline": "Limpieza suave con Extracto de Manzanilla y Glicerina Pura",
    "category": "Bebés/Kids",
    "price": 13500,
    "originalPrice": 16900,
    "discountPercentage": 20,
    "rating": 4.9,
    "reviewsCount": 140,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80"
    ],
    "badges": [
      "2 en 1",
      "Baño Relajante",
      "Bebés & Niños"
    ],
    "description": "Solución práctica y segura para el baño diario. Su espuma cremosa limpia con delicadeza la piel y el cabello infantil, dejando una sensación de calma y confort antes de dormir.",
    "benefits": [
      "Práctico dosificador con válvula pump para usar con una sola mano",
      "Limpia sin eliminar la protección lipídica natural de la piel del niño",
      "Fórmula que no arde en los ojos y se enjuaga fácilmente"
    ],
    "howToUse": "Verter en el agua de la tina o aplicar sobre la piel húmeda con la mano, masajear y aclarar con agua tibia.",
    "stock": 90,
    "featured": false,
    "motherDaySpecial": false,
    "order": 19
  },
  {
    "id": "mim-004",
    "brand": "Mimitos",
    "sku": "MIM-ZINC-004",
    "name": "Mimitos - Pomada Protectora Antiraspaduras de Pañal con Óxido de Zinc",
    "tagline": "Escudo protector antifricción con Pantenol, Caléndula y Cera de Abejas",
    "category": "Bebés/Kids",
    "price": 11900,
    "originalPrice": 14900,
    "discountPercentage": 20,
    "rating": 5,
    "reviewsCount": 160,
    "image": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    "badges": [
      "Óxido de Zinc 15%",
      "Alivio Inmediato",
      "Anti-Escaldaduras"
    ],
    "description": "Tratamiento dermo-protector formulado para prevenir y calmar el enrojecimiento y paspaduras de la zona del pañal. Forma una película protectora impenetrable contra la humedad y bacterias.",
    "benefits": [
      "Alivia el ardor y la irritación desde el primer cambio de pañal",
      "Crea una barrera física transpirable y protectora",
      "Fácil de aplicar y de remover sin frotar bruscamente la piel sensible"
    ],
    "howToUse": "Aplicar una capa generosa sobre la colita limpia y seca en cada cambio de pañal, especialmente antes de dormir.",
    "stock": 110,
    "featured": false,
    "motherDaySpecial": false,
    "order": 20
  },
  {
    "id": "mim-005",
    "brand": "Mimitos",
    "sku": "MIM-OLEO-005",
    "name": "Mimitos - Óleo Calcáreo Clásico con Aceite de Almendras 500ml",
    "tagline": "La limpieza tradicional más pura para el cambio de pañal",
    "category": "Bebés/Kids",
    "price": 12900,
    "originalPrice": 16000,
    "discountPercentage": 19,
    "rating": 4.9,
    "reviewsCount": 195,
    "image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    "badges": [
      "Formato 500ml",
      "Óleo Natural",
      "Recomendado por Pediatras"
    ],
    "description": "Emulsión oleo-calcárea tradicional elaborada con agua de cal y aceite de almendras de alta pureza. Neutraliza la acidez de la orina y materia fecal sin irritar la piel.",
    "benefits": [
      "Limpia suavemente sin necesidad de enjuague ni agua",
      "Deja una capa emoliente que protege de la humedad",
      "Envase económico familiar de 500ml con bomba dispensadora"
    ],
    "howToUse": "Agitar antes de usar. Aplicar con un algodón sobre la zona del pañal hasta retirar las impurezas.",
    "stock": 100,
    "featured": false,
    "motherDaySpecial": false,
    "order": 21
  },
  {
    "id": "mim-006",
    "brand": "Mimitos",
    "sku": "MIM-SPRAY-006",
    "name": "Mimitos - Spray Desenredante Antinudos Mágico Frutos del Bosque",
    "tagline": "Peinado fácil y sin tirones con Pantenol y Proteínas de Seda",
    "category": "Bebés/Kids",
    "price": 11500,
    "originalPrice": 14500,
    "discountPercentage": 20,
    "rating": 4.8,
    "reviewsCount": 130,
    "image": "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
    ],
    "badges": [
      "Sin Tirones",
      "Cabello Rebelde",
      "Aroma a Frutas"
    ],
    "description": "El mejor aliado matutino para peinar a los más pequeños sin lágrimas ni quejas. Deshace los nudos más difíciles al instante dejando el cabello suave, liviano y con un aroma frutal delicioso.",
    "benefits": [
      "Desenreda en segundos cabellos lacios o con rulos",
      "Se puede usar en cabello seco o húmedo sin necesidad de enjuague",
      "No deja el cabello grasoso ni pesado"
    ],
    "howToUse": "Rociar sobre el cabello húmedo o seco a 15 cm de distancia y pasar el cepillo suavemente.",
    "stock": 85,
    "featured": true,
    "motherDaySpecial": true,
    "order": 22
  },
  {
    "id": "sal-001",
    "brand": "Le Salon",
    "sku": "SAL-SHAMP-001",
    "name": "Le Salon - Shampoo Matizador Platinum Violet Anti-Amarillo 350ml",
    "tagline": "Pigmentos violetas puros para rubios fríos, platinados y canas",
    "category": "Capilar",
    "price": 19900,
    "originalPrice": 25000,
    "discountPercentage": 20,
    "rating": 5,
    "reviewsCount": 180,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
    ],
    "badges": [
      "Uso Profesional",
      "Rubios Fríos",
      "Anti-Oxidación"
    ],
    "description": "El secreto de los mejores salones de belleza. Formulado con micropigmentos violetas neutralizantes que eliminan los reflejos cobrizos y amarillentos indeseados en cabellos decolorados o canosos.",
    "benefits": [
      "Neutralización inmediata de tonos cálidos y anaranjados",
      "Nutre la fibra capilar debilitada por decoloraciones",
      "Prolonga la luminosidad del color de peluquería entre visitas"
    ],
    "howToUse": "Aplicar sobre cabello húmedo, masajear y dejar actuar de 3 a 5 minutos según la intensidad deseada. Enjuagar bien.",
    "stock": 65,
    "featured": true,
    "motherDaySpecial": false,
    "order": 23
  },
  {
    "id": "sal-002",
    "brand": "Le Salon",
    "sku": "SAL-BOTOX-002",
    "name": "Le Salon - Máscara Capilar Botox Repair Keratina & Hialurónico 500g",
    "tagline": "Relleno capilar profundo, antifrizz y cauterización de puntas abiertas",
    "category": "Capilar",
    "price": 26500,
    "originalPrice": 34000,
    "discountPercentage": 22,
    "rating": 5,
    "reviewsCount": 215,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"
    ],
    "badges": [
      "Botox Capilar",
      "500g Profesional",
      "Sellado Térmico"
    ],
    "description": "Tratamiento de nutrición e hidratación profunda con efecto botox. Rellena las fisuras del cabello dañado por calor y químicos, devolviendo brillo de espejo y movimiento natural.",
    "benefits": [
      "Disminuye el volumen y elimina el frizz por hasta 3 semanas",
      "Reconstruye la masa capilar con queratina hidrolizada",
      "Aporta suavidad extrema y brillo radiante instantáneo"
    ],
    "howToUse": "Lavar el cabello, secar con toalla y aplicar mecha por mecha. Dejar actuar 15 minutos con gorra térmica y enjuagar al 80%.",
    "stock": 50,
    "featured": true,
    "motherDaySpecial": true,
    "order": 24
  },
  {
    "id": "sal-003",
    "brand": "Le Salon",
    "sku": "SAL-OIL-003",
    "name": "Le Salon - Óleo Capilar Elixir Sellador de Puntas con Argán Puro",
    "tagline": "Protección térmica 230°C y brillo cristalino sin engrasar",
    "category": "Capilar",
    "price": 18900,
    "originalPrice": 23500,
    "discountPercentage": 20,
    "rating": 4.9,
    "reviewsCount": 145,
    "image": "https://images.unsplash.com/photo-1608248597359-07f9c2d18cb3?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
    ],
    "badges": [
      "Termoprotector 230°C",
      "Argán de Marruecos",
      "Anti-Frizz"
    ],
    "description": "Gotas de seda dorada para proteger la fibra capilar del uso constante de planchitas y secadores de pelo. Sella las cutículas al instante eliminando puntas florecidas.",
    "benefits": [
      "Protege contra el calor excesivo hasta 230 grados",
      "Controla el encrespamiento en días de alta humedad",
      "No engrasa ni apelmaza el cabello, absorción ultra rápida"
    ],
    "howToUse": "Colocar 2 o 3 gotas en la palma, frotar y distribuir de medios a puntas antes o después del peinado.",
    "stock": 60,
    "featured": false,
    "motherDaySpecial": false,
    "order": 25
  },
  {
    "id": "sal-004",
    "brand": "Le Salon",
    "sku": "SAL-POMAD-004",
    "name": "Le Salon - Pomada Modeladora Mate Barba & Cabello Matte Clay 100g",
    "tagline": "Fijación fuerte y flexible con acabado natural mate a base de agua",
    "category": "Capilar",
    "price": 14900,
    "originalPrice": 18900,
    "discountPercentage": 21,
    "rating": 4.8,
    "reviewsCount": 128,
    "image": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    "badges": [
      "Barbería Profesional",
      "Acabado Mate",
      "Fácil Lavado"
    ],
    "description": "Cera modeladora de arcilla natural diseñada para cortes masculinos modernos y peinados texturizados. Ofrece control durante todo el día sin dejar residuos blancos ni sensación pegajosa.",
    "benefits": [
      "Fijación duradera que permite remodelar el peinado durante el día",
      "Acabado 100% mate sin brillo grasoso",
      "Fórmula soluble en agua que se retira fácilmente con el lavado"
    ],
    "howToUse": "Frotar una pequeña cantidad entre las manos para calentar el producto y distribuir uniformemente sobre cabello seco o húmedo.",
    "stock": 75,
    "featured": false,
    "motherDaySpecial": false,
    "order": 26
  },
  {
    "id": "sal-005",
    "brand": "Le Salon",
    "sku": "SAL-BEARD-005",
    "name": "Le Salon - Aceite Nutritivo para Barba Beard Oil Cedro & Bergamota",
    "tagline": "Hidrata la piel bajo la barba, alivia la picazón y suaviza el vello",
    "category": "Aceites",
    "price": 16900,
    "originalPrice": 21000,
    "discountPercentage": 20,
    "rating": 4.9,
    "reviewsCount": 98,
    "image": "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
    ],
    "badges": [
      "Aceites 100% Puros",
      "Anti-Picazón",
      "Aroma Amaderado"
    ],
    "description": "Tratamiento de barbería clásica elaborado con aceites de jojoba, almendras dulces y ricino prensados en frío. Elimina la descamación de la piel bajo la barba y da brillo saludable al vello facial.",
    "benefits": [
      "Elimina la picazón y tirantez en barbas cortas o largas",
      "Aporta una fragancia varonil sofisticada a madera de cedro y bergamota",
      "Deja la barba domable, suave y dócil al peinar"
    ],
    "howToUse": "Colocar 3 a 5 gotas en las manos, frotar y masajear profundamente la barba llegando hasta la piel.",
    "stock": 70,
    "featured": false,
    "motherDaySpecial": false,
    "order": 27
  },
  {
    "id": "sal-006",
    "brand": "Le Salon",
    "sku": "SAL-GEL21-006",
    "name": "Le Salon - Shampoo & Gel de Ducha 2 en 1 Active Energy Mentol",
    "tagline": "Efecto refrescante estimulante con Cafeína, Eucalipto y Menta Piperita",
    "category": "Capilar",
    "price": 15900,
    "originalPrice": 19900,
    "discountPercentage": 20,
    "rating": 4.8,
    "reviewsCount": 115,
    "image": "https://images.unsplash.com/photo-1556228852-6d35a585d566?w=800&q=80",
    "secondaryImages": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"
    ],
    "badges": [
      "Efecto Hielo",
      "2 en 1 Pelo & Cuerpo",
      "Energizante"
    ],
    "description": "Gel de ducha y shampoo formulado para la rutina diaria activa. Su descarga de mentol natural y extracto de cafeína estimula el cuero cabelludo y revitaliza el cuerpo al instante.",
    "benefits": [
      "Sensación de frescura glacial inmediata",
      "Limpia el cabello y la piel eliminando sudor y toxinas post-entrenamiento",
      "Fragancia deportiva enérgica y revitalizante"
    ],
    "howToUse": "Aplicar sobre el cuerpo y cabello mojado, masajear hasta crear espuma densa y enjuagar con agua fresca.",
    "stock": 80,
    "featured": false,
    "motherDaySpecial": false,
    "order": 28
  }
];

export const INITIAL_SLIDES: CarouselSlide[] = [
  {
    "id": "slide-1",
    "title": "H2Derm • Dermocosmética Clínica Avanzada",
    "subtitle": "Nuestra línea estrella de alta concentración: Ácido Hialurónico Biomimético, Niacinamida 10% y Fórmulas Reparadoras",
    "highlightText": "⭐ Lanzamiento Exclusivo | Resultados Visibles Desde la 1ª Aplicación",
    "badge": "LÍNEA ESTRELLA 2026",
    "buttonText": "Ver Productos H2Derm",
    "buttonLink": "#productos",
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1600&q=85",
    "textColor": "light",
    "align": "left",
    "active": true,
    "order": 1
  },
  {
    "id": "slide-2",
    "title": "Especial Día de la Madre en ISAMER LAB",
    "subtitle": "El regalo más hermoso para mamá: Piel radiante, hidratada y llena de vida",
    "highlightText": "Hasta 30% OFF en Sets de Rutina Facial + 3 y 6 Cuotas",
    "badge": "Campaña Oficial 2026",
    "buttonText": "Ver Rutina Facial Completa",
    "buttonLink": "#productos",
    "image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=85",
    "textColor": "light",
    "align": "left",
    "active": true,
    "order": 2
  },
  {
    "id": "slide-3",
    "title": "SoftCare • Dermo-Cuidado Corporal y Facial Premium",
    "subtitle": "Nutrición profunda con Manteca de Karité, Urea 10% y Aceites Preciosos para piel de seda",
    "highlightText": "✨ Colección Premium SoftCare | Fórmulas Aterciopeladas",
    "badge": "LÍNEA PREMIUM SOFTCARE",
    "buttonText": "Ver Productos SoftCare",
    "buttonLink": "#productos",
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&q=85",
    "textColor": "light",
    "align": "left",
    "active": true,
    "order": 3
  },
  {
    "id": "slide-4",
    "title": "Crea tu Marca con ISAMER LAB",
    "subtitle": "Tu sueño se puede hacer realidad: Desarrollamos tu propia línea de cosmética personalizada con packaging y formulación a medida",
    "highlightText": "🧪 Fórmulas Exclusivas • Lotes Accesibles • Asesoría Técnica",
    "badge": "MARCA BLANCA & LABORATORIO",
    "buttonText": "Consultar por WhatsApp",
    "buttonLink": "#crea-tu-marca",
    "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600&q=85",
    "textColor": "light",
    "align": "center",
    "active": true,
    "order": 4
  }
];

export const INITIAL_CMS: StoreCMS = {
  "storeName": "ISAMER",
  "storeTagline": "LAB",
  "announcementBar": "✨ BIENVENIDOS A ISAMER LAB | ALTA DERMOCOSMÉTICA & CATÁLOGO MULTIMARCA | ENVÍOS A TODO EL PAÍS",
  "announcementActive": true,
  "enableMothersDay": true,
  "whatsappNumber": "5491123456789",
  "instagramHandle": "@isamer.lab",
  "emailContact": "contacto@isamerlab.com",
  "mothersDayPromoTitle": "Día de la Madre en ISAMER LAB",
  "mothersDayPromoSubtitle": "Edición Limitada de Sets Faciales & Rutinas Completas de Cuidado",
  "mothersDayPromoBanner": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80",
  "mothersDayPromoDiscount": "30% OFF",
  "freeShippingThreshold": 50000,
  "adminPin": "1234",
  "createYourBrand": {
    "title": "Crea tu Propia Marca de Cosmética con ISAMER LAB",
    "subtitle": "Laboratorio Profesional de Desarrollo & Fabricación a Medida",
    "description": "Te acompañamos en cada etapa: formulación dermatológica exclusiva, diseño y rotulado de packaging, registros y producción en lotes accesibles. Tu marca con calidad de laboratorio.",
    "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
    "whatsappMessage": "Hola ISAMER LAB! Me gustaría recibir información y cotización para crear mi propia línea de cosmética personalizada.",
    "enabled": true
  },
  "bankConfig": {
    "bankName": "Banco Galicia",
    "accountHolder": "ISAMER",
    "cbu": "0070327530004092450465",
    "alias": "rbvillar3.gal",
    "cuit": "23-37066549-4",
    "discountPercentage": 10,
    "whatsappNoticeNumber": "5493515056742"
  },
  "mercadoPagoConfig": {
    "publicKey": "",
    "accessToken": "",
    "sandboxMode": false,
    "enabled": true
  },
  "metaAdsConfig": {
    "pixelId": "123456789012345",
    "conversionsApiToken": "",
    "enabled": true
  },
  "footerAbout": "ISAMER LAB - Laboratorio de alta cosmética y catálogo multimarca: H2Derm, SoftCare (Línea Premium), Mimitos y Le Salon. Fórmulas dermatológicas desarrolladas en Argentina con los más altos estándares de pureza y biotecnología."
};

export const INITIAL_ORDERS: Order[] = [
  {
    "id": "ord-1",
    "orderNumber": "ORD-2026-001",
    "createdAt": "2026-09-23T13:13:45.327Z",
    "updatedAt": "2026-09-23T13:13:45.327Z",
    "customerName": "Camila Rodríguez",
    "customerEmail": "camila.rodriguez@gmail.com",
    "customerPhone": "+54 9 11 5544-3322",
    "customerDni": "35112233",
    "shippingAddress": {
      "street": "Av. Santa Fe",
      "number": "3420",
      "apartment": "4 B",
      "city": "Palermo",
      "province": "Buenos Aires",
      "postalCode": "1425"
    },
    "shippingMethod": "standard",
    "shippingCost": 0,
    "paymentMethod": "transferencia",
    "paymentStatus": "approved",
    "status": "En preparación",
    "items": [
      {
        "productId": "h2d-001",
        "productName": "H2Derm - Serum Hialurónico Biomimético Ultra-Plump 3D",
        "productImage": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
        "quantity": 1,
        "unitPrice": 27900,
        "totalPrice": 27900
      }
    ],
    "subtotal": 27900,
    "discount": 0,
    "total": 27900,
    "trackingCode": "OCA-99281726",
    "carrierName": "OCA Express",
    "metaSource": "Instagram Ads",
    "notes": "Tocar timbre 4B, de 14 a 18 hs"
  }
];
