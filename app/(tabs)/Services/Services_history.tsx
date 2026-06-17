import FloatingBottomMenu from "@/components/Floatingbottommenu";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Call,
  Card,
  DocumentText,
  Drop,
  Electricity,
  Flashy,
  SearchNormal1,
  TickCircle,
} from 'iconsax-react-native';
import { useState } from "react";
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

// Tipos de servicios con sus iconos y colores
const serviceIcons: Record<string, any> = {
  agua: { icon: Drop, color: '#03A9F4', bgColor: '#E1F5FE' },
  luz: { icon: Electricity, color: '#FFC107', bgColor: '#FFF9E6' },
  gas: { icon: Flashy, color: '#FF5722', bgColor: '#FBE9E7' },
  telefonia: { icon: Call, color: '#9C27B0', bgColor: '#F3E5F5' },
  transporte: { icon: Card, color: '#4CAF50', bgColor: '#E8F5E9' },
};

// Datos de ejemplo del historial
const historialPagos = [
  {
    id: '1',
    servicio: 'agua',
    nombreServicio: 'Agua',
    fecha: '20 Nov 2024',
    monto: 85000,
    referencia: '123456789',
    estado: 'completado',
    metodoPago: 'Nequi',
  },
  {
    id: '2',
    servicio: 'luz',
    nombreServicio: 'Luz',
    fecha: '18 Nov 2024',
    monto: 145000,
    referencia: '987654321',
    estado: 'completado',
    metodoPago: 'PSE',
  },
  {
    id: '3',
    servicio: 'gas',
    nombreServicio: 'Gas',
    fecha: '15 Nov 2024',
    monto: 65000,
    referencia: '456789123',
    estado: 'completado',
    metodoPago: 'Tarjeta',
  },
  {
    id: '4',
    servicio: 'telefonia',
    nombreServicio: 'Telefonía',
    fecha: '12 Nov 2024',
    monto: 95000,
    referencia: '789123456',
    estado: 'completado',
    metodoPago: 'Daviplata',
  },
  {
    id: '5',
    servicio: 'transporte',
    nombreServicio: 'Transporte',
    fecha: '10 Nov 2024',
    monto: 50000,
    referencia: 'Tarjeta 4567',
    estado: 'completado',
    metodoPago: 'Crédito Biyuyo',
  },
  {
    id: '6',
    servicio: 'agua',
    nombreServicio: 'Agua',
    fecha: '05 Nov 2024',
    monto: 82000,
    referencia: '321654987',
    estado: 'completado',
    metodoPago: 'Nequi',
  },
  {
    id: '7',
    servicio: 'luz',
    nombreServicio: 'Luz',
    fecha: '01 Nov 2024',
    monto: 155000,
    referencia: '654987321',
    estado: 'completado',
    metodoPago: 'PSE',
  },
];

