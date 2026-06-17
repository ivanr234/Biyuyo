import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
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
// Importar iconos de Iconsax
import {
  ArrowLeft,
  Eye,
  EyeSlash,
  Key,
  Lock,
  Lock1,
  SecuritySafe,
  ShieldTick,
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

export default function ChangePasswordScreen() {
  const router = useRouter();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Estados de visibilidad
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados de validación
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Requisitos de contraseña
  const passwordRequirements = [
    { id: 1, text: "Mínimo 8 caracteres", met: formData.newPassword.length >= 8 },
    { id: 2, text: "Una letra mayúscula", met: /[A-Z]/.test(formData.newPassword) },
    { id: 3, text: "Una letra minúscula", met: /[a-z]/.test(formData.newPassword) },
    { id: 4, text: "Un número", met: /[0-9]/.test(formData.newPassword) },
    { id: 5, text: "Un carácter especial", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword !== "";

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePassword = () => {
    // Validaciones
    if (!formData.currentPassword) {
      Alert.alert("Error", "Por favor ingresa tu contraseña actual");
      return;
    }

    if (!formData.newPassword) {
      Alert.alert("Error", "Por favor ingresa tu nueva contraseña");
      return;
    }

    if (!allRequirementsMet) {
      Alert.alert("Error", "La nueva contraseña no cumple con todos los requisitos de seguridad");
      return;
    }

    if (!passwordsMatch) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      Alert.alert("Error", "La nueva contraseña debe ser diferente a la actual");
      return;
    }

    setIsLoading(true);
    
    // Simulación de cambio de contraseña
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "¡Éxito!",
        "Tu contraseña ha sido cambiada correctamente",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
          <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
          <Text style={styles.headerSubtitle}>Protege tu cuenta</Text>
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
        {/* Security Icon */}
        <View style={styles.iconSection}>
          <View style={styles.iconContainer}>
            <SecuritySafe size={64} color="#5B7FFF" variant="Bold" />
          </View>
          <Text style={styles.iconTitle}>Seguridad de tu cuenta</Text>
          <Text style={styles.iconSubtitle}>
            Actualiza tu contraseña regularmente para mantener tu cuenta segura
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Contraseña Actual */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contraseña Actual</Text>
            <View style={[
              styles.inputWrapper,
              focusedInput === 'currentPassword' && styles.inputWrapperFocused
            ]}>
              <View style={styles.inputIconContainer}>
                <Lock size={20} color="#5B7FFF" variant="Bold" />
              </View>
              <TextInput
                style={styles.input}
                value={formData.currentPassword}
                onChangeText={(value) => handleInputChange('currentPassword', value)}
                placeholder="Ingresa tu contraseña actual"
                placeholderTextColor="#999"
                secureTextEntry={!showCurrentPassword}
                onFocus={() => setFocusedInput('currentPassword')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeButton}
              >
                {showCurrentPassword ? (
                  <Eye size={20} color="#999" variant="Bold" />
                ) : (
                  <EyeSlash size={20} color="#999" variant="Bold" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Nueva Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nueva Contraseña</Text>
            <View style={[
              styles.inputWrapper,
              focusedInput === 'newPassword' && styles.inputWrapperFocused
            ]}>
              <View style={styles.inputIconContainer}>
                <Key size={20} color="#5B7FFF" variant="Bold" />
              </View>
              <TextInput
                style={styles.input}
                value={formData.newPassword}
                onChangeText={(value) => handleInputChange('newPassword', value)}
                placeholder="Ingresa tu nueva contraseña"
                placeholderTextColor="#999"
                secureTextEntry={!showNewPassword}
                onFocus={() => setFocusedInput('newPassword')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeButton}
              >
                {showNewPassword ? (
                  <Eye size={20} color="#999" variant="Bold" />
                ) : (
                  <EyeSlash size={20} color="#999" variant="Bold" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
            <View style={[
              styles.inputWrapper,
              focusedInput === 'confirmPassword' && styles.inputWrapperFocused,
              formData.confirmPassword && !passwordsMatch && styles.inputWrapperError
            ]}>
              <View style={styles.inputIconContainer}>
                <Lock1 size={20} color="#5B7FFF" variant="Bold" />
              </View>
              <TextInput
                style={styles.input}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                placeholder="Confirma tu nueva contraseña"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                {showConfirmPassword ? (
                  <Eye size={20} color="#999" variant="Bold" />
                ) : (
                  <EyeSlash size={20} color="#999" variant="Bold" />
                )}
              </TouchableOpacity>
            </View>
            {formData.confirmPassword && !passwordsMatch && (
              <View style={styles.errorMessage}>
                <Warning2 size={14} color="#FF5252" variant="Bold" />
                <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
              </View>
            )}
            {formData.confirmPassword && passwordsMatch && (
              <View style={styles.successMessage}>
                <TickCircle size={14} color="#4CAF50" variant="Bold" />
                <Text style={styles.successText}>Las contraseñas coinciden</Text>
              </View>
            )}
          </View>
        </View>

        {/* Password Requirements */}
        <View style={styles.requirementsCard}>
          <View style={styles.requirementsHeader}>
            <ShieldTick size={24} color="#5B7FFF" variant="Bold" />
            <Text style={styles.requirementsTitle}>Requisitos de seguridad</Text>
          </View>
          
          <View style={styles.requirementsList}>
            {passwordRequirements.map((req) => (
              <View key={req.id} style={styles.requirementItem}>
                <View style={[
                  styles.requirementIcon,
                  req.met && styles.requirementIconMet
                ]}>
                  {req.met ? (
                    <TickCircle size={16} color="#4CAF50" variant="Bold" />
                  ) : (
                    <View style={styles.requirementDot} />
                  )}
                </View>
                <Text style={[
                  styles.requirementText,
                  req.met && styles.requirementTextMet
                ]}>
                  {req.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Security Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Warning2 size={20} color="#FF9800" variant="Bold" />
            <Text style={styles.tipsTitle}>Consejos de seguridad</Text>
          </View>
          <View style={styles.tipsList}>
            <Text style={styles.tipText}>• No compartas tu contraseña con nadie</Text>
            <Text style={styles.tipText}>• Usa una contraseña única para cada cuenta</Text>
            <Text style={styles.tipText}>• Cambia tu contraseña cada 3-6 meses</Text>
            <Text style={styles.tipText}>• No uses información personal obvia</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.saveButton,
              (!allRequirementsMet || !passwordsMatch || isLoading) && styles.saveButtonDisabled
            ]}
            onPress={handleChangePassword}
            activeOpacity={0.8}
            disabled={!allRequirementsMet || !passwordsMatch || isLoading}
          >
            {isLoading ? (
              <Text style={styles.saveButtonText}>Cambiando...</Text>
            ) : (
              <>
                <Key size={20} color="white" variant="Bold" />
                <Text style={styles.saveButtonText}>Cambiar Contraseña</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Biyuyo © 2025</Text>
          <Text style={styles.footerSubtext}>Desarrollado por Ingenio Soluciones Ti</Text>
          <Text style={styles.footerSubtext}>Tu aliado financiero de confianza</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(120),
  },

  // Icon Section
  iconSection: {
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  iconContainer: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(16),
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconTitle: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(8),
  },
  iconSubtitle: {
    fontSize: scaleFont(13),
    color: "#666",
    textAlign: "center",
    lineHeight: scaleFont(20),
    fontWeight: "500",
    paddingHorizontal: scale(20),
  },

  // Form Card
  formCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(20),
    padding: scale(20),
    marginBottom: verticalScale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  // Input Groups
  inputGroup: {
    marginBottom: verticalScale(20),
  },
  inputLabel: {
    fontSize: scaleFont(13),
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: verticalScale(8),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FD",
    borderRadius: moderateScale(14),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    borderWidth: 2,
    borderColor: "#F8F9FD",
  },
  inputWrapperFocused: {
    borderColor: "#5B7FFF",
    backgroundColor: "white",
  },
  inputWrapperError: {
    borderColor: "#FF5252",
    backgroundColor: "#FFF5F5",
  },
  inputIconContainer: {
    marginRight: scale(10),
  },
  input: {
    flex: 1,
    fontSize: scaleFont(15),
    color: "#1a1a1a",
    fontWeight: "500",
    padding: 0,
  },
  eyeButton: {
    padding: scale(4),
    marginLeft: scale(8),
  },
  errorMessage: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(6),
    gap: scale(6),
  },
  errorText: {
    fontSize: scaleFont(12),
    color: "#FF5252",
    fontWeight: "600",
  },
  successMessage: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(6),
    gap: scale(6),
  },
  successText: {
    fontSize: scaleFont(12),
    color: "#4CAF50",
    fontWeight: "600",
  },

  // Requirements Card
  requirementsCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(18),
    marginBottom: verticalScale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  requirementsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
    gap: scale(10),
  },
  requirementsTitle: {
    fontSize: scaleFont(15),
    fontWeight: "700",
    color: "#1a1a1a",
  },
  requirementsList: {
    gap: verticalScale(12),
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  requirementIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  requirementIconMet: {
    backgroundColor: "#E8F5E9",
  },
  requirementDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: "#999",
  },
  requirementText: {
    fontSize: scaleFont(13),
    color: "#999",
    fontWeight: "500",
  },
  requirementTextMet: {
    color: "#4CAF50",
    fontWeight: "600",
  },

  // Tips Card
  tipsCard: {
    backgroundColor: "#FFF9E6",
    borderRadius: moderateScale(16),
    padding: scale(18),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: "rgba(255, 152, 0, 0.2)",
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
    gap: scale(8),
  },
  tipsTitle: {
    fontSize: scaleFont(14),
    fontWeight: "700",
    color: "#1a1a1a",
  },
  tipsList: {
    gap: verticalScale(8),
  },
  tipText: {
    fontSize: scaleFont(12),
    color: "#666",
    lineHeight: scaleFont(18),
    fontWeight: "500",
  },

  // Buttons
  buttonsContainer: {
    flexDirection: "row",
    gap: scale(12),
    marginBottom: verticalScale(24),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(16),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButtonText: {
    fontSize: scaleFont(15),
    fontWeight: "700",
    color: "#666",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#5B7FFF",
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(8),
    shadowColor: "#5B7FFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.5,
    backgroundColor: "#B0BEC5",
  },
  saveButtonText: {
    fontSize: scaleFont(15),
    fontWeight: "700",
    color: "white",
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