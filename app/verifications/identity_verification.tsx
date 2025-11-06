import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
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

type VerificationStep = 'intro' | 'document-front' | 'document-back' | 'selfie' | 'processing';

export default function IdentityVerificationScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<VerificationStep>('intro');
  const [documentFrontCaptured, setDocumentFrontCaptured] = useState(false);
  const [documentBackCaptured, setDocumentBackCaptured] = useState(false);
  const [selfieCaptured, setSelfieCaptured] = useState(false);
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Actualizar barra de progreso
    let targetProgress = 0;
    if (currentStep === 'intro') targetProgress = 0;
    else if (currentStep === 'document-front') targetProgress = 0.33;
    else if (currentStep === 'document-back') targetProgress = 0.66;
    else if (currentStep === 'selfie') targetProgress = 1;

    Animated.timing(progressAnim, {
      toValue: targetProgress,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const handleCaptureDocumentFront = () => {
    // Aquí iría la lógica de captura de cámara
    Alert.alert(
      'Capturar Documento',
      '¿Deseas tomar la foto del frente de tu documento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Capturar',
          onPress: () => {
            // Simular captura
            setDocumentFrontCaptured(true);
            setTimeout(() => {
              setCurrentStep('document-back');
            }, 500);
          }
        }
      ]
    );
  };

  const handleCaptureDocumentBack = () => {
    Alert.alert(
      'Capturar Documento',
      '¿Deseas tomar la foto del reverso de tu documento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Capturar',
          onPress: () => {
            setDocumentBackCaptured(true);
            setTimeout(() => {
              setCurrentStep('selfie');
            }, 500);
          }
        }
      ]
    );
  };

  const handleCaptureSelfie = () => {
    Alert.alert(
      'Capturar Selfie',
      '¿Deseas tomar tu foto de verificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Capturar',
          onPress: () => {
            setSelfieCaptured(true);
            setCurrentStep('processing');
            // Simular procesamiento
            setTimeout(() => {
              router.push('/register'); // O la siguiente pantalla
            }, 2000);
          }
        }
      ]
    );
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

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
          <Text style={styles.headerTitle}>Verificación de Identidad</Text>
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

      {/* Barra de progreso */}
      {currentStep !== 'intro' && currentStep !== 'processing' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                { width: progressWidth }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep === 'document-front' && 'Paso 1 de 3'}
            {currentStep === 'document-back' && 'Paso 2 de 3'}
            {currentStep === 'selfie' && 'Paso 3 de 3'}
          </Text>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }
          ]}
        >
          {/* Pantalla de introducción */}
          {currentStep === 'intro' && (
            <>
              <View style={styles.illustrationContainer}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconEmoji}>🪪</Text>
                </View>
              </View>

              <Text style={styles.title}>Verifica tu identidad</Text>
              <Text style={styles.subtitle}>
                Para tu seguridad, necesitamos verificar tu identidad. El proceso es rápido y sencillo.
              </Text>

              {/* Pasos */}
              <View style={styles.stepsContainer}>
                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Documento de identidad</Text>
                    <Text style={styles.stepDescription}>
                      Toma una foto del frente y reverso de tu cédula
                    </Text>
                  </View>
                  <Text style={styles.stepIcon}>📄</Text>
                </View>

                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Foto de verificación</Text>
                    <Text style={styles.stepDescription}>
                      Toma una selfie para confirmar tu identidad
                    </Text>
                  </View>
                  <Text style={styles.stepIcon}>🤳</Text>
                </View>

                <View style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Listo!</Text>
                    <Text style={styles.stepDescription}>
                      Verificaremos tu información en segundos
                    </Text>
                  </View>
                  <Text style={styles.stepIcon}>✅</Text>
                </View>
              </View>

              {/* Consejos */}
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>💡 Consejos para mejores resultados:</Text>
                <Text style={styles.tipText}>• Busca buena iluminación</Text>
                <Text style={styles.tipText}>• Asegúrate que el documento esté completo</Text>
                <Text style={styles.tipText}>• Evita reflejos en tu documento</Text>
                <Text style={styles.tipText}>• Mantén tu rostro visible y sin accesorios</Text>
              </View>

              <TouchableOpacity
                style={styles.startButton}
                onPress={() => setCurrentStep('document-front')}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>Comenzar verificación</Text>
                <Text style={styles.startButtonArrow}>→</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Captura de documento - Frente */}
          {currentStep === 'document-front' && (
            <>
              <View style={styles.captureContainer}>
                <View style={styles.captureFrame}>
                  <Text style={styles.captureIcon}>🪪</Text>
                  {!documentFrontCaptured && (
                    <View style={styles.frameCorners}>
                      <View style={[styles.corner, styles.cornerTopLeft]} />
                      <View style={[styles.corner, styles.cornerTopRight]} />
                      <View style={[styles.corner, styles.cornerBottomLeft]} />
                      <View style={[styles.corner, styles.cornerBottomRight]} />
                    </View>
                  )}
                  {documentFrontCaptured && (
                    <View style={styles.capturedOverlay}>
                      <Text style={styles.capturedIcon}>✓</Text>
                    </View>
                  )}
                </View>
              </View>

              <Text style={styles.captureTitle}>Frente del documento</Text>
              <Text style={styles.captureSubtitle}>
                Coloca tu cédula dentro del marco y asegúrate que se vea toda la información
              </Text>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCaptureDocumentFront}
                activeOpacity={0.8}
              >
                <Text style={styles.captureButtonIcon}>📷</Text>
                <Text style={styles.captureButtonText}>Tomar foto</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Captura de documento - Reverso */}
          {currentStep === 'document-back' && (
            <>
              <View style={styles.captureContainer}>
                <View style={styles.captureFrame}>
                  <Text style={styles.captureIcon}>🪪</Text>
                  {!documentBackCaptured && (
                    <View style={styles.frameCorners}>
                      <View style={[styles.corner, styles.cornerTopLeft]} />
                      <View style={[styles.corner, styles.cornerTopRight]} />
                      <View style={[styles.corner, styles.cornerBottomLeft]} />
                      <View style={[styles.corner, styles.cornerBottomRight]} />
                    </View>
                  )}
                  {documentBackCaptured && (
                    <View style={styles.capturedOverlay}>
                      <Text style={styles.capturedIcon}>✓</Text>
                    </View>
                  )}
                </View>
              </View>

              <Text style={styles.captureTitle}>Reverso del documento</Text>
              <Text style={styles.captureSubtitle}>
                Ahora voltea tu cédula y toma una foto del reverso
              </Text>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCaptureDocumentBack}
                activeOpacity={0.8}
              >
                <Text style={styles.captureButtonIcon}>📷</Text>
                <Text style={styles.captureButtonText}>Tomar foto</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Captura de selfie */}
          {currentStep === 'selfie' && (
            <>
              <View style={styles.captureContainer}>
                <View style={styles.selfieFrame}>
                  <Text style={styles.captureIcon}>👤</Text>
                  {!selfieCaptured && (
                    <View style={styles.selfieOval} />
                  )}
                  {selfieCaptured && (
                    <View style={styles.capturedOverlay}>
                      <Text style={styles.capturedIcon}>✓</Text>
                    </View>
                  )}
                </View>
              </View>

              <Text style={styles.captureTitle}>Tu foto de verificación</Text>
              <Text style={styles.captureSubtitle}>
                Mira a la cámara y asegúrate que tu rostro esté bien iluminado
              </Text>

              <View style={styles.selfieInstructions}>
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionIcon}>✓</Text>
                  <Text style={styles.instructionText}>Quítate lentes y gorra</Text>
                </View>
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionIcon}>✓</Text>
                  <Text style={styles.instructionText}>Rostro centrado y sin sombras</Text>
                </View>
                <View style={styles.instructionItem}>
                  <Text style={styles.instructionIcon}>✓</Text>
                  <Text style={styles.instructionText}>Expresión neutral</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCaptureSelfie}
                activeOpacity={0.8}
              >
                <Text style={styles.captureButtonIcon}>📷</Text>
                <Text style={styles.captureButtonText}>Tomar selfie</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Procesando */}
          {currentStep === 'processing' && (
            <>
              <View style={styles.processingContainer}>
                <View style={styles.processingCircle}>
                  <Text style={styles.processingIcon}>⏳</Text>
                </View>
              </View>

              <Text style={styles.processingTitle}>Verificando tu identidad...</Text>
              <Text style={styles.processingSubtitle}>
                Esto solo tomará unos segundos
              </Text>

              <View style={styles.processingSteps}>
                <View style={styles.processingStep}>
                  <View style={styles.processingStepIcon}>
                    <Text style={styles.processingStepEmoji}>✓</Text>
                  </View>
                  <Text style={styles.processingStepText}>Documento verificado</Text>
                </View>
                <View style={styles.processingStep}>
                  <View style={styles.processingStepIcon}>
                    <Text style={styles.processingStepEmoji}>⏳</Text>
                  </View>
                  <Text style={styles.processingStepText}>Comparando rostro...</Text>
                </View>
              </View>
            </>
          )}
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

  // Barra de progreso
  progressContainer: {
    backgroundColor: 'white',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(16),
  },
  progressBar: {
    height: verticalScale(6),
    backgroundColor: '#E0E0E0',
    borderRadius: moderateScale(3),
    overflow: 'hidden',
    marginBottom: verticalScale(8),
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5B7FFF',
    borderRadius: moderateScale(3),
  },
  progressText: {
    fontSize: scaleFont(12),
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(40),
  },

  // Content
  content: {
    flex: 1,
    alignItems: 'center',
  },

  // Ilustración
  illustrationContainer: {
    marginBottom: verticalScale(24),
  },
  iconCircle: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B7FFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(91, 127, 255, 0.1)',
  },
  iconEmoji: {
    fontSize: scaleFont(48),
  },

  // Textos
  title: {
    fontSize: scaleFont(26),
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
    paddingHorizontal: scale(10),
  },

  // Pasos
  stepsContainer: {
    width: '100%',
    marginBottom: verticalScale(24),
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: scale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  stepNumber: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: '#5B7FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  stepNumberText: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: 'white',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: scaleFont(15),
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: verticalScale(2),
  },
  stepDescription: {
    fontSize: scaleFont(13),
    color: '#666',
    lineHeight: scaleFont(18),
  },
  stepIcon: {
    fontSize: scaleFont(24),
    marginLeft: scale(8),
  },

  // Consejos
  tipsContainer: {
    width: '100%',
    backgroundColor: '#FFF9E6',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(24),
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  tipsTitle: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: verticalScale(8),
  },
  tipText: {
    fontSize: scaleFont(13),
    color: '#666',
    marginBottom: verticalScale(4),
    lineHeight: scaleFont(20),
  },

  // Botón de inicio
  startButton: {
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
  startButtonText: {
    color: 'white',
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    marginRight: scale(8),
  },
  startButtonArrow: {
    color: 'white',
    fontSize: scaleFont(18),
    fontWeight: 'bold',
  },

  // Captura
  captureContainer: {
    marginBottom: verticalScale(32),
    width: '100%',
    alignItems: 'center',
  },
  captureFrame: {
    width: scale(280),
    height: verticalScale(180),
    backgroundColor: 'white',
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
    borderWidth: 3,
    borderColor: '#5B7FFF',
    borderStyle: 'dashed',
  },
  captureIcon: {
    fontSize: scaleFont(60),
    opacity: 0.3,
  },
  frameCorners: {
    ...StyleSheet.absoluteFillObject,
  },
  corner: {
    position: 'absolute',
    width: moderateScale(30),
    height: moderateScale(30),
    borderColor: '#FFD700',
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: moderateScale(14),
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: moderateScale(14),
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: moderateScale(14),
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: moderateScale(14),
  },
  capturedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(91, 127, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(13),
  },
  capturedIcon: {
    fontSize: scaleFont(60),
    color: 'white',
  },
  selfieFrame: {
    width: scale(240),
    height: verticalScale(300),
    backgroundColor: 'white',
    borderRadius: moderateScale(120),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
    borderWidth: 3,
    borderColor: '#5B7FFF',
    borderStyle: 'dashed',
  },
  selfieOval: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: moderateScale(120),
    borderWidth: 4,
    borderColor: '#FFD700',
    margin: scale(10),
  },
  captureTitle: {
    fontSize: scaleFont(22),
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  captureSubtitle: {
    fontSize: scaleFont(14),
    color: '#666',
    textAlign: 'center',
    lineHeight: scaleFont(20),
    marginBottom: verticalScale(24),
    paddingHorizontal: scale(20),
  },

  // Botón de captura
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(32),
    borderRadius: moderateScale(16),
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  captureButtonIcon: {
    fontSize: scaleFont(24),
    marginRight: scale(8),
  },
  captureButtonText: {
    color: '#1a1a1a',
    fontSize: scaleFont(16),
    fontWeight: 'bold',
  },

  // Instrucciones de selfie
  selfieInstructions: {
    width: '100%',
    backgroundColor: 'white',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(24),
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  instructionIcon: {
    fontSize: scaleFont(16),
    color: '#4CAF50',
    marginRight: scale(10),
  },
  instructionText: {
    fontSize: scaleFont(14),
    color: '#1a1a1a',
    flex: 1,
  },

  // Procesando
  processingContainer: {
    marginBottom: verticalScale(32),
  },
  processingCircle: {
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
    borderWidth: 4,
    borderColor: '#5B7FFF',
  },
  processingIcon: {
    fontSize: scaleFont(50),
  },
  processingTitle: {
    fontSize: scaleFont(24),
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  processingSubtitle: {
    fontSize: scaleFont(15),
    color: '#666',
    textAlign: 'center',
    marginBottom: verticalScale(32),
  },
  processingSteps: {
    width: '100%',
  },
  processingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
  },
  processingStepIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  processingStepEmoji: {
    fontSize: scaleFont(20),
  },
  processingStepText: {
    fontSize: scaleFont(15),
    fontWeight: '600',
    color: '#1a1a1a',
  },
});