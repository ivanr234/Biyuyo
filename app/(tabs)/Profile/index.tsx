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

export default function ProfileScreen() {
  const router = useRouter();
  
  // Datos del usuario
  const [userData] = useState({
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    telefono: "+57 300 123 4567",
    cedula: "1234567890",
    fechaRegistro: "15 Ene 2024",
    cupoTotal: 1000000,
    creditosActivos: 1,
    pagosPuntuales: 8,
  });

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  const handleEditProfile = () => {
    Alert.alert("Editar Perfil", "Función en desarrollo");
  };

  const handleChangePassword = () => {
    Alert.alert("Cambiar Contraseña", "Función en desarrollo");
  };

  const handleNotifications = () => {
    Alert.alert("Notificaciones", "Función en desarrollo");
  };

  const handlePrivacy = () => {
    Alert.alert("Privacidad", "Función en desarrollo");
  };

  const handleTerms = () => {
    Alert.alert("Términos y Condiciones", "Función en desarrollo");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Eliminar Cuenta",
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => Alert.alert("Cuenta eliminada", "Tu cuenta ha sido eliminada")
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header con logo */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
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
        {/* Espaciador para separar del header */}
        <View style={styles.headerSpacer} />

        {/* Tarjeta de Perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData.nombre.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <TouchableOpacity style={styles.avatarEditButton} onPress={handleEditProfile}>
              <Text style={styles.avatarEditIcon}>📷</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{userData.nombre}</Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>

          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeIcon}>⭐</Text>
            <Text style={styles.memberBadgeText}>Miembro desde {userData.fechaRegistro}</Text>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Tu Actividad</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Text style={styles.statIcon}>💳</Text>
              </View>
              <Text style={styles.statValue}>{formatCurrency(userData.cupoTotal)}</Text>
              <Text style={styles.statLabel}>Cupo Total</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.statIcon}>📊</Text>
              </View>
              <Text style={styles.statValue}>{userData.creditosActivos}</Text>
              <Text style={styles.statLabel}>Créditos Activos</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.statIcon}>✅</Text>
              </View>
              <Text style={styles.statValue}>{userData.pagosPuntuales}</Text>
              <Text style={styles.statLabel}>Pagos Puntuales</Text>
            </View>
          </View>
        </View>

        {/* Información Personal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📧</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📱</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{userData.telefono}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🆔</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Cédula</Text>
                <Text style={styles.infoValue}>{userData.cedula}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Configuración de Cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#E3F2FD' }]}>
                <Text style={styles.menuEmoji}>✏</Text>
              </View>
              <Text style={styles.menuText}>Editar perfil</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleChangePassword}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.menuEmoji}>🔑</Text>
              </View>
              <Text style={styles.menuText}>Cambiar contraseña</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleNotifications}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.menuEmoji}>🔔</Text>
              </View>
              <Text style={styles.menuText}>Notificaciones</Text>
            </View>
            <View style={styles.toggleContainer}>
              <View style={styles.toggle}>
                <View style={styles.toggleActive} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Privacidad y Seguridad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacidad y Seguridad</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handlePrivacy}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#F3E5F5' }]}>
                <Text style={styles.menuEmoji}>🔒</Text>
              </View>
              <Text style={styles.menuText}>Privacidad</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleTerms}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#E1F5FE' }]}>
                <Text style={styles.menuEmoji}>📄</Text>
              </View>
              <Text style={styles.menuText}>Términos y condiciones</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Zona de Peligro */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zona de Peligro</Text>
          
          <TouchableOpacity 
            style={styles.dangerItem}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFE5E5' }]}>
                <Text style={styles.menuEmoji}>🗑</Text>
              </View>
              <Text style={[styles.menuText, { color: '#FF5252' }]}>Eliminar cuenta</Text>
            </View>
            <Text style={[styles.menuArrow, { color: '#FF5252' }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Biyuyo v1.0.0</Text>
          <Text style={styles.footerSubtext}>© 2025 Todos los derechos reservados</Text>
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
    paddingBottom: verticalScale(30),
  },
  headerSpacer: {
    height: verticalScale(20),
  },

  // Profile Card
  profileCard: {
    backgroundColor: "white",
    marginHorizontal: scale(20),
    borderRadius: moderateScale(20),
    padding: scale(24),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: verticalScale(16),
  },
  avatar: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    backgroundColor: "#5B7FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: scaleFont(36),
    fontWeight: "bold",
    color: "white",
  },
  avatarEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  avatarEditIcon: {
    fontSize: scaleFont(16),
  },
  profileName: {
    fontSize: scaleFont(24),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  profileEmail: {
    fontSize: scaleFont(14),
    color: "#666",
    marginBottom: verticalScale(16),
    fontWeight: "500",
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  memberBadgeIcon: {
    fontSize: scaleFont(16),
    marginRight: scale(6),
  },
  memberBadgeText: {
    fontSize: scaleFont(12),
    color: "#1a1a1a",
    fontWeight: "600",
  },

  // Stats Card
  statsCard: {
    backgroundColor: "white",
    marginHorizontal: scale(20),
    marginTop: verticalScale(16),
    borderRadius: moderateScale(16),
    padding: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  statsTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(16),
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIconContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  statIcon: {
    fontSize: scaleFont(24),
  },
  statValue: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: scaleFont(11),
    color: "#999",
    textAlign: "center",
    fontWeight: "500",
  },

  // Section
  section: {
    marginTop: verticalScale(24),
    paddingHorizontal: scale(20),
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(12),
  },

  // Info Card
  infoCard: {
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
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(8),
  },
  infoIcon: {
    fontSize: scaleFont(24),
    marginRight: scale(14),
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: scaleFont(12),
    color: "#999",
    marginBottom: verticalScale(2),
    fontWeight: "500",
  },
  infoValue: {
    fontSize: scaleFont(14),
    color: "#1a1a1a",
    fontWeight: "600",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: verticalScale(8),
  },

  // Menu Items
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: scale(16),
    borderRadius: moderateScale(14),
    marginBottom: verticalScale(10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  menuEmoji: {
    fontSize: scaleFont(20),
  },
  menuText: {
    fontSize: scaleFont(15),
    fontWeight: "600",
    color: "#1a1a1a",
  },
  menuArrow: {
    fontSize: scaleFont(24),
    color: "#5B7FFF",
    fontWeight: "bold",
  },
  toggleContainer: {
    marginLeft: scale(10),
  },
  toggle: {
    width: moderateScale(50),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: "#5B7FFF",
    justifyContent: "center",
    paddingHorizontal: scale(3),
  },
  toggleActive: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    backgroundColor: "white",
    alignSelf: "flex-end",
  },

  // Danger Item
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: scale(16),
    borderRadius: moderateScale(14),
    marginBottom: verticalScale(10),
    shadowColor: "#FF5252",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#FFE5E5",
  },

  // Logout Button
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#5B7FFF",
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(24),
    borderRadius: moderateScale(20),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: scale(20),
    marginTop: verticalScale(24),
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutIcon: {
    fontSize: scaleFont(20),
    marginRight: scale(10),
  },
  logoutText: {
    color: "white",
    fontSize: scaleFont(16),
    fontWeight: "700",
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: verticalScale(24),
  },
  footerText: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "600",
    marginBottom: verticalScale(4),
  },
  footerSubtext: {
    fontSize: scaleFont(11),
    color: "#bbb",
  },
});