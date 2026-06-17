import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from 'react-native-svg';
// Importar iconos de Iconsax
import {
  Eye,
  EyeSlash,
  Facebook,
  Google,
  Lock,
  Sms,
  TickSquare
} from 'iconsax-react-native';

const { width, height } = Dimensions.get("window");

// Funciones de escala
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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("usuario@biyuyo.com");
  const [password, setPassword] = useState("biyuyo123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulso continuo
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

  const handleLogin = () => {
    // Validación simple
    if (email === "usuario@biyuyo.com" && password === "biyuyo123") {
      console.log("Login exitoso:", { email, password, rememberMe });
      router.push('/(tabs)/dashboard');
    } else {
      console.log("Credenciales incorrectas");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5B7FFF" />

      {/* Círculos decorativos */}
      <Animated.View
        style={[styles.circle1, { transform: [{ scale: pulseAnim }] }]}
      />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo con contenedor de arco - DE BORDE A BORDE */}
          <Animated.View
            style={[
              styles.logoSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              },
            ]}
          >
            {/* Contenedor con forma de arco en la parte inferior usando SVG */}
            <View style={styles.arcContainer}>
              <Svg
                height={verticalScale(240)}
                width={width}
                style={styles.arcSvg}
              >
                <Path
                  d={`
                    M 0 0
                    L ${width} 0
                    L ${width} ${verticalScale(170)}
                    Q ${width / 2} ${verticalScale(240)}, 0 ${verticalScale(170)}
                    Z
                  `}
                  fill="white"
                />
              </Svg>
              
              {/* Sombra decorativa */}
              
            </View>

            {/* Logo con efecto flotante */}
            <Animated.View 
              style={[
                styles.logoFloatingContainer,
                { transform: [{ translateY: floatY }] }
              ]}
            >
              <View style={styles.logoMainContainer}>
                <Image 
                  source={require('../../../assets/images/logo-biyuyo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </Animated.View>
          </Animated.View>

          {/* Título */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.title}>¡Bienvenido!</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
          </Animated.View>

          {/* Formulario */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Campo Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={styles.inputWrapper}>
                <Sms size={20} color="rgba(255, 255, 255, 0.7)" variant="Bold" />
                <TextInput
                  style={styles.input}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="rgba(255, 255, 255, 0.7)" variant="Bold" />
                <TextInput
                  style={styles.input}
                  placeholder="Tu contraseña"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <Eye size={20} color="rgba(255, 255, 255, 0.7)" variant="Bold" />
                  ) : (
                    <EyeSlash size={20} color="rgba(255, 255, 255, 0.7)" variant="Bold" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Recordarme y Olvidé contraseña */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && (
                    <TickSquare size={22} color="white" variant="Bold" />
                  )}
                </View>
                <Text style={styles.rememberMeText}>Recordarme</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.forgotPassword}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Botón de login */}
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.85}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
              
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o inicia sesión con</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Botones sociales */}
            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Google size={20} color="white" variant="Bold" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Facebook size={20} color="white" variant="Bold" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Registro link */}
            <View style={styles.registerLinkContainer}>
              <Text style={styles.registerLinkText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.registerLink}>Regístrate aquí</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5B7FFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },

  // Círculos decorativos
  circle1: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  circle2: {
    position: "absolute",
    top: height * 0.5,
    left: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
  },
  circle3: {
    position: "absolute",
    bottom: 80,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },

  // ===== LOGO SECTION CON ARCO DE BORDE A BORDE =====
  logoSection: {
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === "ios" ? verticalScale(10) : verticalScale(30),
    paddingBottom: verticalScale(20),
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
    minHeight: verticalScale(240),
    marginBottom: 20,

  },

  // Contenedor del arco - DE BORDE A BORDE
  arcContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: verticalScale(240),
    zIndex: 1,
    overflow: 'visible',
  },

  // SVG del arco
  arcSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  // Sombra del arco en la parte inferior
  

  // Logo con efecto flotante
  logoFloatingContainer: {
    marginTop: verticalScale(60),
    marginBottom: verticalScale(18),
    position: 'relative',
    zIndex: 10,
  },
  
  // Container principal del logo - SIN BORDES, SOLO TRANSPARENTE
  logoMainContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(15),
    position: 'relative',
  },
  
  // Logo
  logo: {
    width: scale(200),
    height: verticalScale(70),
  },

  // Título
  titleContainer: {
    paddingHorizontal: 28,
    marginBottom: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },

  // Formulario
  formContainer: {
    paddingHorizontal: 28,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 12,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingVertical: 16,
    fontWeight: "500",
  },
  eyeButton: {
    padding: 8,
  },

  // Opciones
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: 'hidden',
  },
  checkboxChecked: {
    backgroundColor: "#FFD700",
    borderColor: "#FFD700",
    
  },

  rememberMeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  forgotPassword: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
  },

  // Botón de login
  loginButton: {
    backgroundColor: "#FFD700",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 28,
    shadowColor: "#FFD700",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 28,
    gap: 8,
  },
  loginButtonText: {
    color: "#1a1a1a",
    fontSize: 18,
    fontWeight: "700",
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    paddingHorizontal: 12,
    fontWeight: "500",
  },

  // Botones sociales
  socialButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 8,
  },
  socialText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },

  // Link de registro
  registerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerLinkText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 15,
  },
  registerLink: {
    color: "#FFD700",
    fontSize: 15,
    fontWeight: "bold",
  },
});