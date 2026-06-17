import { Audio, ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
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
} from "react-native";
import Svg, { Path } from "react-native-svg";
// Importar iconos de Iconsax
import {
  ArrowRight,
  Flash,
  MoneyRecive,
  SecuritySafe,
  TickCircle,
} from "iconsax-react-native";

// Prevenir que el splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get("window");

// Función para escalar dimensiones basadas en el ancho de pantalla
const scale = (size: number) => (width / 375) * size;

// Función para escalar fuentes
const scaleFont = (size: number) => {
  const newSize = (width / 375) * size;
  if (Platform.OS === "ios") {
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

export default function Index() {
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Ocultar el splash de Expo después de un pequeño delay
    const prepare = async () => {
      try {
        // Esperar un momento para que los assets se carguen
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    // Configurar el modo de audio para reproducir sonido
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.log("Error setting audio mode:", error);
      }
    };

    if (showVideo && appIsReady) {
      setupAudio();
    }
  }, [showVideo, appIsReady]);

  // Mostrar null mientras la app no esté lista
  if (!appIsReady) {
    return null;
  }

  // Si debe mostrar el video
  if (showVideo) {
    return (
      <View style={styles.videoContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        <Video
          source={require("@/assets/videos/Intro.mp4")}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          isMuted={false}
          volume={1.0}
          onLoad={() => setIsVideoLoaded(true)}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && status.didJustFinish) {
              setShowVideo(false);
            }
          }}
        />

        {/* Botón para saltar el video */}
        {isVideoLoaded && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => setShowVideo(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.skipText}>Saltar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Después del video, muestra el WelcomeScreen
  return <WelcomeScreen />;
}

// Componente WelcomeScreen (tu código actual)
function WelcomeScreen() {
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
      ]),
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
      ]),
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
          {/* Logo Section - CON ARCO EN LA PARTE INFERIOR */}
          <Animated.View
            style={[
              styles.logoSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Contenedor con forma de arco en la parte inferior usando SVG */}
            <View style={styles.arcContainer}>
              <Svg
                height={verticalScale(280)}
                width={width}
                style={styles.arcSvg}
              >
                <Path
                  d={`
                    M 0 0
                    L ${width} 0
                    L ${width} ${verticalScale(200)}
                    Q ${width / 2} ${verticalScale(280)}, 0 ${verticalScale(200)}
                    Z
                  `}
                  fill="white"
                />
              </Svg>
            </View>

            {/* Logo con efecto flotante - MÁS GRANDE Y SIN BORDES */}
            <Animated.View
              style={[
                styles.logoFloatingContainer,
                { transform: [{ translateY: floatY }] },
              ]}
            >
              <View style={styles.logoMainContainer}>
                <Image
                  source={require("@/assets/images/logo-biyuyo.png")}
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
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Badge con icono */}
            <View style={styles.badge}>
              <TickCircle
                size={moderateScale(14)}
                color="#FFD700"
                variant="Bold"
              />
              <Text style={styles.badgeText}>Créditos en minutos</Text>
            </View>

            {/* Main Heading */}
            <Text
              style={styles.mainHeading}
              adjustsFontSizeToFit
              numberOfLines={2}
            >
              Tu dinero cuando{"\n"}lo necesitas
            </Text>

            {/* Features con iconos de Iconsax */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Flash
                    size={moderateScale(24)}
                    color="#FFD700"
                    variant="Bold"
                  />
                </View>
                <Text style={styles.featureText}>Rápido y{"\n"}seguro</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <SecuritySafe
                    size={moderateScale(24)}
                    color="#FFD700"
                    variant="Bold"
                  />
                </View>
                <Text style={styles.featureText}>100%{"\n"}confiable</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <MoneyRecive
                    size={moderateScale(24)}
                    color="#FFD700"
                    variant="Bold"
                  />
                </View>
                <Text style={styles.featureText}>Sin{"\n"}complicaciones</Text>
              </View>
            </View>

            {/* CTA Buttons con icono de flecha */}
            <View style={styles.ctaContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={() => router.push("/(tabs)/Credit/credit_study")}
              >
                <Text style={styles.primaryButtonText}>
                  Solicitar credito ahora
                </Text>
                <ArrowRight
                  size={moderateScale(20)}
                  color="#1a1a1a"
                  variant="Bold"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.85}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.secondaryButtonText}>Ya tengo cuenta</Text>
              </TouchableOpacity>
            </View>

            {/* Trust Indicator con icono */}
            <View style={styles.trustContainer}>
              <TickCircle
                size={moderateScale(12)}
                color="#4ADE80"
                variant="Bold"
              />
              <Text style={styles.trustText}>
                Más de <Text style={styles.trustBold}>10,000</Text> usuarios
                confían en nosotros
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Estilos para el video
  videoContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  skipButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  skipText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  // Estilos del WelcomeScreen
  safeArea: {
    flex: 1,
    backgroundColor: "#5B7FFF",
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
    backgroundColor: "#5B7FFF",
    minHeight: height,
  },
  logoSection: {
    backgroundColor: "transparent",
    paddingTop: Platform.OS === "ios" ? verticalScale(10) : verticalScale(30),
    paddingBottom: verticalScale(40),
    alignItems: "center",
    position: "relative",
    overflow: "visible",
    minHeight: verticalScale(280),
  },
  arcContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(280),
    zIndex: 1,
    overflow: "visible",
  },
  arcSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  logoFloatingContainer: {
    marginTop: isShortDevice ? verticalScale(50) : verticalScale(60),
    marginBottom: verticalScale(18),
    position: "relative",
    zIndex: 10,
  },
  logoMainContainer: {
    backgroundColor: "transparent",
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(22),
    position: "relative",
  },
  logo: {
    width: isSmallDevice ? scale(220) : scale(260),
    height: isSmallDevice ? verticalScale(75) : verticalScale(90),
    maxWidth: 280,
    maxHeight: 100,
  },
  contentSection: {
    paddingHorizontal: scale(20),
    paddingTop: isShortDevice ? verticalScale(15) : verticalScale(25),
    paddingBottom: verticalScale(30),
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(100),
    marginBottom: isShortDevice ? verticalScale(14) : verticalScale(18),
    gap: scale(6),
  },
  badgeText: {
    color: "white",
    fontSize: scaleFont(11),
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  mainHeading: {
    fontSize: isSmallDevice ? scaleFont(30) : scaleFont(34),
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    lineHeight: isSmallDevice ? scaleFont(38) : scaleFont(42),
    marginBottom: isShortDevice ? verticalScale(24) : verticalScale(30),
    letterSpacing: -0.5,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: isShortDevice ? verticalScale(30) : verticalScale(38),
    paddingHorizontal: scale(5),
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(23),
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(7),
  },
  featureText: {
    color: "white",
    fontSize: scaleFont(10.5),
    fontWeight: "600",
    textAlign: "center",
    lineHeight: scaleFont(14),
  },
  ctaContainer: {
    gap: verticalScale(11),
    marginBottom: verticalScale(14),
  },
  primaryButton: {
    backgroundColor: "#FFD700",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(18),
    borderRadius: moderateScale(22),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: scale(8),
  },
  primaryButtonText: {
    color: "#1a1a1a",
    fontSize: scaleFont(15),
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: verticalScale(13),
    borderRadius: moderateScale(22),
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "white",
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
  trustContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(6),
    flexWrap: "wrap",
    paddingHorizontal: scale(8),
    gap: scale(5),
  },
  trustText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: scaleFont(11),
    textAlign: "center",
  },
  trustBold: {
    fontWeight: "bold",
    color: "white",
  },
});
