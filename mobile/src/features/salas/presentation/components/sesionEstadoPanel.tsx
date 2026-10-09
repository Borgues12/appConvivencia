// features/salas/presentation/components/SesionEstadoPanel/SesionEstadoPanel.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colores } from "../../../../core/theme/tema";
import { styles } from "../styles/sesionEstadoPanel.styles";
import { Sesion } from "../../../sesiones/domain/sesion.domain";

type SesionEstadoPanelProps = {
  sesionActual: Sesion | null;
  sesionCargando: boolean;
  usuarioUid: string | undefined;
  handleIniciarSesion: () => void;
};

export function SesionEstadoPanel({
  sesionActual,
  sesionCargando,
  usuarioUid,
  handleIniciarSesion,
}: SesionEstadoPanelProps) {
  if (sesionActual?.sesionEstado === "pendiente") {
    return (
      <TouchableOpacity style={styles.botonIniciar} onPress={handleIniciarSesion} disabled={sesionCargando}>
        <Ionicons name="play-circle" size={22} color={colores.textoSobreFondo} />
        <Text style={styles.botonIniciarTexto}>
          {sesionCargando ? "Iniciando..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>
    );
  }

  if (sesionActual?.sesionEstado === "en_curso") {
    const fueQuienInicio = usuarioUid === sesionActual.sesionIniciadaPorUid;

    if (fueQuienInicio) {
      return (
        <View style={styles.pinContenedor}>
          <Ionicons name="key" size={20} color={colores.fondo} />
          <Text style={styles.pinLabel}>PIN de la sesión:</Text>
          <Text style={styles.pinValor}>{sesionActual.sesionPin}</Text>
        </View>
      );
    }

    return (
      <View style={styles.info}>
        <Ionicons name="checkmark-circle" size={20} color={colores.exito} />
        <Text style={styles.infoTexto}>Check-in abierto, ingresa el PIN</Text>
      </View>
    );
  }

  if (sesionActual?.sesionEstado === "cancelada") {
    return (
      <View style={styles.info}>
        <Ionicons name="close-circle" size={20} color={colores.acentoSecundario} />
        <Text style={styles.infoTexto}>Sesión cancelada por el admin</Text>
      </View>
    );
  }

  return null;
}