import FloatingBottomMenu from "@/components/Floatingbottommenu";
import { useRouter } from "expo-router";
import { useState } from "react";
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
// Importar iconos de Iconsax
import {
  ArrowLeft,
  ArrowRight2,
  Calendar,
  CardPos,
  InfoCircle,
  Lock,
  Wallet,
} from 'iconsax-react-native';

const { width, height } = Dimensions.get("window");

// Funciones de escalado
const scale = (size: number) => (width / 375) * size;

const scaleFont = (size: number) => {
  const newSize = (width / 375) * size;
  if (Platform.OS === 'ios') {
    return Math.round(newSize);
  }
  return Math.round(newSize) - 1;
};

const verticalScale = (size: number) => (height / 812) * size;

const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

const isSmallDevice = width < 375;
const isShortDevice = height < 700;

export default function PayCreditScreen() {
  const router = useRouter();
  
  // Estados
  const [saldoPendiente] = useState(250000);
  const [cuotaMinima] = useState(50000);
  const [proximoVencimiento] = useState("15 Nov 2025");
  const [montoAPagar, setMontoAPagar] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  const handleAmountSelect = (amount: number) => {
    setMontoAPagar(amount.toString());
  };

  const handlePayment = () => {
    if (!montoAPagar || parseFloat(montoAPagar) <= 0) {
      Alert.alert("Error", "Por favor ingresa un monto válido");
      return;
    }
    if (!selectedMethod) {
      Alert.alert("Error", "Por favor selecciona un método de pago");
      return;
    }
    Alert.alert(
      "Confirmar Pago",
      `¿Deseas pagar ${formatCurrency(parseFloat(montoAPagar))}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar", 
          onPress: () => {
            // Aquí iría la lógica de pago
            Alert.alert("¡Éxito!", "Tu pago ha sido procesado correctamente");
            router.back();
          }
        }
      ]
    );
  };

  const metodoPago = [
    { 
      id: "pse", 
      nombre: "PSE", 
      logo: require('../../../assets/images/pse-logo.png'),
      descripcion: "Pago en línea" 
    },
    { 
      id: "nequi", 
      nombre: "Nequi", 
      logo: require('../../../assets/images/nequi-logo.png'),
      descripcion: "Pago digital" 
    },
    { 
      id: "daviplata", 
      nombre: "Daviplata", 
      logo: require('../../../assets/images/daviplata-logo.png'),
      descripcion: "Billetera digital" 
    },
    { 
      id: "tarjeta", 
      nombre: "Tarjeta", 
      icon: "card",
      descripcion: "Débito/Crédito" 
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
          <Text style={styles.headerTitle}>Pagar mi Crédito</Text>
          <Text style={styles.headerSubtitle}>Realiza tu pago fácilmente</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.logoMini}>
            <Image 
              source={require('../../../assets/images/logo-biyuyo.png')}
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
        {/* Resumen de Deuda */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIcon}>
              <Wallet size={28} color="#FF9800" variant="Bold" />
            </View>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Saldo Pendiente</Text>
              <Text 
                style={styles.summaryAmount}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {formatCurrency(saldoPendiente)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryDetails}>
            <View style={styles.summaryDetailRow}>
              <Text style={styles.summaryDetailLabel}>Cuota mínima</Text>
              <Text style={styles.summaryDetailValue}>{formatCurrency(cuotaMinima)}</Text>
            </View>
            <View style={styles.summaryDetailRow}>
              <View style={styles.detailLabelWithIcon}>
                <Calendar size={16} color="#666" variant="Bold" />
                <Text style={styles.summaryDetailLabel}>Próximo vencimiento</Text>
              </View>
              <Text style={[styles.summaryDetailValue, { color: '#FF5252' }]}>
                {proximoVencimiento}
              </Text>
            </View>
          </View>
        </View>

        {/* Monto a Pagar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Cuánto deseas pagar?</Text>
          
          {/* Input de Monto */}
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={montoAPagar}
              onChangeText={setMontoAPagar}
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
              onPress={() => handleAmountSelect(cuotaMinima)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickAmountLabel}>Cuota mínima</Text>
              <Text style={styles.quickAmountValue}>{formatCurrency(cuotaMinima)}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAmountButton}
              onPress={() => handleAmountSelect(saldoPendiente)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickAmountLabel}>Pagar todo</Text>
              <Text style={styles.quickAmountValue}>{formatCurrency(saldoPendiente)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Método de Pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de pago</Text>
          
          <View style={styles.paymentMethodsContainer}>
            {metodoPago.map((metodo) => (
              <TouchableOpacity
                key={metodo.id}
                style={[
                  styles.paymentMethodCard,
                  selectedMethod === metodo.id && styles.paymentMethodCardSelected
                ]}
                onPress={() => setSelectedMethod(metodo.id)}
                activeOpacity={0.7}
              >
                <View style={styles.paymentMethodLeft}>
                  <View style={[
                    styles.paymentMethodIcon,
                    selectedMethod === metodo.id && styles.paymentMethodIconSelected
                  ]}>
                    {metodo.icon === "card" ? (
                      <CardPos size={24} color="#5B7FFF" variant="Bold" />
                    ) : (
                      <Image 
                        source={metodo.logo}
                        style={styles.paymentMethodLogo}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                  <View style={styles.paymentMethodInfo}>
                    <Text style={styles.paymentMethodName}>{metodo.nombre}</Text>
                    <Text style={styles.paymentMethodDesc}>{metodo.descripcion}</Text>
                  </View>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedMethod === metodo.id && styles.radioButtonSelected
                ]}>
                  {selectedMethod === metodo.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Información Adicional */}
        <View style={styles.infoBox}>
          <View style={styles.infoIconContainer}>
            <InfoCircle size={24} color="#5B7FFF" variant="Bold" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Información importante</Text>
            <Text style={styles.infoText}>
              • Los pagos se procesan en tiempo real{'\n'}
              • Recibirás confirmación por correo{'\n'}
              • Tu saldo se actualizará automáticamente
            </Text>
          </View>
        </View>

        {/* Botón de Pago */}
        <TouchableOpacity 
          style={[
            styles.payButton,
            (!montoAPagar || !selectedMethod) && styles.payButtonDisabled
          ]}
          onPress={handlePayment}
          activeOpacity={0.85}
          disabled={!montoAPagar || !selectedMethod}
        >
          <Text style={styles.payButtonText}>
            Pagar {montoAPagar ? formatCurrency(parseFloat(montoAPagar)) : 'ahora'}
          </Text>
          <ArrowRight2 size={20} color="white" variant="Bold" />
        </TouchableOpacity>

        {/* Footer de seguridad */}
        <View style={styles.securityFooter}>
          <Lock size={16} color="#999" variant="Bold" />
          <Text style={styles.securityFooterText}>Pago 100% seguro y protegido</Text>
        </View>

        {/* Footer estándar */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Biyuyo © 2025</Text>
          <Text style={styles.footerSubtext}>Desarrollado por Ingenio Soluciones Ti</Text>
          <Text style={styles.footerSubtext}>Tu aliado financiero de confianza</Text>
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(91, 127, 255, 0.1)",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  summaryIcon: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: "#FFF3E0",
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
    color: "#5B7FFF",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: verticalScale(16),
  },
  summaryDetails: {
    gap: verticalScale(12),
  },
  summaryDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  summaryDetailLabel: {
    fontSize: scaleFont(13),
    color: "#666",
    fontWeight: "500",
  },
  summaryDetailValue: {
    fontSize: scaleFont(14),
    color: "#1a1a1a",
    fontWeight: "700",
  },

  // Section
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: scaleFont(17),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(14),
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    gap: scale(12),
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: moderateScale(14),
    padding: scale(16),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  quickAmountLabel: {
    fontSize: scaleFont(11),
    color: "#666",
    marginBottom: verticalScale(4),
    fontWeight: "500",
  },
  quickAmountValue: {
    fontSize: scaleFont(14),
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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

  // Pay Button
  payButton: {
    backgroundColor: "#5B7FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(18),
    borderRadius: moderateScale(20),
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: verticalScale(20),
    gap: scale(8),
  },
  payButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  payButtonText: {
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