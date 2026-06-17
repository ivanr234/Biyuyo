import FloatingBottomMenu from "@/components/Floatingbottommenu";
import ProductCarousel from "@/components/ProductCarousel";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Importar iconos de Iconsax
import {
  ArrowRight2,
  Calendar,
  ChartSquare,
  Gift,
  Key,
  Logout,
  MessageQuestion,
  MoneyRecive,
  Notification,
  Wallet,
} from "iconsax-react-native";
import Svg, { Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// Función para escalar dimensiones basadas en el ancho de pantalla
const scale = (size: number) => (width / 375) * size;

// Función para escalar fuentes
const scaleFont = (size: number) => {
  const newSize = (width / 375) * size;
  if (Platform.OS === "ios") {
    return Math.round(newSize);
  }
  return Math.round(newSize) - 1;
};

// Función para escalar altura vertical
const verticalScale = (size: number) => (height / 812) * size;

// Función de escala moderada (para que no todo escale proporcionalmente)
const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Detectar si es un dispositivo pequeño (menor a 375px de ancho)
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;
const isLargeDevice = width >= 414;

// Componente de animación circular para el timer
const CircularProgress = ({
  progress,
  size = 56,
}: {
  progress: number;
  size?: number;
}) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        {/* Círculo de fondo */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Círculo de progreso */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#5B7FFF"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.circularProgressContent}>
        <Key size={18} color="#5B7FFF" variant="Bold" />
      </View>
    </View>
  );
};

// Componente de Skeleton
const SkeletonLoader = () => {
  const [fadeAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header Skeleton */}
      <View style={styles.header}>
        <Animated.View style={[styles.skeletonLogo, { opacity: fadeAnim }]} />
        <View style={styles.headerBottom}>
          <View style={styles.greetingContainer}>
            <Animated.View
              style={[styles.skeletonGreeting, { opacity: fadeAnim }]}
            />
            <Animated.View
              style={[styles.skeletonSubGreeting, { opacity: fadeAnim }]}
            />
          </View>
          <View style={styles.headerRightActions}>
            <Animated.View
              style={[styles.skeletonNotification, { opacity: fadeAnim }]}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Card Skeleton */}
        <Animated.View
          style={[styles.skeletonMainCard, { opacity: fadeAnim }]}
        />

        {/* Info Grid Skeleton */}
        <View style={styles.infoGrid}>
          <Animated.View
            style={[styles.skeletonInfoCard, { opacity: fadeAnim }]}
          />
          <Animated.View
            style={[styles.skeletonInfoCard, { opacity: fadeAnim }]}
          />
        </View>

        {/* Product Carousel Skeleton */}
        <View style={styles.section}>
          <Animated.View
            style={[styles.skeletonSectionTitle, { opacity: fadeAnim }]}
          />
          <View style={styles.skeletonProductsContainer}>
            <Animated.View
              style={[styles.skeletonProduct, { opacity: fadeAnim }]}
            />
            <Animated.View
              style={[styles.skeletonProduct, { opacity: fadeAnim }]}
            />
          </View>
        </View>

        {/* Actions Skeleton */}
        <View style={styles.section}>
          <Animated.View
            style={[styles.skeletonSectionTitle, { opacity: fadeAnim }]}
          />
          <Animated.View
            style={[styles.skeletonAction, { opacity: fadeAnim }]}
          />
          <Animated.View
            style={[styles.skeletonAction, { opacity: fadeAnim }]}
          />
          <Animated.View
            style={[styles.skeletonAction, { opacity: fadeAnim }]}
          />
          <Animated.View
            style={[styles.skeletonAction, { opacity: fadeAnim }]}
          />
        </View>
      </ScrollView>

      <FloatingBottomMenu />
    </View>
  );
};

