import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

// Funciones de escalado (las mismas que usas en tu código)
const scale = (size: number) => (width / 375) * size;
const scaleFont = (size: number) => {
  const newSize = (width / 375) * size;
  if (Platform.OS === 'ios') {
    return Math.round(newSize);
  }
  return Math.round(newSize) - 1;
};
const verticalScale = (size: number) => (812 / 812) * size;
const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  price: string;
  category: string;
}

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Smartphone Pro",
    description: "Última generación, 128GB",
    icon: "📱",
    color: "#E3F2FD",
    price: "$899.990",
    category: "Tecnología",
  },
  {
    id: "2",
    name: "Auriculares Bluetooth",
    description: "Cancelación de ruido activa",
    icon: "🎧",
    color: "#FFF3E0",
    price: "$149.990",
    category: "Audio",
  },
  {
    id: "3",
    name: "Cafetera Espresso",
    description: "Café profesional en casa",
    icon: "☕",
    color: "#E8F5E9",
    price: "$299.990",
    category: "Hogar",
  },
  {
    id: "4",
    name: "Zapatillas Running",
    description: "Comodidad y rendimiento",
    icon: "👟",
    color: "#F3E5F5",
    price: "$179.990",
    category: "Deportes",
  },
  {
    id: "5",
    name: "Mochila Inteligente",
    description: "Puerto USB y compartimentos",
    icon: "🎒",
    color: "#FFE5E5",
    price: "$89.990",
    category: "Accesorios",
  },
  {
    id: "6",
    name: "Tablet 10 pulgadas",
    description: "Perfecta para estudiar y trabajar",
    icon: "💻",
    color: "#E1F5FE",
    price: "$549.990",
    category: "Tecnología",
  },
  {
    id: "7",
    name: "Reloj Inteligente",
    description: "Monitoreo fitness 24/7",
    icon: "⌚",
    color: "#FFF9C4",
    price: "$249.990",
    category: "Wearables",
  },
  {
    id: "8",
    name: "Parlante Portátil",
    description: "Sonido 360° resistente al agua",
    icon: "🔊",
    color: "#F0F4C3",
    price: "$129.990",
    category: "Audio",
  },
];

interface ProductCarouselProps {
  onProductPress?: (product: Product) => void;
  onSeeMorePress?: () => void;
}

export default function ProductCarousel({ onProductPress, onSeeMorePress }: ProductCarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % PRODUCTS.length;
        
        // Scroll to next item
        scrollViewRef.current?.scrollTo({
          x: nextIndex * (scale(280) + scale(16)),
          animated: true,
        });
        
        return nextIndex;
      });
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  const handleProductPress = (product: Product) => {
    if (onProductPress) {
      onProductPress(product);
    }
  };

  const handleSeeMorePress = () => {
    if (onSeeMorePress) {
      onSeeMorePress();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Productos Destacados</Text>
          <Text style={styles.subtitle}>Descubre las mejores ofertas</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.seeMoreButton}
          onPress={handleSeeMorePress}
          activeOpacity={0.7}
        >
          <Text style={styles.seeMoreText}>Ver más</Text>
          <Text style={styles.seeMoreArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={scale(280) + scale(16)}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / (scale(280) + scale(16))
          );
          setCurrentIndex(newIndex);
        }}
      >
        {PRODUCTS.map((product, index) => (
          <TouchableOpacity
            key={product.id}
            style={[
              styles.productCard,
              index === 0 && styles.firstCard,
              index === PRODUCTS.length - 1 && styles.lastCard,
            ]}
            onPress={() => handleProductPress(product)}
            activeOpacity={0.9}
          >
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>

            <View style={[styles.iconContainer, { backgroundColor: product.color }]}>
              <Text style={styles.productIcon}>{product.icon}</Text>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Precio</Text>
              <Text style={styles.priceValue}>{product.price}</Text>
            </View>

            <View style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Agregar al carrito</Text>
              <Text style={styles.buyButtonIcon}>🛒</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Indicadores de página */}
      <View style={styles.indicatorContainer}>
        {PRODUCTS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(24),
  },
  header: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  subtitle: {
    fontSize: scaleFont(13),
    color: "#999",
    fontWeight: "500",
  },
  seeMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(14),
    borderRadius: moderateScale(20),
    gap: scale(4),
  },
  seeMoreText: {
    fontSize: scaleFont(13),
    fontWeight: "600",
    color: "#5B7FFF",
  },
  seeMoreArrow: {
    fontSize: scaleFont(14),
    color: "#5B7FFF",
    fontWeight: "bold",
  },
  scrollContent: {
    paddingLeft: scale(20),
    paddingRight: scale(4),
  },
  productCard: {
    width: scale(280),
    backgroundColor: "white",
    borderRadius: moderateScale(20),
    padding: scale(20),
    marginRight: scale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  firstCard: {
    // Primer card no necesita margen extra
  },
  lastCard: {
    marginRight: scale(20), // Último card con margen derecho
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#5B7FFF",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  categoryText: {
    fontSize: scaleFont(11),
    color: "white",
    fontWeight: "600",
  },
  iconContainer: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  productIcon: {
    fontSize: scaleFont(30),
  },
  productInfo: {
    marginBottom: verticalScale(16),
  },
  productName: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(6),
  },
  productDescription: {
    fontSize: scaleFont(14),
    color: "#666",
    lineHeight: scaleFont(20),
  },
  priceContainer: {
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(12),
    padding: scale(12),
    marginBottom: verticalScale(16),
  },
  priceLabel: {
    fontSize: scaleFont(11),
    color: "#999",
    marginBottom: verticalScale(2),
    fontWeight: "600",
  },
  priceValue: {
    fontSize: scaleFont(24),
    fontWeight: "bold",
    color: "#2ECC71",
  },
  buyButton: {
    flexDirection: "row",
    backgroundColor: "#5B7FFF",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(14),
    justifyContent: "center",
    alignItems: "center",
  },
  buyButtonText: {
    fontSize: scaleFont(15),
    fontWeight: "700",
    color: "white",
    marginRight: scale(8),
  },
  buyButtonIcon: {
    fontSize: scaleFont(18),
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(16),
    gap: scale(8),
  },
  indicator: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: "#E0E0E0",
  },
  activeIndicator: {
    backgroundColor: "#5B7FFF",
    width: scale(24),
  },
});