// app/(tabs)/PiyaloAqui/index.tsx
// Vista de Tienda Virtual "Piyalo Aquí" con modal de detalles del producto
// Versión optimizada para diferentes tamaños de dispositivos

import FloatingBottomMenu from "@/components/Floatingbottommenu";
import { useRouter } from "expo-router";
import {
  Add,
  CloseCircle,
  Heart,
  Minus,
  SearchNormal1,
  ShoppingCart,
  Star1,
  Tag,
  TickCircle,
  TruckFast
} from 'iconsax-react-native';
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width, height } = Dimensions.get("window");

// Funciones de escalado mejoradas para diferentes dispositivos
const baseWidth = 375;
const baseHeight = 812;

const scale = (size: number) => (width / baseWidth) * size;
const scaleFont = (size: number) => {
  const newSize = (width / baseWidth) * size;
  // Limitar el tamaño de fuente para pantallas muy grandes o pequeñas
  const minSize = size * 0.8;
  const maxSize = size * 1.2;
  const scaledSize = Math.round(Platform.OS === 'ios' ? newSize : newSize - 1);
  return Math.max(minSize, Math.min(maxSize, scaledSize));
};
const verticalScale = (size: number) => (height / baseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Calcular número de columnas según el ancho de pantalla
const getColumns = () => {
  if (width >= 768) return 3; // Tablets grandes
  if (width >= 600) return 3; // Tablets pequeños
  if (width >= 400) return 2; // Teléfonos grandes
  return 2; // Teléfonos normales
};

const COLUMNS = getColumns();
const CARD_MARGIN = scale(12);
const CARD_WIDTH = (width - scale(32) - (CARD_MARGIN * (COLUMNS - 1))) / COLUMNS;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  inStock: boolean;
  isFavorite?: boolean;
  longDescription?: string;
  features?: string[];
  specifications?: { [key: string]: string };
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: '1', name: 'Todo', icon: '🏪', color: '#5B7FFF' },
  { id: '2', name: 'Tecnología', icon: '📱', color: '#2196F3' },
  { id: '3', name: 'Hogar', icon: '🏠', color: '#4CAF50' },
  { id: '4', name: 'Moda', icon: '👕', color: '#FF9800' },
  { id: '5', name: 'Deportes', icon: '⚽', color: '#9C27B0' },
  { id: '6', name: 'Belleza', icon: '💄', color: '#E91E63' },
];

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Smartphone Galaxy Pro',
    description: 'Última generación, 128GB, 5G',
    price: 899990,
    originalPrice: 1299990,
    discount: '30% OFF',
    rating: 4.8,
    reviews: 234,
    image: '📱',
    category: 'Tecnología',
    inStock: true,
    isFavorite: false,
    longDescription: 'Experimenta la tecnología más avanzada con el Smartphone Galaxy Pro. Diseñado para profesionales y entusiastas de la tecnología que buscan lo mejor.',
    features: [
      'Pantalla AMOLED 6.7" 120Hz',
      'Cámara triple 108MP + 12MP + 5MP',
      'Batería 5000mAh con carga rápida 65W',
      'Procesador Snapdragon 8 Gen 2',
      'Conectividad 5G ultra rápida'
    ],
    specifications: {
      'Pantalla': '6.7" AMOLED 120Hz',
      'Procesador': 'Snapdragon 8 Gen 2',
      'RAM': '8GB',
      'Almacenamiento': '128GB',
      'Cámara': '108MP + 12MP + 5MP',
      'Batería': '5000mAh'
    }
  },
  {
    id: '2',
    name: 'Auriculares Bluetooth Pro',
    description: 'Cancelación de ruido, 40h batería',
    price: 149990,
    originalPrice: 249990,
    discount: '40% OFF',
    rating: 4.6,
    reviews: 189,
    image: '🎧',
    category: 'Tecnología',
    inStock: true,
    isFavorite: true,
    longDescription: 'Sumérgete en un mundo de audio premium con cancelación activa de ruido. Perfectos para trabajar, viajar o disfrutar tu música favorita.',
    features: [
      'Cancelación activa de ruido (ANC)',
      'Hasta 40 horas de batería',
      'Audio de alta resolución',
      'Bluetooth 5.3 multipunto',
      'Estuche de carga incluido'
    ],
    specifications: {
      'Batería': '40 horas',
      'Conectividad': 'Bluetooth 5.3',
      'Cancelación de ruido': 'Activa (ANC)',
      'Peso': '250g',
      'Carga': 'USB-C rápida'
    }
  },
  {
    id: '3',
    name: 'Cafetera Espresso Premium',
    description: 'Café profesional, 15 bares presión',
    price: 299990,
    rating: 4.7,
    reviews: 156,
    image: '☕',
    category: 'Hogar',
    inStock: true,
    isFavorite: false,
    longDescription: 'Prepara café de calidad barista en casa. Sistema profesional de 15 bares para espressos perfectos cada vez.',
    features: [
      'Sistema de 15 bares de presión',
      'Vaporizador para cappuccino',
      'Depósito de agua 1.8L',
      'Panel digital táctil',
      'Fácil limpieza'
    ],
    specifications: {
      'Presión': '15 bares',
      'Capacidad': '1.8L',
      'Potencia': '1450W',
      'Material': 'Acero inoxidable'
    }
  },
  {
    id: '4',
    name: 'Zapatillas Running Elite',
    description: 'Ultra ligeras, máxima amortiguación',
    price: 179990,
    originalPrice: 249990,
    discount: '28% OFF',
    rating: 4.9,
    reviews: 312,
    image: '👟',
    category: 'Deportes',
    inStock: true,
    isFavorite: true,
    longDescription: 'Diseñadas para corredores exigentes. Tecnología de amortiguación avanzada que reduce el impacto y mejora tu rendimiento.',
    features: [
      'Amortiguación Boost MAX',
      'Suela de carbono ultraligera',
      'Upper transpirable',
      'Diseño ergonómico',
      'Reflectantes 360°'
    ],
    specifications: {
      'Peso': '220g',
      'Drop': '8mm',
      'Material': 'Mesh transpirable',
      'Suela': 'Carbono + Goma'
    }
  },
  {
    id: '5',
    name: 'Mochila Smart USB',
    description: 'Puerto USB, impermeable, 30L',
    price: 89990,
    rating: 4.5,
    reviews: 98,
    image: '🎒',
    category: 'Moda',
    inStock: true,
    isFavorite: false,
    longDescription: 'Mochila inteligente perfecta para estudiantes y profesionales. Con compartimento para laptop y puerto USB integrado.',
    features: [
      'Puerto USB para carga',
      'Compartimento laptop 15.6"',
      'Material impermeable',
      'Múltiples bolsillos',
      'Diseño ergonómico'
    ],
    specifications: {
      'Capacidad': '30L',
      'Material': 'Poliéster impermeable',
      'Dimensiones': '45x30x15cm',
      'Peso': '600g'
    }
  },
  {
    id: '6',
    name: 'Tablet 10" Full HD',
    description: '64GB, Android 13, WiFi',
    price: 549990,
    originalPrice: 699990,
    discount: '21% OFF',
    rating: 4.6,
    reviews: 145,
    image: '💻',
    category: 'Tecnología',
    inStock: true,
    isFavorite: false,
    longDescription: 'Tablet versátil para entretenimiento y productividad. Pantalla Full HD y potente procesador octacore.',
    features: [
      'Pantalla 10.1" Full HD',
      'Procesador octacore',
      'Android 13 actualizable',
      'Batería 7000mAh',
      'Cámaras dual'
    ],
    specifications: {
      'Pantalla': '10.1" Full HD',
      'RAM': '4GB',
      'Almacenamiento': '64GB',
      'Batería': '7000mAh',
      'Sistema': 'Android 13'
    }
  },
  {
    id: '7',
    name: 'Reloj Inteligente Pro',
    description: 'GPS, monitor cardíaco, 7 días batería',
    price: 249990,
    rating: 4.7,
    reviews: 201,
    image: '⌚',
    category: 'Tecnología',
    inStock: true,
    isFavorite: true,
    longDescription: 'Smartwatch completo para deportistas. Monitoreo 24/7 de salud y múltiples modos deportivos.',
    features: [
      'GPS integrado',
      'Monitor de frecuencia cardíaca',
      'Oxígeno en sangre (SpO2)',
      'Resistente al agua IP68',
      '100+ modos deportivos'
    ],
    specifications: {
      'Pantalla': '1.4" AMOLED',
      'Batería': '7 días',
      'Resistencia': 'IP68',
      'Conectividad': 'Bluetooth 5.0'
    }
  },
  {
    id: '8',
    name: 'Set Maquillaje Professional',
    description: '24 piezas, todos los tonos',
    price: 129990,
    originalPrice: 189990,
    discount: '32% OFF',
    rating: 4.8,
    reviews: 267,
    image: '💄',
    category: 'Belleza',
    inStock: true,
    isFavorite: false,
    longDescription: 'Kit profesional completo para maquilladores y amantes del maquillaje. Alta pigmentación y larga duración.',
    features: [
      '24 productos profesionales',
      'Paleta de sombras 16 tonos',
      'Brochas premium incluidas',
      'Estuche organizador',
      'Productos hipoalergénicos'
    ],
    specifications: {
      'Piezas': '24 productos',
      'Paleta': '16 sombras',
      'Brochas': '8 incluidas',
      'Material': 'Hipoalergénico'
    }
  },
];