export default function DashboardScreen() {
  const router = useRouter();

  // Estado de carga
  const [isLoading, setIsLoading] = useState(true);

  // Datos del usuario
  const [cupoDisponible] = useState(500000);
  const [cupoTotal] = useState(1000000);
  const [creditoActivo] = useState(250000);
  const [proximoPago] = useState("15 Nov 2025");
  const [userName] = useState("Usuario");

  // Estado para la clave dinámica
  const [dynamicKey, setDynamicKey] = useState("000000");
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showKeyExpanded, setShowKeyExpanded] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [greetingAnim] = useState(new Animated.Value(0));

  // Generar clave dinámica de 6 dígitos
  const generateDynamicKey = () => {
    const key = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    setDynamicKey(key);
    setTimeRemaining(60);
  };

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Generar clave inicial y configurar timer
  useEffect(() => {
    generateDynamicKey();
  }, []);

  // Timer para la clave dinámica
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          generateDynamicKey();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString("es-CO")}`;
  };

  const porcentajeUsado = ((cupoTotal - cupoDisponible) / cupoTotal) * 100;
  const progressPercentage = (timeRemaining / 60) * 100;

  const handleProductPress = (product: any) => {
    Alert.alert(
      product.name,
      `¿Deseas solicitar ${product.name}?\n\n${product.description}`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Solicitar",
          onPress: () => {
            Alert.alert(
              "Solicitud iniciada",
              "Serás redirigido al proceso de solicitud",
            );
          },
        },
      ],
    );
  };

  const handleKeyPress = () => {
    setShowKeyExpanded(!showKeyExpanded);

    // Animar los números
    Animated.timing(slideAnim, {
      toValue: showKeyExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Animar el saludo (sube/baja suavemente)
    Animated.timing(greetingAnim, {
      toValue: showKeyExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  };

  const handleCopyKey = () => {
    Alert.alert("Clave copiada", `Clave ${dynamicKey} copiada al portapapeles`);
  };

  // Mostrar skeleton mientras carga
  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header mejorado con clave dinámica */}
      <View style={styles.header}>
        {/* Logo principal */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/logo-biyuyo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Saludo y acciones */}
        <View style={styles.headerBottom}>
          <Animated.View
            style={[
              styles.greetingContainer,
              {
                transform: [
                  {
                    translateY: greetingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -3],
                    }),
                  },
                ],
                opacity: greetingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.85],
                }),
              },
            ]}
          >
            <Text style={styles.greeting}>Hola, {userName}</Text>
            <Text style={styles.subGreeting}>¿Qué quieres hacer hoy?</Text>
          </Animated.View>

          <View style={styles.headerRightActions}>
            {/* Contenedor para los números y el círculo */}
            <View style={styles.keyContainer}>
              {/* Números de la clave */}
              {showKeyExpanded && (
                <Animated.View
                  style={[
                    styles.keyNumbersRow,
                    {
                      opacity: slideAnim,
                      transform: [
                        {
                          translateX: slideAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {dynamicKey.split("").map((digit, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.miniDigitBox}
                      onPress={handleCopyKey}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.miniDigitText}>{digit}</Text>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              )}

              {/* Botón circular con animación de progreso */}
              <TouchableOpacity
                style={styles.dynamicKeyButton}
                onPress={handleKeyPress}
                activeOpacity={0.7}
              >
                <CircularProgress progress={progressPercentage} size={56} />
                <View style={styles.keyBadge}>
                  <Text style={styles.keyBadgeText}>{timeRemaining}s</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Botón de Notificaciones */}
            <TouchableOpacity style={styles.notificationButton}>
              <Notification size={22} color="#5B7FFF" variant="Bold" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Tarjeta Principal de Cupo con gradiente */}
        <View style={styles.mainCard}>
          <View style={styles.cardGradient}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Text style={styles.cardTitle}>Tu Cupo Disponible</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Activo</Text>
                </View>
              </View>
              <View style={styles.cardIcon}>
                <Wallet size={26} color="#FFD700" variant="Bold" />
              </View>
            </View>

            <View style={styles.amountContainer}>
              <Text
                style={styles.mainAmount}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {formatCurrency(cupoDisponible)}
              </Text>
              <Text style={styles.mainSubtext}>
                de {formatCurrency(cupoTotal)} COP
              </Text>
            </View>

            {/* Barra de progreso mejorada */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Cupo utilizado</Text>
                <Text style={styles.progressPercentage}>
                  {porcentajeUsado.toFixed(0)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${porcentajeUsado}%` },
                  ]}
                />
              </View>
            </View>

            {/* Botón principal */}
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>Solicitar Crédito</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tarjetas de información mejoradas */}
        <View style={styles.infoGrid}>
          {/* Crédito Activo */}
          <View style={styles.infoCard}>
            <View
              style={[styles.infoIconContainer, { backgroundColor: "#E3F2FD" }]}
            >
              <MoneyRecive size={24} color="#2196F3" variant="Bold" />
            </View>
            <Text style={styles.infoLabel}>Crédito Activo</Text>
            <Text
              style={styles.infoAmount}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {formatCurrency(creditoActivo)}
            </Text>
            <Text style={styles.infoSubtext}>En uso actualmente</Text>
          </View>

          {/* Próximo Pago */}
          <View style={styles.infoCard}>
            <View
              style={[styles.infoIconContainer, { backgroundColor: "#FFF3E0" }]}
            >
              <Calendar size={24} color="#FF9800" variant="Bold" />
            </View>
            <Text style={styles.infoLabel}>Próximo Pago</Text>
            <Text style={styles.infoDate}>{proximoPago}</Text>
            <Text style={styles.infoSubtext}>Fecha límite</Text>
          </View>
        </View>

        {/* ===== CARRUSEL DE PRODUCTOS ===== */}
        <ProductCarousel onProductPress={handleProductPress} />

        {/* Acciones Rápidas con mejor diseño */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

          {/* PAGAR MIS SERVICIOS PÚBLICOS - NUEVO */}
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/Services/Pay_services")}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: "#FFF9E6" }]}>
                <Gift size={24} color="#FFA000" variant="Bold" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>
                  Pagar mis servicios públicos
                </Text>
                <Text style={styles.actionSubtitle}>Agua, luz, gas y más</Text>
              </View>
            </View>
            <View style={styles.actionArrowContainer}>
              <ArrowRight2 size={20} color="#5B7FFF" variant="Bold" />
            </View>
          </TouchableOpacity>

          {/* PAGAR MI CRÉDITO */}
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/Credit/pay_credit")}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: "#E8F5E9" }]}>
                <Wallet size={24} color="#4CAF50" variant="Bold" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Pagar mi crédito</Text>
                <Text style={styles.actionSubtitle}>
                  Realiza un abono o paga tu cuota
                </Text>
              </View>
            </View>
            <View style={styles.actionArrowContainer}>
              <ArrowRight2 size={20} color="#5B7FFF" variant="Bold" />
            </View>
          </TouchableOpacity>

          {/* HISTORIAL DE CRÉDITOS */}
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/Credit/credit_history")}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: "#F3E5F5" }]}>
                <ChartSquare size={24} color="#9C27B0" variant="Bold" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Historial de créditos</Text>
                <Text style={styles.actionSubtitle}>
                  Consulta tus movimientos
                </Text>
              </View>
            </View>
            <View style={styles.actionArrowContainer}>
              <ArrowRight2 size={20} color="#5B7FFF" variant="Bold" />
            </View>
          </TouchableOpacity>

          {/* RETIRAR CUPO */}
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/withdrawals")}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: "#FFF3E0" }]}>
                <Gift size={24} color="#FF9800" variant="Bold" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Retirar Dinero</Text>
                <Text style={styles.actionSubtitle}>
                  retira el dinero disponible en tu cupo
                </Text>
              </View>
            </View>

            <View style={styles.actionArrowContainer}>
              <ArrowRight2 size={20} color="#5B7FFF" variant="Bold" />
            </View>
          </TouchableOpacity>

          {/* SOPORTE Y AYUDA */}
          <TouchableOpacity
            style={styles.actionItem}
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/Help")}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: "#E1F5FE" }]}>
                <MessageQuestion size={24} color="#03A9F4" variant="Bold" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Soporte y ayuda</Text>
                <Text style={styles.actionSubtitle}>Chatea con nosotros</Text>
              </View>
            </View>
            <View style={styles.actionArrowContainer}>
              <ArrowRight2 size={20} color="#5B7FFF" variant="Bold" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar sesión mejorado */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.push("/")}
          activeOpacity={0.7}
        >
          <Logout size={20} color="#FF5252" variant="Bold" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Biyuyo © 2025</Text>
          <Text style={styles.footerSubtext}>
            Desarrollado por Ingenio Soluciones Ti
          </Text>
          <Text style={styles.footerSubtext}>
            Tu aliado financiero de confianza
          </Text>
        </View>
      </ScrollView>

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
    paddingBottom: verticalScale(20),
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
  logoContainer: {
    alignItems: "center",
    marginBottom: verticalScale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(16),
  },
  logoImage: {
    width: scale(200),
    height: verticalScale(65),
    maxWidth: 250,
    maxHeight: 80,
  },
  headerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: scaleFont(22),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  subGreeting: {
    fontSize: scaleFont(13),
    color: "#666",
    fontWeight: "500",
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  // Contenedor que agrupa los números y el círculo
  keyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    position: "relative",
  },
  // Estilos para el botón de clave dinámica
  dynamicKeyButton: {
    position: "relative",
    width: moderateScale(56),
    height: moderateScale(56),
    justifyContent: "center",
    alignItems: "center",
  },
  circularProgressContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  keyBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#5B7FFF",
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(8),
    borderWidth: 2,
    borderColor: "white",
  },
  keyBadgeText: {
    fontSize: scaleFont(9),
    fontWeight: "bold",
    color: "white",
  },
  // Estilos para los números expandibles
  keyNumbersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(3),
  },
  miniDigitBox: {
    width: moderateScale(20),
    height: moderateScale(26),
    backgroundColor: "white",
    borderRadius: moderateScale(6),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#5B7FFF",
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  miniDigitText: {
    fontSize: scaleFont(12),
    fontWeight: "bold",
    color: "#5B7FFF",
  },
  notificationButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: moderateScale(4),
    right: moderateScale(4),
    backgroundColor: "#FF5252",
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: {
    fontSize: scaleFont(9),
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(120),
  },
  mainCard: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(16),
    borderRadius: moderateScale(24),
    overflow: "hidden",
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  cardGradient: {
    backgroundColor: "#5B7FFF",
    padding: scale(20),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(16),
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: scale(8),
  },
  cardTitle: {
    fontSize: scaleFont(14),
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    marginBottom: verticalScale(8),
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(16),
    alignSelf: "flex-start",
  },
  statusDot: {
    width: moderateScale(7),
    height: moderateScale(7),
    borderRadius: moderateScale(3.5),
    backgroundColor: "#4CAF50",
    marginRight: scale(5),
  },
  statusText: {
    color: "white",
    fontSize: scaleFont(11),
    fontWeight: "700",
  },
  cardIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  amountContainer: {
    marginBottom: verticalScale(20),
  },
  mainAmount: {
    fontSize: isSmallDevice ? scaleFont(36) : scaleFont(42),
    fontWeight: "bold",
    color: "white",
    marginBottom: verticalScale(4),
    letterSpacing: -0.5,
  },
  mainSubtext: {
    fontSize: scaleFont(14),
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  progressContainer: {
    marginBottom: verticalScale(20),
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  progressLabel: {
    fontSize: scaleFont(12),
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
  progressPercentage: {
    fontSize: scaleFont(12),
    color: "#FFD700",
    fontWeight: "bold",
  },
  progressBar: {
    height: moderateScale(9),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: moderateScale(4.5),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: moderateScale(4.5),
  },
  primaryButton: {
    backgroundColor: "#FFD700",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(16),
    shadowColor: "#FFD700",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    gap: scale(6),
  },
  primaryButtonText: {
    color: "#1a1a1a",
    fontSize: scaleFont(15),
    fontWeight: "bold",
  },
  infoGrid: {
    flexDirection: "row",
    gap: scale(12),
    marginBottom: verticalScale(16),
  },
  infoCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  infoIconContainer: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  infoLabel: {
    fontSize: scaleFont(11),
    color: "#999",
    marginBottom: verticalScale(5),
    fontWeight: "500",
  },
  infoAmount: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(3),
  },
  infoDate: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "#5B7FFF",
    marginBottom: verticalScale(3),
  },
  infoSubtext: {
    fontSize: scaleFont(10),
    color: "#bbb",
  },
  section: {
    marginBottom: verticalScale(20),
    marginTop: verticalScale(10),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(14),
    paddingHorizontal: scale(2),
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: scale(15),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: scale(8),
  },
  actionIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
    flexShrink: 0,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: scaleFont(14),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: verticalScale(2),
  },
  actionSubtitle: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "500",
  },
  actionArrowContainer: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(16),
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(8),
    marginBottom: verticalScale(20),
    borderWidth: 2,
    borderColor: "#FFE5E5",
    shadowColor: "#FF5252",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    gap: scale(8),
  },
  logoutText: {
    color: "#FF5252",
    fontSize: scaleFont(15),
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    paddingVertical: verticalScale(20),
    paddingBottom: verticalScale(30),
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

  // ===== SKELETON STYLES =====
  skeletonLogo: {
    width: "60%",
    height: verticalScale(65),
    backgroundColor: "#E0E0E0",
    borderRadius: moderateScale(16),
    alignSelf: "center",
    marginBottom: verticalScale(16),
  },
  skeletonGreeting: {
    width: "70%",
    height: verticalScale(24),
    backgroundColor: "#E0E0E0",
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(8),
  },
  skeletonSubGreeting: {
    width: "50%",
    height: verticalScale(16),
    backgroundColor: "#E0E0E0",
    borderRadius: moderateScale(6),
  },
  skeletonNotification: {
    width: moderateScale(44),
    height: moderateScale(44),
    backgroundColor: "#E0E0E0",
    borderRadius: moderateScale(22),
  },
  skeletonMainCard: {
    width: "100%",
    height: verticalScale(280),
    backgroundColor: "#E0E0E0",
    borderRadius: moderateScale(24),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(16),
  },
  skeletonInfoCard: {
    flex: 1,
    height: verticalScale(140),
    backgroundColor: "#E0E0E0",
    borderRadius: moderateScale(16),
  },
  skeletonSectionTitle: {
    width: "40%",
    height: verticalScale(20),
    backgroundColor: "#E0E0E0",
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(14),
  },
  skeletonProductsContainer: {
    flexDirection: "row",
    gap: scale(12),
  },
  skeletonProduct: {
    width: (width - scale(44)) / 2,
    height: verticalScale(220),
    backgroundColor: "#E0E0E0",
    borderRadius: moderateScale(16),
  },
  skeletonAction: {
    width: "100%",
    height: verticalScale(72),
    backgroundColor: "#E0E0E0",
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(10),
  },
});
