// features/sesiones/presentation/components/TableroPin.tsx
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./styles/TableroPin.styles";

interface TableroPinProps {
  pin: string;
  longitud: number;
  errorPin: string | null;
  yaHiceCheckin: boolean;
  puedeEnviarPin: boolean;
  onChangePin: (texto: string) => void;
  onSubmit: () => void;
  // modal de motivo (solo check-in con retraso)
  mostrandoModalMotivo: boolean;
  motivo: string;
  puedeEnviarMotivo: boolean;
  onChangeMotivo: (texto: string) => void;
  onConfirmMotivo: () => void;
  onCancelMotivo: () => void;
}

export function TableroPin(props: TableroPinProps) {
  if (props.yaHiceCheckin) {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.confirmado}>Asistencia registrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Ingresa el PIN de la sesión</Text>

      <TextInput
        style={styles.input}
        value={props.pin}
        onChangeText={props.onChangePin}
        keyboardType="number-pad"
        maxLength={props.longitud}
        placeholder={"•".repeat(props.longitud)}
        placeholderTextColor="#666"
      />

      {props.errorPin && <Text style={styles.error}>{props.errorPin}</Text>}

      <Pressable
        style={[styles.boton, !props.puedeEnviarPin && styles.botonDeshabilitado]}
        disabled={!props.puedeEnviarPin}
        onPress={props.onSubmit}
      >
        <Text style={styles.botonTexto}>Confirmar</Text>
      </Pressable>

      <Modal transparent animationType="fade" visible={props.mostrandoModalMotivo}>
        <View style={styles.modalFondo}>
          <View style={styles.modalCaja}>
            <Text style={styles.titulo}>Llegaste con retraso</Text>
            <TextInput
              style={styles.inputMotivo}
              value={props.motivo}
              onChangeText={props.onChangeMotivo}
              placeholder="Escribe el motivo (mín. 10 caracteres)"
              placeholderTextColor="#666"
              multiline
            />
            <Pressable
              style={[styles.boton, !props.puedeEnviarMotivo && styles.botonDeshabilitado]}
              disabled={!props.puedeEnviarMotivo}
              onPress={props.onConfirmMotivo}
            >
              <Text style={styles.botonTexto}>Enviar</Text>
            </Pressable>
            <Pressable onPress={props.onCancelMotivo}>
              <Text style={styles.confirmado}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}