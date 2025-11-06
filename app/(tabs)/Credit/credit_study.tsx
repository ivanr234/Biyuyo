import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Función para escalar dimensiones
const scale = (size: number) => (width / 375) * size;

// Función para escalar fuentes
const scaleFont = (size: number) => {
  const newSize = (width / 375) * size;
  if (Platform.OS === 'ios') {
    return Math.round(newSize);
  }
  return Math.round(newSize) - 1;
};

// Función para escalar altura vertical
const verticalScale = (size: number) => (height / 812) * size;

// Función de escala moderada
const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Detectar tamaños de dispositivo
const isSmallDevice = width < 375;

// Configuración de préstamos
const MIN_AMOUNT = 100000;
const MAX_AMOUNT = 5000000;
const STEP_AMOUNT = 50000;
const INTEREST_RATE = 0.025; // 2.5% mensual
const ADMIN_FEE_RATE = 0.02; // 2% del monto
const INSURANCE_RATE = 0.01; // 1% del monto

// Opciones de plazos en meses
const TERM_OPTIONS = [3, 6, 9, 12, 18, 24];

export default function CreditStudyScreen() {
  const router = useRouter();
  const [creditAmount, setCreditAmount] = useState(1000000);
  const [selectedTerm, setSelectedTerm] = useState(12);

  // Formatear números a pesos colombianos
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calcular valores del préstamo
  const calculateLoanDetails = () => {
    const adminFee = creditAmount * ADMIN_FEE_RATE;
    const insurance = creditAmount * INSURANCE_RATE;
    const totalInterest = creditAmount * INTEREST_RATE * selectedTerm;
    const totalToPay = creditAmount + totalInterest + adminFee + insurance;
    const monthlyPayment = totalToPay / selectedTerm;

    return {
      adminFee,
      insurance,
      totalInterest,
      totalToPay,
      monthlyPayment,
      amountToReceive: creditAmount - adminFee - insurance,
    };
  };

  const loanDetails = calculateLoanDetails();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header con logo - Estilo del perfil */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Solicitud de Crédito</Text>
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
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sección del monto */}
        <View style={styles.amountSection}>
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>¿Cuánto necesitas?</Text>
            <Text style={styles.amountValue}>{formatCurrency(creditAmount)}</Text>
            
            {/* Slider */}
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={MIN_AMOUNT}
                maximumValue={MAX_AMOUNT}
                step={STEP_AMOUNT}
                value={creditAmount}
                onValueChange={setCreditAmount}
                minimumTrackTintColor="#FFD700"
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor="#FFD700"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>{formatCurrency(MIN_AMOUNT)}</Text>
                <Text style={styles.sliderLabel}>{formatCurrency(MAX_AMOUNT)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sección de plazo */}
        <View style={styles.termSection}>
          <Text style={styles.sectionTitle}>¿En cuánto tiempo pagarás?</Text>
          <View style={styles.termOptions}>
            {TERM_OPTIONS.map((term) => (
              <TouchableOpacity
                key={term}
                style={[
                  styles.termOption,
                  selectedTerm === term && styles.termOptionSelected
                ]}
                onPress={() => setSelectedTerm(term)}
              >
                <Text style={[
                  styles.termOptionText,
                  selectedTerm === term && styles.termOptionTextSelected
                ]}>
                  {term}
                </Text>
                <Text style={[
                  styles.termOptionLabel,
                  selectedTerm === term && styles.termOptionLabelSelected
                ]}>
                  {term === 1 ? 'mes' : 'meses'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Resumen del préstamo */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Resumen de tu crédito</Text>
          
          <View style={styles.summaryCard}>
            {/* Monto solicitado */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Monto solicitado</Text>
              <Text style={styles.summaryValue}>{formatCurrency(creditAmount)}</Text>
            </View>

            <View style={styles.divider} />

            {/* Desglose de cargos */}
            <View style={styles.chargesSection}>
              <Text style={styles.chargesTitle}>Cargos del préstamo</Text>
              
              <View style={styles.chargeRow}>
                <Text style={styles.chargeLabel}>Cuota de administración ({(ADMIN_FEE_RATE * 100).toFixed(1)}%)</Text>
                <Text style={styles.chargeValue}>- {formatCurrency(loanDetails.adminFee)}</Text>
              </View>
              
              <View style={styles.chargeRow}>
                <Text style={styles.chargeLabel}>Seguro ({(INSURANCE_RATE * 100).toFixed(1)}%)</Text>
                <Text style={styles.chargeValue}>- {formatCurrency(loanDetails.insurance)}</Text>
              </View>
              
              <View style={styles.chargeRow}>
                <Text style={styles.chargeLabel}>Intereses ({(INTEREST_RATE * 100).toFixed(1)}% mensual)</Text>
                <Text style={styles.chargeValue}>+ {formatCurrency(loanDetails.totalInterest)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Total a pagar */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelBold}>Total a pagar</Text>
              <Text style={styles.summaryValueBold}>{formatCurrency(loanDetails.totalToPay)}</Text>
            </View>
          </View>
        </View>

        {/* Cuota mensual destacada */}
        <View style={styles.monthlyPaymentSection}>
          <View style={styles.monthlyPaymentCard}>
            <View style={styles.monthlyPaymentHeader}>
              <Text style={styles.monthlyPaymentLabel}>Pagarás mensualmente</Text>
              <View style={styles.monthlyPaymentBadge}>
                <Text style={styles.monthlyPaymentBadgeText}>{selectedTerm} meses</Text>
              </View>
            </View>
            <Text style={styles.monthlyPaymentValue}>{formatCurrency(loanDetails.monthlyPayment)}</Text>
            <Text style={styles.monthlyPaymentSubtext}>por mes</Text>
          </View>
        </View>

        {/* Recibirás */}
        <View style={styles.receiveSection}>
          <View style={styles.receiveCard}>
            <View style={styles.receiveIconContainer}>
              <Text style={styles.receiveIcon}>💰</Text>
            </View>
            <Text style={styles.receiveLabel}>Recibirás en tu cuenta</Text>
            <Text style={styles.receiveValue}>{formatCurrency(loanDetails.amountToReceive)}</Text>
            <Text style={styles.receiveSubtext}>
              Después de descontar la administración y el seguro
            </Text>
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⚡</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Aprobación rápida</Text>
                <Text style={styles.infoText}>Respuesta en menos de 24 horas</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🔒</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>100% seguro</Text>
                <Text style={styles.infoText}>Tus datos están protegidos</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📱</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Todo digital</Text>
                <Text style={styles.infoText}>Sin papeleos ni trámites engorrosos</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Botón de continuar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.continueButton}
            activeOpacity={0.8}
            onPress={() => router.push("/verifications/phone_verification")}
          >
            <Text style={styles.continueButtonText}>Continuar con la solicitud</Text>
            <Text style={styles.continueButtonArrow}>→</Text>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            Al continuar aceptas nuestros términos y condiciones
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Header - Estilo del perfil
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
  
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(30),
  },

  // Amount Section
  amountSection: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
  },
  amountCard: {
    backgroundColor: 'white',
    borderRadius: moderateScale(24),
    padding: scale(24),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  amountLabel: {
    fontSize: scaleFont(16),
    color: '#666',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  amountValue: {
    fontSize: scaleFont(36),
    fontWeight: 'bold',
    color: '#5B7FFF',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  sliderContainer: {
    marginTop: verticalScale(10),
  },
  slider: {
    width: '100%',
    height: verticalScale(40),
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(8),
  },
  sliderLabel: {
    fontSize: scaleFont(11),
    color: '#999',
  },

  // Term Section
  termSection: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(24),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: verticalScale(16),
  },
  termOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  termOption: {
    flex: 1,
    minWidth: scale(100),
    backgroundColor: 'white',
    borderRadius: moderateScale(16),
    padding: scale(16),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  termOptionSelected: {
    backgroundColor: '#5B7FFF',
    borderColor: '#5B7FFF',
  },
  termOptionText: {
    fontSize: scaleFont(24),
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  termOptionTextSelected: {
    color: 'white',
  },
  termOptionLabel: {
    fontSize: scaleFont(12),
    color: '#666',
    marginTop: verticalScale(4),
  },
  termOptionLabelSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Summary Section
  summarySection: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(24),
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: moderateScale(20),
    padding: scale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  summaryLabel: {
    fontSize: scaleFont(14),
    color: '#666',
  },
  summaryValue: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#1a1a1a',
  },
  summaryLabelBold: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  summaryValueBold: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: '#5B7FFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: verticalScale(12),
  },
  chargesSection: {
    paddingVertical: verticalScale(8),
  },
  chargesTitle: {
    fontSize: scaleFont(13),
    fontWeight: '600',
    color: '#999',
    marginBottom: verticalScale(12),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chargeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(6),
  },
  chargeLabel: {
    fontSize: scaleFont(13),
    color: '#666',
    flex: 1,
  },
  chargeValue: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#666',
  },

  // Monthly Payment Section
  monthlyPaymentSection: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(24),
  },
  monthlyPaymentCard: {
    backgroundColor: '#FFD700',
    borderRadius: moderateScale(20),
    padding: scale(24),
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  monthlyPaymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  monthlyPaymentLabel: {
    fontSize: scaleFont(14),
    color: '#1a1a1a',
    fontWeight: '600',
  },
  monthlyPaymentBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
  },
  monthlyPaymentBadgeText: {
    fontSize: scaleFont(12),
    color: '#1a1a1a',
    fontWeight: '600',
  },
  monthlyPaymentValue: {
    fontSize: scaleFont(32),
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  monthlyPaymentSubtext: {
    fontSize: scaleFont(14),
    color: '#1a1a1a',
    opacity: 0.7,
    marginTop: verticalScale(4),
  },

  // Receive Section
  receiveSection: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(24),
  },
  receiveCard: {
    backgroundColor: 'white',
    borderRadius: moderateScale(20),
    padding: scale(24),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5B7FFF',
    borderStyle: 'dashed',
  },
  receiveIconContainer: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  receiveIcon: {
    fontSize: scaleFont(28),
  },
  receiveLabel: {
    fontSize: scaleFont(14),
    color: '#666',
    marginBottom: verticalScale(8),
  },
  receiveValue: {
    fontSize: scaleFont(28),
    fontWeight: 'bold',
    color: '#5B7FFF',
    marginBottom: verticalScale(8),
  },
  receiveSubtext: {
    fontSize: scaleFont(12),
    color: '#999',
    textAlign: 'center',
    lineHeight: scaleFont(16),
  },

  // Info Section
  infoSection: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(24),
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: moderateScale(20),
    padding: scale(20),
    gap: verticalScale(16),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: scaleFont(24),
    marginRight: scale(12),
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: verticalScale(2),
  },
  infoText: {
    fontSize: scaleFont(12),
    color: '#666',
    lineHeight: scaleFont(16),
  },

  // Button
  buttonContainer: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(32),
  },
  continueButton: {
    backgroundColor: '#5B7FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(24),
    shadowColor: '#5B7FFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    color: 'white',
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    marginRight: scale(8),
  },
  continueButtonArrow: {
    color: 'white',
    fontSize: scaleFont(18),
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: scaleFont(11),
    color: '#999',
    textAlign: 'center',
    marginTop: verticalScale(12),
    lineHeight: scaleFont(16),
  },
});