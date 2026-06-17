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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Importar iconos de Iconsax
import {
  ArrowLeft,
  ArrowRight2,
  Book1,
  CardPos,
  CloseCircle,
  Cup,
  DocumentText1,
  InfoCircle,
  Lamp,
  MoneyRecive,
  Play,
  SearchNormal1,
  Teacher,
  VideoPlay,
  Wallet3,
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
interface Tutorial {
  id: string;
  titulo: string;
  descripcion: string;
  duracion: string;
  nivel: "principiante" | "intermedio" | "avanzado";
  categoria: string;
  icono: any;
  color: string;
}

interface Guide {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  icono: any;
  color: string;
}

export default function LearningCenterScreen() {
  const router = useRouter();
  
  // Estados
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");

  // Categorías
  const categorias = [
    { id: "todos", nombre: "Todos", color: "#5B7FFF" },
    { id: "creditos", nombre: "Créditos", color: "#4CAF50" },
    { id: "pagos", nombre: "Pagos", color: "#FF9800" },
    { id: "finanzas", nombre: "Finanzas", color: "#2196F3" },
    { id: "seguridad", nombre: "Seguridad", color: "#E91E63" },
  ];

  // Tutoriales en Video
  const tutoriales: Tutorial[] = [
    {
      id: "1",
      titulo: "Cómo solicitar tu primer crédito",
      descripcion: "Aprende paso a paso cómo solicitar un crédito en Biyuyo de forma rápida y segura.",
      duracion: "5 min",
      nivel: "principiante",
      categoria: "creditos",
      icono: MoneyRecive,
      color: "#4CAF50",
    },
    {
      id: "2",
      titulo: "Métodos de pago disponibles",
      descripcion: "Conoce todas las formas en que puedes pagar tu crédito: PSE, Nequi, tarjetas y más.",
      duracion: "4 min",
      nivel: "principiante",
      categoria: "pagos",
      icono: CardPos,
      color: "#FF9800",
    },
    {
      id: "3",
      titulo: "Gestiona tu presupuesto personal",
      descripcion: "Tips y herramientas para administrar mejor tu dinero y finanzas personales.",
      duracion: "8 min",
      nivel: "intermedio",
      categoria: "finanzas",
      icono: Wallet3,
      color: "#2196F3",
    },
    {
      id: "4",
      titulo: "Seguridad en tus transacciones",
      descripcion: "Aprende a proteger tu cuenta y realizar transacciones de forma segura.",
      duracion: "6 min",
      nivel: "intermedio",
      categoria: "seguridad",
      icono: InfoCircle,
      color: "#E91E63",
    },
  ];

  // Guías Rápidas
  const guias: Guide[] = [
    {
      id: "1",
      titulo: "Aumenta tu cupo de crédito",
      descripcion: "Descubre cómo puedes aumentar tu límite de crédito disponible",
      categoria: "creditos",
      icono: MoneyRecive,
      color: "#4CAF50",
    },
    {
      id: "2",
      titulo: "Pago anticipado sin penalización",
      descripcion: "Guía completa sobre cómo hacer pagos adelantados y ahorrar intereses",
      categoria: "pagos",
      icono: CardPos,
      color: "#FF9800",
    },
    {
      id: "3",
      titulo: "Educación financiera básica",
      descripcion: "Conceptos fundamentales para mejorar tu salud financiera",
      categoria: "finanzas",
      icono: Book1,
      color: "#2196F3",
    },
    {
      id: "4",
      titulo: "Consejos para ahorrar dinero",
      descripcion: "Estrategias prácticas para mejorar tus hábitos de ahorro",
      categoria: "finanzas",
      icono: Wallet3,
      color: "#2196F3",
    },
    {
      id: "5",
      titulo: "Protege tu información",
      descripcion: "Mejores prácticas para mantener segura tu cuenta y datos personales",
      categoria: "seguridad",
      icono: InfoCircle,
      color: "#E91E63",
    },
    {
      id: "6",
      titulo: "Entiende tu historial crediticio",
      descripcion: "Qué es el historial crediticio y cómo mejorarlo",
      categoria: "creditos",
      icono: DocumentText1,
      color: "#4CAF50",
    },
  ];

  // Filtrar contenido
  const tutorialesFiltrados = tutoriales.filter(tutorial => {
    const matchCategory = selectedCategory === "todos" || tutorial.categoria === selectedCategory;
    const matchSearch = tutorial.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       tutorial.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const guiasFiltradas = guias.filter(guia => {
    const matchCategory = selectedCategory === "todos" || guia.categoria === selectedCategory;
    const matchSearch = guia.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       guia.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Función para obtener color del nivel
  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "principiante":
        return "#4CAF50";
      case "intermedio":
        return "#FF9800";
      case "avanzado":
        return "#E91E63";
      default:
        return "#999";
    }
  };

  // Función para obtener texto del nivel
  const getNivelTexto = (nivel: string) => {
    switch (nivel) {
      case "principiante":
        return "Principiante";
      case "intermedio":
        return "Intermedio";
      case "avanzado":
        return "Avanzado";
      default:
        return "";
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
          <Text style={styles.headerTitle}>Centro de Aprendizaje</Text>
          <Text style={styles.headerSubtitle}>Aprende a tu ritmo</Text>
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
              <Teacher size={56} color="white" variant="Bold" />
            </View>
            <Text style={styles.heroTitle}>Aprende con Biyuyo</Text>
            <Text style={styles.heroSubtitle}>
              Tutoriales, guías y recursos para aprovechar al máximo tu experiencia financiera
            </Text>
          </View>
        </View>

        {/* Búsqueda */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <SearchNormal1 size={20} color="#999" variant="Bold" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar tutoriales o guías..."
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <CloseCircle size={20} color="#999" variant="Bold" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Estadísticas rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
              <VideoPlay size={24} color="#4CAF50" variant="Bold" />
            </View>
            <Text style={styles.statNumber}>12+</Text>
            <Text style={styles.statLabel}>Tutoriales</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
              <Book1 size={24} color="#FF9800" variant="Bold" />
            </View>
            <Text style={styles.statNumber}>20+</Text>
            <Text style={styles.statLabel}>Guías</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F3E5F5' }]}>
              <Cup size={24} color="#9C27B0" variant="Bold" />
            </View>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Gratis</Text>
          </View>
        </View>

        {/* Categorías */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categorias.map((categoria) => {
              const isSelected = selectedCategory === categoria.id;
              return (
                <TouchableOpacity
                  key={categoria.id}
                  style={[
                    styles.categoryChip,
                    isSelected && { 
                      backgroundColor: categoria.color,
                      borderColor: categoria.color 
                    }
                  ]}
                  onPress={() => setSelectedCategory(categoria.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected
                  ]}>
                    {categoria.nombre}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Tutoriales en Video */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <VideoPlay size={24} color="#5B7FFF" variant="Bold" />
              <Text style={styles.sectionTitle}>Tutoriales en Video</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.verTodos}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {tutorialesFiltrados.length === 0 ? (
            <View style={styles.emptyState}>
              <SearchNormal1 size={56} color="#E0E0E0" variant="Bulk" />
              <Text style={styles.emptyStateTitle}>No se encontraron tutoriales</Text>
              <Text style={styles.emptyStateText}>
                Intenta con otros términos de búsqueda
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tutorialesScroll}
            >
              {tutorialesFiltrados.map((tutorial) => {
                const IconComponent = tutorial.icono;
                return (
                  <TouchableOpacity
                    key={tutorial.id}
                    style={styles.tutorialCard}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.tutorialImageContainer, { backgroundColor: tutorial.color }]}>
                      <View style={styles.tutorialPlayButton}>
                        <Play size={32} color="white" variant="Bold" />
                      </View>
                      <View style={styles.tutorialDuration}>
                        <Text style={styles.tutorialDurationText}>{tutorial.duracion}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.tutorialContent}>
                      <View style={styles.tutorialHeader}>
                        <View style={[styles.tutorialIconContainer, { backgroundColor: `${tutorial.color}20` }]}>
                          <IconComponent size={20} color={tutorial.color} variant="Bold" />
                        </View>
                        <View style={[styles.nivelBadge, { backgroundColor: getNivelColor(tutorial.nivel) }]}>
                          <Text style={styles.nivelText}>{getNivelTexto(tutorial.nivel)}</Text>
                        </View>
                      </View>
                      
                      <Text style={styles.tutorialTitulo} numberOfLines={2}>
                        {tutorial.titulo}
                      </Text>
                      <Text style={styles.tutorialDescripcion} numberOfLines={2}>
                        {tutorial.descripcion}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Guías Rápidas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Book1 size={24} color="#5B7FFF" variant="Bold" />
              <Text style={styles.sectionTitle}>Guías Rápidas</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.verTodos}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {guiasFiltradas.length === 0 ? (
            <View style={styles.emptyState}>
              <SearchNormal1 size={56} color="#E0E0E0" variant="Bulk" />
              <Text style={styles.emptyStateTitle}>No se encontraron guías</Text>
              <Text style={styles.emptyStateText}>
                Intenta con otros términos de búsqueda
              </Text>
            </View>
          ) : (
            <View style={styles.guiasContainer}>
              {guiasFiltradas.map((guia) => {
                const IconComponent = guia.icono;
                return (
                  <TouchableOpacity
                    key={guia.id}
                    style={styles.guiaCard}
                    activeOpacity={0.7}
                  >
                    <View style={styles.guiaLeft}>
                      <View style={[styles.guiaIconContainer, { backgroundColor: `${guia.color}20` }]}>
                        <IconComponent size={24} color={guia.color} variant="Bold" />
                      </View>
                      <View style={styles.guiaTextContainer}>
                        <Text style={styles.guiaTitulo} numberOfLines={1}>
                          {guia.titulo}
                        </Text>
                        <Text style={styles.guiaDescripcion} numberOfLines={2}>
                          {guia.descripcion}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.guiaArrowContainer}>
                      <ArrowRight2 size={20} color="#5B7FFF" variant="Bold" />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Tips Destacados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Lamp size={24} color="#5B7FFF" variant="Bold" />
              <Text style={styles.sectionTitle}>Tips Financieros</Text>
            </View>
          </View>

          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Lamp size={28} color="#FFC107" variant="Bold" />
              </View>
              <Text style={styles.tipTitle}>Regla del 50/30/20</Text>
              <Text style={styles.tipText}>
                Destina el 50% de tus ingresos a necesidades, 30% a deseos y 20% a ahorros e inversiones.
              </Text>
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Lamp size={28} color="#4CAF50" variant="Bold" />
              </View>
              <Text style={styles.tipTitle}>Ahorra primero</Text>
              <Text style={styles.tipText}>
                Antes de gastar, aparta un porcentaje de tus ingresos para el ahorro. Paga tus metas primero.
              </Text>
            </View>

            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Lamp size={28} color="#2196F3" variant="Bold" />
              </View>
              <Text style={styles.tipTitle}>Fondo de emergencia</Text>
              <Text style={styles.tipText}>
                Mantén ahorrados al menos 3-6 meses de tus gastos esenciales para imprevistos.
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
    gap: scale(10),
  },
  searchInput: {
    flex: 1,
    fontSize: scaleFont(15),
    color: "#1a1a1a",
    padding: 0,
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    gap: scale(12),
    marginBottom: verticalScale(24),
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  statNumber: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: scaleFont(12),
    color: "#999",
    fontWeight: "600",
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
  },
  verTodos: {
    fontSize: scaleFont(14),
    color: "#5B7FFF",
    fontWeight: "600",
  },

  // Categories
  categoriesScroll: {
    gap: scale(10),
    paddingBottom: verticalScale(4),
  },
  categoryChip: {
    paddingHorizontal: scale(20),
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
  categoryText: {
    fontSize: scaleFont(13),
    fontWeight: "600",
    color: "#666",
  },
  categoryTextSelected: {
    color: "white",
  },

  // Tutoriales
  tutorialesScroll: {
    gap: scale(16),
    paddingBottom: verticalScale(4),
  },
  tutorialCard: {
    width: scale(280),
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  tutorialImageContainer: {
    width: "100%",
    height: verticalScale(160),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  tutorialPlayButton: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  tutorialDuration: {
    position: "absolute",
    bottom: scale(12),
    right: scale(12),
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
  },
  tutorialDurationText: {
    color: "white",
    fontSize: scaleFont(12),
    fontWeight: "700",
  },
  tutorialContent: {
    padding: scale(16),
  },
  tutorialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  tutorialIconContainer: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    justifyContent: "center",
    alignItems: "center",
  },
  nivelBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
  },
  nivelText: {
    color: "white",
    fontSize: scaleFont(10),
    fontWeight: "700",
    textTransform: "uppercase",
  },
  tutorialTitulo: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(6),
    lineHeight: scaleFont(22),
  },
  tutorialDescripcion: {
    fontSize: scaleFont(13),
    color: "#666",
    lineHeight: scaleFont(19),
    fontWeight: "500",
  },

  // Guías
  guiasContainer: {
    gap: verticalScale(12),
  },
  guiaCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: scale(16),
    borderRadius: moderateScale(14),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  guiaLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: scale(12),
  },
  guiaIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  guiaTextContainer: {
    flex: 1,
  },
  guiaTitulo: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  guiaDescripcion: {
    fontSize: scaleFont(12),
    color: "#999",
    lineHeight: scaleFont(18),
    fontWeight: "500",
  },
  guiaArrowContainer: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
  },

  // Tips
  tipsContainer: {
    gap: verticalScale(12),
  },
  tipCard: {
    backgroundColor: "white",
    padding: scale(20),
    borderRadius: moderateScale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  tipIcon: {
    marginBottom: verticalScale(12),
  },
  tipTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(8),
  },
  tipText: {
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
    lineHeight: scaleFont(20),
  },

  // CTA Card
  ctaCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: moderateScale(20),
    padding: scale(24),
    borderWidth: 2,
    borderColor: "rgba(91, 127, 255, 0.2)",
    marginBottom: verticalScale(24),
  },
  ctaContent: {
    alignItems: "center",
  },
  ctaIconContainer: {
    marginBottom: verticalScale(16),
  },
  ctaTitle: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  ctaText: {
    fontSize: scaleFont(14),
    color: "#666",
    textAlign: "center",
    marginBottom: verticalScale(20),
    lineHeight: scaleFont(21),
    fontWeight: "500",
  },
  ctaButton: {
    backgroundColor: "#5B7FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(28),
    borderRadius: moderateScale(20),
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    gap: scale(8),
  },
  ctaButtonText: {
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