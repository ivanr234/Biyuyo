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
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Importar iconos de Iconsax
import {
  ArrowLeft,
  ArrowRight2,
  Clock,
  FingerScan,
  InfoCircle,
  Key,
  Location,
  Lock,
  Logout,
  Mobile,
  Notification,
  SecuritySafe,
  ShieldTick,
  Warning2
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

interface SecurityOption {
  id: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  type: 'toggle' | 'action';
  value?: boolean;
  action?: () => void;
}

export default function SecurityScreen() {
  const router = useRouter();
  
  // Estados de seguridad
  const [securitySettings, setSecuritySettings] = useState({
    biometricLogin: true,
    twoFactorAuth: false,
    loginNotifications: true,
    unusualActivityAlerts: true,
    autoLock: true,
    deviceTracking: false,
  });

  // Información de sesión
  const sessionInfo = {
    lastLogin: "Hoy a las 14:30",
    currentDevice: "iPhone 13 Pro",
    activeSessions: 1,
    lastPasswordChange: "Hace 2 meses",
  };

  const handleToggle = (setting: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleChangePassword = () => {
    router.push('/Profile/change_password');
  };

  const handle2FASetup = () => {
    if (securitySettings.twoFactorAuth) {
      Alert.alert(
        "Desactivar 2FA",
        "¿Estás seguro de que deseas desactivar la autenticación de dos factores? Tu cuenta será menos segura.",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Desactivar", 
            style: "destructive",
            onPress: () => handleToggle('twoFactorAuth')
          }
        ]
      );
    } else {
      Alert.alert(
        "Configurar 2FA",
        "Configura la autenticación de dos factores para mayor seguridad.",
        [
          { text: "Ahora no", style: "cancel" },
          { 
            text: "Configurar",
            onPress: () => {
              handleToggle('twoFactorAuth');
              Alert.alert("¡Activado!", "La autenticación de dos factores ha sido activada");
            }
          }
        ]
      );
    }
  };

  const handleViewActiveSessions = () => {
    Alert.alert(
      "Sesiones Activas",
      `Sesión actual:\n${sessionInfo.currentDevice}\n${sessionInfo.lastLogin}\n\nSesiones activas: ${sessionInfo.activeSessions}`,
      [{ text: "OK" }]
    );
  };

  const handleCloseAllSessions = () => {
    Alert.alert(
      "Cerrar Todas las Sesiones",
      "¿Deseas cerrar sesión en todos los dispositivos excepto este?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Cerrar Sesiones",
          style: "destructive",
          onPress: () => Alert.alert("Sesiones cerradas", "Has cerrado sesión en todos los dispositivos")
        }
      ]
    );
  };

  const handleSecurityCheckup = () => {
    Alert.alert(
      "Revisión de Seguridad",
      "✅ Contraseña fuerte\n✅ Login biométrico activo\n⚠️ Autenticación de dos factores desactivada\n✅ Notificaciones activas",
      [{ text: "OK" }]
    );
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
          <Text style={styles.headerTitle}>Seguridad</Text>
          <Text style={styles.headerSubtitle}>Protege tu cuenta</Text>
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
        {/* Security Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconContainer}>
            <ShieldTick size={56} color="#4CAF50" variant="Bold" />
          </View>
          <Text style={styles.statusTitle}>Tu cuenta está protegida</Text>
          <Text style={styles.statusSubtitle}>
            Has activado {Object.values(securitySettings).filter(v => v).length} de 6 medidas de seguridad
          </Text>
          <TouchableOpacity 
            style={styles.checkupButton}
            onPress={handleSecurityCheckup}
            activeOpacity={0.8}
          >
            <SecuritySafe size={18} color="white" variant="Bold" />
            <Text style={styles.checkupButtonText}>Revisar Seguridad</Text>
          </TouchableOpacity>
        </View>

        {/* Session Info Card */}
        <View style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <Clock size={20} color="#5B7FFF" variant="Bold" />
            <Text style={styles.sessionTitle}>Información de Sesión</Text>
          </View>
          <View style={styles.sessionDetails}>
            <View style={styles.sessionItem}>
              <Text style={styles.sessionLabel}>Último acceso</Text>
              <Text style={styles.sessionValue}>{sessionInfo.lastLogin}</Text>
            </View>
            <View style={styles.sessionDivider} />
            <View style={styles.sessionItem}>
              <Text style={styles.sessionLabel}>Dispositivo actual</Text>
              <Text style={styles.sessionValue}>{sessionInfo.currentDevice}</Text>
            </View>
            <View style={styles.sessionDivider} />
            <View style={styles.sessionItem}>
              <Text style={styles.sessionLabel}>Sesiones activas</Text>
              <Text style={styles.sessionValue}>{sessionInfo.activeSessions}</Text>
            </View>
          </View>
        </View>

        {/* Authentication Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Autenticación</Text>

          <View style={styles.optionCard}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#E8F5E9' }]}>
                <FingerScan size={24} color="#4CAF50" variant="Bold" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Login Biométrico</Text>
                <Text style={styles.optionSubtitle}>Usa huella o Face ID</Text>
              </View>
            </View>
            <Switch
              value={securitySettings.biometricLogin}
              onValueChange={() => handleToggle('biometricLogin')}
              trackColor={{ false: "#E0E0E0", true: "#4CAF50" }}
              thumbColor={securitySettings.biometricLogin ? "white" : "#f4f3f4"}
            />
          </View>

          <View style={styles.optionCard}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#E3F2FD' }]}>
                <ShieldTick size={24} color="#2196F3" variant="Bold" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Autenticación de Dos Factores</Text>
                <Text style={styles.optionSubtitle}>
                  {securitySettings.twoFactorAuth ? "Activada" : "Mayor seguridad recomendada"}
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.twoFactorAuth}
              onValueChange={handle2FASetup}
              trackColor={{ false: "#E0E0E0", true: "#2196F3" }}
              thumbColor={securitySettings.twoFactorAuth ? "white" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleChangePassword}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Key size={24} color="#FF9800" variant="Bold" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Cambiar Contraseña</Text>
                <Text style={styles.optionSubtitle}>
                  Última actualización: {sessionInfo.lastPasswordChange}
                </Text>
              </View>
            </View>
            <ArrowRight2 size={20} color="#5B7FFF" variant="Bold" />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones de Seguridad</Text>

          <View style={styles.optionCard}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#F3E5F5' }]}>
                <Notification size={24} color="#9C27B0" variant="Bold" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Notificar Nuevos Accesos</Text>
                <Text style={styles.optionSubtitle}>Alerta cuando inicies sesión</Text>
              </View>
            </View>
            <Switch
              value={securitySettings.loginNotifications}
              onValueChange={() => handleToggle('loginNotifications')}
              trackColor={{ false: "#E0E0E0", true: "#9C27B0" }}
              thumbColor={securitySettings.loginNotifications ? "white" : "#f4f3f4"}
            />
          </View>

          <View style={styles.optionCard}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#FFE5E5' }]}>
                <Warning2 size={24} color="#FF5252" variant="Bold" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Actividad Inusual</Text>
                <Text style={styles.optionSubtitle}>Detectar intentos sospechosos</Text>
              </View>
            </View>
            <Switch
              value={securitySettings.unusualActivityAlerts}
              onValueChange={() => handleToggle('unusualActivityAlerts')}
              trackColor={{ false: "#E0E0E0", true: "#FF5252" }}
              thumbColor={securitySettings.unusualActivityAlerts ? "white" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Device Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seguridad del Dispositivo</Text>

          <View style={styles.optionCard}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#E1F5FE' }]}>
                <Lock size={24} color="#00BCD4" variant="Bold" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Bloqueo Automático</Text>
                <Text style={styles.optionSubtitle}>Requiere PIN al abrir la app</Text>
              </View>
            </View>
            <Switch
              value={securitySettings.autoLock}
              onValueChange={() => handleToggle('autoLock')}
              trackColor={{ false: "#E0E0E0", true: "#00BCD4" }}
              thumbColor={securitySettings.autoLock ? "white" : "#f4f3f4"}
            />
          </View>

          <View style={styles.optionCard}>
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#FFF9E6' }]}>
                <Location size={24} color="#FFC107" variant="Bold" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Rastreo de Dispositivos</Text>
                <Text style={styles.optionSubtitle}>Ver dispositivos conectados</Text>
              </View>
            </View>
            <Switch
              value={securitySettings.deviceTracking}
              onValueChange={() => handleToggle('deviceTracking')}
              trackColor={{ false: "#E0E0E0", true: "#FFC107" }}
              thumbColor={securitySettings.deviceTracking ? "white" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Session Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Sesiones</Text>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleViewActiveSessions}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Mobile size={24} color="#4CAF50" variant="Bold" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Sesiones Activas</Text>
                <Text style={styles.optionSubtitle}>Ver todos los dispositivos</Text>
              </View>
            </View>
            <ArrowRight2 size={20} color="#5B7FFF" variant="Bold" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, styles.dangerActionCard]}
            onPress={handleCloseAllSessions}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: '#FFE5E5' }]}>
                <Logout size={24} color="#FF5252" variant="Bold" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: '#FF5252' }]}>
                  Cerrar Todas las Sesiones
                </Text>
                <Text style={styles.optionSubtitle}>Excepto este dispositivo</Text>
              </View>
            </View>
            <ArrowRight2 size={20} color="#FF5252" variant="Bold" />
          </TouchableOpacity>
        </View>

        {/* Security Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <InfoCircle size={24} color="#5B7FFF" variant="Bold" />
            <Text style={styles.tipsTitle}>Consejos de Seguridad</Text>
          </View>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>
                Activa la autenticación de dos factores para mayor protección
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>
                Cambia tu contraseña regularmente cada 3-6 meses
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>
                Nunca compartas tu contraseña o códigos de verificación
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>
                Revisa regularmente las sesiones activas en tus dispositivos
              </Text>
            </View>
          </View>
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

  // Status Card
  statusCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(20),
    padding: scale(24),
    alignItems: "center",
    marginBottom: verticalScale(20),
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  statusIconContainer: {
    marginBottom: verticalScale(16),
  },
  statusTitle: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(8),
  },
  statusSubtitle: {
    fontSize: scaleFont(13),
    color: "#666",
    textAlign: "center",
    marginBottom: verticalScale(20),
    fontWeight: "500",
  },
  checkupButton: {
    flexDirection: "row",
    backgroundColor: "#5B7FFF",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
    borderRadius: moderateScale(20),
    alignItems: "center",
    gap: scale(8),
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkupButtonText: {
    color: "white",
    fontSize: scaleFont(14),
    fontWeight: "700",
  },

  // Session Card
  sessionCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(18),
    marginBottom: verticalScale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
    gap: scale(8),
  },
  sessionTitle: {
    fontSize: scaleFont(15),
    fontWeight: "700",
    color: "#1a1a1a",
  },
  sessionDetails: {
    gap: verticalScale(12),
  },
  sessionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionLabel: {
    fontSize: scaleFont(13),
    color: "#999",
    fontWeight: "500",
  },
  sessionValue: {
    fontSize: scaleFont(13),
    color: "#1a1a1a",
    fontWeight: "600",
  },
  sessionDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },

  // Section
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(12),
  },

  // Option Cards
  optionCard: {
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
  actionCard: {
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
  dangerActionCard: {
    borderWidth: 1,
    borderColor: "#FFE5E5",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: scale(12),
  },
  optionIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: scaleFont(14),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: verticalScale(2),
  },
  optionSubtitle: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "500",
  },

  // Tips Card
  tipsCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: moderateScale(16),
    padding: scale(18),
    borderWidth: 1,
    borderColor: "rgba(91, 127, 255, 0.2)",
    marginBottom: verticalScale(24),
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
    gap: scale(10),
  },
  tipsTitle: {
    fontSize: scaleFont(15),
    fontWeight: "700",
    color: "#1a1a1a",
  },
  tipsList: {
    gap: verticalScale(12),
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: scale(10),
  },
  tipBullet: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: "#5B7FFF",
    marginTop: verticalScale(7),
  },
  tipText: {
    flex: 1,
    fontSize: scaleFont(12),
    color: "#666",
    lineHeight: scaleFont(18),
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