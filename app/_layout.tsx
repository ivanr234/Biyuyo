// app/_layout.tsx
// Layout ROOT de tu aplicación - SIN headers

import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Ocultar header en todas las pantallas
        contentStyle: {
          backgroundColor: 'transparent',
        },
        animation: Platform.OS === 'ios' ? 'default' : 'fade',
      }}
    >
      {/* Pantalla de bienvenida */}
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
          gestureEnabled: false, // Deshabilitar gesto de volver
        }}
      />
      
      {/* Pantallas de autenticación */}
      <Stack.Screen 
        name="login/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="register/index"
        options={{
          headerShown: false,
        }}
      />
      
      {/* Grupo de pantallas con tabs */}
      <Stack.Screen 
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}