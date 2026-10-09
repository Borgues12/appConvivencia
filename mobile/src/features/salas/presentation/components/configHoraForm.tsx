// features/salas/presentation/components/ConfigHoraForm/ConfigHoraForm.tsx
import { useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { colores } from "../../../../core/theme/tema";
import { Sesion } from "../../../sesiones/domain/sesion.domain";
import {
  dateToTimeString,
  timeStringToDate,
} from "../../../../core/utils/hora";
import { styles } from "./styles/configHoraForm.styles";

//Estados que bloquean el cambio de hora
const ESTADOS_BLOQUEAN_CAMBIO_HORA: Sesion["sesionEstado"][] = [
  "pendiente",
  "en_curso",
  "aplazada",
];

type ConfigHoraFormProps = {
  esAdmin: boolean;
  salaHoraInicio: string;
  mostrandoConfigHora: boolean;
  setMostrandoConfigHora: (valor: boolean) => void;
  horaInicioInput: string;
  setHoraInicioInput: (valor: string) => void;
  guardandoHora: boolean;
  errorHora: string | null;
  handleGuardarHora: () => void;
  sesionEstado: Sesion | null;
};

export function ConfigHoraForm({
  esAdmin,
  salaHoraInicio,
  mostrandoConfigHora,
  setMostrandoConfigHora,
  horaInicioInput,
  setHoraInicioInput,
  guardandoHora,
  errorHora,
  handleGuardarHora,
  sesionEstado,
}: ConfigHoraFormProps) {
  const [mostrandoPicker, setMostrandoPicker] = useState(false);

  // solo admins pueden modificar la hora de inicio
  if (!esAdmin) return null;

  const estaBloqueado = Boolean(
    sesionEstado &&
      ESTADOS_BLOQUEAN_CAMBIO_HORA.includes(sesionEstado.sesionEstado),
  );

  const handleChangePicker = (evento: DateTimePickerEvent, fecha?: Date) => {
    setMostrandoPicker(false); // en Android el diálogo se cierra solo
    if (evento.type === "set" && fecha) {
      setHoraInicioInput(dateToTimeString(fecha));
    }
  };

  if (!mostrandoConfigHora) {
    return (
      <TouchableOpacity
        style={[styles.boton, estaBloqueado && styles.botonDesactivado]}
        disabled={estaBloqueado}
        onPress={() => {
          setHoraInicioInput(salaHoraInicio);
          setMostrandoConfigHora(true);
        }}
      >
        <Ionicons
          name="time-outline"
          size={20}
          color={colores.acentoSecundario}
        />
        <Text style={styles.botonTexto}>Hora de inicio: {salaHoraInicio}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.form}>
      <TouchableOpacity
        style={styles.selectorHora}
        onPress={() => setMostrandoPicker(true)}
        disabled={guardandoHora}
      >
        <Ionicons
          name="time-outline"
          size={22}
          color={colores.acentoSecundario}
        />
        <Text style={styles.selectorHoraTexto}>{horaInicioInput}</Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color={colores.acentoSecundario}
        />
      </TouchableOpacity>

      {mostrandoPicker && (
        <DateTimePicker
          value={timeStringToDate(horaInicioInput)}
          mode="time"
          is24Hour
          display="default"
          onChange={handleChangePicker}
        />
      )}

      {errorHora && <Text style={styles.textoError}>{errorHora}</Text>}

      <View style={styles.filaBotones}>
        <Button
          title={guardandoHora ? "Guardando..." : "Guardar"}
          onPress={handleGuardarHora}
          disabled={guardandoHora}
        />
        <Button
          title="Volver"
          onPress={() => setMostrandoConfigHora(false)}
          disabled={guardandoHora}
        />
      </View>
    </View>
  );
}