// features/sesiones/presentation/components/TableroPin.styles.ts
import { StyleSheet } from "react-native";

// TODO: reemplazar por tokens de core/tema/ (los nombres reales no los conozco)
const COLOR_FONDO = "#1a1a1a";
const COLOR_ORO = "#c9a227";
const COLOR_TEXTO = "#f2ead3";
const COLOR_ERROR = "#d9534f";

export const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: COLOR_FONDO,
    borderWidth: 1,
    borderColor: COLOR_ORO,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  titulo: { color: COLOR_ORO, fontSize: 16, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: COLOR_ORO,
    borderRadius: 6,
    color: COLOR_TEXTO,
    fontSize: 28,
    letterSpacing: 12,
    textAlign: "center",
    paddingVertical: 10,
  },
  error: { color: COLOR_ERROR, fontSize: 13 },
  boton: {
    backgroundColor: COLOR_ORO,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
  },
  botonDeshabilitado: { opacity: 0.4 },
  botonTexto: { color: COLOR_FONDO, fontWeight: "700" },
  confirmado: { color: COLOR_ORO, textAlign: "center", fontSize: 15 },
  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 24,
  },
  modalCaja: {
    backgroundColor: COLOR_FONDO,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  inputMotivo: {
    borderWidth: 1,
    borderColor: COLOR_ORO,
    borderRadius: 6,
    color: COLOR_TEXTO,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },
});