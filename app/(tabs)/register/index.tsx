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

const { width, height } = Dimensions.get("window");

type FormStep = 'personal' | 'contact' | 'work' | 'bank';

export default function RegisterScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  
  // Datos personales
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Información de contacto
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [departamento, setDepartamento] = useState("");
  
  // Información laboral
  const [empresa, setEmpresa] = useState("");
  const [cargo, setCargo] = useState("");
  const [tiempoEmpleo, setTiempoEmpleo] = useState("");
  const [ingresoMensual, setIngresoMensual] = useState("");
  
  // Información bancaria
  const [banco, setBanco] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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
  }, []);

  // Resetear animación al cambiar de paso
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep === 'personal') setCurrentStep('contact');
    else if (currentStep === 'contact') setCurrentStep('work');
    else if (currentStep === 'work') setCurrentStep('bank');
    else handleRegister();
  };

  const handleBack = () => {
    if (currentStep === 'contact') setCurrentStep('personal');
    else if (currentStep === 'work') setCurrentStep('contact');
    else if (currentStep === 'bank') setCurrentStep('work');
  };

  const handleRegister = () => {
    console.log("Registro completo:", {
      personal: { nombre, email, password },
      contacto: { telefono, direccion, ciudad, departamento },
      laboral: { empresa, cargo, tiempoEmpleo, ingresoMensual },
      bancaria: { banco, tipoCuenta, numeroCuenta }
    });
    // router.push('/dashboard');
  };

  const getStepNumber = () => {
    switch(currentStep) {
      case 'personal': return 1;
      case 'contact': return 2;
      case 'work': return 3;
      case 'bank': return 4;
      default: return 1;
    }
  };

  const getStepTitle = () => {
    switch(currentStep) {
      case 'personal': return 'Datos Personales';
      case 'contact': return 'Información de Contacto';
      case 'work': return 'Información Laboral';
      case 'bank': return 'Información Bancaria';
      default: return '';
    }
  };

  const getStepSubtitle = () => {
    switch(currentStep) {
      case 'personal': return 'Crea tu cuenta con tu información básica';
      case 'contact': return 'Dónde podemos contactarte';
      case 'work': return 'Cuéntanos sobre tu empleo actual';
      case 'bank': return 'Para procesar tu crédito';
      default: return '';
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
          {/* Header con Logo */}
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: pulseAnim }]
              }
            ]}
          >
            <View style={styles.logoCard}>
              <Image
                source={require('../../../assets/images/logo-biyuyo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          {/* Indicador de progreso */}
          <Animated.View 
            style={[
              styles.progressContainer,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.stepsIndicator}>
              {[1, 2, 3, 4].map((step) => (
                <View key={step} style={styles.stepDot}>
                  <View style={[
                    styles.stepDotInner,
                    getStepNumber() >= step && styles.stepDotActive
                  ]} />
                  {step < 4 && (
                    <View style={[
                      styles.stepLine,
                      getStepNumber() > step && styles.stepLineActive
                    ]} />
                  )}
                </View>
              ))}
            </View>
            <Text style={styles.progressText}>Paso {getStepNumber()} de 4</Text>
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
            <Text style={styles.title}>{getStepTitle()}</Text>
            <Text style={styles.subtitle}>{getStepSubtitle()}</Text>
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
            {/* PASO 1: Datos Personales */}
            {currentStep === 'personal' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nombre completo</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>👤</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Juan Pérez González"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={nombre}
                      onChangeText={setNombre}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Correo electrónico</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>✉️</Text>
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

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Contraseña</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Mínimo 8 caracteres"
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
                      <Text style={styles.eyeIcon}>
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirmar contraseña</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Repite tu contraseña"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeButton}
                    >
                      <Text style={styles.eyeIcon}>
                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {/* PASO 2: Información de Contacto */}
            {currentStep === 'contact' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Teléfono celular</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>📱</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="+57 300 123 4567"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={telefono}
                      onChangeText={setTelefono}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Dirección de residencia</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🏠</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Calle 123 #45-67"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={direccion}
                      onChangeText={setDireccion}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Ciudad</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🏙️</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej: Bogotá"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={ciudad}
                      onChangeText={setCiudad}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Departamento</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>📍</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej: Cundinamarca"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={departamento}
                      onChangeText={setDepartamento}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              </>
            )}

            {/* PASO 3: Información Laboral */}
            {currentStep === 'work' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Empresa donde trabajas</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🏢</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre de la empresa"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={empresa}
                      onChangeText={setEmpresa}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Cargo o posición</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>💼</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej: Analista, Gerente, etc."
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={cargo}
                      onChangeText={setCargo}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Tiempo en el empleo</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>📅</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej: 2 años, 6 meses"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={tiempoEmpleo}
                      onChangeText={setTiempoEmpleo}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Ingreso mensual</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>💰</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej: $2,500,000"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={ingresoMensual}
                      onChangeText={setIngresoMensual}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </>
            )}

            {/* PASO 4: Información Bancaria */}
            {currentStep === 'bank' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Banco</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🏦</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej: Bancolombia, Davivienda"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={banco}
                      onChangeText={setBanco}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Tipo de cuenta</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>💳</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ahorros o Corriente"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={tipoCuenta}
                      onChangeText={setTipoCuenta}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Número de cuenta</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🔢</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="1234567890"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={numeroCuenta}
                      onChangeText={setNumeroCuenta}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    Al registrarte, aceptas nuestros{" "}
                    <Text style={styles.termsLink}>Términos y Condiciones</Text> y{" "}
                    <Text style={styles.termsLink}>Política de Privacidad</Text>
                  </Text>
                </View>
              </>
            )}

            {/* Botones de navegación */}
            <View style={styles.buttonContainer}>
              {currentStep !== 'personal' && (
                <TouchableOpacity
                  style={styles.backButtonForm}
                  activeOpacity={0.85}
                  onPress={handleBack}
                >
                  <Text style={styles.backButtonText}>← Atrás</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  currentStep === 'personal' && styles.nextButtonFull
                ]}
                activeOpacity={0.85}
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>
                  {currentStep === 'bank' ? 'Crear cuenta' : 'Siguiente'}
                </Text>
                <Text style={styles.nextButtonArrow}>→</Text>
              </TouchableOpacity>
            </View>

            {/* Login link solo en primer paso */}
            {currentStep === 'personal' && (
              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>¿Ya tienes cuenta? </Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text style={styles.loginLink}>Inicia sesión</Text>
                </TouchableOpacity>
              </View>
            )}
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
    top: height * 0.4,
    left: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
  },
  circle3: {
    position: "absolute",
    bottom: 100,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },

  // Logo
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50
  },
  logoCard: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 24,
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  logo: {
    width: 140,
    height: 46,
  },

  // Progreso
  progressContainer: {
    paddingHorizontal: 28,
    marginBottom: 20,
  },
  stepsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepDot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  stepDotActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: '#FFD700',
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Título
  titleContainer: {
    paddingHorizontal: 28,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 22,
  },

  // Formulario
  formContainer: {
    paddingHorizontal: 28,
  },
  inputGroup: {
    marginBottom: 18,
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
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
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
  eyeIcon: {
    fontSize: 20,
  },

  // Términos
  termsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  termsText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
    textAlign: "center",
  },
  termsLink: {
    color: "#FFD700",
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  // Botones de navegación
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  backButtonForm: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  nextButton: {
    flex: 1,
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
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  nextButtonArrow: {
    color: "#1a1a1a",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Link de login
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  loginLinkText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 15,
  },
  loginLink: {
    color: "#FFD700",
    fontSize: 15,
    fontWeight: "bold",
  },
});