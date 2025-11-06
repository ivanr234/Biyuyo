import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Keyboard,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

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

export default function PhoneVerificationScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Referencias para los inputs del código
  const inputRefs = useRef<(TextInput | null)[]>([]);
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de pulso
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Temporizador para reenviar código
    if (isCodeSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [isCodeSent, timer]);

  const formatPhoneNumber = (text: string) => {
    // Remover todo excepto números
    const cleaned = text.replace(/\D/g, '');
    
    // Limitar a 10 dígitos
    const limited = cleaned.substring(0, 10);
    
    // Formatear como 300 123 4567
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const handleSendCode = () => {
    if (phoneNumber.replace(/\s/g, '').length === 10) {
      setIsCodeSent(true);
      setTimer(60);
      setCanResend(false);
      // Enfocar el primer input del código
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    // Solo permitir números
    if (text && !/^\d+$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-avanzar al siguiente campo
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Verificar si el código está completo
    if (text && index === 5 && newCode.every(digit => digit !== '')) {
      Keyboard.dismiss();
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setTimer(60);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleVerifyCode = (fullCode: string) => {
    // Aquí iría la lógica de verificación
    console.log('Código a verificar:', fullCode);
    // Simular verificación exitosa y navegar a verificación de identidad
    setTimeout(() => {
      router.push('/verifications/identity_verification');
    }, 500);
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
          <Text style={styles.headerTitle}>Verificación</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.logoMini}>
            <Image 
              source={require('@/assets/images/logo-biyuyo.png')}
              style={styles.logoMiniImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Ilustración */}
          <Animated.View 
            style={[
              styles.illustrationContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <View style={styles.phoneCircle}>
              <Text style={styles.phoneIcon}>📱</Text>
            </View>
          </Animated.View>

          {/* Título y descripción */}
          {!isCodeSent ? (
            <>
              <Text style={styles.title}>Verifica tu número</Text>
              <Text style={styles.subtitle}>
                Ingresa tu número de celular para enviarte un código de verificación
              </Text>

              {/* Input de teléfono */}
              <View style={styles.phoneInputContainer}>
                <View style={styles.phonePrefix}>
                  <Text style={styles.phonePrefixFlag}>🇨🇴</Text>
                  <Text style={styles.phonePrefixText}>+57</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="300 123 4567"
                  placeholderTextColor="#999"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  maxLength={12} // 10 dígitos + 2 espacios
                  autoFocus
                />
              </View>

              {/* Botón de enviar código */}
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  phoneNumber.replace(/\s/g, '').length !== 10 && styles.sendButtonDisabled
                ]}
                onPress={handleSendCode}
                disabled={phoneNumber.replace(/\s/g, '').length !== 10}
                activeOpacity={0.8}
              >
                <Text style={styles.sendButtonText}>Enviar código</Text>
                <Text style={styles.sendButtonArrow}>→</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>Ingresa el código</Text>
              <Text style={styles.subtitle}>
                Enviamos un código de 6 dígitos a{'\n'}
                <Text style={styles.phoneHighlight}>+57 {phoneNumber}</Text>
              </Text>

              {/* Inputs de código OTP */}
              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      styles.codeInput,
                      digit && styles.codeInputFilled
                    ]}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {/* Temporizador y reenviar */}
              <View style={styles.resendContainer}>
                {!canResend ? (
                  <Text style={styles.timerText}>
                    Reenviar código en <Text style={styles.timerHighlight}>{timer}s</Text>
                  </Text>
                ) : (
                  <TouchableOpacity
                    onPress={handleResendCode}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.resendButton}>Reenviar código</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Botón de cambiar número */}
              <TouchableOpacity
                style={styles.changeNumberButton}
                onPress={() => {
                  setIsCodeSent(false);
                  setPhoneNumber('');
                  setCode(['', '', '', '', '', '']);
                  setTimer(60);
                  setCanResend(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.changeNumberText}>Cambiar número</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Información de seguridad */}
          <View style={styles.securityInfo}>
            <View style={styles.securityIcon}>
              <Text style={styles.securityEmoji}>🔒</Text>
            </View>
            <Text style={styles.securityText}>
              Tu información está segura y protegida. Nunca compartiremos tus datos.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Header
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

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(40),
  },

  // Content
  content: {
    flex: 1,
    alignItems: 'center',
  },

  // Ilustración
  illustrationContainer: {
    marginBottom: verticalScale(32),
  },
  phoneCircle: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B7FFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'rgba(91, 127, 255, 0.1)',
  },
  phoneIcon: {
    fontSize: scaleFont(50),
  },

  // Textos
  title: {
    fontSize: scaleFont(28),
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scaleFont(15),
    color: '#666',
    textAlign: 'center',
    lineHeight: scaleFont(22),
    marginBottom: verticalScale(32),
    paddingHorizontal: scale(20),
  },
  phoneHighlight: {
    fontWeight: 'bold',
    color: '#5B7FFF',
  },

  // Input de teléfono
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(24),
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#5B7FFF',
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: scale(12),
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  phonePrefixFlag: {
    fontSize: scaleFont(24),
    marginRight: scale(6),
  },
  phonePrefixText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#1a1a1a',
  },
  phoneInput: {
    flex: 1,
    paddingVertical: verticalScale(16),
    paddingLeft: scale(12),
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#1a1a1a',
  },

  // Botón de enviar
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B7FFF',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(24),
    borderRadius: moderateScale(16),
    width: '100%',
    shadowColor: '#5B7FFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    color: 'white',
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    marginRight: scale(8),
  },
  sendButtonArrow: {
    color: 'white',
    fontSize: scaleFont(18),
    fontWeight: 'bold',
  },

  // Código OTP
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(24),
    paddingHorizontal: scale(10),
    width: '100%',
  },
  codeInput: {
    width: moderateScale(48),
    height: moderateScale(56),
    borderRadius: moderateScale(12),
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    fontSize: scaleFont(24),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  codeInputFilled: {
    borderColor: '#5B7FFF',
    backgroundColor: '#F0F4FF',
  },

  // Reenviar código
  resendContainer: {
    marginBottom: verticalScale(16),
  },
  timerText: {
    fontSize: scaleFont(14),
    color: '#666',
    textAlign: 'center',
  },
  timerHighlight: {
    fontWeight: 'bold',
    color: '#5B7FFF',
  },
  resendButton: {
    fontSize: scaleFont(15),
    fontWeight: 'bold',
    color: '#5B7FFF',
    textAlign: 'center',
  },

  // Cambiar número
  changeNumberButton: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
  },
  changeNumberText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },

  // Información de seguridad
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: scale(16),
    borderRadius: moderateScale(16),
    marginTop: verticalScale(32),
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  securityIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  securityEmoji: {
    fontSize: scaleFont(20),
  },
  securityText: {
    flex: 1,
    fontSize: scaleFont(12),
    color: '#666',
    lineHeight: scaleFont(18),
  },
});