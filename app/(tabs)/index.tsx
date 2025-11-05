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
          toValue: 1.1,
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
  }, []);

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
          {/* Círculos decorativos animados */}
          <Animated.View 
            style={[
              styles.circle1,
              { transform: [{ scale: pulseAnim }] }
            ]} 
          />
          <Animated.View 
            style={[
              styles.circle2,
              { transform: [{ scale: pulseAnim }] }
            ]} 
          />
          <View style={styles.circle3} />

          {/* Logo Section */}
          <Animated.View 
            style={[
              styles.logoSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Elementos decorativos superiores */}
            <View style={styles.topShapesContainer}>
              <View style={styles.topCircle1} />
              <View style={styles.topCircle2} />
              <View style={styles.topSquare} />
            </View>

            {/* Logo con efecto flotante */}
            <View style={styles.logoFloatingContainer}>
              <View style={styles.logoShadowLayer} />
              <View style={styles.logoMainContainer}>
                <Image
                  source={require('@/assets/images/logo-biyuyo.png')}
                  style={styles.logo}
                  contentFit="contain"
                />
              </View>
            </View>

            {/* Onda curva */}
            <View style={styles.wavesContainer}>
              <View style={styles.waveLayer1} />
              <View style={styles.waveLayer2} />
            </View>
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
                onPress={() => router.push("/register")}
              >
                <Text style={styles.primaryButtonText}>Comenzar ahora</Text>
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

  // Elementos decorativos
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

  // Logo Section
  logoSection: {
    backgroundColor: 'white',
    paddingTop: isShortDevice ? verticalScale(30) : verticalScale(40),
    paddingBottom: verticalScale(35),
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },

  // Shapes decorativas superiores
  topShapesContainer: {
    position: 'absolute',
    top: verticalScale(10),
    left: 0,
    right: 0,
    height: verticalScale(50),
    overflow: 'hidden',
  },
  topCircle1: {
    position: 'absolute',
    top: verticalScale(-20),
    right: scale(30),
    width: moderateScale(45),
    height: moderateScale(45),
    borderRadius: moderateScale(22.5),
    backgroundColor: '#F0F4FF',
  },
  topCircle2: {
    position: 'absolute',
    top: verticalScale(5),
    left: scale(20),
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: '#FFF9E6',
  },
  topSquare: {
    position: 'absolute',
    top: verticalScale(-5),
    left: width * 0.7,
    width: moderateScale(25),
    height: moderateScale(25),
    borderRadius: moderateScale(5),
    backgroundColor: '#F0F4FF',
    transform: [{ rotate: '15deg' }],
  },

  // Logo con efecto flotante
  logoFloatingContainer: {
    marginTop: isShortDevice ? verticalScale(25) : verticalScale(30),
    marginBottom: verticalScale(12),
    position: 'relative',
    zIndex: 10,
  },
  logoShadowLayer: {
    position: 'absolute',
    bottom: verticalScale(-5),
    left: scale(6),
    right: scale(6),
    height: verticalScale(14),
    backgroundColor: 'rgba(91, 127, 255, 0.08)',
    borderRadius: moderateScale(70),
    transform: [{ scaleX: 0.9 }],
  },
  logoMainContainer: {
    backgroundColor: 'white',
    paddingHorizontal: scale(22),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(18),
    shadowColor: '#5B7FFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(91, 127, 255, 0.08)',
  },
  logo: {
    width: isSmallDevice ? scale(140) : scale(160),
    height: isSmallDevice ? verticalScale(46) : verticalScale(52),
    maxWidth: 180,
    maxHeight: 60,
  },

  // Ondas
  wavesContainer: {
    position: 'absolute',
    bottom: verticalScale(-35),
    left: scale(-40),
    right: scale(-40),
    height: verticalScale(90),
  },
  waveLayer1: {
    position: 'absolute',
    bottom: verticalScale(6),
    left: 0,
    width: width + scale(80),
    height: verticalScale(70),
    backgroundColor: 'white',
    borderBottomLeftRadius: width * 1.8,
    borderBottomRightRadius: width * 1.8,
  },
  waveLayer2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width + scale(80),
    height: verticalScale(70),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomLeftRadius: width * 1.5,
    borderBottomRightRadius: width * 1.5,
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