export default function ServicesHistoryScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  const filteredHistory = selectedFilter === 'todos' 
    ? historialPagos 
    : historialPagos.filter(pago => pago.servicio === selectedFilter);

  const totalPagado = historialPagos.reduce((sum, pago) => sum + pago.monto, 0);

  const filters = [
    { id: 'todos', name: 'Todos' },
    { id: 'agua', name: 'Agua' },
    { id: 'luz', name: 'Luz' },
    { id: 'gas', name: 'Gas' },
    { id: 'telefonia', name: 'Telefonía' },
    { id: 'transporte', name: 'Transporte' },
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
          <Text style={styles.headerTitle}>Historial de Pagos</Text>
          <Text style={styles.headerSubtitle}>Consulta tus pagos realizados</Text>
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
        {/* Tarjeta de Resumen */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIconContainer}>
              <DocumentText size={28} color="#5B7FFF" variant="Bold" />
            </View>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Total Pagado</Text>
              <Text 
                style={styles.summaryAmount}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {formatCurrency(totalPagado)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{historialPagos.length}</Text>
              <Text style={styles.statLabel}>Pagos realizados</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatCurrency(Math.round(totalPagado / historialPagos.length))}
              </Text>
              <Text style={styles.statLabel}>Promedio por pago</Text>
            </View>
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filtersSection}>
          <Text style={styles.filtersTitle}>Filtrar por servicio</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.id && styles.filterChipSelected
                ]}
                onPress={() => setSelectedFilter(filter.id)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedFilter === filter.id && styles.filterChipTextSelected
                ]}>
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de Pagos */}
        <View style={styles.historySection}>
          <Text style={styles.historySectionTitle}>
            {filteredHistory.length} {filteredHistory.length === 1 ? 'Pago' : 'Pagos'}
          </Text>

          {filteredHistory.length > 0 ? (
            filteredHistory.map((pago) => {
              const serviceData = serviceIcons[pago.servicio];
              const IconComponent = serviceData.icon;

              return (
                <TouchableOpacity
                  key={pago.id}
                  style={styles.historyCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.historyCardLeft}>
                    <View style={[
                      styles.historyIconContainer,
                      { backgroundColor: serviceData.bgColor }
                    ]}>
                      <IconComponent 
                        size={24} 
                        color={serviceData.color} 
                        variant="Bold" 
                      />
                    </View>

                    <View style={styles.historyCardInfo}>
                      <Text style={styles.historyServiceName}>
                        {pago.nombreServicio}
                      </Text>
                      <View style={styles.historyDetailsRow}>
                        <Calendar size={14} color="#999" variant="Bold" />
                        <Text style={styles.historyDate}>{pago.fecha}</Text>
                      </View>
                      <Text style={styles.historyReference}>
                        Ref: {pago.referencia}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.historyCardRight}>
                    <Text style={styles.historyAmount}>
                      {formatCurrency(pago.monto)}
                    </Text>
                    <View style={styles.historyStatus}>
                      <TickCircle size={14} color="#4CAF50" variant="Bold" />
                      <Text style={styles.historyStatusText}>Pagado</Text>
                    </View>
                    <Text style={styles.historyMethod}>{pago.metodoPago}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <SearchNormal1 size={48} color="#ccc" variant="Bold" />
              </View>
              <Text style={styles.emptyStateTitle}>No hay pagos</Text>
              <Text style={styles.emptyStateText}>
                No se encontraron pagos con este filtro
              </Text>
            </View>
          )}
        </View>

        {/* Información adicional */}
        <View style={styles.infoFooter}>
          <Text style={styles.infoFooterText}>
            Los pagos se muestran de más recientes a más antiguos
          </Text>
        </View>

        {/* Footer */}
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
    marginBottom: verticalScale(20),
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
  summaryIconContainer: {
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
    color: "#5B7FFF",
  },
  summaryStats: {
    flexDirection: "row",
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(12),
    padding: scale(16),
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: scaleFont(11),
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: scale(16),
  },

  // Filters
  filtersSection: {
    marginBottom: verticalScale(20),
  },
  filtersTitle: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(12),
  },
  filtersContainer: {
    paddingRight: scale(20),
    gap: scale(8),
  },
  filterChip: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    backgroundColor: "white",
    borderRadius: moderateScale(20),
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  filterChipSelected: {
    backgroundColor: "#5B7FFF",
    borderColor: "#5B7FFF",
  },
  filterChipText: {
    fontSize: scaleFont(13),
    fontWeight: "600",
    color: "#666",
  },
  filterChipTextSelected: {
    color: "white",
  },

  // History Section
  historySection: {
    marginBottom: verticalScale(20),
  },
  historySectionTitle: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(12),
  },
  historyCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    flexDirection: "row",
    justifyContent: "space-between",
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
  historyCardLeft: {
    flexDirection: "row",
    flex: 1,
    marginRight: scale(12),
  },
  historyIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  historyCardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  historyServiceName: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  historyDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    marginBottom: verticalScale(2),
  },
  historyDate: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "500",
  },
  historyReference: {
    fontSize: scaleFont(11),
    color: "#bbb",
    fontWeight: "500",
  },
  historyCardRight: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  historyAmount: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#5B7FFF",
    marginBottom: verticalScale(4),
  },
  historyStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    backgroundColor: "#E8F5E9",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(4),
  },
  historyStatusText: {
    fontSize: scaleFont(11),
    color: "#4CAF50",
    fontWeight: "600",
  },
  historyMethod: {
    fontSize: scaleFont(11),
    color: "#999",
    fontWeight: "500",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(60),
  },
  emptyStateIcon: {
    marginBottom: verticalScale(16),
  },
  emptyStateTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#666",
    marginBottom: verticalScale(8),
  },
  emptyStateText: {
    fontSize: scaleFont(14),
    color: "#999",
    textAlign: "center",
  },

  // Info Footer
  infoFooter: {
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(12),
    padding: scale(16),
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  infoFooterText: {
    fontSize: scaleFont(12),
    color: "#999",
    textAlign: "center",
    fontWeight: "500",
  },

  // Footer
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