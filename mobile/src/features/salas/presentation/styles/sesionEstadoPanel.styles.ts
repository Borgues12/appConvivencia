// features/salas/presentation/components/SesionEstadoPanel/SesionEstadoPanel.styles.ts
import { StyleSheet } from "react-native";
import { colores } from "../../../../core/theme/tema";

export const styles = StyleSheet.create({
  botonIniciar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  botonIniciarTexto: {
    color: colores.textoSobreFondo,
    fontWeight: "600",
  },
  pinContenedor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  pinLabel: {
    color: colores.fondo,
  },
  pinValor: {
    fontSize: 22,
    fontWeight: "700",
    color: colores.fondo,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  infoTexto: {
    color: colores.acentoSecundario,
  },
});