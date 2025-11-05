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

export default function IncreaseQuotaScreen() {
  const router = useRouter();
  
  // Estados
  const [cupoActual] = useState(1000000);
  const [cupoDisponible] = useState(500000);
  const [montoSolicitado, setMontoSolicitado] = useState("");
  const [ingresoMensual, setIngresoMensual] = useState("");
  const [motivoSolicitud, setMotivoSolicitud] = useState("");
  const [selectedReason, setSelectedReason] = useState<string>("");

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  const handleAmountSelect = (amount: number) => {
    setMontoSolicitado(amount.toString());
  };

  const handleSubmit = () => {
    // Validaciones
    if (!montoSolicitado || parseFloat(montoSolicitado) <= 0) {
      Alert.alert("Error", "Por favor ingresa el monto que deseas solicitar");
      return;
    }
    if (!ingresoMensual || parseFloat(ingresoMensual) <= 0) {
      Alert.alert("Error", "Por favor ingresa tu ingreso mensual");
      return;
    }
    if (!selectedReason) {
      Alert.alert("Error", "Por favor selecciona un motivo para tu solicitud");
      return;
    }

    Alert.alert(
      "Solicitud Enviada",
      `Tu solicitud de aumento de cupo por ${formatCurrency(parseFloat(montoSolicitado))} ha sido enviada. Te notificaremos el resultado en 24-48 horas.`,
      [
        { 
          text: "Entendido", 
          onPress: () => router.back()
        }
      ]
    );
  };

  const motivosAumento = [
    { id: "negocio", nombre: "Negocio propio", icon: "💼", descripcion: "Expandir mi negocio" },
    { id: "emergencia", nombre: "Emergencia", icon: "🚨", descripcion: "Situación imprevista" },
    { id: "educacion", nombre: "Educación", icon: "📚", descripcion: "Estudios o capacitación" },
    { id: "mejoras", nombre: "Mejoras hogar", icon: "🏠", descripcion: "Arreglos o compras" },
    { id: "otro", nombre: "Otro motivo", icon: "📝", descripcion: "Especificar motivo" },
  ];

  const montosRapidos = [500000, 1000000, 2000000, 3000000];

  const cupoMaximoElegible = cupoActual * 2; // Puede solicitar hasta el doble

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
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Aumentar Cupo</Text>
          <Text style={styles.headerSubtitle}>Solicita más crédito disponible</Text>
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
        {/* Tarjeta de Estado Actual */}
        <View style={styles.currentStatusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIconContainer}>
              <Text style={styles.statusIcon}>💳</Text>
            </View>
            <Text style={styles.statusTitle}>Tu Cupo Actual</Text>
          </View>

          <View style={styles.statusDetails}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Cupo total</Text>
              <Text style={styles.statusValue}>{formatCurrency(cupoActual)}</Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Disponible</Text>
              <Text style={[styles.statusValue, { color: '#4CAF50' }]}>
                {formatCurrency(cupoDisponible)}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Máximo elegible</Text>
              <Text style={[styles.statusValue, { color: '#5B7FFF' }]}>
                {formatCurrency(cupoMaximoElegible)}
              </Text>
            </View>
          </View>

          <View style={styles.progressInfo}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(cupoDisponible / cupoActual) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {((cupoDisponible / cupoActual) * 100).toFixed(0)}% disponible
            </Text>
          </View>
        </View>

        {/* Formulario de Solicitud */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de la Solicitud</Text>

          {/* Monto Solicitado */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>¿Cuánto deseas aumentar?</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={montoSolicitado}
                onChangeText={setMontoSolicitado}
                placeholder="0"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
                maxLength={10}
              />
              <Text style={styles.currencySuffix}>COP</Text>
            </View>

            {/* Montos Rápidos */}
            <View style={styles.quickAmountsGrid}>
              {montosRapidos.map((monto) => (
                <TouchableOpacity
                  key={monto}
                  style={[
                    styles.quickAmountChip,
                    montoSolicitado === monto.toString() && styles.quickAmountChipSelected
                  ]}
                  onPress={() => handleAmountSelect(monto)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.quickAmountChipText,
                    montoSolicitado === monto.toString() && styles.quickAmountChipTextSelected
                  ]}>
                    {formatCurrency(monto)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ingreso Mensual */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Tu ingreso mensual</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>💰</Text>
              <TextInput
                style={styles.textInput}
                value={ingresoMensual}
                onChangeText={setIngresoMensual}
                placeholder="Ingresa tu ingreso mensual"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            <Text style={styles.inputHint}>
              💡 Un ingreso estable aumenta tus posibilidades de aprobación
            </Text>
          </View>

          {/* Motivo de Solicitud */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Motivo de la solicitud</Text>
            <View style={styles.reasonsContainer}>
              {motivosAumento.map((motivo) => (
                <TouchableOpacity
                  key={motivo.id}
                  style={[
                    styles.reasonCard,
                    selectedReason === motivo.id && styles.reasonCardSelected
                  ]}
                  onPress={() => setSelectedReason(motivo.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.reasonCardContent}>
                    <View style={[
                      styles.reasonIcon,
                      selectedReason === motivo.id && styles.reasonIconSelected
                    ]}>
                      <Text style={styles.reasonEmoji}>{motivo.icon}</Text>
                    </View>
                    <View style={styles.reasonTextContainer}>
                      <Text style={[
                        styles.reasonName,
                        selectedReason === motivo.id && styles.reasonNameSelected
                      ]}>
                        {motivo.nombre}
                      </Text>
                      <Text style={styles.reasonDesc}>{motivo.descripcion}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.radioButton,
                    selectedReason === motivo.id && styles.radioButtonSelected
                  ]}>
                    {selectedReason === motivo.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Detalle adicional si es "otro" */}
          {selectedReason === "otro" && (
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Describe tu motivo</Text>
              <TextInput
                style={styles.textAreaInput}
                value={motivoSolicitud}
                onChangeText={setMotivoSolicitud}
                placeholder="Cuéntanos por qué necesitas aumentar tu cupo..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          )}
        </View>

        {/* Información de Proceso */}
        <View style={styles.processCard}>
          <View style={styles.processHeader}>
            <Text style={styles.processIcon}>⏱️</Text>
            <Text style={styles.processTitle}>Proceso de aprobación</Text>
          </View>
          <View style={styles.processSteps}>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Envía tu solicitud</Text>
                <Text style={styles.stepDesc}>Completa el formulario con tus datos</Text>
              </View>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Análisis crediticio</Text>
                <Text style={styles.stepDesc}>Evaluamos tu perfil en 24-48 horas</Text>
              </View>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Recibe respuesta</Text>
                <Text style={styles.stepDesc}>Te notificamos por correo y app</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Consejos */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Consejos para aprobar tu solicitud</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>✓ Mantén tus pagos al día</Text>
            <Text style={styles.tipItem}>✓ Proporciona información verídica</Text>
            <Text style={styles.tipItem}>✓ Usa responsablemente tu cupo actual</Text>
            <Text style={styles.tipItem}>✓ Actualiza tus datos de contacto</Text>
          </View>
        </View>

        {/* Botón de Enviar */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!montoSolicitado || !ingresoMensual || !selectedReason) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          activeOpacity={0.85}
          disabled={!montoSolicitado || !ingresoMensual || !selectedReason}
        >
          <Text style={styles.submitButtonText}>Enviar Solicitud</Text>
          <Text style={styles.submitButtonArrow}>→</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🔒 Tu información está protegida y cifrada
          </Text>
        </View>
      </ScrollView>
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
  backIcon: {
    fontSize: scaleFont(24),
    color: "#5B7FFF",
    fontWeight: "bold",
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
    paddingBottom: verticalScale(30),
  },

  // Current Status Card
  currentStatusCard: {
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
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  statusIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  statusIcon: {
    fontSize: scaleFont(24),
  },
  statusTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  statusDetails: {
    gap: verticalScale(10),
    marginBottom: verticalScale(16),
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: scaleFont(13),
    color: "#666",
    fontWeight: "500",
  },
  statusValue: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  progressInfo: {
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  progressBar: {
    height: moderateScale(8),
    backgroundColor: "#f0f0f0",
    borderRadius: moderateScale(4),
    overflow: "hidden",
    marginBottom: verticalScale(8),
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: moderateScale(4),
  },
  progressText: {
    fontSize: scaleFont(12),
    color: "#4CAF50",
    fontWeight: "600",
    textAlign: "center",
  },

  // Form Section
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: scaleFont(17),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(16),
  },
  formGroup: {
    marginBottom: verticalScale(20),
  },
  formLabel: {
    fontSize: scaleFont(14),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: verticalScale(12),
  },

  // Amount Input
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(18),
    marginBottom: verticalScale(12),
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

  // Quick Amounts Grid
  quickAmountsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(10),
  },
  quickAmountChip: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "white",
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickAmountChipSelected: {
    borderColor: "#5B7FFF",
    backgroundColor: "#F8F9FD",
  },
  quickAmountChipText: {
    fontSize: scaleFont(13),
    fontWeight: "600",
    color: "#666",
  },
  quickAmountChipTextSelected: {
    color: "#5B7FFF",
    fontWeight: "700",
  },

  // Text Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: moderateScale(14),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  inputIcon: {
    fontSize: scaleFont(20),
    marginRight: scale(10),
  },
  textInput: {
    flex: 1,
    fontSize: scaleFont(15),
    color: "#1a1a1a",
    padding: 0,
  },
  inputHint: {
    fontSize: scaleFont(12),
    color: "#999",
    marginTop: verticalScale(8),
    fontWeight: "500",
  },
  textAreaInput: {
    backgroundColor: "white",
    borderRadius: moderateScale(14),
    padding: scale(16),
    fontSize: scaleFont(14),
    color: "#1a1a1a",
    minHeight: verticalScale(100),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  // Reasons
  reasonsContainer: {
    gap: verticalScale(10),
  },
  reasonCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(14),
    padding: scale(14),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 2,
    borderColor: "transparent",
  },
  reasonCardSelected: {
    borderColor: "#5B7FFF",
    backgroundColor: "#F8F9FD",
  },
  reasonCardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  reasonIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  reasonIconSelected: {
    backgroundColor: "white",
  },
  reasonEmoji: {
    fontSize: scaleFont(20),
  },
  reasonTextContainer: {
    flex: 1,
  },
  reasonName: {
    fontSize: scaleFont(14),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: verticalScale(2),
  },
  reasonNameSelected: {
    color: "#5B7FFF",
  },
  reasonDesc: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "500",
  },
  radioButton: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#5B7FFF",
  },
  radioButtonInner: {
    width: moderateScale(11),
    height: moderateScale(11),
    borderRadius: moderateScale(5.5),
    backgroundColor: "#5B7FFF",
  },

  // Process Card
  processCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: moderateScale(16),
    padding: scale(18),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: "rgba(91, 127, 255, 0.2)",
  },
  processHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  processIcon: {
    fontSize: scaleFont(24),
    marginRight: scale(10),
  },
  processTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#5B7FFF",
  },
  processSteps: {
    gap: verticalScale(14),
  },
  processStep: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumber: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: "#5B7FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  stepNumberText: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "white",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: scaleFont(14),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: verticalScale(2),
  },
  stepDesc: {
    fontSize: scaleFont(12),
    color: "#666",
    fontWeight: "500",
  },

  // Tips Card
  tipsCard: {
    backgroundColor: "#FFF9E6",
    borderRadius: moderateScale(16),
    padding: scale(18),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  tipsTitle: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(12),
  },
  tipsList: {
    gap: verticalScale(8),
  },
  tipItem: {
    fontSize: scaleFont(13),
    color: "#666",
    fontWeight: "500",
  },

  // Submit Button
  submitButton: {
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
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "white",
    fontSize: scaleFont(17),
    fontWeight: "bold",
    marginRight: scale(8),
  },
  submitButtonArrow: {
    color: "white",
    fontSize: scaleFont(20),
    fontWeight: "bold",
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: verticalScale(16),
  },
  footerText: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "600",
    textAlign: "center",
  },
});