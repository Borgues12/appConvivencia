import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  contenedor: {
    position: "absolute",
    left: 12,
    right: 12,
    zIndex: 1000,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#c9a227",
  },
  texto: { flex: 1, color: "#f5f0e1", fontSize: 13 },
  boton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: "#c9a227",
  },
  botonTexto: { color: "#1a1a1a", fontWeight: "600" },
});