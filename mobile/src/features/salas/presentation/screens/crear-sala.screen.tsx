import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuthStore } from "../../../auth/presentation/store/use-auth-store";
import { useSalaStore } from "../store/use-sala-store";

export function CrearSalaScreen() {
  const [nombre, setNombre] = useState("");
  const user = useAuthStore((state) => state.user);
  const { crear, isLoading, error, sala } = useSalaStore();

  const handleCrear = () => {
    if (!user || nombre.trim().length === 0) return;
    crear(nombre.trim(), user.uid);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Crear Sala</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la sala"
        value={nombre}
        onChangeText={setNombre}
      />

      <Button title="Crear" onPress={handleCrear} disabled={isLoading} />

      {isLoading && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error}</Text>}
      {sala && (
        <Text style={styles.codigo}>
          Código de invitación: {sala.salaCodigoInvitacion}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  error: { color: "red", marginTop: 8 },
  codigo: { marginTop: 16, fontSize: 16, fontWeight: "600" },
});
