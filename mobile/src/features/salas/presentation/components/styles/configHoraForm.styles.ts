// features/salas/presentation/components/ConfigHoraForm/ConfigHoraForm.styles.ts
import { StyleSheet } from "react-native";
import { colores } from "../../../../../core/theme/tema";

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
  },
  textoError: {
    color: colores.error ?? "red",
  },
  filaBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botonDesactivado: {
    opacity: 0.5,
  },
  selectorHora: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colores.acentoSecundario,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  selectorHoraTexto: {
    fontSize: 28,
    letterSpacing: 2,
    color: colores.acentoSecundario,
  },
});
