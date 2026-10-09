// features/salas/presentation/components/CancelarSesionForm/CancelarSesionForm.tsx
import { View, Text, Button, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colores } from "../../../../core/theme/tema";
import { styles } from "../styles/cancelarSesionForm.styles";

type CancelarSesionFormProps = {
  sePuedeCancelar: boolean;
  mostrandoInputCancelar: boolean;
  setMostrandoInputCancelar: (valor: boolean) => void;
  motivoCancelacion: string;
  setMotivoCancelacion: (valor: string) => void;
  cancelandoSesion: boolean;
  handleCancelarSesion: () => void;
};

export function CancelarSesionForm({
  sePuedeCancelar,
  mostrandoInputCancelar,
  setMostrandoInputCancelar,
  motivoCancelacion,
  setMotivoCancelacion,
  cancelandoSesion,
  handleCancelarSesion,
}: CancelarSesionFormProps) {
  if (!sePuedeCancelar) return null;

  if (!mostrandoInputCancelar) {
    return (
      <TouchableOpacity
        style={styles.boton}
        onPress={() => setMostrandoInputCancelar(true)}
      >
        <Ionicons name="ban" size={20} color={colores.acentoSecundario} />
        <Text style={styles.botonTexto}>Cancelar sesión de hoy</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Motivo de la cancelación"
        value={motivoCancelacion}
        onChangeText={setMotivoCancelacion}
        multiline
      />
      <View style={styles.filaBotones}>
        <Button
          title={cancelandoSesion ? "Cancelando..." : "Confirmar"}
          onPress={handleCancelarSesion}
          disabled={cancelandoSesion}
        />
        <Button
          title="Volver"
          onPress={() => {
            setMostrandoInputCancelar(false);
            setMotivoCancelacion("");
          }}
          disabled={cancelandoSesion}
        />
      </View>
    </View>
  );
}