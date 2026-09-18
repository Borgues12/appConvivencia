// shared/alertas/presentation/AlertaHost.tsx
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { AlertaTipo } from "../alertas.schema";
import { bordes, colores, espaciado, tipografia } from "../../../core/theme/tema";
import { useAlertaStore } from "../store/use-alerta.store";


const coloresPorTipo: Record<AlertaTipo, string> = {
  error: colores.error,
  exito: colores.exito,
  info: colores.info,
  advertencia: colores.advertencia,
};

export function AlertaHost() {
  const alertaActual = useAlertaStore((state) => state.alertaActual);
  const ocultarAlerta = useAlertaStore((state) => state.ocultarAlerta);
  const opacidad = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!alertaActual) return;

    Animated.timing(opacidad, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(opacidad, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => ocultarAlerta());
    }, alertaActual.alertaDuracionMs);

    return () => clearTimeout(timer);
  }, [alertaActual, opacidad, ocultarAlerta]);

  if (!alertaActual) return null;

  return (
    <Animated.View
      style={[
        estilos.contenedor,
        {
          backgroundColor: colores.fondo,
          borderColor: coloresPorTipo[alertaActual.alertaTipo],
          opacity: opacidad,
        },
      ]}
    >
      <View style={[estilos.franjaAcento, { backgroundColor: coloresPorTipo[alertaActual.alertaTipo] }]} />
      <Text style={estilos.mensaje}>{alertaActual.alertaMensaje}</Text>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    position: "absolute",
    top: 50,
    left: espaciado.md,
    right: espaciado.md,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: bordes.radioChato,
    borderWidth: bordes.anchoLinea,
    paddingVertical: espaciado.sm,
    paddingHorizontal: espaciado.md,
    zIndex: 999,
    elevation: 999,
  },
  franjaAcento: {
    width: 3,
    alignSelf: "stretch",
    borderRadius: bordes.radioChato,
    marginRight: espaciado.sm,
  },
  mensaje: {
    ...tipografia.cuerpo,
    color: colores.textoSobreFondo,
    flex: 1,
  },
});