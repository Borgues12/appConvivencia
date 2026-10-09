import { useCallback, useEffect, useState } from "react";
import { AppState, Platform } from "react-native";

import {
  hasNotificationPermission,
  requestNotificationPermission,
  openNotificationSettings,
  subscribeToRoomTopic,
} from "../../../../shared/services/notificaciones.service";
import { useAuthStore } from "../../../auth/presentation/store/use-auth-store";

export function useNotificacionesSala() {
  const userUid = useAuthStore((s) => s.usuario?.userUid);
  const salaId = useAuthStore((s) => s.usuario?.userSalaActualId);
  const [permitido, setPermitido] = useState(true);

  // Verifica el permiso al entrar y al volver a primer plano
  useEffect(() => {
    if (Platform.OS === "web" || !userUid) return;

    const verificar = async () => {
      const resultado = await hasNotificationPermission();
      console.log("[notif] permiso verificado:", resultado);
      setPermitido(resultado);
    };

    console.log("[notif] iniciando verificación, uid:", userUid);
    verificar();

    const sub = AppState.addEventListener("change", (estado) => {
      console.log("[notif] AppState:", estado);
      if (estado === "active") verificar();
    });
    return () => sub.remove();
  }, [userUid]);

  // El topic no depende del permiso
  useEffect(() => {
    if (Platform.OS === "web" || !userUid || !salaId) return;
    console.log("[notif] suscribiendo a sala_" + salaId);
    subscribeToRoomTopic(salaId)
      .then(() => console.log("[notif] suscrito a sala_" + salaId))
      .catch((e) => console.warn("[notif] fallo al suscribir:", e));
  }, [userUid, salaId]);

  // Acción del botón: intenta el diálogo; si no se concede, manda a Ajustes
  const enableNotifications = useCallback(async () => {
    console.log("[notif] usuario pulsó Activar");
    try {
      await requestNotificationPermission();
    } catch (e) {
      console.warn("[notif] requestPermission lanzó error:", e);
    }

    const real = await hasNotificationPermission();
    console.log("[notif] permiso real tras pedir:", real);
    if (real) {
      setPermitido(true);
      return;
    }

    console.log("[notif] sigue denegado, abriendo Ajustes");
    try {
      await openNotificationSettings();
    } catch (e) {
      console.warn("[notif] openSettings falló:", e);
    }
  }, []);

  return { permitido, enableNotifications };
}