// Datos para el carrusel de publicidad
const CAROUSEL_SLIDES = [
  {
    id: '1',
    title: 'Black Friday\nEspecial',
    subtitle: 'Hasta 50% de descuento en productos seleccionados',
    badge: '🔥 CYBER WEEK',
    buttonText: 'Comprar ahora',
    emoji: '🛍️',
    gradient: '#5B7FFF',
  },
  {
    id: '2',
    title: 'Envío Gratis\nEn Todo',
    subtitle: 'En compras mayores a $100.000 COP',
    badge: '🚚 ENVÍO GRATIS',
    buttonText: 'Ver productos',
    emoji: '📦',
    gradient: '#FF6B6B',
  },
  {
    id: '3',
    title: 'Tecnología\n2024',
    subtitle: 'Los últimos smartphones y gadgets del año',
    badge: '⚡ NUEVOS',
    buttonText: 'Explorar',
    emoji: '📱',
    gradient: '#4ECDC4',
  },
  {
    id: '4',
    title: '3 Cuotas\nSin Interés',
    subtitle: 'Paga cómodamente en todas tus compras',
    badge: '💳 FINANCIACIÓN',
    buttonText: 'Más info',
    emoji: '💰',
    gradient: '#9B59B6',
  },
];

// Datos de marcas y sus ofertas (solo informativo)
interface BrandOffer {
  id: string;
  brand: string;
  brandLogo: string;
  discount: string;
  category: string;
  description: string;
  validUntil: string;
  backgroundColor: string;
  textColor?: string;
}

