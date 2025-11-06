import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

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

// Función de escala moderada
const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Detectar tamaños de dispositivo
const isSmallDevice = width < 375;
const isShortDevice = height < 700;

export default function WelcomeScreen() {
  const router = useRouter();

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de pulso continua
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación flotante
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#5B7FFF" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.container}>
          
          
          

          {/* Logo Section - DISEÑO ULTRA CREATIVO */}
          <Animated.View 
            style={[
              styles.logoSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Contenedor principal con forma hexagonal/diamante */}
            <View style={styles.diamondContainer}>
              {/* Capa de fondo blanca principal */}
              <View style={styles.whiteBackground} />
            </View>

            {/* Logo con efecto flotante */}
            <Animated.View 
              style={[
                styles.logoFloatingContainer,
                { transform: [{ translateY: floatY }] }
              ]}
            >
              {/* Container principal del logo */}
              <View style={styles.logoMainContainer}>
                <View style={styles.logoInnerGlow} />
                <Image
                  source={require('@/assets/images/logo-biyuyo.png')}
                  style={styles.logo}
                  contentFit="contain"
                />
              </View>
            </Animated.View>

            
          </Animated.View>

          {/* Content Section */}
          <Animated.View 
            style={[
              styles.contentSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            {/* Badge */}
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Créditos en minutos</Text>
            </View>

            {/* Main Heading */}
            <Text 
              style={styles.mainHeading}
              adjustsFontSizeToFit
              numberOfLines={2}
            >
              Tu dinero cuando{'\n'}lo necesitas
            </Text>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>⚡</Text>
                </View>
                <Text style={styles.featureText}>Rápido y{'\n'}seguro</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>🛡️</Text>
                </View>
                <Text style={styles.featureText}>100%{'\n'}confiable</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureEmoji}>💰</Text>
                </View>
                <Text style={styles.featureText}>Sin{'\n'}complicaciones</Text>
              </View>
            </View>

            {/* CTA Buttons */}
            <View style={styles.ctaContainer}>
              <TouchableOpacity 
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={() => router.push("/(tabs)/Credit/credit_study")}
              >
                <Text style={styles.primaryButtonText}>Solicitar credito ahora</Text>
                <Text style={styles.primaryButtonArrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                activeOpacity={0.85}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.secondaryButtonText}>Ya tengo cuenta</Text>
              </TouchableOpacity>
            </View>

            {/* Trust Indicator */}
            <View style={styles.trustContainer}>
              <View style={styles.trustDot} />
              <Text style={styles.trustText}>
                Más de <Text style={styles.trustBold}>10,000</Text> usuarios confían en nosotros
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#5B7FFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  container: {
    flex: 1,
    backgroundColor: '#5B7FFF',
    minHeight: height,
  },



       

  // Elementos decorativos del fondo
  circle1: {
    position: 'absolute',
    top: verticalScale(-60),
    right: scale(-60),
    width: moderateScale(160),
    height: moderateScale(160),
    borderRadius: moderateScale(80),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  circle2: {
    position: 'absolute',
    top: height * 0.35,
    left: scale(-50),
    width: moderateScale(110),
    height: moderateScale(110),
    borderRadius: moderateScale(55),
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  circle3: {
    position: 'absolute',
    bottom: height * 0.15,
    right: scale(-30),
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  // ===== LOGO SECTION CON DISEÑO ULTRA CREATIVO =====
  logoSection: {
    backgroundColor: 'transparent',
    paddingTop: isShortDevice ? verticalScale(30) : verticalScale(40),
    paddingBottom: verticalScale(40),
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },

  // Contenedor con forma de diamante/hexágono
  diamondContainer: {
    position: 'absolute',
    top: verticalScale(15),
    left: scale(15),
    right: scale(15),
    height: verticalScale(240),
    zIndex: 1,
  },
  
  // Fondo blanco principal
  whiteBackground: {
    position: 'absolute',
    top: verticalScale(20),
    left: 0,
    right: 0,
    bottom: verticalScale(20),
    backgroundColor: 'white',
    borderRadius: moderateScale(45),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 15,
  },
  
  // Círculos flotantes decorativos
  floatingCircle1: {
    position: 'absolute',
    top: verticalScale(50),
    left: scale(25),
    width: moderateScale(35),
    height: moderateScale(35),
    borderRadius: moderateScale(17.5),
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  floatingCircle2: {
    position: 'absolute',
    top: verticalScale(60),
    right: scale(30),
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: 'rgba(91, 127, 255, 0.12)',
    borderWidth: 2,
    borderColor: 'rgba(91, 127, 255, 0.25)',
  },
  
  // Cuadrados decorativos
  floatingSquare1: {
    position: 'absolute',
    bottom: verticalScale(50),
    left: scale(30),
    width: moderateScale(25),
    height: moderateScale(25),
    backgroundColor: 'rgba(255, 215, 0, 0.18)',
    borderRadius: moderateScale(8),
    transform: [{ rotate: '15deg' }],
  },
  floatingSquare2: {
    position: 'absolute',
    bottom: verticalScale(60),
    right: scale(25),
    width: moderateScale(30),
    height: moderateScale(30),
    backgroundColor: 'rgba(91, 127, 255, 0.1)',
    borderRadius: moderateScale(8),
    transform: [{ rotate: '-20deg' }],
  },
  
  // Líneas decorativas diagonales
  decorativeLine1: {
    position: 'absolute',
    top: verticalScale(80),
    left: scale(15),
    width: scale(50),
    height: 3,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
  },
  decorativeLine2: {
    position: 'absolute',
    top: verticalScale(90),
    right: scale(15),
    width: scale(45),
    height: 2,
    backgroundColor: 'rgba(91, 127, 255, 0.2)',
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  decorativeLine3: {
    position: 'absolute',
    bottom: verticalScale(100),
    left: scale(50),
    width: scale(40),
    height: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    borderRadius: 2,
    transform: [{ rotate: '30deg' }],
  },

  // Logo con efecto flotante
  logoFloatingContainer: {
    marginTop: isShortDevice ? verticalScale(40) : verticalScale(50),
    marginBottom: verticalScale(18),
    position: 'relative',
    zIndex: 10,
  },
  
  // Container principal del logo
  logoMainContainer: {
    backgroundColor: 'white',
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(22),
    borderRadius: moderateScale(28),
    shadowColor: '#5B7FFF',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  
  // Brillo interno
  logoInnerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
  },
  
  logo: {
    width: isSmallDevice ? scale(150) : scale(170),
    height: isSmallDevice ? verticalScale(50) : verticalScale(57),
    maxWidth: 190,
    maxHeight: 67,
  },

  // Elementos decorativos inferiores
  bottomDecorativeElements: {
    position: 'absolute',
    bottom: verticalScale(30),
    left: 0,
    right: 0,
    height: verticalScale(40),
    zIndex: 5,
  },
  bottomTriangle1: {
    position: 'absolute',
    bottom: 0,
    left: scale(40),
    width: 0,
    height: 0,
    borderLeftWidth: moderateScale(15),
    borderRightWidth: moderateScale(15),
    borderBottomWidth: moderateScale(25),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  bottomTriangle2: {
    position: 'absolute',
    bottom: verticalScale(5),
    right: scale(50),
    width: 0,
    height: 0,
    borderLeftWidth: moderateScale(12),
    borderRightWidth: moderateScale(12),
    borderBottomWidth: moderateScale(20),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(91, 127, 255, 0.15)',
    transform: [{ rotate: '180deg' }],
  },
  bottomCircle: {
    position: 'absolute',
    bottom: verticalScale(8),
    left: width * 0.5 - moderateScale(10),
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },

  // Content Section
  contentSection: {
    paddingHorizontal: scale(20),
    paddingTop: isShortDevice ? verticalScale(35) : verticalScale(45),
    paddingBottom: verticalScale(30),
  },

  // Badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
    marginBottom: isShortDevice ? verticalScale(14) : verticalScale(18),
  },
  badgeDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: '#FFD700',
    marginRight: scale(6),
  },
  badgeText: {
    color: 'white',
    fontSize: scaleFont(11),
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Main Heading
  mainHeading: {
    fontSize: isSmallDevice ? scaleFont(30) : scaleFont(34),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    lineHeight: isSmallDevice ? scaleFont(38) : scaleFont(42),
    marginBottom: isShortDevice ? verticalScale(24) : verticalScale(30),
    letterSpacing: -0.5,
  },

  // Features
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: isShortDevice ? verticalScale(30) : verticalScale(38),
    paddingHorizontal: scale(5),
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(23),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(7),
  },
  featureEmoji: {
    fontSize: scaleFont(20),
  },
  featureText: {
    color: 'white',
    fontSize: scaleFont(10.5),
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: scaleFont(14),
  },

  // CTA Buttons
  ctaContainer: {
    gap: verticalScale(11),
    marginBottom: verticalScale(14),
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(18),
    borderRadius: moderateScale(22),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#1a1a1a',
    fontSize: scaleFont(15),
    fontWeight: '700',
    marginRight: scale(5),
  },
  primaryButtonArrow: {
    color: '#1a1a1a',
    fontSize: scaleFont(17),
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: verticalScale(13),
    borderRadius: moderateScale(22),
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: scaleFont(14),
    fontWeight: '600',
  },

  // Trust Indicator
  trustContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(6),
    flexWrap: 'wrap',
    paddingHorizontal: scale(8),
  },
  trustDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
    backgroundColor: '#4ADE80',
    marginRight: scale(5),
  },
  trustText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: scaleFont(11),
    textAlign: 'center',
  },
  trustBold: {
    fontWeight: 'bold',
    color: 'white',
  },
});