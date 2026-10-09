import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "./src/features/auth/presentation/store/use-auth-store";
import { subscribeToAuthChanges } from "./src/features/auth/data/auth.repository";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { RootNavigator } from "./src/shared/navigation/root-navigatos";
import { AlertaHost } from "./src/shared/alertas/presentation/AlertaHost";
import {
  useFonts,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { PTSerif_400Regular } from "@expo-google-fonts/pt-serif";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNotificacionesSala } from "./src/features/salas/presentation/hooks/useNotificacionesSala";
import { AvisoNotificaciones } from "./src/shared/components/AvisoNotificaciones";

// Componente interno que se renderiza SOLO cuando la app ya cargó datos/fuentes
function AppContenido() {
  const { permitido, enableNotifications } = useNotificacionesSala();

  return (
    <SafeAreaProvider>
      <RootNavigator />
      <AvisoNotificaciones
        visible={!permitido}
        onActivar={enableNotifications}
      />
      <StatusBar style="auto" />
      <AlertaHost />
    </SafeAreaProvider>
  );
}

export default function App() {
  // 1. Carga de fuentes
  const [fuentesCargadas] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
    PTSerif_400Regular,
  });

  const { isLoading, setUser } = useAuthStore();

  // 2. Suscripción al estado de autenticación
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, [setUser]);

  // 3. Returns condicionales (después de todos los hooks de App)
  if (!fuentesCargadas) {
    return null;
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 4. Render del contenido principal
  return <AppContenido />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
