import { View, Text, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useAuthStore } from "../store/use-auth-store";
import {
  signInWithEmailPassword,
  signInWithGoogle,
  signOutUser,
} from "../../data/auth.repository";

export function LoginScreen() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSignIn = async () => {
    console.log('1. 🔘 Presionaste el botón de Iniciar Sesión con Google');
    try {
      console.log('2. 🚀 Llamando a signInWithGoogle()...');
      const user = await signInWithGoogle();
      console.log('3. 🕒 Usuario autenticado:', user);
      setUser(user);
    } catch (error: any) {
      console.error('4. ❌ Error al iniciar sesión:', error);
      Alert.alert("Error al iniciar sesión", error.message);
    }
  };

  // FUNCION: solo para pruebas de desarrollo, inicia sesión con un correo electrónico y contraseña predefinidos
  async function handleDevLogin(email: string) {
    try {
      await signInWithEmailPassword(email, 'Testa.123');
    } catch (err: any) {
      console.error('Error en login de prueba:', err);
      Alert.alert("Error en login de prueba", err.message);
    }
  }

  // FUNCION: cierra la sesión activa, sirve tanto para Google como para usuarios de prueba
  async function handleSignOut() {
    try {
      await signOutUser();
    } catch (err: any) {
      console.error('Error al cerrar sesión:', err);
      Alert.alert("Error al cerrar sesión", err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Convivencia Audiovisual</Text>

      {user ? (
        <TouchableOpacity style={styles.botonSecundario} onPress={handleSignOut}>
          <Text style={styles.botonSecundarioTexto}>Cerrar sesión</Text>
        </TouchableOpacity>
      ) : (
        <Button title="Continuar con Google" onPress={handleSignIn} />
      )}

      {__DEV__ && (
        <View style={styles.devLoginContainer}>
          <Text style={styles.devLabel}>Solo desarrollo</Text>
          <TouchableOpacity
            style={styles.devBotonContainer}
            onPress={() => handleDevLogin('test.a@coexistence.ec')}
          >
            <Text style={styles.devBoton}>Login como Usuario A</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.devBotonContainer}
            onPress={() => handleDevLogin('test.b@coexistence.ec')}
          >
            <Text style={styles.devBoton}>Login como Usuario B</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
  },
  botonSecundario: {
    borderWidth: 1,
    borderColor: "#8B0000",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  botonSecundarioTexto: {
    color: "#8B0000",
    fontWeight: "600",
  },
  devLoginContainer: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 16,
    alignItems: "center",
    gap: 8,
  },
  devLabel: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  devBotonContainer: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  devBoton: {
    fontSize: 14,
    color: "#333",
  },
});