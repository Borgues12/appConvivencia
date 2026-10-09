// features/salas/presentation/components/CancelarSesionForm/CancelarSesionForm.styles.ts
import { StyleSheet } from "react-native";
import { colores } from "../../../../core/theme/tema";

export const styles = StyleSheet.create({
  boton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  botonTexto: {
    color: colores.acentoSecundario,
    fontWeight: "600",
  },
  form: {
    marginTop: 12,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colores.acentoSecundario,
    borderRadius: 6,
    padding: 8,
    minHeight: 60,
    textAlignVertical: "top",
  },
  filaBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});