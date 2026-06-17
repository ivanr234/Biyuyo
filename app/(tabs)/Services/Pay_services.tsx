import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight2,
  Call,
  Card,
  Cards,
  DocumentText,
  Drop,
  Electricity,
  Flashy,
  InfoCircle,
  Lock1,
  TickCircle,
  Wallet2,
} from 'iconsax-react-native';
import { useState } from "react";
import {
  Alert,
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
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Funciones de escala
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

// Tipos de servicios
const serviceTypes = [
  {
    id: 'agua',
    name: 'Agua',
    icon: Drop,
    color: '#03A9F4',
    bgColor: '#E1F5FE',
    gradient: ['#03A9F4', '#0288D1'],
  },
  {
    id: 'luz',
    name: 'Luz',
    icon: Electricity,
    color: '#FFC107',
    bgColor: '#FFF9E6',
    gradient: ['#FFC107', '#FFA000'],
  },
  {
    id: 'gas',
    name: 'Gas',
    icon: Flashy,
    color: '#FF5722',
    bgColor: '#FBE9E7',
    gradient: ['#FF5722', '#E64A19'],
  },
  {
    id: 'telefonia',
    name: 'Telefonía',
    icon: Call,
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    gradient: ['#9C27B0', '#7B1FA2'],
  },
  {
    id: 'transporte',
    name: 'Transporte',
    icon: Card,
    color: '#4CAF50',
    bgColor: '#E8F5E9',
    gradient: ['#4CAF50', '#388E3C'],
  },
];

// Métodos de pago
const paymentMethods = [
  {
    id: 'biyuyo',
    name: 'Crédito Biyuyo',
    description: 'Usa tu cupo disponible',
    type: 'icon',
    icon: Wallet2,
    color: '#5B7FFF',
    bgColor: '#F8F9FD',
  },
  {
    id: 'tarjeta',
    name: 'Tarjeta',
    description: 'Débito/Crédito',
    type: 'icon',
    icon: Cards,
    color: '#5B7FFF',
    bgColor: '#F8F9FD',
  },
  {
    id: 'nequi',
    name: 'Nequi',
    description: 'Pago digital',
    type: 'logo',
    logo: require('../../../assets/images/nequi-logo.png'),
    color: '#5B7FFF',
    bgColor: '#F8F9FD',
  },
  {
    id: 'daviplata',
    name: 'Daviplata',
    description: 'Billetera digital',
    type: 'logo',
    logo: require('../../../assets/images/daviplata-logo.png'),
    color: '#5B7FFF',
    bgColor: '#F8F9FD',
  },
  {
    id: 'pse',
    name: 'PSE',
    description: 'Pago en línea',
    type: 'logo',
    logo: require('../../../assets/images/pse-logo.png'),
    color: '#5B7FFF',
    bgColor: '#F8F9FD',
  },
];

export default function PayServicesScreen() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  
  // Estados para información de tarjeta
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setReferenceNumber('');
    setCardNumber('');
    setAmount('');
    setPaymentMethod(null);
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    if (methodId === 'tarjeta') {
      setShowCardModal(true);
    } else {
      setPaymentMethod(methodId);
    }
  };

  const handleCardModalClose = () => {
    setShowCardModal(false);
    setCardData({
      number: '',
      name: '',
      expiry: '',
      cvv: '',
    });
  };

  const handleCardModalConfirm = () => {
    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
      Alert.alert('Error', 'Por favor completa todos los campos de la tarjeta');
      return;
    }
    setPaymentMethod('tarjeta');
    setShowCardModal(false);
  };

  const handlePayment = () => {
    const service = serviceTypes.find(s => s.id === selectedService);
    
    if (!service) {
      Alert.alert('Error', 'Por favor selecciona un servicio');
      return;
    }

    if (selectedService === 'transporte') {
      if (!cardNumber.trim()) {
        Alert.alert('Error', 'Por favor ingresa el número de tarjeta');
        return;
      }
      if (!amount.trim()) {
        Alert.alert('Error', 'Por favor ingresa el monto a recargar');
        return;
      }
    } else {
      if (!referenceNumber.trim()) {
        Alert.alert('Error', 'Por favor ingresa la referencia de pago');
        return;
      }
    }

    if (!paymentMethod) {
      Alert.alert('Error', 'Por favor selecciona un método de pago');
      return;
    }

    setLoading(true);
    
    const paymentMethodNames: Record<string, string> = {
      biyuyo: 'Crédito Biyuyo',
      tarjeta: 'Tarjeta',
      nequi: 'Nequi',
      daviplata: 'Daviplata',
      pse: 'PSE'
    };
    
    // Simular proceso de pago
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        '¡Pago Exitoso!',
        selectedService === 'transporte' 
          ? `Recarga de $${amount} realizada en la tarjeta ${cardNumber}\nMétodo de pago: ${paymentMethodNames[paymentMethod]}`
          : `Pago del servicio de ${service.name} realizado con referencia ${referenceNumber}\nMétodo de pago: ${paymentMethodNames[paymentMethod]}`,
        [
          {
            text: 'Ver Comprobante',
            onPress: () => {
              // Navegar a la vista de comprobante
              router.push({
                pathname: '/(tabs)/Services/Payment_receipt',
                params: {
                  id: `BYY-${Date.now()}`,
                  servicio: selectedService,
                  nombreServicio: service.name,
                  fecha: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }),
                  hora: new Date().toLocaleTimeString('es-CO'),
                  monto: selectedService === 'transporte' ? amount : '145000',
                  referencia: selectedService === 'transporte' ? `Tarjeta ${cardNumber}` : referenceNumber,
                  metodoPago: paymentMethodNames[paymentMethod],
                  estado: 'Aprobado',
                }
              });
            }
          },
          {
            text: 'Aceptar',
            onPress: () => {
              setSelectedService(null);
              setReferenceNumber('');
              setCardNumber('');
              setAmount('');
              setPaymentMethod(null);
            }
          }
        ]
      );
    }, 2000);
  };

  const selectedServiceData = serviceTypes.find(s => s.id === selectedService);

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
          <Text style={styles.headerTitle}>Pagar Servicios</Text>
          <Text style={styles.headerSubtitle}>Paga tus servicios fácilmente</Text>
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
        {/* Sección de introducción */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>¿Qué servicio deseas pagar?</Text>
          <Text style={styles.introSubtitle}>
            Selecciona el servicio y completa la información requerida
          </Text>
        </View>

        {/* Botón de Historial de Pagos */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push('/(tabs)/Services/Services_history')}
          activeOpacity={0.7}
        >
          <View style={styles.historyButtonContent}>
            <View style={styles.historyButtonIcon}>
              <DocumentText size={24} color="#5B7FFF" variant="Bold" />
            </View>
            <View style={styles.historyButtonText}>
              <Text style={styles.historyButtonTitle}>Ver Historial de Pagos</Text>
              <Text style={styles.historyButtonSubtitle}>Consulta todos tus pagos realizados</Text>
            </View>
            <ArrowRight2 size={20} color="#5B7FFF" variant="Bold" />
          </View>
        </TouchableOpacity>

        {/* Grid de servicios */}
        <View style={styles.servicesGrid}>
          {serviceTypes.map((service) => {
            const isSelected = selectedService === service.id;
            const IconComponent = service.icon;
            
            return (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceCard,
                  isSelected && [styles.serviceCardSelected, { borderColor: service.color }]
                ]}
                onPress={() => handleServiceSelect(service.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.serviceIconContainer, { backgroundColor: service.bgColor }]}>
                  <IconComponent size={28} color={service.color} variant="Bold" />
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
                {isSelected && (
                  <View style={[styles.selectedIndicator, { backgroundColor: service.color }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Formulario de pago */}
        {selectedService && selectedServiceData && (
          <View style={styles.formSection}>
            <View style={[styles.formHeader, { backgroundColor: selectedServiceData.bgColor }]}>
              <View style={styles.formHeaderContent}>
                <View style={[styles.formIconContainer, { backgroundColor: 'white' }]}>
                  {(() => {
                    const IconComp = selectedServiceData.icon;
                    return <IconComp size={24} color={selectedServiceData.color} variant="Bold" />;
                  })()}
                </View>
                <View style={styles.formHeaderText}>
                  <Text style={styles.formTitle}>Pago de {selectedServiceData.name}</Text>
                  <Text style={styles.formSubtitle}>
                    {selectedService === 'transporte' 
                      ? 'Recarga tu tarjeta de transporte'
                      : 'Completa los datos de pago'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.formContent}>
              {selectedService === 'transporte' ? (
                <>
                  {/* Número de tarjeta */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Número de Tarjeta</Text>
                    <View style={styles.inputContainer}>
                      <Card size={20} color="#999" variant="Bold" />
                      <TextInput
                        style={styles.input}
                        placeholder="Ej: 1234567890"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        keyboardType="numeric"
                        maxLength={16}
                        placeholderTextColor="#999"
                      />
                    </View>
                    <Text style={styles.inputHint}>
                      Ingresa el número de tu tarjeta de transporte público
                    </Text>
                  </View>

                  {/* Monto a recargar */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Monto a Recargar</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                  {/* Montos sugeridos */}
                  <View style={styles.quickAmountsSection}>
                    <Text style={styles.quickAmountsLabel}>Montos sugeridos</Text>
                    <View style={styles.quickAmountsGrid}>
                      {['5000', '10000', '20000', '50000'].map((quickAmount) => (
                        <TouchableOpacity
                          key={quickAmount}
                          style={[
                            styles.quickAmountButton,
                            amount === quickAmount && styles.quickAmountButtonSelected
                          ]}
                          onPress={() => setAmount(quickAmount)}
                          activeOpacity={0.7}
                        >
                          <Text style={[
                            styles.quickAmountText,
                            amount === quickAmount && styles.quickAmountTextSelected
                          ]}>
                            ${parseInt(quickAmount).toLocaleString('es-CO')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              ) : (
                <>
                  {/* Referencia de pago */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Referencia de Pago</Text>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Ej: 123456789"
                        value={referenceNumber}
                        onChangeText={setReferenceNumber}
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                      />
                    </View>
                    <Text style={styles.inputHint}>
                      Encuentra esta referencia en tu factura
                    </Text>
                  </View>

                  {/* Info adicional */}
                  <View style={styles.infoBox}>
                    <View style={styles.infoIconContainer}>
                      <InfoCircle size={20} color="#5B7FFF" variant="Bold" />
                    </View>
                    <Text style={styles.infoBoxText}>
                      El monto a pagar se consultará automáticamente con la referencia ingresada
                    </Text>
                  </View>
                </>
              )}

              {/* Botón de pago */}
              <TouchableOpacity
                style={[
                  styles.payButton,
                  { backgroundColor: selectedServiceData.color },
                  loading && styles.payButtonDisabled
                ]}
                onPress={handlePayment}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={styles.payButtonText}>
                  {loading ? 'Procesando...' : 'Realizar Pago'}
                </Text>
                {!loading && <ArrowRight2 size={20} color="white" variant="Bold" />}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Métodos de pago - Solo mostrar si hay un servicio seleccionado */}
        {selectedService && (
          <View style={styles.paymentMethodsSection}>
            <Text style={styles.paymentMethodsTitle}>Método de Pago</Text>
            <Text style={styles.paymentMethodsSubtitle}>
              Selecciona cómo deseas pagar
            </Text>

            <View style={styles.paymentMethodsList}>
              {paymentMethods.map((method) => {
                const isSelected = paymentMethod === method.id;

                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.paymentMethodCard,
                      isSelected && [
                        styles.paymentMethodCardSelected,
                        { borderColor: method.color }
                      ]
                    ]}
                    onPress={() => handlePaymentMethodSelect(method.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.paymentMethodContent}>
                      <View style={[
                        styles.paymentMethodIcon,
                        { backgroundColor: method.bgColor }
                      ]}>
                        {method.type === 'icon' ? (
                          (() => {
                            const IconComponent = method.icon;
                            return <IconComponent size={24} color={method.color} variant="Bold" />;
                          })()
                        ) : (
                          <Image 
                            source={method.logo} 
                            style={styles.paymentMethodLogo}
                            resizeMode="contain"
                          />
                        )}
                      </View>
                      
                      <View style={styles.paymentMethodInfo}>
                        <Text style={styles.paymentMethodName}>{method.name}</Text>
                        <Text style={styles.paymentMethodDescription}>
                          {method.description}
                        </Text>
                      </View>
                    </View>

                    <View style={[
                      styles.radioButton,
                      isSelected && [
                        styles.radioButtonSelected,
                        { backgroundColor: "#5B7FFF" }
                      ]
                    ]}>
                      {isSelected && <View style={styles.radioButtonInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Mensaje cuando no hay servicio seleccionado */}
        {!selectedService && (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <TickCircle size={48} color="#5B7FFF" variant="Bold" />
            </View>
            <Text style={styles.emptyStateText}>
              Selecciona un servicio para continuar
            </Text>
          </View>
        )}

        {/* Información adicional */}
        <View style={styles.footerInfo}>
          <View style={styles.footerInfoHeader}>
            <Lock1 size={20} color="#2E7D32" variant="Bold" />
            <Text style={styles.footerInfoTitle}>Pago Seguro</Text>
          </View>
          <Text style={styles.footerInfoText}>
            Todos tus pagos están protegidos con encriptación de nivel bancario
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Biyuyo © 2025</Text>
          <Text style={styles.footerSubtext}>Desarrollado por Ingenio Soluciones Ti</Text>
          <Text style={styles.footerSubtext}>Tu aliado financiero de confianza</Text>
        </View>
      </ScrollView>

      {/* Modal para información de tarjeta */}
      <Modal
        visible={showCardModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCardModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Información de Tarjeta</Text>
              <TouchableOpacity
                onPress={handleCardModalClose}
                style={styles.modalCloseButton}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              {/* Número de tarjeta */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalInputLabel}>Número de Tarjeta</Text>
                <View style={styles.modalInputContainer}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="0000 0000 0000 0000"
                    value={cardData.number}
                    onChangeText={(text) => setCardData({...cardData, number: text})}
                    keyboardType="numeric"
                    maxLength={19}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              {/* Nombre en la tarjeta */}
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalInputLabel}>Nombre en la Tarjeta</Text>
                <View style={styles.modalInputContainer}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="NOMBRE APELLIDO"
                    value={cardData.name}
                    onChangeText={(text) => setCardData({...cardData, name: text.toUpperCase()})}
                    autoCapitalize="characters"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              {/* Fecha de expiración y CVV */}
              <View style={styles.modalRowInputs}>
                <View style={[styles.modalInputGroup, { flex: 1 }]}>
                  <Text style={styles.modalInputLabel}>Fecha de Vencimiento</Text>
                  <View style={styles.modalInputContainer}>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="MM/AA"
                      value={cardData.expiry}
                      onChangeText={(text) => setCardData({...cardData, expiry: text})}
                      keyboardType="numeric"
                      maxLength={5}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={[styles.modalInputGroup, { flex: 1 }]}>
                  <Text style={styles.modalInputLabel}>CVV</Text>
                  <View style={styles.modalInputContainer}>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="123"
                      value={cardData.cvv}
                      onChangeText={(text) => setCardData({...cardData, cvv: text})}
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>

              {/* Botones del modal */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonSecondary}
                  onPress={handleCardModalClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonSecondaryText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalButtonPrimary}
                  onPress={handleCardModalConfirm}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonPrimaryText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingBottom: verticalScale(120),
  },
  introSection: {
    marginTop: verticalScale(24),
    marginBottom: verticalScale(20),
  },
  introTitle: {
    fontSize: scaleFont(24),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(8),
  },
  introSubtitle: {
    fontSize: scaleFont(14),
    color: "#666",
    lineHeight: scaleFont(20),
  },
  historyButton: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(24),
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
  historyButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  historyButtonIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
  },
  historyButtonText: {
    flex: 1,
  },
  historyButtonTitle: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(2),
  },
  historyButtonSubtitle: {
    fontSize: scaleFont(12),
    color: "#666",
    fontWeight: "500",
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(12),
    marginBottom: verticalScale(24),
  },
  serviceCard: {
    width: (width - scale(52)) / 2,
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  serviceCardSelected: {
    borderWidth: 2,
    shadowOpacity: 0.15,
    elevation: 6,
  },
  serviceIconContainer: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  serviceName: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
  },
  selectedIndicator: {
    position: "absolute",
    top: scale(12),
    right: scale(12),
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  formSection: {
    backgroundColor: "white",
    borderRadius: moderateScale(20),
    overflow: "hidden",
    marginBottom: verticalScale(24),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  formHeader: {
    padding: scale(20),
  },
  formHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  formIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formHeaderText: {
    flex: 1,
  },
  formTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  formSubtitle: {
    fontSize: scaleFont(13),
    color: "#666",
  },
  formContent: {
    padding: scale(20),
  },
  inputGroup: {
    marginBottom: verticalScale(20),
  },
  inputLabel: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: verticalScale(8),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    gap: scale(10),
    borderWidth: 2,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    fontSize: scaleFont(16),
    color: "#1a1a1a",
    fontWeight: "500",
  },
  currencySymbol: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#666",
  },
  inputHint: {
    fontSize: scaleFont(12),
    color: "#999",
    marginTop: verticalScale(6),
    paddingHorizontal: scale(4),
  },
  quickAmountsSection: {
    marginBottom: verticalScale(20),
  },
  quickAmountsLabel: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: verticalScale(12),
  },
  quickAmountsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
  },
  quickAmountButton: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(10),
    borderWidth: 2,
    borderColor: "transparent",
  },
  quickAmountButtonSelected: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  quickAmountText: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    color: "#666",
  },
  quickAmountTextSelected: {
    color: "#4CAF50",
  },
  infoBox: {
    backgroundColor: "#FFF9E6",
    borderRadius: moderateScale(12),
    padding: scale(16),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: "#FFE082",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: scale(12),
  },
  infoIconContainer: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(2),
  },
  infoBoxText: {
    flex: 1,
    fontSize: scaleFont(13),
    color: "#666",
    lineHeight: scaleFont(18),
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(12),
    gap: scale(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "white",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(60),
  },
  emptyStateIcon: {
    marginBottom: verticalScale(16),
  },
  emptyStateText: {
    fontSize: scaleFont(16),
    color: "#999",
    textAlign: "center",
    fontWeight: "500",
  },
  footerInfo: {
    backgroundColor: "#E8F5E9",
    borderRadius: moderateScale(12),
    padding: scale(16),
    borderWidth: 1,
    borderColor: "#C8E6C9",
    marginBottom: verticalScale(24),
  },
  footerInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
    marginBottom: verticalScale(6),
  },
  footerInfoTitle: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "#2E7D32",
  },
  footerInfoText: {
    fontSize: scaleFont(13),
    color: "#666",
    lineHeight: scaleFont(18),
  },
  // Estilos de métodos de pago
  paymentMethodsSection: {
    marginBottom: verticalScale(24),
  },
  paymentMethodsTitle: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(6),
  },
  paymentMethodsSubtitle: {
    fontSize: scaleFont(14),
    color: "#666",
    marginBottom: verticalScale(16),
  },
  paymentMethodsList: {
    gap: scale(12),
  },
  paymentMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentMethodCardSelected: {
    borderColor: "#5B7FFF",
    backgroundColor: "#F8F9FD",
    shadowOpacity: 0.15,
    elevation: 6,
  },
  paymentMethodContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: scale(12),
  },
  paymentMethodIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
  },
  paymentMethodLogo: {
    width: moderateScale(36),
    height: moderateScale(36),
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(2),
  },
  paymentMethodDescription: {
    fontSize: scaleFont(12),
    color: "#999",
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
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: "white",
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    maxHeight: height * 0.85,
    paddingBottom: verticalScale(20),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  modalCloseButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: scaleFont(20),
    color: "#666",
    fontWeight: "600",
  },
  modalContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
  },
  modalInputGroup: {
    marginBottom: verticalScale(16),
  },
  modalInputLabel: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: verticalScale(8),
  },
  modalInputContainer: {
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: "transparent",
  },
  modalInput: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    fontSize: scaleFont(16),
    color: "#1a1a1a",
    fontWeight: "500",
  },
  modalRowInputs: {
    flexDirection: "row",
    gap: scale(12),
  },
  modalButtons: {
    flexDirection: "row",
    gap: scale(12),
    marginTop: verticalScale(24),
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    backgroundColor: "#F8F9FD",
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonSecondaryText: {
    fontSize: scaleFont(15),
    fontWeight: "600",
    color: "#666",
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    backgroundColor: "#5B7FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalButtonPrimaryText: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "white",
  },
  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: verticalScale(24),
    paddingTop: verticalScale(30),
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