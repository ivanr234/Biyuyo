import FloatingBottomMenu from "@/components/Floatingbottommenu";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight2,
  Building,
  InfoCircle,
  Location,
  Lock,
  MoneyRecive,
  Wallet,
} from "iconsax-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Funciones de escalado
const scale = (size: number) => (width / 375) * size;

const scaleFont = (size: number) => {
  const newSize = (width / 375) * size;
  if (Platform.OS === "ios") {
    return Math.round(newSize);
  }
  return Math.round(newSize) - 1;
};

const verticalScale = (size: number) => (height / 812) * size;

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Tipos
interface Establecimiento {
  id: string;
  nombre: string;
  logo: any;
  direccion: string;
  latitud: number;
  longitud: number;
  distancia?: number;
}

export default function WithdrawScreen() {
  const router = useRouter();

  // Estados
  const [cupoDisponible] = useState(500000);
  const [montoARetirar, setMontoARetirar] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [userLocation, setUserLocation] = useState({
    lat: 10.3932,
    lng: -75.4832,
  }); // Cartagena

  // Establecimientos aliados con coordenadas
  const [establecimientos] = useState<Establecimiento[]>([
    {
      id: "1",
      nombre: "Éxito Centro",
      logo: require("../../../assets/images/exito-logo.png"),
      direccion: "Av. Pedro de Heredia #30-52",
      latitud: 10.391,
      longitud: -75.4794,
    },
    {
      id: "2",
      nombre: "Olímpica Caribe",
      logo: require("../../../assets/images/olimpica-logo.png"),
      direccion: "Calle 30 #18-45",
      latitud: 10.3985,
      longitud: -75.492,
    },
    {
      id: "3",
      nombre: "Farmatodo Plaza",
      logo: require("../../../assets/images/farmatodo-logo.png"),
      direccion: "Centro Comercial La Plazuela",
      latitud: 10.3845,
      longitud: -75.4715,
    },
    {
      id: "4",
      nombre: "Superinter",
      logo: require("../../../assets/images/superinter-logo.png"),
      direccion: "Av. San Martín #45-12",
      latitud: 10.405,
      longitud: -75.501,
    },
  ]);

  const [establecimientosConDistancia, setEstablecimientosConDistancia] =
    useState<Establecimiento[]>([]);

  // Calcular distancia usando fórmula de Haversine
  const calcularDistancia = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    // Calcular distancias y ordenar
    const establecimientosActualizados = establecimientos
      .map((est) => ({
        ...est,
        distancia: calcularDistancia(
          userLocation.lat,
          userLocation.lng,
          est.latitud,
          est.longitud,
        ),
      }))
      .sort((a, b) => (a.distancia || 0) - (b.distancia || 0));

    setEstablecimientosConDistancia(establecimientosActualizados);
  }, [userLocation]);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString("es-CO")}`;
  };

  const formatDistancia = (distancia?: number) => {
    if (!distancia) return "";
    if (distancia < 1) {
      return `${Math.round(distancia * 1000)} m`;
    }
    return `${distancia.toFixed(1)} km`;
  };

  const handleAmountSelect = (amount: number) => {
    setMontoARetirar(amount.toString());
  };

  const handleWithdraw = () => {
    if (!montoARetirar || parseFloat(montoARetirar) <= 0) {
      Alert.alert("Error", "Por favor ingresa un monto válido");
      return;
    }
    if (parseFloat(montoARetirar) > cupoDisponible) {
      Alert.alert("Error", "El monto supera tu cupo disponible");
      return;
    }
    if (!selectedMethod) {
      Alert.alert("Error", "Por favor selecciona un método de retiro");
      return;
    }

    Alert.alert(
      "Confirmar Retiro",
      `¿Deseas retirar ${formatCurrency(parseFloat(montoARetirar))}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            Alert.alert("¡Éxito!", "Tu solicitud de retiro ha sido procesada");
            router.back();
          },
        },
      ],
    );
  };

  const metodosRetiro = [
    {
      id: "pse",
      nombre: "PSE",
      logo: require("../../../assets/images/pse-logo.png"),
      descripcion: "Transferencia bancaria",
    },
    {
      id: "nequi",
      nombre: "Nequi",
      logo: require("../../../assets/images/nequi-logo.png"),
      descripcion: "Envío a Nequi",
    },
    {
      id: "daviplata",
      nombre: "Daviplata",
      logo: require("../../../assets/images/daviplata-logo.png"),
      descripcion: "Envío a Daviplata",
    },
    {
      id: "establecimiento",
      nombre: "Establecimiento",
      icon: "building",
      descripcion: "Retiro en aliados",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#5B7FFF" variant="Bold" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Retirar Dinero</Text>
          <Text style={styles.headerSubtitle}>
            Retira desde tu cupo disponible
          </Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.logoMini}>
            <Image
              source={require("../../../assets/images/logo-biyuyo.png")}
              style={styles.logoMiniImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cupo Disponible */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIcon}>
              <MoneyRecive size={28} color="#5B7FFF" variant="Bold" />
            </View>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Cupo Disponible</Text>
              <Text
                style={styles.summaryAmount}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {formatCurrency(cupoDisponible)}
              </Text>
            </View>
          </View>
        </View>

        {/* Monto a Retirar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Cuánto deseas retirar?</Text>

          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={montoARetirar}
              onChangeText={setMontoARetirar}
              placeholder="0"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              maxLength={10}
            />
            <Text style={styles.currencySuffix}>COP</Text>
          </View>

          {/* Botones de Monto Rápido */}
          <View style={styles.quickAmountsContainer}>
            <TouchableOpacity
              style={styles.quickAmountButton}
              onPress={() => handleAmountSelect(100000)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickAmountValue}>
                {formatCurrency(100000)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAmountButton}
              onPress={() => handleAmountSelect(200000)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickAmountValue}>
                {formatCurrency(200000)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAmountButton}
              onPress={() => handleAmountSelect(500000)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickAmountValue}>
                {formatCurrency(500000)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Método de Retiro */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de retiro</Text>

          <View style={styles.paymentMethodsContainer}>
            {metodosRetiro.map((metodo) => (
              <TouchableOpacity
                key={metodo.id}
                style={[
                  styles.paymentMethodCard,
                  selectedMethod === metodo.id &&
                    styles.paymentMethodCardSelected,
                ]}
                onPress={() => setSelectedMethod(metodo.id)}
                activeOpacity={0.7}
              >
                <View style={styles.paymentMethodLeft}>
                  <View
                    style={[
                      styles.paymentMethodIcon,
                      selectedMethod === metodo.id &&
                        styles.paymentMethodIconSelected,
                    ]}
                  >
                    {metodo.icon === "building" ? (
                      <Building size={24} color="#5B7FFF" variant="Bold" />
                    ) : (
                      <Image
                        source={metodo.logo}
                        style={styles.paymentMethodLogo}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                  <View style={styles.paymentMethodInfo}>
                    <Text style={styles.paymentMethodName}>
                      {metodo.nombre}
                    </Text>
                    <Text style={styles.paymentMethodDesc}>
                      {metodo.descripcion}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    selectedMethod === metodo.id && styles.radioButtonSelected,
                  ]}
                >
                  {selectedMethod === metodo.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Carrusel de Establecimientos */}
        {selectedMethod === "establecimiento" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Establecimientos cercanos</Text>
              <View style={styles.locationBadge}>
                <Location size={14} color="#FF9800" variant="Bold" />
                <Text style={styles.locationText}>Cartagena</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContainer}
            >
              {establecimientosConDistancia.map((establecimiento, index) => (
                <View
                  key={establecimiento.id}
                  style={[
                    styles.establecimientoCard,
                    index === 0 && styles.establecimientoCardFirst,
                  ]}
                >
                  <View style={styles.establecimientoLogoContainer}>
                    <Image
                      source={establecimiento.logo}
                      style={styles.establecimientoLogo}
                      resizeMode="contain"
                    />
                  </View>

                  <Text style={styles.establecimientoNombre} numberOfLines={1}>
                    {establecimiento.nombre}
                  </Text>

                  <Text
                    style={styles.establecimientoDireccion}
                    numberOfLines={2}
                  >
                    {establecimiento.direccion}
                  </Text>

                  <View style={styles.distanciaContainer}>
                    <Location size={16} color="#5B7FFF" variant="Bold" />
                    <Text style={styles.distanciaText}>
                      {formatDistancia(establecimiento.distancia)}
                    </Text>
                  </View>

                  {index === 0 && (
                    <View style={styles.nearestBadge}>
                      <Text style={styles.nearestBadgeText}>Más cercano</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Información Adicional */}
        <View style={styles.infoBox}>
          <View style={styles.infoIconContainer}>
            <InfoCircle size={24} color="#5B7FFF" variant="Bold" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Información importante</Text>
            <Text style={styles.infoText}>
              • Los retiros se procesan en tiempo real{"\n"}•{" "}
              {selectedMethod === "establecimiento"
                ? "Presenta tu código QR en el establecimiento"
                : "Recibirás confirmación por correo"}
              {"\n"}• Tu cupo se actualizará automáticamente
            </Text>
          </View>
        </View>

        {/* Botón de Retiro */}
        <TouchableOpacity
          style={[
            styles.withdrawButton,
            (!montoARetirar || !selectedMethod) &&
              styles.withdrawButtonDisabled,
          ]}
          onPress={handleWithdraw}
          activeOpacity={0.85}
          disabled={!montoARetirar || !selectedMethod}
        >
          <Wallet size={20} color="white" variant="Bold" />
          <Text style={styles.withdrawButtonText}>
            Retirar{" "}
            {montoARetirar
              ? formatCurrency(parseFloat(montoARetirar))
              : "ahora"}
          </Text>
          <ArrowRight2 size={20} color="white" variant="Bold" />
        </TouchableOpacity>

        {/* Footer de seguridad */}
        <View style={styles.securityFooter}>
          <Lock size={16} color="#999" variant="Bold" />
          <Text style={styles.securityFooterText}>
            Retiro 100% seguro y protegido
          </Text>
        </View>

        {/* Footer estándar */}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: moderateScale(24),
    borderBottomRightRadius: moderateScale(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: scale(12),
  },
  headerTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(2),
  },
  headerSubtitle: {
    fontSize: scaleFont(12),
    color: "#666",
    fontWeight: "500",
  },
  headerRight: {
    width: moderateScale(40),
    alignItems: "center",
  },
  logoMini: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
    padding: scale(4),
  },
  logoMiniImage: {
    width: moderateScale(28),
    height: moderateScale(28),
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(120),
  },

  // Summary Card
  summaryCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(20),
    padding: scale(20),
    marginBottom: verticalScale(24),
    shadowColor: "#5B7FFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.1)",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryIcon: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(14),
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: scaleFont(13),
    color: "#666",
    marginBottom: verticalScale(4),
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: scaleFont(32),
    fontWeight: "bold",
    color: "#4CAF50",
  },

  // Section
  section: {
    marginBottom: verticalScale(24),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(14),
  },
  sectionTitle: {
    fontSize: scaleFont(17),
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    gap: scale(4),
  },
  locationText: {
    fontSize: scaleFont(11),
    color: "#FF9800",
    fontWeight: "700",
  },

  // Amount Input
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(18),
    marginBottom: verticalScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#5B7FFF",
  },
  currencySymbol: {
    fontSize: scaleFont(24),
    fontWeight: "bold",
    color: "#5B7FFF",
    marginRight: scale(8),
  },
  amountInput: {
    flex: 1,
    fontSize: scaleFont(28),
    fontWeight: "bold",
    color: "#1a1a1a",
    padding: 0,
  },
  currencySuffix: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    color: "#999",
    marginLeft: scale(8),
  },

  // Quick Amounts
  quickAmountsContainer: {
    flexDirection: "row",
    gap: scale(10),
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: moderateScale(14),
    padding: scale(14),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  quickAmountValue: {
    fontSize: scaleFont(13),
    color: "#5B7FFF",
    fontWeight: "bold",
  },

  // Payment Methods
  paymentMethodsContainer: {
    gap: verticalScale(12),
  },
  paymentMethodCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 2,
    borderColor: "transparent",
  },
  paymentMethodCardSelected: {
    borderColor: "#5B7FFF",
    backgroundColor: "#F8F9FD",
  },
  paymentMethodLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentMethodIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  paymentMethodIconSelected: {
    backgroundColor: "white",
  },
  paymentMethodLogo: {
    width: moderateScale(32),
    height: moderateScale(32),
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: scaleFont(15),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: verticalScale(2),
  },
  paymentMethodDesc: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "500",
  },
  radioButton: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#5B7FFF",
  },
  radioButtonInner: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    backgroundColor: "#5B7FFF",
  },

  // Carrusel de Establecimientos
  carouselContainer: {
    paddingRight: scale(20),
  },
  establecimientoCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginRight: scale(12),
    width: scale(200),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    position: "relative",
  },
  establecimientoCardFirst: {
    borderWidth: 2,
    borderColor: "#5B7FFF",
  },
  establecimientoLogoContainer: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
    alignSelf: "center",
  },
  establecimientoLogo: {
    width: moderateScale(48),
    height: moderateScale(48),
  },
  establecimientoNombre: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
    textAlign: "center",
  },
  establecimientoDireccion: {
    fontSize: scaleFont(11),
    color: "#999",
    marginBottom: verticalScale(12),
    textAlign: "center",
    lineHeight: scaleFont(16),
  },
  distanciaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3F2FD",
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(12),
    gap: scale(4),
  },
  distanciaText: {
    fontSize: scaleFont(12),
    color: "#5B7FFF",
    fontWeight: "700",
  },
  nearestBadge: {
    position: "absolute",
    top: scale(12),
    right: scale(12),
    backgroundColor: "#5B7FFF",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
  },
  nearestBadgeText: {
    fontSize: scaleFont(9),
    color: "white",
    fontWeight: "700",
  },

  // Info Box
  infoBox: {
    backgroundColor: "#E3F2FD",
    borderRadius: moderateScale(16),
    padding: scale(16),
    flexDirection: "row",
    marginBottom: verticalScale(24),
    borderWidth: 1,
    borderColor: "rgba(91, 127, 255, 0.2)",
  },
  infoIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: scaleFont(13),
    fontWeight: "700",
    color: "#5B7FFF",
    marginBottom: verticalScale(6),
  },
  infoText: {
    fontSize: scaleFont(12),
    color: "#666",
    lineHeight: scaleFont(18),
    fontWeight: "500",
  },

  // Withdraw Button
  withdrawButton: {
    backgroundColor: "#5B7FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(18),
    borderRadius: moderateScale(20),
    shadowColor: "#5B7FFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: verticalScale(20),
    gap: scale(8),
  },
  withdrawButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  withdrawButtonText: {
    color: "white",
    fontSize: scaleFont(17),
    fontWeight: "bold",
  },

  // Security Footer
  securityFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    gap: scale(6),
    marginBottom: verticalScale(24),
  },
  securityFooterText: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "600",
  },

  // Footer estándar
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
});
