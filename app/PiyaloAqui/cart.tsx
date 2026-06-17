// app/(tabs)/PiyaloAqui/cart.tsx
// Vista del Carrito con modal de tarjeta de crédito

import { useRouter } from "expo-router";
import {
  Add,
  ArrowLeft,
  Bank,
  Card,
  CloseCircle,
  Minus,
  ReceiptText,
  ShoppingCart,
  TicketDiscount,
  Trash,
  Wallet2,
} from 'iconsax-react-native';
import { useState } from "react";
import {
  Alert,
  Dimensions,
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

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  inStock: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  color: string;
  available: boolean;
}

interface CreditCardData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    name: 'Crédito Biyuyo',
    icon: Wallet2,
    color: '#5B7FFF',
    available: true,
  },
  {
    id: '2',
    name: 'Tarjeta de Crédito',
    icon: Card,
    color: '#2196F3',
    available: true,
  },
  {
    id: '3',
    name: 'PSE',
    icon: Bank,
    color: '#4CAF50',
    available: true,
  },
];

export default function CartScreen() {
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Smartphone Galaxy Pro',
      description: '128GB, 5G',
      price: 899990,
      quantity: 1,
      image: '📱',
      inStock: true,
    },
    {
      id: '2',
      name: 'Auriculares Bluetooth Pro',
      description: 'Cancelación de ruido',
      price: 149990,
      quantity: 2,
      image: '🎧',
      inStock: true,
    },
    {
      id: '3',
      name: 'Zapatillas Running Elite',
      description: 'Ultra ligeras',
      price: 179990,
      quantity: 1,
      image: '👟',
      inStock: true,
    },
  ]);

  const [selectedPayment, setSelectedPayment] = useState('1');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  
  // Estados para el modal de tarjeta
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardData, setCardData] = useState<CreditCardData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [cardDataSaved, setCardDataSaved] = useState(false);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  const formatCardNumber = (text: string) => {
    // Remover espacios y caracteres no numéricos
    const cleaned = text.replace(/\s/g, '').replace(/\D/g, '');
    // Limitar a 16 dígitos
    const limited = cleaned.substring(0, 16);
    // Agregar espacio cada 4 dígitos
    const formatted = limited.match(/.{1,4}/g)?.join(' ') || limited;
    return formatted;
  };

  const formatExpiryDate = (text: string) => {
    // Remover caracteres no numéricos
    const cleaned = text.replace(/\D/g, '');
    // Limitar a 4 dígitos (MMYY)
    const limited = cleaned.substring(0, 4);
    // Agregar "/" después de los primeros 2 dígitos
    if (limited.length >= 2) {
      return limited.substring(0, 2) + '/' + limited.substring(2);
    }
    return limited;
  };

  const formatCVV = (text: string) => {
    // Solo números, máximo 4 dígitos
    return text.replace(/\D/g, '').substring(0, 4);
  };

  const handlePaymentSelect = (paymentId: string) => {
    if (paymentId === '2') {
      // Si selecciona tarjeta de crédito, mostrar modal
      setShowCardModal(true);
    } else {
      setSelectedPayment(paymentId);
    }
  };

  const handleSaveCard = () => {
    // Validaciones
    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert("Error", "Número de tarjeta inválido");
      return;
    }
    if (!cardData.cardName || cardData.cardName.length < 3) {
      Alert.alert("Error", "Nombre del titular inválido");
      return;
    }
    if (!cardData.expiryDate || cardData.expiryDate.length !== 5) {
      Alert.alert("Error", "Fecha de vencimiento inválida");
      return;
    }
    if (!cardData.cvv || cardData.cvv.length < 3) {
      Alert.alert("Error", "CVV inválido");
      return;
    }

    // Guardar y cerrar
    setCardDataSaved(true);
    setSelectedPayment('2');
    setShowCardModal(false);
    Alert.alert("¡Listo!", "Tarjeta guardada correctamente");
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (itemId: string) => {
    Alert.alert(
      "Eliminar producto",
      "¿Estás seguro de eliminar este producto del carrito?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => {
            setCartItems(cartItems.filter(item => item.id !== itemId));
          }
        }
      ]
    );
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'BIYUYO10') {
      setDiscount(subtotal * 0.1);
      Alert.alert("¡Código aplicado!", "Has obtenido 10% de descuento");
    } else if (promoCode.toUpperCase() === 'PIYALO20') {
      setDiscount(subtotal * 0.2);
      Alert.alert("¡Código aplicado!", "Has obtenido 20% de descuento");
    } else {
      Alert.alert("Código inválido", "El código ingresado no es válido");
    }
  };

  const handleCheckout = () => {
    // Validar método de pago
    if (selectedPayment === '2' && !cardDataSaved) {
      Alert.alert("Error", "Debes ingresar los datos de tu tarjeta");
      return;
    }

    const paymentName = PAYMENT_METHODS.find(m => m.id === selectedPayment)?.name;
    let paymentInfo = paymentName;
    
    if (selectedPayment === '2' && cardDataSaved) {
      const lastFourDigits = cardData.cardNumber.replace(/\s/g, '').slice(-4);
      paymentInfo = `${paymentName} **** ${lastFourDigits}`;
    }

    Alert.alert(
      "Confirmar compra",
      `Total a pagar: ${formatCurrency(total)}\nMétodo: ${paymentInfo}\n\n¿Deseas proceder con el pago?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar", 
          onPress: () => {
            Alert.alert(
              "¡Compra exitosa!",
              "Tu pedido ha sido procesado correctamente",
              [
                { 
                  text: "Ver pedidos", 
                  onPress: () => router.push('/PiyaloAqui/orders') 
                },
                { text: "Seguir comprando", onPress: () => router.back() }
              ]
            );
          }
        }
      ]
    );
  };

  // Cálculos
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100000 ? 0 : 15000;
  const total = subtotal - discount + shipping;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Mi Carrito</Text>
          <Text style={styles.headerSubtitle}>
            {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <ShoppingCart size={24} color="#5B7FFF" variant="Bold" />
        </View>
      </View>

      {cartItems.length === 0 ? (
        // Carrito vacío
        <View style={styles.emptyContainer}>
          <View style={styles.emptyContent}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
            <Text style={styles.emptySubtitle}>
              Agrega productos para comenzar tu compra
            </Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => router.back()}
            >
              <Text style={styles.shopButtonText}>Ir a comprar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Productos en el carrito */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Productos</Text>
            
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemImageContainer}>
                  <Text style={styles.itemImage}>{item.image}</Text>
                </View>

                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemDescription}>
                    {item.description}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatCurrency(item.price)}
                  </Text>
                </View>

                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeItem(item.id)}
                  >
                    <Trash size={18} color="#FF5252" />
                  </TouchableOpacity>

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={16} color="#5B7FFF" variant="Bold" />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Add size={16} color="#5B7FFF" variant="Bold" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Código promocional */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Código promocional</Text>
            <View style={styles.promoCard}>
              <View style={styles.promoIconContainer}>
                <TicketDiscount size={24} color="#5B7FFF" variant="Bold" />
              </View>
              <View style={styles.promoInputContainer}>
                <Text style={styles.promoLabel}>¿Tienes un código?</Text>
                <View style={styles.promoInputWrapper}>
                  <Text 
                    style={styles.promoInput}
                    onPress={() => Alert.prompt(
                      "Código promocional",
                      "Ingresa tu código",
                      [
                        { text: "Cancelar", style: "cancel" },
                        { 
                          text: "Aplicar", 
                          onPress: (code) => {
                            if (code) {
                              setPromoCode(code);
                              applyPromoCode();
                            }
                          }
                        }
                      ]
                    )}
                  >
                    {promoCode || 'Ingresar código'}
                  </Text>
                  {discount > 0 && (
                    <View style={styles.discountApplied}>
                      <Text style={styles.discountAppliedText}>
                        -{formatCurrency(discount)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={applyPromoCode}
              >
                <Text style={styles.applyButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Método de pago */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Método de pago</Text>
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedPayment === method.id;
              const isCard = method.id === '2';
              
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethod,
                    isSelected && styles.paymentMethodSelected
                  ]}
                  onPress={() => handlePaymentSelect(method.id)}
                  disabled={!method.available}
                >
                  <View style={[styles.paymentIcon, { backgroundColor: method.color + '20' }]}>
                    <Icon size={24} color={method.color} variant="Bold" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[
                      styles.paymentName,
                      isSelected && styles.paymentNameSelected
                    ]}>
                      {method.name}
                    </Text>
                    {isCard && cardDataSaved && (
                      <Text style={styles.cardInfo}>
                        **** **** **** {cardData.cardNumber.replace(/\s/g, '').slice(-4)}
                      </Text>
                    )}
                  </View>
                  <View style={[
                    styles.radioButton,
                    isSelected && styles.radioButtonSelected
                  ]}>
                    {isSelected && <View style={styles.radioButtonInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Resumen de compra */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen de compra</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
              </View>
              
              {discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Descuento</Text>
                  <Text style={[styles.summaryValue, styles.discountValue]}>
                    -{formatCurrency(discount)}
                  </Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Envío</Text>
                <Text style={styles.summaryValue}>
                  {shipping === 0 ? 'GRATIS' : formatCurrency(shipping)}
                </Text>
              </View>

              {shipping === 0 && (
                <View style={styles.freeShippingBadge}>
                  <Text style={styles.freeShippingText}>
                    ✓ Envío gratis en compras mayores a $100.000
                  </Text>
                </View>
              )}

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>{formatCurrency(total)}</Text>
              </View>
            </View>
          </View>

          {/* Botón de pagar */}
          <View style={styles.checkoutSection}>
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
              activeOpacity={0.85}
            >
              <View style={styles.checkoutButtonContent}>
                <View style={styles.checkoutButtonLeft}>
                  <ReceiptText size={24} color="white" variant="Bold" />
                  <View>
                    <Text style={styles.checkoutButtonLabel}>Total a pagar</Text>
                    <Text style={styles.checkoutButtonTotal}>{formatCurrency(total)}</Text>
                  </View>
                </View>
                <View style={styles.checkoutButtonRight}>
                  <Text style={styles.checkoutButtonText}>Pagar ahora</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Biyuyo © 2025</Text>
            <Text style={styles.footerSubtext}>Desarrollado por Ingenio Soluciones Ti</Text>
            <Text style={styles.footerSubtext}>Tu aliado financiero de confianza</Text>
          </View>
        </ScrollView>
      )}

      {/* MODAL DE TARJETA DE CRÉDITO */}
      <Modal
        visible={showCardModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Card size={28} color="#2196F3" variant="Bold" />
                <Text style={styles.modalTitle}>Tarjeta de Crédito</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCardModal(false)}
              >
                <CloseCircle size={28} color="#999" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Número de tarjeta */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número de tarjeta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={cardData.cardNumber}
                  onChangeText={(text) => 
                    setCardData({ ...cardData, cardNumber: formatCardNumber(text) })
                  }
                  maxLength={19}
                />
              </View>

              {/* Nombre del titular */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre del titular</Text>
                <TextInput
                  style={styles.input}
                  placeholder="JUAN PEREZ"
                  placeholderTextColor="#999"
                  autoCapitalize="characters"
                  value={cardData.cardName}
                  onChangeText={(text) => 
                    setCardData({ ...cardData, cardName: text.toUpperCase() })
                  }
                />
              </View>

              {/* Fecha y CVV en fila */}
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: scale(8) }]}>
                  <Text style={styles.inputLabel}>Vencimiento</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={cardData.expiryDate}
                    onChangeText={(text) => 
                      setCardData({ ...cardData, expiryDate: formatExpiryDate(text) })
                    }
                    maxLength={5}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: scale(8) }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    secureTextEntry
                    value={cardData.cvv}
                    onChangeText={(text) => 
                      setCardData({ ...cardData, cvv: formatCVV(text) })
                    }
                    maxLength={4}
                  />
                </View>
              </View>

              {/* Info de seguridad */}
              <View style={styles.securityInfo}>
                <Text style={styles.securityText}>
                  🔒 Tus datos están protegidos con encriptación de nivel bancario
                </Text>
              </View>

              {/* Botón guardar */}
              <TouchableOpacity
                style={styles.saveCardButton}
                onPress={handleSaveCard}
              >
                <Text style={styles.saveCardButtonText}>Guardar tarjeta</Text>
              </TouchableOpacity>
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
  },
  headerTitle: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  headerSubtitle: {
    fontSize: scaleFont(12),
    color: "#666",
    fontWeight: "500",
    marginTop: verticalScale(2),
  },
  headerRight: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContent: {
    alignItems: "center",
    paddingHorizontal: scale(40),
  },
  emptyIcon: {
    fontSize: scaleFont(80),
    marginBottom: verticalScale(20),
  },
  emptyTitle: {
    fontSize: scaleFont(22),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(8),
  },
  emptySubtitle: {
    fontSize: scaleFont(14),
    color: "#999",
    textAlign: "center",
    marginBottom: verticalScale(30),
  },
  shopButton: {
    backgroundColor: "#5B7FFF",
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(16),
  },
  shopButtonText: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "white",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(120),
  },
  section: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(20),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(14),
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(12),
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImageContainer: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(12),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  itemImage: {
    fontSize: scaleFont(32),
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  itemDescription: {
    fontSize: scaleFont(12),
    color: "#999",
    marginBottom: verticalScale(6),
  },
  itemPrice: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#5B7FFF",
  },
  itemActions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  deleteButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: "#FFE5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(12),
    padding: scale(4),
    gap: scale(8),
  },
  quantityButton: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "#1a1a1a",
    minWidth: scale(20),
    textAlign: "center",
  },
  promoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    gap: scale(12),
  },
  promoIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
  },
  promoInputContainer: {
    flex: 1,
  },
  promoLabel: {
    fontSize: scaleFont(11),
    color: "#999",
    marginBottom: verticalScale(4),
  },
  promoInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  promoInput: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    color: "#1a1a1a",
  },
  discountApplied: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: moderateScale(8),
  },
  discountAppliedText: {
    fontSize: scaleFont(11),
    fontWeight: "bold",
    color: "white",
  },
  applyButton: {
    backgroundColor: "#5B7FFF",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
  },
  applyButtonText: {
    fontSize: scaleFont(13),
    fontWeight: "bold",
    color: "white",
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    gap: scale(12),
  },
  paymentMethodSelected: {
    borderWidth: 2,
    borderColor: "#5B7FFF",
    backgroundColor: "#F8F9FD",
  },
  paymentIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  paymentName: {
    fontSize: scaleFont(15),
    fontWeight: "600",
    color: "#1a1a1a",
  },
  paymentNameSelected: {
    color: "#5B7FFF",
    fontWeight: "700",
  },
  cardInfo: {
    fontSize: scaleFont(12),
    color: "#666",
    marginTop: verticalScale(2),
  },
  radioButton: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: "#DDD",
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
  summaryCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  summaryLabel: {
    fontSize: scaleFont(14),
    color: "#666",
  },
  summaryValue: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    color: "#1a1a1a",
  },
  discountValue: {
    color: "#4CAF50",
  },
  freeShippingBadge: {
    backgroundColor: "#E8F5E9",
    borderRadius: moderateScale(12),
    padding: scale(10),
    marginBottom: verticalScale(12),
  },
  freeShippingText: {
    fontSize: scaleFont(12),
    color: "#4CAF50",
    fontWeight: "600",
    textAlign: "center",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: verticalScale(12),
  },
  summaryTotalLabel: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  summaryTotalValue: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#5B7FFF",
  },
  checkoutSection: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(30),
    marginBottom: verticalScale(20),
  },
  checkoutButton: {
    backgroundColor: "#5B7FFF",
    borderRadius: moderateScale(20),
    padding: scale(20),
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  checkoutButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkoutButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
    flex: 1,
  },
  checkoutButtonLabel: {
    fontSize: scaleFont(12),
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  checkoutButtonTotal: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "white",
  },
  checkoutButtonRight: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
  },
  checkoutButtonText: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "white",
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    padding: scale(20),
    maxHeight: height * 0.85,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  modalTitle: {
    fontSize: scaleFont(22),
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  closeButton: {
    padding: scale(4),
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
  input: {
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    fontSize: scaleFont(16),
    color: "#1a1a1a",
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputRow: {
    flexDirection: "row",
  },
  securityInfo: {
    backgroundColor: "#E8F5E9",
    borderRadius: moderateScale(12),
    padding: scale(12),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
  },
  securityText: {
    fontSize: scaleFont(12),
    color: "#4CAF50",
    textAlign: "center",
    fontWeight: "500",
  },
  saveCardButton: {
    backgroundColor: "#2196F3",
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(16),
    alignItems: "center",
    shadowColor: "#2196F3",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveCardButtonText: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "white",
  },
  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: verticalScale(20),
    paddingBottom: verticalScale(30),
    paddingHorizontal: scale(16),
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