const BRAND_OFFERS: BrandOffer[] = [
  {
    id: '1',
    brand: 'Samsung',
    brandLogo: '📱',
    discount: '30% OFF',
    category: 'Electrodomésticos',
    description: 'En toda la línea de smartphones, tablets y electrodomésticos inteligentes',
    validUntil: 'Válido hasta 30/Nov',
    backgroundColor: '#1428A0',
    textColor: '#FFFFFF',
  },
  {
    id: '2',
    brand: 'Sony',
    brandLogo: '🎧',
    discount: '40% OFF',
    category: 'Audio Premium',
    description: 'Auriculares, parlantes y equipos de sonido de alta fidelidad',
    validUntil: 'Válido hasta 25/Nov',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
  },
  {
    id: '3',
    brand: 'Nike',
    brandLogo: '👟',
    discount: '28% OFF',
    category: 'Deportes y Fitness',
    description: 'Zapatillas, ropa deportiva y accesorios para entrenar',
    validUntil: 'Válido hasta 28/Nov',
    backgroundColor: '#FF6B00',
    textColor: '#FFFFFF',
  },
  {
    id: '4',
    brand: 'Apple',
    brandLogo: '',
    discount: '15% OFF',
    category: 'Tecnología Premium',
    description: 'Productos seleccionados: Watches, AirPods y accesorios oficiales',
    validUntil: 'Válido hasta 22/Nov',
    backgroundColor: '#555555',
    textColor: '#FFFFFF',
  },
  {
    id: '5',
    brand: 'L\'Oréal',
    brandLogo: '💄',
    discount: '32% OFF',
    category: 'Belleza y Cuidado',
    description: 'Sets de maquillaje, productos para el cuidado de la piel y el cabello',
    validUntil: 'Válido hasta 01/Dic',
    backgroundColor: '#E91E63',
    textColor: '#FFFFFF',
  },
  {
    id: '6',
    brand: 'Philips',
    brandLogo: '💡',
    discount: '25% OFF',
    category: 'Hogar Inteligente',
    description: 'Cafeteras, licuadoras y electrodomésticos para tu cocina',
    validUntil: 'Válido hasta 27/Nov',
    backgroundColor: '#0E5FBF',
    textColor: '#FFFFFF',
  },
  {
    id: '7',
    brand: 'Adidas',
    brandLogo: '⚽',
    discount: '35% OFF',
    category: 'Moda Deportiva',
    description: 'Toda la colección de ropa deportiva, mochilas y accesorios',
    validUntil: 'Válido hasta 29/Nov',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
  },
];

