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
  Book,
  Calendar,
  DocumentText1,
  InfoCircle,
  Lock,
  MessageQuestion,
  MoneyRecive,
  SecurityUser,
  TickCircle,
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

interface Section {
  id: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  title: string;
  content: string[];
}

export default function TermsConditionsScreen() {
  const router = useRouter();
  
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Información del documento
  const documentInfo = {
    version: "1.0",
    lastUpdate: "15 de Enero, 2025",
    effectiveDate: "01 de Enero, 2025",
  };

  // Secciones de términos y condiciones
  const sections: Section[] = [
    {
      id: "1",
      icon: InfoCircle,
      iconColor: "#2196F3",
      iconBg: "#E3F2FD",
      title: "1. Aceptación de Términos",
      content: [
        "Al acceder y utilizar Biyuyo, usted acepta estar sujeto a estos Términos y Condiciones de uso.",
        "Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.",
        "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigencia inmediatamente después de su publicación.",
        "Es su responsabilidad revisar periódicamente estos términos para estar al tanto de las actualizaciones.",
      ]
    },
    {
      id: "2",
      icon: SecurityUser,
      iconColor: "#4CAF50",
      iconBg: "#E8F5E9",
      title: "2. Elegibilidad y Registro",
      content: [
        "Debe ser mayor de 18 años y tener capacidad legal para celebrar contratos en Colombia.",
        "Debe proporcionar información veraz, precisa y completa durante el proceso de registro.",
        "Es responsable de mantener la confidencialidad de su cuenta y contraseña.",
        "Debe notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta.",
        "Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos.",
      ]
    },
    {
      id: "3",
      icon: MoneyRecive,
      iconColor: "#FF9800",
      iconBg: "#FFF3E0",
      title: "3. Servicios de Crédito",
      content: [
        "Biyuyo ofrece servicios de microcrédito sujetos a aprobación y evaluación crediticia.",
        "Los montos, tasas de interés y plazos están sujetos a nuestra política crediticia vigente.",
        "La aprobación de un crédito no garantiza la aprobación de solicitudes futuras.",
        "Nos reservamos el derecho de rechazar cualquier solicitud sin necesidad de justificación.",
        "Los pagos deben realizarse en las fechas acordadas. Los pagos atrasados pueden generar intereses moratorios.",
        "El incumplimiento en los pagos puede afectar su historial crediticio.",
      ]
    },
    {
      id: "4",
      icon: Lock,
      iconColor: "#9C27B0",
      iconBg: "#F3E5F5",
      title: "4. Privacidad y Datos",
      content: [
        "Recopilamos, almacenamos y procesamos sus datos personales de acuerdo con nuestra Política de Privacidad.",
        "Sus datos serán utilizados para evaluar solicitudes de crédito, procesar transacciones y mejorar nuestros servicios.",
        "Podemos compartir información con entidades de reporte crediticio y autoridades cuando sea legalmente requerido.",
        "Implementamos medidas de seguridad para proteger su información, pero no podemos garantizar seguridad absoluta.",
        "Usted tiene derecho a acceder, rectificar y solicitar la eliminación de sus datos personales.",
      ]
    },
    {
      id: "5",
      icon: Warning2,
      iconColor: "#FF5252",
      iconBg: "#FFE5E5",
      title: "5. Responsabilidades del Usuario",
      content: [
        "Acepta utilizar la plataforma solo para fines legales y de acuerdo con estos términos.",
        "No debe intentar interferir con el funcionamiento de la plataforma o acceder a áreas no autorizadas.",
        "No debe proporcionar información falsa o engañosa en sus solicitudes.",
        "Es responsable de mantener actualizada su información de contacto y personal.",
        "No debe usar la plataforma para actividades fraudulentas o ilegales.",
      ]
    },
    {
      id: "6",
      icon: Book,
      iconColor: "#00BCD4",
      iconBg: "#E1F5FE",
      title: "6. Propiedad Intelectual",
      content: [
        "Todo el contenido de Biyuyo, incluyendo texto, gráficos, logos y software, es propiedad de la empresa.",
        "No puede copiar, modificar, distribuir o reproducir ningún contenido sin autorización previa.",
        "La marca Biyuyo y todos los logos relacionados son marcas registradas.",
        "El uso no autorizado de nuestra propiedad intelectual puede resultar en acciones legales.",
      ]
    },
    {
      id: "7",
      icon: MessageQuestion,
      iconColor: "#FFC107",
      iconBg: "#FFF9E6",
      title: "7. Limitación de Responsabilidad",
      content: [
        "Biyuyo proporciona sus servicios 'tal cual' sin garantías de ningún tipo.",
        "No somos responsables por daños indirectos, incidentales o consecuentes derivados del uso de nuestros servicios.",
        "No garantizamos que el servicio esté libre de errores o interrupciones.",
        "Su uso de la plataforma es bajo su propio riesgo.",
        "Nuestra responsabilidad total no excederá el monto del último crédito aprobado.",
      ]
    },
    {
      id: "8",
      icon: DocumentText1,
      iconColor: "#673AB7",
      iconBg: "#EDE7F6",
      title: "8. Terminación",
      content: [
        "Podemos suspender o terminar su acceso a Biyuyo en cualquier momento por violación de estos términos.",
        "Usted puede cancelar su cuenta en cualquier momento, sujeto al pago de cualquier deuda pendiente.",
        "La terminación no afecta las obligaciones previamente adquiridas.",
        "Tras la terminación, debe dejar de usar inmediatamente todos los servicios de Biyuyo.",
      ]
    },
  ];

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
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
          <Text style={styles.headerTitle}>Términos y Condiciones</Text>
          <Text style={styles.headerSubtitle}>Lee cuidadosamente</Text>
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
        {/* Document Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <DocumentText1 size={48} color="#5B7FFF" variant="Bold" />
          </View>
          <Text style={styles.infoTitle}>Términos y Condiciones de Uso</Text>
          <Text style={styles.infoSubtitle}>
            Al usar Biyuyo, aceptas estos términos. Por favor, léelos detenidamente.
          </Text>
          
          <View style={styles.infoDetailsContainer}>
            <View style={styles.infoDetailItem}>
              <Calendar size={16} color="#666" variant="Bold" />
              <View style={styles.infoDetailText}>
                <Text style={styles.infoDetailLabel}>Última actualización:</Text>
                <Text style={styles.infoDetailValue}>{documentInfo.lastUpdate}</Text>
              </View>
            </View>
            <View style={styles.infoDetailItem}>
              <TickCircle size={16} color="#4CAF50" variant="Bold" />
              <View style={styles.infoDetailText}>
                <Text style={styles.infoDetailLabel}>Vigencia desde:</Text>
                <Text style={styles.infoDetailValue}>{documentInfo.effectiveDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Important Notice */}
        <View style={styles.noticeCard}>
          <InfoCircle size={20} color="#FF9800" variant="Bold" />
          <Text style={styles.noticeText}>
            Estos términos constituyen un acuerdo legal entre usted y Biyuyo. 
            Mantenga una copia para sus registros.
          </Text>
        </View>

        {/* Sections */}
        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionsTitle}>Contenido del Documento</Text>
          
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isExpanded = expandedSection === section.id;
            
            return (
              <TouchableOpacity
                key={section.id}
                style={styles.sectionCard}
                onPress={() => toggleSection(section.id)}
                activeOpacity={0.7}
              >
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionHeaderLeft}>
                    <View style={[
                      styles.sectionIcon,
                      { backgroundColor: section.iconBg }
                    ]}>
                      <IconComponent 
                        size={24} 
                        color={section.iconColor} 
                        variant="Bold" 
                      />
                    </View>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>
                  <View style={[
                    styles.expandIcon,
                    isExpanded && styles.expandIconRotated
                  ]}>
                    <Text style={styles.expandIconText}>›</Text>
                  </View>
                </View>

                {isExpanded && (
                  <View style={styles.sectionContent}>
                    {section.content.map((paragraph, index) => (
                      <View key={index} style={styles.paragraphContainer}>
                        <View style={styles.bulletPoint} />
                        <Text style={styles.paragraphText}>{paragraph}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Contact Section */}
        <View style={styles.contactCard}>
          <MessageQuestion size={24} color="#5B7FFF" variant="Bold" />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactTitle}>¿Tienes preguntas?</Text>
            <Text style={styles.contactText}>
              Si tienes dudas sobre estos términos, contáctanos a través de 
              nuestro centro de ayuda o escribe a legal@biyuyo.com
            </Text>
          </View>
        </View>

        {/* Acceptance Footer */}
        <View style={styles.acceptanceFooter}>
          <View style={styles.acceptanceIcon}>
            <TickCircle size={20} color="#4CAF50" variant="Bold" />
          </View>
          <Text style={styles.acceptanceText}>
            Al continuar usando Biyuyo, confirmas que has leído, entendido y 
            aceptado estos Términos y Condiciones.
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

  // Info Card
  infoCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(20),
    padding: scale(24),
    alignItems: "center",
    marginBottom: verticalScale(16),
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  infoIconContainer: {
    marginBottom: verticalScale(16),
  },
  infoTitle: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  infoSubtitle: {
    fontSize: scaleFont(13),
    color: "#666",
    textAlign: "center",
    lineHeight: scaleFont(20),
    fontWeight: "500",
    marginBottom: verticalScale(20),
  },
  infoDetailsContainer: {
    width: "100%",
    gap: verticalScale(12),
  },
  infoDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
    padding: scale(12),
    borderRadius: moderateScale(12),
    gap: scale(10),
  },
  infoDetailText: {
    flex: 1,
  },
  infoDetailLabel: {
    fontSize: scaleFont(11),
    color: "#999",
    fontWeight: "600",
    marginBottom: verticalScale(2),
  },
  infoDetailValue: {
    fontSize: scaleFont(13),
    color: "#1a1a1a",
    fontWeight: "700",
  },

  // Notice Card
  noticeCard: {
    flexDirection: "row",
    backgroundColor: "#FFF9E6",
    borderRadius: moderateScale(14),
    padding: scale(14),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: "rgba(255, 152, 0, 0.2)",
    gap: scale(12),
  },
  noticeText: {
    flex: 1,
    fontSize: scaleFont(12),
    color: "#666",
    lineHeight: scaleFont(18),
    fontWeight: "500",
  },

  // Sections
  sectionsContainer: {
    marginBottom: verticalScale(20),
  },
  sectionsTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(12),
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: scale(12),
  },
  sectionIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    flex: 1,
    fontSize: scaleFont(14),
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: scaleFont(20),
  },
  expandIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '90deg' }],
  },
  expandIconText: {
    fontSize: scaleFont(20),
    color: "#5B7FFF",
    fontWeight: "bold",
  },
  sectionContent: {
    marginTop: verticalScale(16),
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: verticalScale(12),
  },
  paragraphContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: scale(10),
  },
  bulletPoint: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: "#5B7FFF",
    marginTop: verticalScale(7),
  },
  paragraphText: {
    flex: 1,
    fontSize: scaleFont(13),
    color: "#666",
    lineHeight: scaleFont(20),
    fontWeight: "500",
  },

  // Contact Card
  contactCard: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    borderRadius: moderateScale(16),
    padding: scale(18),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: "rgba(91, 127, 255, 0.2)",
    gap: scale(14),
  },
  contactTextContainer: {
    flex: 1,
  },
  contactTitle: {
    fontSize: scaleFont(14),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: verticalScale(6),
  },
  contactText: {
    fontSize: scaleFont(12),
    color: "#666",
    lineHeight: scaleFont(18),
    fontWeight: "500",
  },

  // Acceptance Footer
  acceptanceFooter: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E8F5E9",
    borderRadius: moderateScale(14),
    padding: scale(16),
    marginBottom: verticalScale(24),
    gap: scale(12),
  },
  acceptanceIcon: {
    marginTop: verticalScale(2),
  },
  acceptanceText: {
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