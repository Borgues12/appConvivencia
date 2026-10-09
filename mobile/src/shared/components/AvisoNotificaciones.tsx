import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles } from "./styles/AvisoNotificaciones.styles";

interface Props {
  visible: boolean;
  onActivar: () => void;
}

export function AvisoNotificaciones({ visible, onActivar }: Props) {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <View style={[styles.contenedor, { top: insets.top + 8 }]}>
      <Text style={styles.texto}>
        Activa las notificaciones para saber cuándo se abre la sesión del día.
      </Text>
      <Pressable style={styles.boton} onPress={onActivar}>
        <Text style={styles.botonTexto}>Activar</Text>
      </Pressable>
    </View>
  );
}