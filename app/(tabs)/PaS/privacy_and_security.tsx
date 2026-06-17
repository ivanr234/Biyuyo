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
  Eye,
  Key,
  Lock,
  LockCircle,
  Message,
  Notification,
  PasswordCheck,
  Profile2User,
  Scan,
  Scanner,
  SecuritySafe,
  Setting2,
  Shield,
  ShieldSecurity,
  ShieldTick,
  Unlock,
  Verify
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

// Interfaces
interface SecurityFeature {
  id: string;
  titulo: string;
  descripcion: string;
  icono: any;
  color: string;
  backgroundColor: string;
}

interface SecurityTip {
  id: string;
  titulo: string;
  descripcion: string;
  icono: any;
  color: string;
}

interface PrivacySection {
  id: string;
  titulo: string;
  items: string[];
  icono: any;
  color: string;
}

export default function PrivacySecurityScreen() {
  const router = useRouter();
  
  // Estados
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Características de Seguridad
  const securityFeatures: SecurityFeature[] = [
    {
      id: "1",
      titulo: "Encriptación de datos",
      descripcion: "Toda tu información está protegida con encriptación de grado bancario AES-256",
      icono: LockCircle,
      color: "#4CAF50",
      backgroundColor: "#E8F5E9",
    },
    {
      id: "2",
      titulo: "Autenticación biométrica",
      descripcion: "Protege tu cuenta con huella dactilar o reconocimiento facial",
      icono: Scan,
      color: "#2196F3",
      backgroundColor: "#E3F2FD",
    },
    {
      id: "3",
      titulo: "Verificación en dos pasos",
      descripcion: "Capa adicional de seguridad para tus transacciones importantes",
      icono: ShieldTick,
      color: "#FF9800",
      backgroundColor: "#FFF3E0",
    },
    {
      id: "4",
      titulo: "Monitoreo 24/7",
      descripcion: "Sistema de detección de actividades sospechosas en tiempo real",
      icono: Eye,
      color: "#9C27B0",
      backgroundColor: "#F3E5F5",
    },
  ];

  // Tips de Seguridad
  const securityTips: SecurityTip[] = [
    {
      id: "1",
      titulo: "Usa contraseñas seguras",
      descripcion: "Combina letras, números y símbolos. Evita información personal.",
      icono: PasswordCheck,
      color: "#4CAF50",
    },
    {
      id: "2",
      titulo: "No compartas tu PIN",
      descripcion: "Nunca reveles tu PIN, contraseña o código de verificación a nadie.",
      icono: Key,
      color: "#E91E63",
    },
    {
      id: "3",
      titulo: "Verifica los enlaces",
      descripcion: "Asegúrate de estar en sitios oficiales antes de ingresar información.",
      icono: Scanner,
      color: "#FF9800",
    },
    {
      id: "4",
      titulo: "Actualiza regularmente",
      descripcion: "Mantén la app actualizada para obtener las últimas mejoras de seguridad.",
      icono: Setting2,
      color: "#2196F3",
    },
    {
      id: "5",
      titulo: "Revisa tu actividad",
      descripcion: "Verifica regularmente tus movimientos y reporta cualquier irregularidad.",
      icono: Eye,
      color: "#9C27B0",
    },
    {
      id: "6",
      titulo: "Cierra sesión en dispositivos compartidos",
      descripcion: "Siempre cierra sesión cuando uses dispositivos públicos o compartidos.",
      icono: Unlock,
      color: "#F44336",
    },
  ];

  // Secciones de Privacidad
  const privacySections: PrivacySection[] = [
    {
      id: "1",
      titulo: "¿Qué información recopilamos?",
      items: [
        "Información de identificación personal (nombre, documento, email, teléfono)",
        "Información financiera necesaria para evaluar créditos",
        "Datos de uso de la aplicación para mejorar tu experiencia",
        "Información de dispositivo y ubicación (con tu consentimiento)",
      ],
      icono: Profile2User,
      color: "#5B7FFF",
    },
    {
      id: "2",
      titulo: "¿Cómo usamos tu información?",
      items: [
        "Procesar y aprobar solicitudes de crédito",
        "Verificar tu identidad y prevenir fraudes",
        "Personalizar tu experiencia en la app",
        "Enviarte notificaciones importantes sobre tu cuenta",
        "Mejorar nuestros servicios y productos",
        "Cumplir con requisitos legales y regulatorios",
      ],
      icono: SecuritySafe,
      color: "#4CAF50",
    },
    {
      id: "3",
      titulo: "¿Compartimos tu información?",
      items: [
        "NO vendemos tu información personal a terceros",
        "Compartimos datos solo con proveedores de servicios confiables",
        "Reportamos a centrales de riesgo según la ley colombiana",
        "Podemos compartir información por requerimientos legales",
        "Toda transferencia cumple con estándares de protección de datos",
      ],
      icono: Shield,
      color: "#FF9800",
    },
    {
      id: "4",
      titulo: "Tus derechos",
      items: [
        "Acceder a tu información personal almacenada",
        "Solicitar corrección de datos inexactos",
        "Solicitar eliminación de tu información (según aplique)",
        "Oponerte al procesamiento de tus datos",
        "Solicitar portabilidad de tus datos",
        "Revocar consentimientos otorgados",
      ],
      icono: Verify,
      color: "#2196F3",
    },
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
          <Text style={styles.headerTitle}>Privacidad y Seguridad</Text>
          <Text style={styles.headerSubtitle}>Tu protección es nuestra prioridad</Text>
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
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroIconContainer}>
              <ShieldSecurity size={56} color="white" variant="Bold" />
            </View>
            <Text style={styles.heroTitle}>Tu seguridad es lo primero</Text>
            <Text style={styles.heroSubtitle}>
              Protegemos tu información con los más altos estándares de seguridad y privacidad
            </Text>
          </View>
        </View>

        {/* Security Level Card */}
        <View style={styles.securityLevelCard}>
          <View style={styles.securityLevelHeader}>
            <View style={styles.securityLevelIconContainer}>
              <ShieldTick size={32} color="#4CAF50" variant="Bold" />
            </View>
            <View style={styles.securityLevelTextContainer}>
              <Text style={styles.securityLevelTitle}>Nivel de Seguridad</Text>
              <Text style={styles.securityLevelStatus}>Alto - Cuenta protegida</Text>
            </View>
          </View>
          <View style={styles.securityLevelProgress}>
            <View style={styles.securityLevelProgressBar}>
              <View style={[styles.securityLevelProgressFill, { width: '85%' }]} />
            </View>
            <Text style={styles.securityLevelPercentage}>85%</Text>
          </View>
          <Text style={styles.securityLevelTip}>
            💡 Activa la verificación en dos pasos para mejorar tu seguridad
          </Text>
        </View>

        {/* Características de Seguridad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cómo protegemos tu cuenta</Text>
          
          <View style={styles.featuresGrid}>
            {securityFeatures.map((feature) => {
              const IconComponent = feature.icono;
              return (
                <View key={feature.id} style={styles.featureCard}>
                  <View style={[styles.featureIconContainer, { backgroundColor: feature.backgroundColor }]}>
                    <IconComponent size={32} color={feature.color} variant="Bold" />
                  </View>
                  <Text style={styles.featureTitle}>{feature.titulo}</Text>
                  <Text style={styles.featureDescription}>{feature.descripcion}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Tips de Seguridad */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Lock size={24} color="#5B7FFF" variant="Bold" />
              <Text style={styles.sectionTitle}>Consejos de Seguridad</Text>
            </View>
          </View>

          <View style={styles.tipsContainer}>
            {securityTips.map((tip) => {
              const IconComponent = tip.icono;
              return (
                <View key={tip.id} style={styles.tipCard}>
                  <View style={[styles.tipIconContainer, { backgroundColor: `${tip.color}20` }]}>
                    <IconComponent size={24} color={tip.color} variant="Bold" />
                  </View>
                  <View style={styles.tipContent}>
                    <Text style={styles.tipTitle}>{tip.titulo}</Text>
                    <Text style={styles.tipDescription}>{tip.descripcion}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Secciones de Privacidad */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Shield size={24} color="#5B7FFF" variant="Bold" />
              <Text style={styles.sectionTitle}>Política de Privacidad</Text>
            </View>
          </View>

          <View style={styles.privacySectionsContainer}>
            {privacySections.map((section) => {
              const IconComponent = section.icono;
              const isExpanded = expandedSection === section.id;
              
              return (
                <TouchableOpacity
                  key={section.id}
                  style={styles.privacyCard}
                  onPress={() => setExpandedSection(isExpanded ? null : section.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.privacyCardHeader}>
                    <View style={styles.privacyCardLeft}>
                      <View style={[styles.privacyIconContainer, { backgroundColor: `${section.color}20` }]}>
                        <IconComponent size={24} color={section.color} variant="Bold" />
                      </View>
                      <Text style={styles.privacyCardTitle}>{section.titulo}</Text>
                    </View>
                    <ArrowRight2 
                      size={20} 
                      color="#5B7FFF" 
                      variant="Bold"
                      style={[
                        styles.privacyArrow,
                        isExpanded && styles.privacyArrowExpanded
                      ]}
                    />
                  </View>
                  
                  {isExpanded && (
                    <View style={styles.privacyCardContent}>
                      {section.items.map((item, index) => (
                        <View key={index} style={styles.privacyItem}>
                          <View style={styles.privacyBullet} />
                          <Text style={styles.privacyItemText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Certificaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certificaciones y Cumplimiento</Text>
          
          <View style={styles.certificationsContainer}>
            <View style={styles.certificationCard}>
              <View style={[styles.certificationIcon, { backgroundColor: '#E8F5E9' }]}>
                <ShieldTick size={32} color="#4CAF50" variant="Bold" />
              </View>
              <Text style={styles.certificationTitle}>ISO 27001</Text>
              <Text style={styles.certificationText}>Gestión de seguridad de la información</Text>
            </View>

            <View style={styles.certificationCard}>
              <View style={[styles.certificationIcon, { backgroundColor: '#E3F2FD' }]}>
                <SecuritySafe size={32} color="#2196F3" variant="Bold" />
              </View>
              <Text style={styles.certificationTitle}>PCI DSS</Text>
              <Text style={styles.certificationText}>Seguridad de datos de tarjetas</Text>
            </View>

            <View style={styles.certificationCard}>
              <View style={[styles.certificationIcon, { backgroundColor: '#F3E5F5' }]}>
                <Verify size={32} color="#9C27B0" variant="Bold" />
              </View>
              <Text style={styles.certificationTitle}>Ley 1581</Text>
              <Text style={styles.certificationText}>Protección de datos personales</Text>
            </View>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración de Privacidad</Text>
          
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <PasswordCheck size={24} color="#2196F3" variant="Bold" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Cambiar contraseña</Text>
                <Text style={styles.actionSubtitle}>Actualiza tu contraseña regularmente</Text>
              </View>
            </View>
            <ArrowRight2 size={20} color="#5B7FFF" variant="Bold" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Scan size={24} color="#FF9800" variant="Bold" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Autenticación biométrica</Text>
                <Text style={styles.actionSubtitle}>Configura huella o Face ID</Text>
              </View>
            </View>
            <ArrowRight2 size={20} color="#5B7FFF" variant="Bold" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                <ShieldTick size={24} color="#4CAF50" variant="Bold" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Verificación en dos pasos</Text>
                <Text style={styles.actionSubtitle}>Seguridad adicional</Text>
              </View>
            </View>
            <ArrowRight2 size={20} color="#5B7FFF" variant="Bold" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                <Notification size={24} color="#9C27B0" variant="Bold" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Alertas de seguridad</Text>
                <Text style={styles.actionSubtitle}>Notificaciones de actividad</Text>
              </View>
            </View>
            <ArrowRight2 size={20} color="#5B7FFF" variant="Bold" />
          </TouchableOpacity>
        </View>

        {/* Contacto de Seguridad */}
        <View style={styles.contactCard}>
          <View style={styles.contactIconContainer}>
            <Message size={32} color="#5B7FFF" variant="Bold" />
          </View>
          <Text style={styles.contactTitle}>¿Detectaste algo sospechoso?</Text>
          <Text style={styles.contactText}>
            Contáctanos inmediatamente si notas alguna actividad inusual en tu cuenta
          </Text>
          <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
            <Text style={styles.contactButtonText}>Reportar Incidente</Text>
          </TouchableOpacity>
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
    paddingBottom: verticalScale(100),
  },

  // Hero Card
  heroCard: {
    backgroundColor: "#5B7FFF",
    borderRadius: moderateScale(20),
    padding: scale(28),
    marginBottom: verticalScale(20),
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  heroContent: {
    alignItems: "center",
  },
  heroIconContainer: {
    marginBottom: verticalScale(16),
  },
  heroTitle: {
    fontSize: scaleFont(24),
    fontWeight: "bold",
    color: "white",
    marginBottom: verticalScale(10),
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: scaleFont(14),
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: scaleFont(22),
  },

  // Security Level Card
  securityLevelCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(20),
    marginBottom: verticalScale(24),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  securityLevelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  securityLevelIconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  securityLevelTextContainer: {
    flex: 1,
  },
  securityLevelTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  securityLevelStatus: {
    fontSize: scaleFont(13),
    color: "#4CAF50",
    fontWeight: "600",
  },
  securityLevelProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
    marginBottom: verticalScale(12),
  },
  securityLevelProgressBar: {
    flex: 1,
    height: verticalScale(8),
    backgroundColor: "#F0F0F0",
    borderRadius: moderateScale(4),
    overflow: "hidden",
  },
  securityLevelProgressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: moderateScale(4),
  },
  securityLevelPercentage: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "#4CAF50",
  },
  securityLevelTip: {
    fontSize: scaleFont(12),
    color: "#666",
    fontWeight: "500",
    lineHeight: scaleFont(18),
  },

  // Section
  section: {
    marginBottom: verticalScale(28),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(16),
  },

  // Features Grid
  featuresGrid: {
    gap: verticalScale(12),
  },
  featureCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIconContainer: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  featureTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(6),
  },
  featureDescription: {
    fontSize: scaleFont(13),
    color: "#666",
    lineHeight: scaleFont(20),
    fontWeight: "500",
  },

  // Tips
  tipsContainer: {
    gap: verticalScale(12),
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: moderateScale(14),
    padding: scale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    gap: scale(12),
  },
  tipIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  tipDescription: {
    fontSize: scaleFont(12),
    color: "#666",
    lineHeight: scaleFont(18),
    fontWeight: "500",
  },

  // Privacy Sections
  privacySectionsContainer: {
    gap: verticalScale(12),
  },
  privacyCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(14),
    padding: scale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  privacyCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  privacyCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: scale(12),
  },
  privacyIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  privacyCardTitle: {
    flex: 1,
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  privacyArrow: {
    transform: [{ rotate: '0deg' }],
  },
  privacyArrowExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  privacyCardContent: {
    marginTop: verticalScale(16),
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  privacyItem: {
    flexDirection: "row",
    marginBottom: verticalScale(12),
    gap: scale(10),
  },
  privacyBullet: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: "#5B7FFF",
    marginTop: scaleFont(7),
  },
  privacyItemText: {
    flex: 1,
    fontSize: scaleFont(13),
    color: "#666",
    lineHeight: scaleFont(20),
    fontWeight: "500",
  },

  // Certifications
  certificationsContainer: {
    gap: verticalScale(12),
  },
  certificationCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(14),
    padding: scale(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  certificationIcon: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(36),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  certificationTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(6),
  },
  certificationText: {
    fontSize: scaleFont(13),
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },

  // Actions
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
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: scale(12),
  },
  actionIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(2),
  },
  actionSubtitle: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "500",
  },

  // Contact Card
  contactCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: moderateScale(16),
    padding: scale(24),
    alignItems: "center",
    marginBottom: verticalScale(24),
    borderWidth: 2,
    borderColor: "rgba(255, 152, 0, 0.2)",
  },
  contactIconContainer: {
    marginBottom: verticalScale(16),
  },
  contactTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  contactText: {
    fontSize: scaleFont(13),
    color: "#666",
    textAlign: "center",
    marginBottom: verticalScale(20),
    lineHeight: scaleFont(20),
    fontWeight: "500",
  },
  contactButton: {
    backgroundColor: "#FF9800",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(28),
    borderRadius: moderateScale(20),
    shadowColor: "#FF9800",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  contactButtonText: {
    color: "white",
    fontSize: scaleFont(15),
    fontWeight: "700",
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