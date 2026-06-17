// components/FloatingBottomMenu.tsx
// Componente de menú flotante reutilizable con detección automática de safe area

import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Funciones de escalado
const scale = (size: number) => (width / 375) * size;
const scaleFont = (size: number) => {
  const newSize = (width / 375) * size;
  if (Platform.OS === 'ios') {
    return Math.round(newSize);
  }
  return Math.round(newSize) - 1;
};
const moderateScale = (size: number, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  route: string;
  pathMatch: string; // Para identificar cuando está activo
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    label: 'Inicio',
    icon: 'home-outline',
    activeIcon: 'home',
    route: '/(tabs)/dashboard',
    pathMatch: 'dashboard',
  },
  {
    id: '2',
    label: 'Créditos',
    icon: 'cash-outline',
    activeIcon: 'cash',
    route: '/(tabs)/Credit/credit_history',
    pathMatch: 'Credit',
  },
  {
    id: '3',
    label: 'Comprar',
    icon: 'bag-handle-outline',
    activeIcon: 'bag-handle',
    route: '/PiyaloAqui/Index',
    pathMatch: 'PiyaloAqui',
  },
  {
    id: '4',
    label: 'Ayuda',
    icon: 'help-circle-outline',
    activeIcon: 'help-circle',
    route: '/(tabs)/Help',
    pathMatch: 'Help',
  },
  {
    id: '5',
    label: 'Perfil',
    icon: 'person-outline',
    activeIcon: 'person',
    route: '/(tabs)/Profile',
    pathMatch: 'Profile',
  },
];

interface FloatingBottomMenuProps {
  currentRoute?: string; // Opcional: para forzar una ruta activa
}

export default function FloatingBottomMenu({ currentRoute }: FloatingBottomMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handlePress = (route: string) => {
    try {
      router.push(route as any);
    } catch (error) {
      console.log('Error navegando a:', route);
    }
  };

  // Determinar qué item está activo
  const getActiveItem = () => {
    if (currentRoute) return currentRoute;
    
    // Buscar en el pathname actual
    for (const item of MENU_ITEMS) {
      if (pathname.includes(item.pathMatch)) {
        return item.pathMatch;
      }
    }
    return '';
  };

  const activeRoute = getActiveItem();

  // Calcular el padding bottom dinámico basado en el safe area
  const getBottomPadding = () => {
    // Si hay inset bottom (barra de gestos o home indicator)
    if (insets.bottom > 0) {
      // Dispositivos con gestos (iPhone X+, algunos Android)
      // Usamos el inset + un poco de espacio extra
      return insets.bottom + scale(8);
    } else {
      // Dispositivos con botones físicos/virtuales
      // Agregamos más espacio para evitar superposición
      return Platform.OS === 'ios' ? scale(20) : scale(24);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: getBottomPadding() }]}>
      <View style={styles.menuContainer}>
        {MENU_ITEMS.map((item) => {
          const isActive = activeRoute === item.pathMatch;
          
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handlePress(item.route)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={isActive ? item.activeIcon : item.icon}
                  size={scale(24)}
                  color={isActive ? '#5B7FFF' : '#6B7280'}
                />
              </View>
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale(16),
    // paddingBottom se calcula dinámicamente
    backgroundColor: 'transparent',
    zIndex: 999,
    pointerEvents: 'box-none', // Permite tocar a través del container
  },
  menuContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: moderateScale(25),
    paddingVertical: scale(12),
    paddingHorizontal: scale(8),
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    pointerEvents: 'auto', // El menú sí recibe toques
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: scale(8),
  },
  iconContainer: {
    marginBottom: scale(4),
  },
  label: {
    fontSize: scaleFont(12),
    color: '#6B7280',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#5B7FFF',
    fontWeight: '700',
  },
});