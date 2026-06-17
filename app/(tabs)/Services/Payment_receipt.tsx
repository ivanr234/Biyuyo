import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Call,
  Card,
  Clock,
  DocumentDownload,
  Drop,
  Electricity,
  Flashy,
  Printer,
  Share as ShareIcon,
  TickCircle,
} from 'iconsax-react-native';
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
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

// Tipos de servicios con sus iconos y colores
const serviceIcons: Record<string, any> = {
  agua: { icon: Drop, color: '#03A9F4', bgColor: '#E1F5FE', name: 'Agua' },
  luz: { icon: Electricity, color: '#FFC107', bgColor: '#FFF9E6', name: 'Energía' },
  gas: { icon: Flashy, color: '#FF5722', bgColor: '#FBE9E7', name: 'Gas Natural' },
  telefonia: { icon: Call, color: '#9C27B0', bgColor: '#F3E5F5', name: 'Telefonía' },
  transporte: { icon: Card, color: '#4CAF50', bgColor: '#E8F5E9', name: 'Transporte Público' },
};

export default function PaymentReceiptScreen() {
  const router = useRouter();

  // Datos del comprobante (normalmente vendrían de la navegación/params)
  const [receiptData] = useState({
    id: 'BYY-20241124-001234',
    servicio: 'luz',
    nombreServicio: 'Energía Eléctrica',
    empresa: 'Empresa de Energía S.A.',
    fecha: '24 Noviembre 2024',
    hora: '14:35:22',
    monto: 145000,
    referencia: '987654321',
    metodoPago: 'PSE',
    numeroTransaccion: '789456123',
    estado: 'Aprobado',
    nombreUsuario: 'Usuario Biyuyo',
    documento: '1234567890',
  });

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Comprobante de Pago Biyuyo\n\nServicio: ${receiptData.nombreServicio}\nMonto: ${formatCurrency(receiptData.monto)}\nReferencia: ${receiptData.referencia}\nFecha: ${receiptData.fecha}\nID: ${receiptData.id}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = () => {
    Alert.alert(
      "Descargar Comprobante",
      "El comprobante se descargará en formato PDF",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Descargar", 
          onPress: () => Alert.alert("Éxito", "Comprobante descargado correctamente")
        }
      ]
    );
  };

  const handlePrint = () => {
    Alert.alert(
      "Imprimir Comprobante",
      "¿Deseas imprimir este comprobante?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Imprimir", 
          onPress: () => Alert.alert("Imprimiendo", "Enviando a impresora...")
        }
      ]
    );
  };

  const serviceData = serviceIcons[receiptData.servicio];
  const IconComponent = serviceData.icon;

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
          <Text style={styles.headerTitle}>Comprobante de Pago</Text>
          <Text style={styles.headerSubtitle}>Detalles de la transacción</Text>
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
        {/* Ticket Container */}
        <View style={styles.ticketContainer}>
          {/* Header del Ticket */}
          <View style={styles.ticketHeader}>
            <Image 
              source={require('../../../assets/images/logo-biyuyo.png')}
              style={styles.ticketLogo}
              resizeMode="contain"
            />
            <Text style={styles.ticketCompany}>Biyuyo</Text>
            <Text style={styles.ticketSubtitle}>Comprobante de Pago</Text>
          </View>

          {/* Estado de Pago */}
          <View style={styles.statusSection}>
            <View style={styles.statusBadge}>
              <TickCircle size={32} color="#4CAF50" variant="Bold" />
            </View>
            <Text style={styles.statusTitle}>¡Pago Exitoso!</Text>
            <Text style={styles.statusSubtitle}>Tu pago ha sido procesado correctamente</Text>
          </View>

          {/* Línea divisoria con estilo perforado */}
          <View style={styles.dashedLine}>
            <View style={styles.leftNotch} />
            <View style={styles.dashedLineInner} />
            <View style={styles.rightNotch} />
          </View>

          {/* Icono y Servicio */}
          <View style={styles.serviceSection}>
            <View style={[styles.serviceIconLarge, { backgroundColor: serviceData.bgColor }]}>
              <IconComponent size={40} color={serviceData.color} variant="Bold" />
            </View>
            <Text style={styles.serviceName}>{receiptData.nombreServicio}</Text>
            <Text style={styles.serviceCompany}>{receiptData.empresa}</Text>
          </View>

          {/* Monto Principal */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Monto Pagado</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(receiptData.monto)}
            </Text>
            <Text style={styles.amountCurrency}>COP</Text>
          </View>

          {/* Línea divisoria */}
          <View style={styles.divider} />

          {/* Detalles de la Transacción */}
          <View style={styles.detailsSection}>
            <Text style={styles.detailsSectionTitle}>Detalles de la Transacción</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ID de Transacción</Text>
              <Text style={styles.detailValue}>{receiptData.id}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabelWithIcon}>
                <Calendar size={16} color="#666" variant="Bold" />
                <Text style={styles.detailLabel}>Fecha</Text>
              </View>
              <Text style={styles.detailValue}>{receiptData.fecha}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabelWithIcon}>
                <Clock size={16} color="#666" variant="Bold" />
                <Text style={styles.detailLabel}>Hora</Text>
              </View>
              <Text style={styles.detailValue}>{receiptData.hora}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Referencia</Text>
              <Text style={styles.detailValue}>{receiptData.referencia}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Método de Pago</Text>
              <Text style={styles.detailValue}>{receiptData.metodoPago}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Núm. de Transacción</Text>
              <Text style={styles.detailValue}>{receiptData.numeroTransaccion}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estado</Text>
              <View style={styles.statusTag}>
                <Text style={styles.statusTagText}>{receiptData.estado}</Text>
              </View>
            </View>
          </View>

          {/* Línea divisoria */}
          <View style={styles.divider} />

          {/* Información del Usuario */}
          <View style={styles.userSection}>
            <Text style={styles.userSectionTitle}>Información del Pagador</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nombre</Text>
              <Text style={styles.detailValue}>{receiptData.nombreUsuario}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Documento</Text>
              <Text style={styles.detailValue}>{receiptData.documento}</Text>
            </View>
          </View>

          {/* Footer del Ticket */}
          <View style={styles.ticketFooter}>
            <Text style={styles.ticketFooterText}>
              Este documento es válido como comprobante de pago
            </Text>
            <Text style={styles.ticketFooterDate}>
              Generado el {receiptData.fecha} a las {receiptData.hora}
            </Text>
            <View style={styles.ticketFooterLine} />
            <Text style={styles.ticketFooterBrand}>Biyuyo © 2025</Text>
            <Text style={styles.ticketFooterContact}>
              Soporte: soporte@biyuyo.com
            </Text>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonIcon}>
              <ShareIcon size={24} color="#5B7FFF" variant="Bold" />
            </View>
            <Text style={styles.actionButtonText}>Compartir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownload}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonIcon}>
              <DocumentDownload size={24} color="#5B7FFF" variant="Bold" />
            </View>
            <Text style={styles.actionButtonText}>Descargar PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePrint}
            activeOpacity={0.7}
          >
            <View style={styles.actionButtonIcon}>
              <Printer size={24} color="#5B7FFF" variant="Bold" />
            </View>
            <Text style={styles.actionButtonText}>Imprimir</Text>
          </TouchableOpacity>
        </View>

        {/* Información Adicional */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>
            Guarda este comprobante para tus registros. Puedes descargarlo o compartirlo en cualquier momento.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Biyuyo © 2025</Text>
          <Text style={styles.footerSubtext}>Desarrollado por Ingenio Soluciones Ti</Text>
          <Text style={styles.footerSubtext}>Tu aliado financiero de confianza</Text>
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
    paddingBottom: verticalScale(120),
  },

  // Ticket Container
  ticketContainer: {
    backgroundColor: "white",
    borderRadius: moderateScale(20),
    overflow: "hidden",
    marginBottom: verticalScale(24),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },

  // Ticket Header
  ticketHeader: {
    alignItems: "center",
    paddingTop: verticalScale(32),
    paddingBottom: verticalScale(24),
    backgroundColor: "#F8F9FD",
  },
  ticketLogo: {
    width: scale(120),
    height: verticalScale(50),
    marginBottom: verticalScale(12),
  },
  ticketCompany: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
  },
  ticketSubtitle: {
    fontSize: scaleFont(13),
    color: "#666",
    fontWeight: "500",
  },

  // Status Section
  statusSection: {
    alignItems: "center",
    paddingVertical: verticalScale(24),
  },
  statusBadge: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  statusTitle: {
    fontSize: scaleFont(22),
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: verticalScale(4),
  },
  statusSubtitle: {
    fontSize: scaleFont(13),
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },

  // Dashed Line
  dashedLine: {
    position: "relative",
    height: 1,
    marginVertical: verticalScale(24),
  },
  dashedLineInner: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  leftNotch: {
    position: "absolute",
    left: -20,
    top: -10,
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    backgroundColor: "#F8F9FD",
  },
  rightNotch: {
    position: "absolute",
    right: -20,
    top: -10,
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    backgroundColor: "#F8F9FD",
  },

  // Service Section
  serviceSection: {
    alignItems: "center",
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(24),
  },
  serviceIconLarge: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  serviceName: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(4),
    textAlign: "center",
  },
  serviceCompany: {
    fontSize: scaleFont(13),
    color: "#999",
    textAlign: "center",
    fontWeight: "500",
  },

  // Amount Section
  amountSection: {
    alignItems: "center",
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(24),
  },
  amountLabel: {
    fontSize: scaleFont(13),
    color: "#666",
    marginBottom: verticalScale(8),
    fontWeight: "500",
  },
  amountValue: {
    fontSize: scaleFont(40),
    fontWeight: "bold",
    color: "#5B7FFF",
    marginBottom: verticalScale(4),
  },
  amountCurrency: {
    fontSize: scaleFont(16),
    color: "#999",
    fontWeight: "600",
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: verticalScale(20),
    marginHorizontal: scale(20),
  },

  // Details Section
  detailsSection: {
    paddingHorizontal: scale(20),
  },
  detailsSectionTitle: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(16),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  detailLabel: {
    fontSize: scaleFont(13),
    color: "#666",
    fontWeight: "500",
  },
  detailLabelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  detailValue: {
    fontSize: scaleFont(13),
    color: "#1a1a1a",
    fontWeight: "700",
    textAlign: "right",
  },
  statusTag: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
  },
  statusTagText: {
    fontSize: scaleFont(12),
    color: "#4CAF50",
    fontWeight: "bold",
  },

  // User Section
  userSection: {
    paddingHorizontal: scale(20),
  },
  userSectionTitle: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: verticalScale(16),
  },

  // Ticket Footer
  ticketFooter: {
    alignItems: "center",
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(20),
    backgroundColor: "#F8F9FD",
    marginTop: verticalScale(20),
  },
  ticketFooterText: {
    fontSize: scaleFont(12),
    color: "#666",
    textAlign: "center",
    marginBottom: verticalScale(8),
    fontWeight: "500",
  },
  ticketFooterDate: {
    fontSize: scaleFont(11),
    color: "#999",
    textAlign: "center",
    marginBottom: verticalScale(12),
  },
  ticketFooterLine: {
    width: scale(60),
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: verticalScale(12),
  },
  ticketFooterBrand: {
    fontSize: scaleFont(13),
    fontWeight: "bold",
    color: "#5B7FFF",
    marginBottom: verticalScale(4),
  },
  ticketFooterContact: {
    fontSize: scaleFont(11),
    color: "#999",
  },

  // Actions Container
  actionsContainer: {
    flexDirection: "row",
    gap: scale(10),
    marginBottom: verticalScale(20),
  },
  actionButton: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(14),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: "#F8F9FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(6),
  },
  actionButtonText: {
    fontSize: scaleFont(11),
    fontWeight: "600",
    color: "#5B7FFF",
    textAlign: "center",
  },

  // Info Box
  infoBox: {
    backgroundColor: "#E3F2FD",
    borderRadius: moderateScale(12),
    padding: scale(16),
    borderWidth: 1,
    borderColor: "rgba(91, 127, 255, 0.2)",
    marginBottom: verticalScale(24),
  },
  infoBoxText: {
    fontSize: scaleFont(12),
    color: "#666",
    textAlign: "center",
    lineHeight: scaleFont(18),
    fontWeight: "500",
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