export default function PiyaloAquiScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(3);
  const [favorites, setFavorites] = useState<string[]>(['2', '4', '7']);
  
  // Estados para el modal de detalles
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);

  // Estados y refs para el carrusel publicitario
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Estados y refs para el carrusel de ofertas por marca
  const [currentBrandSlide, setCurrentBrandSlide] = useState(0);
  const brandScrollViewRef = useRef<ScrollView>(null);
  const brandFadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-scroll del carrusel publicitario
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        const nextSlide = (prevSlide + 1) % CAROUSEL_SLIDES.length;
        
        // Animación de fade
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        // Scroll al siguiente slide
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: nextSlide * width,
            animated: true,
          });
        }
        
        return nextSlide;
      });
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, [fadeAnim]);

  // Auto-scroll del carrusel de ofertas por marca
  useEffect(() => {
    const brandInterval = setInterval(() => {
      setCurrentBrandSlide((prevSlide) => {
        const nextSlide = (prevSlide + 1) % BRAND_OFFERS.length;
        
        // Animación de fade
        Animated.sequence([
          Animated.timing(brandFadeAnim, {
            toValue: 0.8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(brandFadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();

        // Scroll al siguiente slide
        if (brandScrollViewRef.current) {
          brandScrollViewRef.current.scrollTo({
            x: nextSlide * (scale(320) + scale(16)),
            animated: true,
          });
        }
        
        return nextSlide;
      });
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(brandInterval);
  }, [brandFadeAnim]);

  // Manejar scroll manual del carrusel publicitario
  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex);
    }
  };

  // Manejar scroll manual del carrusel de marcas
  const handleBrandScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (scale(320) + scale(16)));
    if (slideIndex !== currentBrandSlide) {
      setCurrentBrandSlide(slideIndex);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setProductQuantity(1);
    setShowProductModal(true);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      setCartCount(cartCount + productQuantity);
      setShowProductModal(false);
      Alert.alert(
        "¡Agregado al carrito!",
        `${productQuantity} ${selectedProduct.name} agregado${productQuantity > 1 ? 's' : ''} al carrito`
      );
    }
  };

  const handleCartPress = () => {
    router.push('/PiyaloAqui/cart');
  };

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === '1' || 
      product.category === CATEGORIES.find(c => c.id === selectedCategory)?.name;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header con logo y carrito */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoSection}>
            <Image 
              source={require('@/assets/images/logo_piyalo_aqui.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity 
            style={styles.cartButton}
            onPress={handleCartPress}
            activeOpacity={0.7}
          >
            <ShoppingCart size={moderateScale(24)} color="#5B7FFF" variant="Bold" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <SearchNormal1 size={moderateScale(20)} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CARRUSEL DE PUBLICIDAD */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={width}
            snapToAlignment="center"
          >
            {CAROUSEL_SLIDES.map((slide) => (
              <Animated.View
                key={slide.id}
                style={[
                  styles.carouselSlide,
                  { opacity: fadeAnim }
                ]}
              >
                <View style={[styles.carouselGradient, { backgroundColor: slide.gradient }]}>
                  <View style={styles.carouselContent}>
                    <Text style={styles.carouselBadge}>{slide.badge}</Text>
                    <Text style={styles.carouselTitle}>{slide.title}</Text>
                    <Text style={styles.carouselSubtitle}>{slide.subtitle}</Text>
                    <TouchableOpacity style={styles.carouselButton}>
                      <Text style={styles.carouselButtonText}>{slide.buttonText}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.carouselImageContainer}>
                    <Text style={styles.carouselEmoji}>{slide.emoji}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </ScrollView>

          {/* Indicadores de puntos */}
          <View style={styles.carouselIndicators}>
            {CAROUSEL_SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.carouselDot,
                  currentSlide === index && styles.carouselDotActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Banner promocional */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <View style={styles.promoLeft}>
              <View style={styles.promoIconContainer}>
                <Tag size={moderateScale(28)} color="#FFD700" variant="Bold" />
              </View>
              <View>
                <Text style={styles.promoTitle}>¡Ofertas Especiales!</Text>
                <Text style={styles.promoSubtitle}>Hasta 40% de descuento</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CARRUSEL DE OFERTAS POR MARCA - AUTOMÁTICO */}
        <View style={styles.brandOffersSection}>
          <View style={styles.brandOffersSectionHeader}>
            <View style={styles.brandOffersTitleRow}>
              <View>
                <Text style={styles.sectionTitle}>Ofertas por Marca 🏷️</Text>
                <Text style={styles.sectionSubtitle}>Descuentos exclusivos vigentes</Text>
              </View>
              <View style={styles.brandOffersCounter}>
                <Text style={styles.brandOffersCounterText}>
                  {currentBrandSlide + 1}/{BRAND_OFFERS.length}
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            ref={brandScrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brandOffersScroll}
            decelerationRate="fast"
            snapToInterval={scale(320) + scale(16)}
            snapToAlignment="start"
            onScroll={handleBrandScroll}
            scrollEventThrottle={16}
          >
            {BRAND_OFFERS.map((brandOffer, index) => (
              <Animated.View
                key={brandOffer.id}
                style={[
                  styles.brandOfferCardWrapper,
                  {
                    opacity: brandFadeAnim,
                    transform: [{
                      scale: brandFadeAnim.interpolate({
                        inputRange: [0.8, 1],
                        outputRange: [0.95, 1],
                      }),
                    }],
                  }
                ]}
              >
                <TouchableOpacity 
                  style={styles.brandOfferCard}
                  activeOpacity={0.95}
                >
                  {/* Fondo de color de la marca */}
                  <View style={[styles.brandOfferBackground, { backgroundColor: brandOffer.backgroundColor }]}>
                    {/* Efecto de brillo en el fondo */}
                    <View style={styles.brandOfferShine} />
                    
                    {/* Header con logo y descuento */}
                    <View style={styles.brandOfferTop}>
                      <View style={styles.brandOfferLogoContainer}>
                        <Text style={styles.brandOfferLogo}>{brandOffer.brandLogo}</Text>
                      </View>
                      <View style={styles.brandOfferDiscountBadge}>
                        <Text style={styles.brandOfferDiscountText}>{brandOffer.discount}</Text>
                      </View>
                    </View>

                    {/* Información de la marca */}
                    <View style={styles.brandOfferContent}>
                      <Text style={[styles.brandOfferBrandName, { color: brandOffer.textColor }]}>
                        {brandOffer.brand}
                      </Text>
                      <View style={styles.brandOfferCategoryContainer}>
                        <View style={styles.brandOfferCategoryBadge}>
                          <Text style={styles.brandOfferCategory}>
                            {brandOffer.category}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.brandOfferDescription, { color: brandOffer.textColor }]}>
                        {brandOffer.description}
                      </Text>
                    </View>

                    {/* Footer con validez */}
                    <View style={styles.brandOfferFooter}>
                      <View style={styles.brandOfferValidContainer}>
                        <Text style={[styles.brandOfferValidIcon, { color: brandOffer.textColor }]}>
                          ⏰
                        </Text>
                        <Text style={[styles.brandOfferValidText, { color: brandOffer.textColor }]}>
                          {brandOffer.validUntil}
                        </Text>
                      </View>
                      <View style={styles.brandOfferActionButton}>
                        <Text style={styles.brandOfferActionText}>Ver productos →</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>

          {/* Indicadores de puntos para ofertas de marca */}
          <View style={styles.brandOffersIndicators}>
            {BRAND_OFFERS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.brandOfferDot,
                  currentBrandSlide === index && styles.brandOfferDotActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Categorías horizontales */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.categoryNameActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Productos */}
        <View style={styles.productsSection}>
          <View style={styles.productsSectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === '1' ? 'Todos los productos' : 
                CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </Text>
            <Text style={styles.productsCount}>
              {filteredProducts.length} productos
            </Text>
          </View>

          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => handleProductPress(product)}
                activeOpacity={0.9}
              >
                {/* Badge de descuento */}
                {product.discount && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{product.discount}</Text>
                  </View>
                )}

                {/* Botón de favorito */}
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(product.id)}
                  activeOpacity={0.7}
                >
                  <Heart
                    size={moderateScale(20)}
                    color={favorites.includes(product.id) ? "#FF5252" : "#999"}
                    variant={favorites.includes(product.id) ? "Bold" : "Outline"}
                  />
                </TouchableOpacity>

                {/* Imagen del producto */}
                <View style={styles.productImageContainer}>
                  <Text style={styles.productImage}>{product.image}</Text>
                </View>

                {/* Información del producto */}
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.productDescription} numberOfLines={1}>
                    {product.description}
                  </Text>

                  {/* Rating */}
                  <View style={styles.ratingContainer}>
                    <Star1 size={moderateScale(14)} color="#FFD700" variant="Bold" />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                    <Text style={styles.reviewsText}>({product.reviews})</Text>
                  </View>

                  {/* Precio */}
                  <View style={styles.priceContainer}>
                    <View>
                      {product.originalPrice && (
                        <Text style={styles.originalPrice}>
                          {formatCurrency(product.originalPrice)}
                        </Text>
                      )}
                      <Text style={styles.productPrice}>
                        {formatCurrency(product.price)}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.addToCartButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        setCartCount(cartCount + 1);
                        Alert.alert("¡Agregado!", `${product.name} agregado al carrito`);
                      }}
                    >
                      <ShoppingCart size={moderateScale(18)} color="white" variant="Bold" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mensaje si no hay productos */}
        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateTitle}>No encontramos productos</Text>
            <Text style={styles.emptyStateSubtitle}>
              Intenta con otra búsqueda o categoría
            </Text>
          </View>
        )}
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Biyuyo © 2025</Text>
          <Text style={styles.footerSubtext}>Desarrollado por Ingenio Soluciones Ti</Text>
          <Text style={styles.footerSubtext}>Tu aliado financiero de confianza</Text>
        </View>
      </ScrollView>

      {/* MODAL DE DETALLES DEL PRODUCTO */}
      <Modal
        visible={showProductModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                {/* Header del modal */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setShowProductModal(false)}
                  >
                    <CloseCircle size={moderateScale(32)} color="#999" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalFavoriteButton}
                    onPress={() => toggleFavorite(selectedProduct.id)}
                  >
                    <Heart
                      size={moderateScale(24)}
                      color={favorites.includes(selectedProduct.id) ? "#FF5252" : "#999"}
                      variant={favorites.includes(selectedProduct.id) ? "Bold" : "Outline"}
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Imagen grande del producto */}
                  <View style={styles.modalProductImage}>
                    <Text style={styles.modalProductEmoji}>{selectedProduct.image}</Text>
                    {selectedProduct.discount && (
                      <View style={styles.modalDiscountBadge}>
                        <Text style={styles.modalDiscountText}>{selectedProduct.discount}</Text>
                      </View>
                    )}
                  </View>

                  {/* Categoría */}
                  <View style={styles.modalCategory}>
                    <Text style={styles.modalCategoryText}>{selectedProduct.category}</Text>
                  </View>

                  {/* Nombre y rating */}
                  <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                  
                  <View style={styles.modalRatingContainer}>
                    <View style={styles.modalRating}>
                      <Star1 size={moderateScale(18)} color="#FFD700" variant="Bold" />
                      <Text style={styles.modalRatingText}>{selectedProduct.rating}</Text>
                    </View>
                    <Text style={styles.modalReviews}>
                      ({selectedProduct.reviews} reseñas)
                    </Text>
                  </View>

                  {/* Precio */}
                  <View style={styles.modalPriceSection}>
                    {selectedProduct.originalPrice && (
                      <Text style={styles.modalOriginalPrice}>
                        {formatCurrency(selectedProduct.originalPrice)}
                      </Text>
                    )}
                    <Text style={styles.modalPrice}>
                      {formatCurrency(selectedProduct.price)}
                    </Text>
                  </View>

                  {/* Badges de disponibilidad y envío */}
                  <View style={styles.modalBadges}>
                    <View style={styles.modalBadge}>
                      <TickCircle size={moderateScale(16)} color="#4CAF50" variant="Bold" />
                      <Text style={styles.modalBadgeText}>En stock</Text>
                    </View>
                    <View style={styles.modalBadge}>
                      <TruckFast size={moderateScale(16)} color="#2196F3" variant="Bold" />
                      <Text style={styles.modalBadgeText}>Envío gratis</Text>
                    </View>
                  </View>

                  {/* Descripción larga */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Descripción</Text>
                    <Text style={styles.modalDescription}>
                      {selectedProduct.longDescription || selectedProduct.description}
                    </Text>
                  </View>

                  {/* Características */}
                  {selectedProduct.features && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Características principales</Text>
                      {selectedProduct.features.map((feature, index) => (
                        <View key={index} style={styles.modalFeatureItem}>
                          <TickCircle size={moderateScale(16)} color="#5B7FFF" variant="Bold" />
                          <Text style={styles.modalFeatureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Especificaciones */}
                  {selectedProduct.specifications && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Especificaciones técnicas</Text>
                      <View style={styles.modalSpecsTable}>
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <View key={key} style={styles.modalSpecRow}>
                            <Text style={styles.modalSpecKey}>{key}</Text>
                            <Text style={styles.modalSpecValue}>{value}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Espaciador final */}
                  <View style={{ height: verticalScale(100) }} />
                </ScrollView>

                {/* Footer con cantidad y botón de agregar */}
                <View style={styles.modalFooter}>
                  <View style={styles.modalQuantityContainer}>
                    <Text style={styles.modalQuantityLabel}>Cantidad</Text>
                    <View style={styles.modalQuantityControls}>
                      <TouchableOpacity
                        style={styles.modalQuantityButton}
                        onPress={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                      >
                        <Minus size={moderateScale(20)} color="#5B7FFF" variant="Bold" />
                      </TouchableOpacity>
                      <Text style={styles.modalQuantityText}>{productQuantity}</Text>
                      <TouchableOpacity
                        style={styles.modalQuantityButton}
                        onPress={() => setProductQuantity(productQuantity + 1)}
                      >
                        <Add size={moderateScale(20)} color="#5B7FFF" variant="Bold" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.modalAddButton}
                    onPress={handleAddToCart}
                    activeOpacity={0.85}
                  >
                    <ShoppingCart size={moderateScale(20)} color="white" variant="Bold" />
                    <Text style={styles.modalAddButtonText}>
                      Agregar • {formatCurrency(selectedProduct.price * productQuantity)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Menú flotante */}
      <FloatingBottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FD",
  },
  header: {
    backgroundColor: "white",
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(16),
    paddingHorizontal: scale(20),
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
  },
  logoImage: {
    width: scale(220),
    height: verticalScale(60),
    marginLeft: scale(-30),
  },
  cartButton: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: moderateScale(4),
    right: moderateScale(4),
    backgroundColor: "#FF5252",
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  cartBadgeText: {
    fontSize: scaleFont(10),
    fontWeight: "bold",
    color: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    gap: scale(10),
  },
  searchInput: {
    flex: 1,
    fontSize: scaleFont(14),
    color: "#1a1a1a",
    padding: 0,
  },
  clearSearch: {
    fontSize: scaleFont(18),
    color: "#999",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(120),
  },
  
  // ESTILOS DEL CARRUSEL DE PUBLICIDAD
  carouselContainer: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(12),
    height: verticalScale(200),
    position: 'relative',
  },
  carouselSlide: {
    width: width,
    paddingHorizontal: scale(16),
  },
  carouselGradient: {
    flex: 1,
    flexDirection: "row",
    borderRadius: moderateScale(24),
    padding: scale(24),
    position: "relative",
    overflow: 'hidden',
  },
  carouselContent: {
    flex: 1,
    justifyContent: "center",
    zIndex: 1,
  },
  carouselBadge: {
    fontSize: scaleFont(12),
    fontWeight: "800",
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignSelf: "flex-start",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(8),
    overflow: 'hidden',
  },
  carouselTitle: {
    fontSize: scaleFont(28),
    fontWeight: "900",
    color: "white",
    marginBottom: verticalScale(8),
    lineHeight: scaleFont(34),
  },
  carouselSubtitle: {
    fontSize: scaleFont(13),
    color: "rgba(255, 255, 255, 0.95)",
    fontWeight: "500",
    marginBottom: verticalScale(16),
    lineHeight: scaleFont(18),
  },
  carouselButton: {
    backgroundColor: "white",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  carouselButtonText: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  carouselImageContainer: {
    position: "absolute",
    right: scale(-10),
    top: "50%",
    transform: [{ translateY: -60 }],
    opacity: 0.25,
  },
  carouselEmoji: {
    fontSize: scaleFont(140),
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: verticalScale(12),
    left: 0,
    right: 0,
    gap: scale(8),
  },
  carouselDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  carouselDotActive: {
    width: scale(24),
    backgroundColor: 'white',
  },
  
  promoBanner: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(16),
    borderRadius: moderateScale(20),
    overflow: "hidden",
    backgroundColor: "#4CAF50",
  },
  promoContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(20),
  },
  promoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
    flex: 1,
  },
  promoIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  promoTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "white",
    marginBottom: verticalScale(2),
  },
  promoSubtitle: {
    fontSize: scaleFont(12),
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  promoButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
  },
  promoButtonText: {
    fontSize: scaleFont(13),
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  
  // ESTILOS DEL CARRUSEL DE OFERTAS POR MARCA - AUTOMÁTICO
  brandOffersSection: {
    marginBottom: verticalScale(24),
  },
  brandOffersSectionHeader: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(16),
  },
  brandOffersTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brandOffersCounter: {
    backgroundColor: "#5B7FFF",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(12),
  },
  brandOffersCounterText: {
    fontSize: scaleFont(12),
    fontWeight: "bold",
    color: "white",
  },
  sectionSubtitle: {
    fontSize: scaleFont(13),
    color: "#666",
    fontWeight: "500",
    marginTop: verticalScale(2),
  },
  brandOffersScroll: {
    paddingHorizontal: scale(16),
    gap: scale(16),
  },
  brandOfferCardWrapper: {
    width: scale(320),
  },
  brandOfferCard: {
    flex: 1,
    borderRadius: moderateScale(24),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  brandOfferBackground: {
    padding: scale(24),
    minHeight: verticalScale(240),
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  brandOfferShine: {
    position: "absolute",
    top: -50,
    right: -50,
    width: scale(200),
    height: scale(200),
    borderRadius: scale(100),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  brandOfferTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(20),
    zIndex: 1,
  },
  brandOfferLogoContainer: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  brandOfferLogo: {
    fontSize: scaleFont(36),
  },
  brandOfferDiscountBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(20),
    shadowColor: "#FFD700",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  brandOfferDiscountText: {
    fontSize: scaleFont(18),
    fontWeight: "900",
    color: "#1a1a1a",
  },
  brandOfferContent: {
    gap: verticalScale(10),
    marginBottom: verticalScale(20),
    zIndex: 1,
  },
  brandOfferBrandName: {
    fontSize: scaleFont(28),
    fontWeight: "900",
    lineHeight: scaleFont(32),
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  brandOfferCategoryContainer: {
    flexDirection: "row",
  },
  brandOfferCategoryBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
  },
  brandOfferCategory: {
    fontSize: scaleFont(12),
    fontWeight: "800",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  brandOfferDescription: {
    fontSize: scaleFont(14),
    lineHeight: scaleFont(20),
    opacity: 0.95,
    fontWeight: "500",
  },
  brandOfferFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  brandOfferValidContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(10),
  },
  brandOfferValidIcon: {
    fontSize: scaleFont(16),
  },
  brandOfferValidText: {
    fontSize: scaleFont(12),
    fontWeight: "700",
  },
  brandOfferActionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  brandOfferActionText: {
    fontSize: scaleFont(13),
    fontWeight: "800",
    color: "#1a1a1a",
  },
  brandOffersIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(16),
    gap: scale(8),
  },
  brandOfferDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#DDD',
  },
  brandOfferDotActive: {
    width: scale(28),
    backgroundColor: '#5B7FFF',
  },
  
  categoriesSection: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(14),
    paddingHorizontal: scale(16),
  },
  categoriesScroll: {
    paddingHorizontal: scale(16),
    gap: scale(10),
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(20),
    gap: scale(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryChipActive: {
    backgroundColor: "#5B7FFF",
  },
  categoryIcon: {
    fontSize: scaleFont(18),
  },
  categoryName: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    color: "#1a1a1a",
  },
  categoryNameActive: {
    color: "white",
  },
  productsSection: {
    paddingHorizontal: scale(16),
  },
  productsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(14),
  },
  productsCount: {
    fontSize: scaleFont(13),
    color: "#666",
    fontWeight: "500",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(12),
    marginBottom: CARD_MARGIN,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
  },
  discountBadge: {
    position: "absolute",
    top: scale(8),
    left: scale(8),
    backgroundColor: "#FF5252",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
    zIndex: 1,
  },
  discountText: {
    fontSize: scaleFont(10),
    fontWeight: "bold",
    color: "white",
  },
  favoriteButton: {
    position: "absolute",
    top: scale(8),
    right: scale(8),
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImageContainer: {
    width: "100%",
    height: verticalScale(120),
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  productImage: {
    fontSize: scaleFont(48),
  },
  productInfo: {
    gap: verticalScale(6),
  },
  productName: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "#1a1a1a",
    lineHeight: scaleFont(18),
  },
  productDescription: {
    fontSize: scaleFont(11),
    color: "#999",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },
  ratingText: {
    fontSize: scaleFont(12),
    fontWeight: "600",
    color: "#1a1a1a",
  },
  reviewsText: {
    fontSize: scaleFont(11),
    color: "#999",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: verticalScale(4),
  },
  originalPrice: {
    fontSize: scaleFont(11),
    color: "#999",
    textDecorationLine: "line-through",
  },
  productPrice: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#5B7FFF",
  },
  addToCartButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: "#5B7FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(60),
  },
  emptyStateIcon: {
    fontSize: scaleFont(64),
    marginBottom: verticalScale(16),
  },
  emptyStateTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(8),
  },
  emptyStateSubtitle: {
    fontSize: scaleFont(14),
    color: "#999",
    textAlign: "center",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    maxHeight: height * 0.95,
    paddingBottom: verticalScale(20),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(10),
  },
  modalCloseButton: {
    padding: scale(4),
  },
  modalFavoriteButton: {
    padding: scale(4),
  },
  modalProductImage: {
    width: "100%",
    height: verticalScale(250),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  modalProductEmoji: {
    fontSize: scaleFont(120),
  },
  modalDiscountBadge: {
    position: "absolute",
    top: scale(20),
    right: scale(20),
    backgroundColor: "#FF5252",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(12),
  },
  modalDiscountText: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "white",
  },
  modalCategory: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
  },
  modalCategoryText: {
    fontSize: scaleFont(13),
    color: "#5B7FFF",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  modalProductName: {
    fontSize: scaleFont(24),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginHorizontal: scale(20),
    marginTop: verticalScale(8),
    lineHeight: scaleFont(30),
  },
  modalRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: scale(20),
    marginTop: verticalScale(12),
    gap: scale(8),
  },
  modalRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  modalRatingText: {
    fontSize: scaleFont(16),
    fontWeight: "700",
    color: "#1a1a1a",
  },
  modalReviews: {
    fontSize: scaleFont(14),
    color: "#999",
  },
  modalPriceSection: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(16),
  },
  modalOriginalPrice: {
    fontSize: scaleFont(16),
    color: "#999",
    textDecorationLine: "line-through",
    marginBottom: verticalScale(4),
  },
  modalPrice: {
    fontSize: scaleFont(32),
    fontWeight: "bold",
    color: "#5B7FFF",
  },
  modalBadges: {
    flexDirection: "row",
    gap: scale(10),
    marginHorizontal: scale(20),
    marginTop: verticalScale(16),
  },
  modalBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(10),
    gap: scale(6),
  },
  modalBadgeText: {
    fontSize: scaleFont(12),
    fontWeight: "600",
    color: "#1a1a1a",
  },
  modalSection: {
    marginHorizontal: scale(20),
    marginTop: verticalScale(24),
  },
  modalSectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(12),
  },
  modalDescription: {
    fontSize: scaleFont(15),
    color: "#666",
    lineHeight: scaleFont(22),
  },
  modalFeatureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
    marginBottom: verticalScale(10),
  },
  modalFeatureText: {
    fontSize: scaleFont(14),
    color: "#1a1a1a",
    flex: 1,
  },
  modalSpecsTable: {
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(12),
    padding: scale(16),
  },
  modalSpecRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalSpecKey: {
    fontSize: scaleFont(14),
    color: "#666",
    fontWeight: "600",
  },
  modalSpecValue: {
    fontSize: scaleFont(14),
    color: "#1a1a1a",
    fontWeight: "600",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    gap: scale(10),
    backgroundColor: "white",
    alignItems: "center",
  },
  modalQuantityContainer: {
    flex: 1,
  },
  modalQuantityLabel: {
    fontSize: scaleFont(11),
    color: "#666",
    marginBottom: verticalScale(6),
    fontWeight: "600",
  },
  modalQuantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(10),
    padding: scale(3),
    gap: scale(6),
  },
  modalQuantityButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  modalQuantityText: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#1a1a1a",
    minWidth: scale(28),
    textAlign: "center",
  },
  modalAddButton: {
    flex: 1.5,
    flexDirection: "row",
    backgroundColor: "#5B7FFF",
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14),
    justifyContent: "center",
    alignItems: "center",
    gap: scale(8),
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalAddButtonText: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "white",
  },
  
  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: verticalScale(20),
    paddingBottom: verticalScale(30),
    paddingHorizontal: scale(16),
    marginTop: verticalScale(24),
  },
  footerText: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "600",
    marginBottom: verticalScale(3),
  },
  footerSubtext: {
    fontSize: scaleFont(11),
    color: "#bbb",
  },
});
