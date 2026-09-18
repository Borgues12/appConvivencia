import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "./src/features/auth/presentation/store/use-auth-store";
import { subscribeToAuthChanges } from "./src/features/auth/data/auth.repository";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { RootNavigator } from "./src/shared/navigation/root-navigatos";
import { AlertaHost } from "./src/shared/alertas/presentation/AlertaHost";
import { useFonts, Poppins_500Medium, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import { PTSerif_400Regular } from "@expo-google-fonts/pt-serif";

export default function App() {
  // cargamos las fuentes de Google Fonts
  const [fuentesCargadas] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
    PTSerif_400Regular,
  });

  const { isLoading, setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  // recién aquí, después de que TODOS los hooks se llamaron, empiezan los returns condicionales
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

  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
      <AlertaHost />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});