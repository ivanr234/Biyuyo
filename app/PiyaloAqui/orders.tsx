
import FloatingBottomMenu from "@/components/Floatingbottommenu";
import { useRouter } from "expo-router";
import {
    ArrowLeft,
    Box,
    Calendar,
    CloseCircle,
    Location,
    ReceiptText,
    ShoppingCart,
    TickCircle,
    TruckFast,
} from 'iconsax-react-native';
import { useState } from "react";
import {
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
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

interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  products: OrderProduct[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

const ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-11-20',
    status: 'delivered',
    products: [
      { id: '1', name: 'Smartphone Galaxy Pro', quantity: 1, price: 899990, image: '📱' },
      { id: '2', name: 'Auriculares Bluetooth Pro', quantity: 1, price: 149990, image: '🎧' },
    ],
    subtotal: 1049980,
    shipping: 0,
    discount: 104998,
    total: 944982,
    paymentMethod: 'Crédito Biyuyo',
    shippingAddress: 'Calle 123 #45-67, Cartagena, Bolívar',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-11-18',
    status: 'shipped',
    products: [
      { id: '3', name: 'Zapatillas Running Elite', quantity: 1, price: 179990, image: '👟' },
    ],
    subtotal: 179990,
    shipping: 15000,
    discount: 0,
    total: 194990,
    paymentMethod: 'Tarjeta de Crédito',
    shippingAddress: 'Calle 123 #45-67, Cartagena, Bolívar',
    estimatedDelivery: '2024-11-22',
    trackingNumber: 'TRK123456789',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-11-15',
    status: 'processing',
    products: [
      { id: '4', name: 'Cafetera Espresso Premium', quantity: 1, price: 299990, image: '☕' },
      { id: '5', name: 'Mochila Smart USB', quantity: 2, price: 89990, image: '🎒' },
    ],
    subtotal: 479970,
    shipping: 0,
    discount: 0,
    total: 479970,
    paymentMethod: 'PSE',
    shippingAddress: 'Calle 123 #45-67, Cartagena, Bolívar',
    estimatedDelivery: '2024-11-25',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    date: '2024-11-10',
    status: 'cancelled',
    products: [
      { id: '6', name: 'Tablet 10" Full HD', quantity: 1, price: 549990, image: '💻' },
    ],
    subtotal: 549990,
    shipping: 0,
    discount: 109998,
    total: 439992,
    paymentMethod: 'Crédito Biyuyo',
    shippingAddress: 'Calle 123 #45-67, Cartagena, Bolívar',
  },
];

const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    color: '#FF9800',
    bgColor: '#FFF3E0',
    icon: Calendar,
  },
  processing: {
    label: 'Procesando',
    color: '#2196F3',
    bgColor: '#E3F2FD',
    icon: Box,
  },
  shipped: {
    label: 'En camino',
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    icon: TruckFast,
  },
  delivered: {
    label: 'Entregado',
    color: '#4CAF50',
    bgColor: '#E8F5E9',
    icon: TickCircle,
  },
  cancelled: {
    label: 'Cancelado',
    color: '#FF5252',
    bgColor: '#FFE5E5',
    icon: CloseCircle,
  },
};

