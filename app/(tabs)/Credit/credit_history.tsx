import FloatingBottomMenu from "@/components/Floatingbottommenu";
import { useRouter } from "expo-router";
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
// Importar iconos de Iconsax
import {
  ArrowLeft,
  ArrowRight2,
  Calendar,
  Cards,
  Chart,
  Clock,
  DocumentText,
  Lamp,
  TickCircle,
  Wallet,
  Warning2,
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

// Tipos de filtro
type FilterType = 'todos' | 'activos' | 'pagados' | 'vencidos';

// Interfaz de crédito
interface Credit {
  id: string;
  monto: number;
  fecha: string;
  estado: 'activo' | 'pagado' | 'vencido';
  cuotasPagadas: number;
  cuotasTotales: number;
  saldoPendiente: number;
  fechaVencimiento: string;
  interes: number;
}

export default function CreditHistoryScreen() {
  const router = useRouter();
  
  // Estados
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('todos');
  
  // Datos de resumen
  const totalCreditos = 4;
  const creditosActivos = 1;
  const creditosPagados = 2;
  const creditosVencidos = 1;
  const saldoTotal = 250000;

  // Datos de créditos (ejemplo)
  const creditos: Credit[] = [
    {
      id: '001',
      monto: 500000,
      fecha: '01 Oct 2024',
      estado: 'activo',
      cuotasPagadas: 2,
      cuotasTotales: 6,
      saldoPendiente: 250000,
      fechaVencimiento: '15 Nov 2024',
      interes: 2.5,
    },
    {
      id: '002',
      monto: 300000,
      fecha: '15 Ago 2024',
      estado: 'pagado',
      cuotasPagadas: 4,
      cuotasTotales: 4,
      saldoPendiente: 0,
      fechaVencimiento: '15 Oct 2024',
      interes: 2.0,
    },
    {
      id: '003',
      monto: 400000,
      fecha: '20 Jul 2024',
      estado: 'pagado',
      cuotasPagadas: 5,
      cuotasTotales: 5,
      saldoPendiente: 0,
      fechaVencimiento: '20 Sep 2024',
      interes: 2.2,
    },
    {
      id: '004',
      monto: 200000,
      fecha: '10 Jun 2024',
      estado: 'vencido',
      cuotasPagadas: 1,
      cuotasTotales: 3,
      saldoPendiente: 140000,
      fechaVencimiento: '10 Ago 2024',
      interes: 3.0,
    },
  ];

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  // Filtrar créditos
  const creditosFiltrados = creditos.filter(credito => {
    if (selectedFilter === 'todos') return true;
    if (selectedFilter === 'activos') return credito.estado === 'activo';
    if (selectedFilter === 'pagados') return credito.estado === 'pagado';
    if (selectedFilter === 'vencidos') return credito.estado === 'vencido';
    return true;
  });

  // Obtener color según estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return '#5B7FFF';
      case 'pagado': return '#4CAF50';
      case 'vencido': return '#FF5252';
      default: return '#999';
    }
  };

  // Obtener texto según estado
  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'activo': return 'En curso';
      case 'pagado': return 'Pagado';
      case 'vencido': return 'Vencido';
      default: return estado;
    }
  };

  // Obtener ícono según estado
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'activo': 
        return <Clock size={14} color="#5B7FFF" variant="Bold" />;
      case 'pagado': 
        return <TickCircle size={14} color="#4CAF50" variant="Bold" />;
      case 'vencido': 
        return <Warning2 size={14} color="#FF5252" variant="Bold" />;
      default: 
        return <DocumentText size={14} color="#999" variant="Bold" />;
    }
  };

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
          <Text style={styles.headerTitle}>Historial de Créditos</Text>
          <Text style={styles.headerSubtitle}>Consulta tus movimientos</Text>
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
              <Cards size={28} color="#2196F3" variant="Bold" />
            </View>
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Saldo Total Pendiente</Text>
              <Text 
                style={styles.summaryAmount}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {formatCurrency(saldoTotal)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCreditos}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statItem, styles.statItemBorder]}>
              <Text style={[styles.statValue, { color: '#5B7FFF' }]}>
                {creditosActivos}
              </Text>
              <Text style={styles.statLabel}>Activos</Text>
            </View>
            <View style={[styles.statItem, styles.statItemBorder]}>
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                {creditosPagados}
              </Text>
              <Text style={styles.statLabel}>Pagados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#FF5252' }]}>
                {creditosVencidos}
              </Text>
              <Text style={styles.statLabel}>Vencidos</Text>
            </View>
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filtrar por:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'todos' && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter('todos')}
              activeOpacity={0.7}
            >
              <DocumentText 
                size={16} 
                color={selectedFilter === 'todos' ? "white" : "#666"} 
                variant="Bold" 
              />
              <Text style={[
                styles.filterButtonText,
                selectedFilter === 'todos' && styles.filterButtonTextActive
              ]}>
                Todos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'activos' && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter('activos')}
              activeOpacity={0.7}
            >
              <Clock 
                size={16} 
                color={selectedFilter === 'activos' ? "white" : "#666"} 
                variant="Bold" 
              />
              <Text style={[
                styles.filterButtonText,
                selectedFilter === 'activos' && styles.filterButtonTextActive
              ]}>
                Activos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'pagados' && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter('pagados')}
              activeOpacity={0.7}
            >
              <TickCircle 
                size={16} 
                color={selectedFilter === 'pagados' ? "white" : "#666"} 
                variant="Bold" 
              />
              <Text style={[
                styles.filterButtonText,
                selectedFilter === 'pagados' && styles.filterButtonTextActive
              ]}>
                Pagados
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'vencidos' && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter('vencidos')}
              activeOpacity={0.7}
            >
              <Warning2 
                size={16} 
                color={selectedFilter === 'vencidos' ? "white" : "#666"} 
                variant="Bold" 
              />
              <Text style={[
                styles.filterButtonText,
                selectedFilter === 'vencidos' && styles.filterButtonTextActive
              ]}>
                Vencidos
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Lista de Créditos */}
        <View style={styles.creditsList}>
          <Text style={styles.creditsListTitle}>
            {creditosFiltrados.length} {creditosFiltrados.length === 1 ? 'Crédito' : 'Créditos'}
          </Text>

          {creditosFiltrados.length === 0 ? (
            <View style={styles.emptyState}>
              <DocumentText size={56} color="#E0E0E0" variant="Bulk" />
              <Text style={styles.emptyStateTitle}>No hay créditos</Text>
              <Text style={styles.emptyStateText}>
                No se encontraron créditos con este filtro
              </Text>
            </View>
          ) : (
            creditosFiltrados.map((credito) => (
              <TouchableOpacity
                key={credito.id}
                style={styles.creditCard}
                activeOpacity={0.7}
              >
                {/* Header del crédito */}
                <View style={styles.creditCardHeader}>
                  <View style={styles.creditCardLeft}>
                    <View style={[
                      styles.creditStatusBadge,
                      { backgroundColor: `${getEstadoColor(credito.estado)}20` }
                    ]}>
                      <View style={styles.creditStatusIcon}>
                        {getEstadoIcon(credito.estado)}
                      </View>
                      <Text style={[
                        styles.creditStatusText,
                        { color: getEstadoColor(credito.estado) }
                      ]}>
                        {getEstadoTexto(credito.estado)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.creditId}>#{credito.id}</Text>
                </View>

                {/* Monto del crédito */}
                <View style={styles.creditAmountContainer}>
                  <Text style={styles.creditAmountLabel}>Monto prestado</Text>
                  <Text 
                    style={styles.creditAmount}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                  >
                    {formatCurrency(credito.monto)}
                  </Text>
                </View>

                {/* Progreso de cuotas */}
                {credito.estado !== 'pagado' && (
                  <View style={styles.creditProgress}>
                    <View style={styles.creditProgressHeader}>
                      <Text style={styles.creditProgressLabel}>
                        Cuotas pagadas
                      </Text>
                      <Text style={styles.creditProgressText}>
                        {credito.cuotasPagadas}/{credito.cuotasTotales}
                      </Text>
                    </View>
                    <View style={styles.creditProgressBar}>
                      <View 
                        style={[
                          styles.creditProgressFill,
                          { 
                            width: `${(credito.cuotasPagadas / credito.cuotasTotales) * 100}%`,
                            backgroundColor: getEstadoColor(credito.estado)
                          }
                        ]} 
                      />
                    </View>
                  </View>
                )}

                {/* Detalles del crédito con iconos de colores */}
                <View style={styles.creditDetails}>
                  <View style={styles.creditDetailRow}>
                    <View style={styles.creditDetailItem}>
                      <View style={styles.creditDetailLabelWithIcon}>
                        <Calendar size={14} color="#FF9800" variant="Bold" />
                        <Text style={styles.creditDetailLabel}>Fecha</Text>
                      </View>
                      <Text style={styles.creditDetailValue}>{credito.fecha}</Text>
                    </View>
                    <View style={styles.creditDetailItem}>
                      <View style={styles.creditDetailLabelWithIcon}>
                        {credito.estado === 'pagado' ? (
                          <TickCircle size={14} color="#4CAF50" variant="Bold" />
                        ) : (
                          <Clock size={14} color="#5B7FFF" variant="Bold" />
                        )}
                        <Text style={styles.creditDetailLabel}>
                          {credito.estado === 'pagado' ? 'Pagado' : 'Vence'}
                        </Text>
                      </View>
                      <Text style={[
                        styles.creditDetailValue,
                        credito.estado === 'vencido' && { color: '#FF5252' }
                      ]}>
                        {credito.fechaVencimiento}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.creditDetailRow}>
                    <View style={styles.creditDetailItem}>
                      <View style={styles.creditDetailLabelWithIcon}>
                        <Wallet size={14} color="#E91E63" variant="Bold" />
                        <Text style={styles.creditDetailLabel}>Saldo</Text>
                      </View>
                      <Text style={[
                        styles.creditDetailValue,
                        styles.creditDetailValueBold,
                        { color: credito.saldoPendiente > 0 ? '#FF5252' : '#4CAF50' }
                      ]}>
                        {formatCurrency(credito.saldoPendiente)}
                      </Text>
                    </View>
                    <View style={styles.creditDetailItem}>
                      <View style={styles.creditDetailLabelWithIcon}>
                        <Chart size={14} color="#9C27B0" variant="Bold" />
                        <Text style={styles.creditDetailLabel}>Interés</Text>
                      </View>
                      <Text style={styles.creditDetailValue}>
                        {credito.interes}% mensual
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Botón de acción */}
                {credito.estado === 'activo' && (
                  <TouchableOpacity 
                    style={styles.creditActionButton}
                    onPress={() => router.push('/(tabs)/Credit/pay_credit')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.creditActionButtonText}>Pagar ahora</Text>
                    <ArrowRight2 size={16} color="white" variant="Bold" />
                  </TouchableOpacity>
                )}

                {credito.estado === 'vencido' && (
                  <TouchableOpacity 
                    style={[styles.creditActionButton, styles.creditActionButtonDanger]}
                    onPress={() => router.push('/(tabs)/Credit/pay_credit')}
                    activeOpacity={0.8}
                  >
                    <Warning2 size={18} color="white" variant="Bold" />
                    <Text style={styles.creditActionButtonTextDanger}>
                      Ponerse al día
                    </Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Footer de consejo */}
        <View style={styles.footerTip}>
          <Lamp size={16} color="#FFC107" variant="Bold" />
          <Text style={styles.footerTipText}>
            Mantén tus pagos al día para mejorar tu historial
          </Text>
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
    marginBottom: verticalScale(20),
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  summaryIconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: "#E3F2FD",
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
    fontSize: scaleFont(28),
    fontWeight: "bold",
    color: "#5B7FFF",
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statItemBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#f0f0f0",
  },
  statValue: {
    fontSize: scaleFont(22),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: scaleFont(11),
    color: "#999",
    fontWeight: "500",
  },

  // Filters
  filtersContainer: {
    marginBottom: verticalScale(20),
  },
  filtersTitle: {
    fontSize: scaleFont(15),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: verticalScale(12),
  },
  filtersScroll: {
    gap: scale(10),
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(20),
    backgroundColor: "white",
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
  filterButtonActive: {
    backgroundColor: "#5B7FFF",
    borderColor: "#5B7FFF",
  },
  filterButtonText: {
    fontSize: scaleFont(13),
    fontWeight: "600",
    color: "#666",
  },
  filterButtonTextActive: {
    color: "white",
  },

  // Credits List
  creditsList: {
    marginBottom: verticalScale(20),
  },
  creditsListTitle: {
    fontSize: scaleFont(15),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: verticalScale(14),
  },

  // Empty State
  emptyState: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(40),
    alignItems: "center",
  },
  emptyStateTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  emptyStateText: {
    fontSize: scaleFont(14),
    color: "#999",
    textAlign: "center",
  },

  // Credit Card
  creditCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(18),
    padding: scale(18),
    marginBottom: verticalScale(14),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f5f5f5",
  },
  creditCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(14),
  },
  creditCardLeft: {
    flex: 1,
  },
  creditStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
    alignSelf: "flex-start",
    gap: scale(6),
  },
  creditStatusIcon: {
    marginRight: scale(2),
  },
  creditStatusText: {
    fontSize: scaleFont(12),
    fontWeight: "700",
  },
  creditId: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "600",
  },
  creditAmountContainer: {
    marginBottom: verticalScale(14),
  },
  creditAmountLabel: {
    fontSize: scaleFont(12),
    color: "#999",
    marginBottom: verticalScale(4),
    fontWeight: "500",
  },
  creditAmount: {
    fontSize: scaleFont(26),
    fontWeight: "bold",
    color: "#1a1a1a",
  },

  // Credit Progress
  creditProgress: {
    marginBottom: verticalScale(14),
  },
  creditProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  creditProgressLabel: {
    fontSize: scaleFont(12),
    color: "#666",
    fontWeight: "500",
  },
  creditProgressText: {
    fontSize: scaleFont(12),
    color: "#5B7FFF",
    fontWeight: "700",
  },
  creditProgressBar: {
    height: moderateScale(8),
    backgroundColor: "#f0f0f0",
    borderRadius: moderateScale(4),
    overflow: "hidden",
  },
  creditProgressFill: {
    height: "100%",
    borderRadius: moderateScale(4),
  },

  // Credit Details
  creditDetails: {
    gap: verticalScale(10),
    paddingTop: verticalScale(14),
    borderTopWidth: 1,
    borderTopColor: "#f5f5f5",
  },
  creditDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(12),
  },
  creditDetailItem: {
    flex: 1,
  },
  creditDetailLabelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    marginBottom: verticalScale(4),
  },
  creditDetailLabel: {
    fontSize: scaleFont(11),
    color: "#999",
    fontWeight: "500",
  },
  creditDetailValue: {
    fontSize: scaleFont(13),
    color: "#1a1a1a",
    fontWeight: "600",
  },
  creditDetailValueBold: {
    fontWeight: "700",
    fontSize: scaleFont(14),
  },

  // Credit Action Button
  creditActionButton: {
    backgroundColor: "#5B7FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    marginTop: verticalScale(14),
    gap: scale(6),
  },
  creditActionButtonText: {
    color: "white",
    fontSize: scaleFont(14),
    fontWeight: "700",
  },
  creditActionButtonDanger: {
    backgroundColor: "#FF5252",
  },
  creditActionButtonTextDanger: {
    color: "white",
    fontSize: scaleFont(14),
    fontWeight: "700",
  },

  // Footer de consejo
  footerTip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(20),
    gap: scale(8),
    marginBottom: verticalScale(24),
  },
  footerTipText: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: scaleFont(18),
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