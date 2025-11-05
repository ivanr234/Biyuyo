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
  amount?: string;
}

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Crédito Rápido",
    description: "Hasta $500.000 en 24 horas",
    icon: "⚡",
    color: "#E3F2FD",
    amount: "$500K",
  },
  {
    id: "2",
    name: "Crédito Personal",
    description: "Hasta $2.000.000 flexible",
    icon: "💼",
    color: "#FFF3E0",
    amount: "$2M",
  },
  {
    id: "3",
    name: "Crédito Educativo",
    description: "Invierte en tu futuro",
    icon: "🎓",
    color: "#E8F5E9",
    amount: "$5M",
  },
  {
    id: "4",
    name: "Crédito Vivienda",
    description: "Tu hogar te espera",
    icon: "🏠",
    color: "#F3E5F5",
    amount: "$50M",
  },
  {
    id: "5",
    name: "Crédito Vehículo",
    description: "El auto de tus sueños",
    icon: "🚗",
    color: "#FFE5E5",
    amount: "$30M",
  },
];

interface ProductCarouselProps {
  onProductPress?: (product: Product) => void;
}

export default function ProductCarousel({ onProductPress }: ProductCarouselProps) {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos Disponibles</Text>
        <Text style={styles.subtitle}>Desliza para ver más</Text>
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
            <View style={[styles.iconContainer, { backgroundColor: product.color }]}>
              <Text style={styles.productIcon}>{product.icon}</Text>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Hasta</Text>
              <Text style={styles.amountValue}>{product.amount}</Text>
            </View>

            <View style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Solicitar</Text>
              <Text style={styles.applyButtonArrow}>→</Text>
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
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  firstCard: {
    // Primer card no necesita margen extra
  },
  lastCard: {
    marginRight: scale(20), // Último card con margen derecho
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
  amountContainer: {
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(12),
    padding: scale(12),
    marginBottom: verticalScale(16),
  },
  amountLabel: {
    fontSize: scaleFont(11),
    color: "#999",
    marginBottom: verticalScale(2),
    fontWeight: "600",
  },
  amountValue: {
    fontSize: scaleFont(24),
    fontWeight: "bold",
    color: "#5B7FFF",
  },
  applyButton: {
    flexDirection: "row",
    backgroundColor: "#5B7FFF",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(14),
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: scaleFont(15),
    fontWeight: "700",
    color: "white",
    marginRight: scale(8),
  },
  applyButtonArrow: {
    fontSize: scaleFont(18),
    color: "white",
    fontWeight: "bold",
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