export default function OrdersScreen() {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const filteredOrders = filterStatus === 'all' 
    ? ORDERS 
    : ORDERS.filter(order => order.status === filterStatus);

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
          <Text style={styles.headerTitle}>Mis Pedidos</Text>
          <Text style={styles.headerSubtitle}>
            {ORDERS.length} pedidos totales
          </Text>
        </View>

        <View style={styles.headerRight}>
          <ShoppingCart size={24} color="#5B7FFF" variant="Bold" />
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filtros */}
        <View style={styles.filtersSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterStatus === 'all' && styles.filterChipActive
              ]}
              onPress={() => setFilterStatus('all')}
            >
              <Text style={[
                styles.filterText,
                filterStatus === 'all' && styles.filterTextActive
              ]}>
                Todos ({ORDERS.length})
              </Text>
            </TouchableOpacity>

            {Object.entries(STATUS_CONFIG).map(([key, config]) => {
              const count = ORDERS.filter(o => o.status === key).length;
              if (count === 0) return null;
              
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.filterChip,
                    filterStatus === key && styles.filterChipActive
                  ]}
                  onPress={() => setFilterStatus(key)}
                >
                  <Text style={[
                    styles.filterText,
                    filterStatus === key && styles.filterTextActive
                  ]}>
                    {config.label} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Lista de pedidos */}
        <View style={styles.ordersSection}>
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>No hay pedidos</Text>
              <Text style={styles.emptySubtitle}>
                No tienes pedidos con este estado
              </Text>
            </View>
          ) : (
            filteredOrders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.status];
              const StatusIcon = statusConfig.icon;
              
              return (
                <TouchableOpacity
                  key={order.id}
                  style={styles.orderCard}
                  onPress={() => handleOrderPress(order)}
                  activeOpacity={0.7}
                >
                  {/* Header del pedido */}
                  <View style={styles.orderHeader}>
                    <View style={styles.orderHeaderLeft}>
                      <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                      <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: statusConfig.bgColor }
                    ]}>
                      <StatusIcon size={16} color={statusConfig.color} variant="Bold" />
                      <Text style={[styles.statusText, { color: statusConfig.color }]}>
                        {statusConfig.label}
                      </Text>
                    </View>
                  </View>

                  {/* Productos */}
                  <View style={styles.orderProducts}>
                    {order.products.slice(0, 2).map((product, index) => (
                      <View key={product.id} style={styles.productRow}>
                        <Text style={styles.productEmoji}>{product.image}</Text>
                        <Text style={styles.productName} numberOfLines={1}>
                          {product.name}
                        </Text>
                        <Text style={styles.productQuantity}>x{product.quantity}</Text>
                      </View>
                    ))}
                    {order.products.length > 2 && (
                      <Text style={styles.moreProducts}>
                        +{order.products.length - 2} productos más
                      </Text>
                    )}
                  </View>

                  {/* Footer del pedido */}
                  <View style={styles.orderFooter}>
                    <View>
                      <Text style={styles.totalLabel}>Total</Text>
                      <Text style={styles.totalAmount}>{formatCurrency(order.total)}</Text>
                    </View>
                    <View style={styles.viewDetailsButton}>
                      <Text style={styles.viewDetailsText}>Ver detalles</Text>
                      <ArrowLeft size={16} color="#5B7FFF" style={{ transform: [{ rotate: '180deg' }] }} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Modal de detalles */}
      <Modal
        visible={showDetailsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedOrder && (
              <>
                {/* Header del modal */}
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <ReceiptText size={28} color="#5B7FFF" variant="Bold" />
                    <View>
                      <Text style={styles.modalTitle}>{selectedOrder.orderNumber}</Text>
                      <Text style={styles.modalSubtitle}>{formatDate(selectedOrder.date)}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowDetailsModal(false)}
                  >
                    <CloseCircle size={28} color="#999" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Estado */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Estado del pedido</Text>
                    <View style={[
                      styles.statusBadgeLarge,
                      { backgroundColor: STATUS_CONFIG[selectedOrder.status].bgColor }
                    ]}>
                      {(() => {
                        const StatusIcon = STATUS_CONFIG[selectedOrder.status].icon;
                        return <StatusIcon size={24} color={STATUS_CONFIG[selectedOrder.status].color} variant="Bold" />;
                      })()}
                      <Text style={[
                        styles.statusTextLarge,
                        { color: STATUS_CONFIG[selectedOrder.status].color }
                      ]}>
                        {STATUS_CONFIG[selectedOrder.status].label}
                      </Text>
                    </View>
                  </View>

                  {/* Seguimiento */}
                  {selectedOrder.trackingNumber && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionTitle}>Seguimiento</Text>
                      <View style={styles.trackingCard}>
                        <TruckFast size={24} color="#9C27B0" variant="Bold" />
                        <View style={styles.trackingInfo}>
                          <Text style={styles.trackingLabel}>Número de guía</Text>
                          <Text style={styles.trackingNumber}>{selectedOrder.trackingNumber}</Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Entrega estimada */}
                  {selectedOrder.estimatedDelivery && selectedOrder.status !== 'delivered' && (
                    <View style={styles.detailSection}>
                      <View style={styles.deliveryCard}>
                        <Calendar size={20} color="#FF9800" variant="Bold" />
                        <Text style={styles.deliveryText}>
                          Entrega estimada: {formatDate(selectedOrder.estimatedDelivery)}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Productos */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Productos</Text>
                    {selectedOrder.products.map((product) => (
                      <View key={product.id} style={styles.detailProductRow}>
                        <View style={styles.detailProductLeft}>
                          <View style={styles.detailProductImage}>
                            <Text style={styles.detailProductEmoji}>{product.image}</Text>
                          </View>
                          <View style={styles.detailProductInfo}>
                            <Text style={styles.detailProductName}>{product.name}</Text>
                            <Text style={styles.detailProductQuantity}>
                              Cantidad: {product.quantity}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.detailProductPrice}>
                          {formatCurrency(product.price * product.quantity)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Dirección de envío */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Dirección de envío</Text>
                    <View style={styles.addressCard}>
                      <Location size={20} color="#5B7FFF" variant="Bold" />
                      <Text style={styles.addressText}>{selectedOrder.shippingAddress}</Text>
                    </View>
                  </View>

                  {/* Resumen de pago */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Resumen de pago</Text>
                    <View style={styles.summaryCard}>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>
                          {formatCurrency(selectedOrder.subtotal)}
                        </Text>
                      </View>

                      {selectedOrder.discount > 0 && (
                        <View style={styles.summaryRow}>
                          <Text style={styles.summaryLabel}>Descuento</Text>
                          <Text style={[styles.summaryValue, styles.discountValue]}>
                            -{formatCurrency(selectedOrder.discount)}
                          </Text>
                        </View>
                      )}

                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Envío</Text>
                        <Text style={styles.summaryValue}>
                          {selectedOrder.shipping === 0 ? 'GRATIS' : formatCurrency(selectedOrder.shipping)}
                        </Text>
                      </View>

                      <View style={styles.summaryDivider} />

                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryTotalLabel}>Total</Text>
                        <Text style={styles.summaryTotalValue}>
                          {formatCurrency(selectedOrder.total)}
                        </Text>
                      </View>

                      <View style={styles.paymentMethodRow}>
                        <Text style={styles.paymentMethodLabel}>Método de pago</Text>
                        <Text style={styles.paymentMethodValue}>
                          {selectedOrder.paymentMethod}
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(120),
  },
  filtersSection: {
    marginTop: verticalScale(20),
  },
  filtersScroll: {
    paddingHorizontal: scale(16),
    gap: scale(10),
  },
  filterChip: {
    backgroundColor: "white",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: "#5B7FFF",
  },
  filterText: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    color: "#1a1a1a",
  },
  filterTextActive: {
    color: "white",
  },
  ordersSection: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(20),
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(12),
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderNumber: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  orderDate: {
    fontSize: scaleFont(12),
    color: "#999",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(12),
    gap: scale(6),
  },
  statusText: {
    fontSize: scaleFont(12),
    fontWeight: "700",
  },
  orderProducts: {
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: verticalScale(12),
    marginBottom: verticalScale(12),
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8),
    gap: scale(10),
  },
  productEmoji: {
    fontSize: scaleFont(20),
  },
  productName: {
    flex: 1,
    fontSize: scaleFont(14),
    color: "#1a1a1a",
  },
  productQuantity: {
    fontSize: scaleFont(12),
    color: "#666",
    fontWeight: "600",
  },
  moreProducts: {
    fontSize: scaleFont(12),
    color: "#5B7FFF",
    fontWeight: "600",
    marginTop: verticalScale(4),
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: verticalScale(12),
  },
  totalLabel: {
    fontSize: scaleFont(12),
    color: "#666",
    marginBottom: verticalScale(4),
  },
  totalAmount: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#5B7FFF",
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  viewDetailsText: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    color: "#5B7FFF",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(60),
  },
  emptyIcon: {
    fontSize: scaleFont(64),
    marginBottom: verticalScale(16),
  },
  emptyTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(8),
  },
  emptySubtitle: {
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
    padding: scale(20),
    maxHeight: height * 0.9,
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
    flex: 1,
  },
  modalTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  modalSubtitle: {
    fontSize: scaleFont(12),
    color: "#666",
    marginTop: verticalScale(2),
  },
  closeButton: {
    padding: scale(4),
  },
  detailSection: {
    marginBottom: verticalScale(24),
  },
  detailSectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(12),
  },
  statusBadgeLarge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    gap: scale(10),
  },
  statusTextLarge: {
    fontSize: scaleFont(16),
    fontWeight: "700",
  },
  trackingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
    padding: scale(16),
    borderRadius: moderateScale(12),
    gap: scale(12),
  },
  trackingInfo: {
    flex: 1,
  },
  trackingLabel: {
    fontSize: scaleFont(12),
    color: "#666",
    marginBottom: verticalScale(4),
  },
  trackingNumber: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  deliveryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: scale(12),
    borderRadius: moderateScale(12),
    gap: scale(8),
  },
  deliveryText: {
    fontSize: scaleFont(13),
    color: "#FF9800",
    fontWeight: "600",
  },
  detailProductRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
    padding: scale(12),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(8),
  },
  detailProductLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: scale(12),
  },
  detailProductImage: {
    width: moderateScale(48),
    height: moderateScale(48),
    backgroundColor: "white",
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  detailProductEmoji: {
    fontSize: scaleFont(24),
  },
  detailProductInfo: {
    flex: 1,
  },
  detailProductName: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: verticalScale(2),
  },
  detailProductQuantity: {
    fontSize: scaleFont(12),
    color: "#666",
  },
  detailProductPrice: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#5B7FFF",
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
    padding: scale(16),
    borderRadius: moderateScale(12),
    gap: scale(12),
  },
  addressText: {
    flex: 1,
    fontSize: scaleFont(14),
    color: "#1a1a1a",
    lineHeight: scaleFont(20),
  },
  summaryCard: {
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(12),
    padding: scale(16),
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
  summaryDivider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: verticalScale(8),
  },
  summaryTotalLabel: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  summaryTotalValue: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#5B7FFF",
  },
  paymentMethodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  paymentMethodLabel: {
    fontSize: scaleFont(13),
    color: "#666",
  },
  paymentMethodValue: {
    fontSize: scaleFont(13),
    fontWeight: "600",
    color: "#1a1a1a",
  },
});