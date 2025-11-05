import ProductCarousel from "@/components/ProductCarousel";
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
  TouchableOpacity,
  View,
} from "react-native";
   
const { width, height } = Dimensions.get("window");

// Función para escalar dimensiones basadas en el ancho de pantalla
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

// Función de escala moderada (para que no todo escale proporcionalmente)
const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Detectar si es un dispositivo pequeño (menor a 375px de ancho)
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;
const isLargeDevice = width >= 414;

export default function DashboardScreen() {
  const router = useRouter();
  
  // Datos del usuario
  const [cupoDisponible] = useState(500000);
  const [cupoTotal] = useState(1000000);
  const [creditoActivo] = useState(250000);
  const [proximoPago] = useState("15 Nov 2025");
  const [userName] = useState("Usuario");

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  const porcentajeUsado = ((cupoTotal - cupoDisponible) / cupoTotal) * 100;

  const handleProductPress = (product: any) => {
    Alert.alert(
      product.name,
      `¿Deseas solicitar ${product.name}?\n\n${product.description}`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Solicitar", 
          onPress: () => {
            Alert.alert("Solicitud iniciada", "Serás redirigido al proceso de solicitud");
            // Aquí puedes agregar la navegación a la pantalla de solicitud
            // router.push('/(tabs)/Credit/request_credit');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header mejorado */}
      <View style={styles.header}>
        {/* Logo principal */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/images/logo-biyuyo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Saludo y acciones */}
        <View style={styles.headerBottom}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hola, {userName}</Text>
            <Text style={styles.subGreeting}>¿Qué quieres hacer hoy?</Text>
          </View>
          
          <View style={styles.headerRightActions}>
            {/* Botón de Notificaciones */}
            <TouchableOpacity style={styles.notificationButton}>
              <Text style={styles.notificationIcon}>🔔</Text>
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>
            
            {/* Botón de Perfil Mejorado */}
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push('/(tabs)/Profile')}
              activeOpacity={0.8}
            >
              <View style={styles.profileAvatarContainer}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>
                    {userName.charAt(0)}
                  </Text>
                </View>
                <View style={styles.profileStatusDot} />
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
                <Text style={styles.cardIconText}>💰</Text>
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
              <Text style={styles.mainSubtext}>de {formatCurrency(cupoTotal)} COP</Text>
            </View>

            {/* Barra de progreso mejorada */}
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Cupo utilizado</Text>
                <Text style={styles.progressPercentage}>{porcentajeUsado.toFixed(0)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${porcentajeUsado}%` }
                  ]} 
                />
              </View>
            </View>

            {/* Botón principal */}
            <TouchableOpacity 
              style={styles.primaryButton}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Solicitar Crédito</Text>
              <Text style={styles.buttonArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tarjetas de información mejoradas */}
        <View style={styles.infoGrid}>
          {/* Crédito Activo */}
          <View style={styles.infoCard}>
            <View style={[styles.infoIconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.infoIcon}>💳</Text>
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
            <View style={[styles.infoIconContainer, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.infoIcon}>📅</Text>
            </View>
            <Text style={styles.infoLabel}>Próximo Pago</Text>
            <Text style={styles.infoDate}>{proximoPago}</Text>
            <Text style={styles.infoSubtext}>Fecha límite</Text>
          </View>
        </View>

        {/* ===== CARRUSEL DE PRODUCTOS - NUEVO ===== */}
        <ProductCarousel onProductPress={handleProductPress} />

        {/* Acciones Rápidas con mejor diseño */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          {/* PAGAR MI CRÉDITO */}
          <TouchableOpacity 
            style={styles.actionItem} 
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/Credit/pay_credit')}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.actionEmoji}>💰</Text>
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Pagar mi crédito</Text>
                <Text style={styles.actionSubtitle}>Realiza un abono o paga tu cuota</Text>
              </View>
            </View>
            <View style={styles.actionArrowContainer}>
              <Text style={styles.actionArrow}>›</Text>
            </View>
          </TouchableOpacity>

          {/* HISTORIAL DE CRÉDITOS */}
          <TouchableOpacity 
            style={styles.actionItem} 
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/Credit/credit_history')}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                <Text style={styles.actionEmoji}>📊</Text>
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Historial de créditos</Text>
                <Text style={styles.actionSubtitle}>Consulta tus movimientos</Text>
              </View>
            </View>
            <View style={styles.actionArrowContainer}>
              <Text style={styles.actionArrow}>›</Text>
            </View>
          </TouchableOpacity>

          {/* AUMENTAR CUPO */}
          <TouchableOpacity 
            style={styles.actionItem} 
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/Credit/increase_quota')}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.actionEmoji}>🎁</Text>
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Aumentar cupo</Text>
                <Text style={styles.actionSubtitle}>Solicita más crédito disponible</Text>
              </View>
            </View>
            <View style={styles.actionArrowContainer}>
              <Text style={styles.actionArrow}>›</Text>
            </View>
          </TouchableOpacity>

          {/* SOPORTE Y AYUDA */}
          <TouchableOpacity 
            style={styles.actionItem} 
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/Help')}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#E1F5FE' }]}>
                <Text style={styles.actionEmoji}>💬</Text>
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Soporte y ayuda</Text>
                <Text style={styles.actionSubtitle}>Chatea con nosotros</Text>
              </View>
            </View>
            <View style={styles.actionArrowContainer}>
              <Text style={styles.actionArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar sesión mejorado */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.push('/')}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Biyuyo © 2025</Text>
          <Text style={styles.footerSubtext}>Desarrollado por Ingenio Soluciones Ti</Text>
          <Text style={styles.footerSubtext}>Tu aliado financiero de confianza</Text>
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
    width: scale(140),
    height: verticalScale(45),
    maxWidth: 180,
    maxHeight: 60,
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
  notificationButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationIcon: {
    fontSize: scaleFont(20),
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
  profileButton: {
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  profileAvatarContainer: {
    position: "relative",
  },
  profileAvatar: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(23),
    backgroundColor: "#5B7FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  profileAvatarText: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "white",
  },
  profileStatusDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: moderateScale(14),
    height: moderateScale(14),
    borderRadius: moderateScale(7),
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: "white",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(20),
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
  cardIconText: {
    fontSize: scaleFont(24),
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
  },
  primaryButtonText: {
    color: "#1a1a1a",
    fontSize: scaleFont(15),
    fontWeight: "bold",
    marginRight: scale(6),
  },
  buttonArrow: {
    color: "#1a1a1a",
    fontSize: scaleFont(18),
    fontWeight: "bold",
  },
  infoGrid: {
    flexDirection: "row",
    gap: scale(12),
    marginBottom: verticalScale(20),
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
  infoIcon: {
    fontSize: scaleFont(20),
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
  actionEmoji: {
    fontSize: scaleFont(22),
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
  actionArrow: {
    fontSize: scaleFont(18),
    color: "#5B7FFF",
    fontWeight: "bold",
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
  },
  logoutIcon: {
    fontSize: scaleFont(18),
    marginRight: scale(8),
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
});