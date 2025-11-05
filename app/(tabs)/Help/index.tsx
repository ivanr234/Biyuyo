import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    Linking,
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

const isSmallDevice = width < 375;
const isShortDevice = height < 700;

// Interfaces
interface FAQ {
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: string;
}

export default function HelpScreen() {
  const router = useRouter();
  
  // Estados
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");

  // Datos de contacto
  const contactInfo = {
    whatsapp: "+573001234567",
    email: "soporte@biyuyo.com",
    telefono: "+57 (601) 123 4567",
    horario: "Lun-Vie: 8am-6pm, Sáb: 9am-2pm",
  };

  // FAQs
  const faqs: FAQ[] = [
    {
      id: "1",
      categoria: "credito",
      pregunta: "¿Cómo solicito un crédito?",
      respuesta: "Puedes solicitar un crédito desde el Dashboard, haciendo clic en 'Solicitar Crédito'. Solo necesitas completar un formulario con tus datos y en minutos recibirás una respuesta.",
    },
    {
      id: "2",
      categoria: "credito",
      pregunta: "¿Cuál es el monto máximo que puedo solicitar?",
      respuesta: "El monto máximo depende de tu cupo aprobado, el cual se calcula según tu perfil crediticio. Puedes ver tu cupo disponible en el Dashboard.",
    },
    {
      id: "3",
      categoria: "pagos",
      pregunta: "¿Cómo pago mi crédito?",
      respuesta: "Puedes pagar a través de PSE, Nequi, Daviplata o tarjeta débito/crédito. Ve a 'Pagar mi crédito' desde el menú principal.",
    },
    {
      id: "4",
      categoria: "pagos",
      pregunta: "¿Puedo hacer pagos anticipados?",
      respuesta: "Sí, puedes hacer pagos anticipados sin penalización. Esto reducirá el saldo total de tu crédito y los intereses.",
    },
    {
      id: "5",
      categoria: "cuenta",
      pregunta: "¿Cómo cambio mi contraseña?",
      respuesta: "Ve a Configuración > Seguridad > Cambiar contraseña. Necesitarás tu contraseña actual para confirmar el cambio.",
    },
    {
      id: "6",
      categoria: "cuenta",
      pregunta: "¿Cómo actualizo mis datos personales?",
      respuesta: "En tu perfil encontrarás la opción 'Editar datos'. Recuerda que algunos cambios pueden requerir verificación adicional.",
    },
    {
      id: "7",
      categoria: "seguridad",
      pregunta: "¿Es seguro usar Biyuyo?",
      respuesta: "Sí, utilizamos encriptación de grado bancario y cumplimos con todas las normativas de protección de datos. Tu información está 100% segura.",
    },
    {
      id: "8",
      categoria: "seguridad",
      pregunta: "¿Qué hago si detecto un movimiento sospechoso?",
      respuesta: "Contáctanos inmediatamente al WhatsApp o correo de soporte. Congelaremos tu cuenta temporalmente mientras investigamos.",
    },
  ];

  // Categorías
  const categorias = [
    { id: "todas", nombre: "Todas", icon: "📋" },
    { id: "credito", nombre: "Créditos", icon: "💰" },
    { id: "pagos", nombre: "Pagos", icon: "💳" },
    { id: "cuenta", nombre: "Cuenta", icon: "👤" },
    { id: "seguridad", nombre: "Seguridad", icon: "🔒" },
  ];

  // Filtrar FAQs
  const faqsFiltradas = faqs.filter(faq => {
    const matchCategory = selectedCategory === "todas" || faq.categoria === selectedCategory;
    const matchSearch = faq.pregunta.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       faq.respuesta.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Funciones de contacto
  const handleWhatsApp = () => {
    const url = `whatsapp://send?phone=${contactInfo.whatsapp.replace(/\+/g, '')}&text=Hola, necesito ayuda con...`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "No se pudo abrir WhatsApp. Asegúrate de tenerlo instalado.");
        }
      })
      .catch(() => Alert.alert("Error", "No se pudo abrir WhatsApp"));
  };

  const handleEmail = () => {
    const url = `mailto:${contactInfo.email}?subject=Soporte Biyuyo&body=Hola, necesito ayuda con...`;
    Linking.openURL(url).catch(() => 
      Alert.alert("Error", "No se pudo abrir el cliente de correo")
    );
  };

  const handlePhone = () => {
    const url = `tel:${contactInfo.telefono.replace(/\s/g, '')}`;
    Linking.openURL(url).catch(() => 
      Alert.alert("Error", "No se pudo realizar la llamada")
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
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Soporte y Ayuda</Text>
          <Text style={styles.headerSubtitle}>Estamos para ayudarte 24/7</Text>
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
            <Text style={styles.heroIcon}>💬</Text>
            <Text style={styles.heroTitle}>¿Cómo podemos ayudarte?</Text>
            <Text style={styles.heroSubtitle}>
              Encuentra respuestas rápidas o contáctanos directamente
            </Text>
          </View>
        </View>

        {/* Búsqueda */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar en preguntas frecuentes..."
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Contacto Rápido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto Directo</Text>
          
          <View style={styles.contactGrid}>
            <TouchableOpacity 
              style={styles.contactCard}
              onPress={handleWhatsApp}
              activeOpacity={0.7}
            >
              <View style={[styles.contactIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.contactIcon}>💬</Text>
              </View>
              <Text style={styles.contactTitle}>WhatsApp</Text>
              <Text style={styles.contactSubtitle}>Chat en vivo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.contactCard}
              onPress={handlePhone}
              activeOpacity={0.7}
            >
              <View style={[styles.contactIconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Text style={styles.contactIcon}>📞</Text>
              </View>
              <Text style={styles.contactTitle}>Llamar</Text>
              <Text style={styles.contactSubtitle}>Atención directa</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.contactCard}
              onPress={handleEmail}
              activeOpacity={0.7}
            >
              <View style={[styles.contactIconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.contactIcon}>📧</Text>
              </View>
              <Text style={styles.contactTitle}>Email</Text>
              <Text style={styles.contactSubtitle}>Soporte escrito</Text>
            </TouchableOpacity>
          </View>

          {/* Info de Horario */}
          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleIcon}>⏰</Text>
            <View style={styles.scheduleTextContainer}>
              <Text style={styles.scheduleTitle}>Horario de atención</Text>
              <Text style={styles.scheduleText}>{contactInfo.horario}</Text>
            </View>
          </View>
        </View>

        {/* Categorías FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === categoria.id && styles.categoryChipSelected
                ]}
                onPress={() => setSelectedCategory(categoria.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryIcon}>{categoria.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === categoria.id && styles.categoryTextSelected
                ]}>
                  {categoria.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de FAQs */}
        <View style={styles.faqsContainer}>
          {faqsFiltradas.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🔍</Text>
              <Text style={styles.emptyStateTitle}>No se encontraron resultados</Text>
              <Text style={styles.emptyStateText}>
                Intenta con otros términos de búsqueda o contáctanos directamente
              </Text>
            </View>
          ) : (
            faqsFiltradas.map((faq) => (
              <TouchableOpacity
                key={faq.id}
                style={styles.faqCard}
                onPress={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqPregunta}>{faq.pregunta}</Text>
                  <Text style={[
                    styles.faqArrow,
                    expandedFAQ === faq.id && styles.faqArrowExpanded
                  ]}>
                    ›
                  </Text>
                </View>
                {expandedFAQ === faq.id && (
                  <View style={styles.faqRespuesta}>
                    <Text style={styles.faqRespuestaText}>{faq.respuesta}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Recursos Adicionales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos Adicionales</Text>
          
          <TouchableOpacity style={styles.resourceItem} activeOpacity={0.7}>
            <View style={styles.resourceLeft}>
              <View style={[styles.resourceIcon, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.resourceEmoji}>📚</Text>
              </View>
              <View style={styles.resourceTextContainer}>
                <Text style={styles.resourceTitle}>Centro de aprendizaje</Text>
                <Text style={styles.resourceSubtitle}>Guías y tutoriales</Text>
              </View>
            </View>
            <View style={styles.resourceArrowContainer}>
              <Text style={styles.resourceArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem} activeOpacity={0.7}>
            <View style={styles.resourceLeft}>
              <View style={[styles.resourceIcon, { backgroundColor: '#F3E5F5' }]}>
                <Text style={styles.resourceEmoji}>📄</Text>
              </View>
              <View style={styles.resourceTextContainer}>
                <Text style={styles.resourceTitle}>Términos y condiciones</Text>
                <Text style={styles.resourceSubtitle}>Políticas de uso</Text>
              </View>
            </View>
            <View style={styles.resourceArrowContainer}>
              <Text style={styles.resourceArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem} activeOpacity={0.7}>
            <View style={styles.resourceLeft}>
              <View style={[styles.resourceIcon, { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.resourceEmoji}>🔒</Text>
              </View>
              <View style={styles.resourceTextContainer}>
                <Text style={styles.resourceTitle}>Privacidad y seguridad</Text>
                <Text style={styles.resourceSubtitle}>Cómo protegemos tus datos</Text>
              </View>
            </View>
            <View style={styles.resourceArrowContainer}>
              <Text style={styles.resourceArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Contacto Info Card */}
        <View style={styles.contactInfoCard}>
          <Text style={styles.contactInfoTitle}>Información de Contacto</Text>
          <View style={styles.contactInfoList}>
            <View style={styles.contactInfoItem}>
              <Text style={styles.contactInfoIcon}>📧</Text>
              <Text style={styles.contactInfoText}>{contactInfo.email}</Text>
            </View>
            <View style={styles.contactInfoItem}>
              <Text style={styles.contactInfoIcon}>📞</Text>
              <Text style={styles.contactInfoText}>{contactInfo.telefono}</Text>
            </View>
            <View style={styles.contactInfoItem}>
              <Text style={styles.contactInfoIcon}>💬</Text>
              <Text style={styles.contactInfoText}>{contactInfo.whatsapp}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No encontraste lo que buscabas?
          </Text>
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={handleWhatsApp}
            activeOpacity={0.8}
          >
            <Text style={styles.footerButtonText}>Chatea con nosotros</Text>
            <Text style={styles.footerButtonArrow}>→</Text>
          </TouchableOpacity>
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
    paddingBottom: verticalScale(30),
  },

  // Hero Card
  heroCard: {
    backgroundColor: "#5B7FFF",
    borderRadius: moderateScale(20),
    padding: scale(24),
    marginBottom: verticalScale(20),
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  heroContent: {
    alignItems: "center",
  },
  heroIcon: {
    fontSize: scaleFont(48),
    marginBottom: verticalScale(12),
  },
  heroTitle: {
    fontSize: scaleFont(22),
    fontWeight: "bold",
    color: "white",
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: scaleFont(14),
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
  },

  // Search
  searchContainer: {
    marginBottom: verticalScale(24),
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    fontSize: scaleFont(20),
    marginRight: scale(10),
  },
  searchInput: {
    flex: 1,
    fontSize: scaleFont(15),
    color: "#1a1a1a",
    padding: 0,
  },
  clearIcon: {
    fontSize: scaleFont(18),
    color: "#999",
    padding: scale(4),
  },

  // Contact Grid
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(16),
  },
  contactGrid: {
    flexDirection: "row",
    gap: scale(12),
    marginBottom: verticalScale(16),
  },
  contactCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  contactIconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  contactIcon: {
    fontSize: scaleFont(28),
  },
  contactTitle: {
    fontSize: scaleFont(14),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  contactSubtitle: {
    fontSize: scaleFont(11),
    color: "#999",
    fontWeight: "500",
  },

  // Schedule Card
  scheduleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    borderRadius: moderateScale(14),
    padding: scale(14),
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  scheduleIcon: {
    fontSize: scaleFont(24),
    marginRight: scale(12),
  },
  scheduleTextContainer: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: scaleFont(13),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: verticalScale(2),
  },
  scheduleText: {
    fontSize: scaleFont(12),
    color: "#666",
    fontWeight: "500",
  },

  // Categories
  categoriesScroll: {
    gap: scale(10),
    paddingBottom: verticalScale(4),
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(20),
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
  categoryChipSelected: {
    backgroundColor: "#5B7FFF",
    borderColor: "#5B7FFF",
  },
  categoryIcon: {
    fontSize: scaleFont(16),
    marginRight: scale(6),
  },
  categoryText: {
    fontSize: scaleFont(13),
    fontWeight: "600",
    color: "#666",
  },
  categoryTextSelected: {
    color: "white",
  },

  // FAQs
  faqsContainer: {
    marginBottom: verticalScale(24),
  },
  faqCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(14),
    padding: scale(16),
    marginBottom: verticalScale(10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqPregunta: {
    flex: 1,
    fontSize: scaleFont(14),
    fontWeight: "700",
    color: "#1a1a1a",
    marginRight: scale(10),
  },
  faqArrow: {
    fontSize: scaleFont(24),
    color: "#5B7FFF",
    fontWeight: "bold",
    transform: [{ rotate: '0deg' }],
  },
  faqArrowExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  faqRespuesta: {
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  faqRespuestaText: {
    fontSize: scaleFont(13),
    color: "#666",
    lineHeight: scaleFont(20),
    fontWeight: "500",
  },

  // Empty State
  emptyState: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(40),
    alignItems: "center",
  },
  emptyStateIcon: {
    fontSize: scaleFont(56),
    marginBottom: verticalScale(16),
  },
  emptyStateTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(8),
  },
  emptyStateText: {
    fontSize: scaleFont(14),
    color: "#999",
    textAlign: "center",
    lineHeight: scaleFont(20),
  },

  // Resources
  resourceItem: {
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
  resourceLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  resourceIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  resourceEmoji: {
    fontSize: scaleFont(20),
  },
  resourceTextContainer: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: scaleFont(14),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: verticalScale(2),
  },
  resourceSubtitle: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "500",
  },
  resourceArrowContainer: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
  },
  resourceArrow: {
    fontSize: scaleFont(18),
    color: "#5B7FFF",
    fontWeight: "bold",
  },

  // Contact Info Card
  contactInfoCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: moderateScale(16),
    padding: scale(18),
    marginBottom: verticalScale(24),
    borderWidth: 1,
    borderColor: "rgba(91, 127, 255, 0.2)",
  },
  contactInfoTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#5B7FFF",
    marginBottom: verticalScale(14),
  },
  contactInfoList: {
    gap: verticalScale(10),
  },
  contactInfoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactInfoIcon: {
    fontSize: scaleFont(18),
    marginRight: scale(10),
  },
  contactInfoText: {
    fontSize: scaleFont(13),
    color: "#1a1a1a",
    fontWeight: "600",
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: verticalScale(20),
  },
  footerText: {
    fontSize: scaleFont(14),
    color: "#666",
    marginBottom: verticalScale(12),
    fontWeight: "500",
  },
  footerButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(24),
    borderRadius: moderateScale(20),
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  footerButtonText: {
    color: "white",
    fontSize: scaleFont(15),
    fontWeight: "700",
    marginRight: scale(6),
  },
  footerButtonArrow: {
    color: "white",
    fontSize: scaleFont(18),
    fontWeight: "bold",
  },
});