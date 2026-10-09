import { onSchedule } from "firebase-functions/v2/scheduler";
import { getFirestore } from "firebase-admin/firestore";
import { notifyRoom } from "../notificaciones/sala-notificaciones";
import { createDailySessions } from "./logica/crearSesionesDiarias.logica";
import { notifyLateWindow } from "./logica/retrasoNotificacion.logica";
import { closeExpiredSessions } from "./logica/cerrarSesionesAutomatico.logica";

export const runSessionTick = onSchedule(
  {
    schedule: "every 1 minutes",
    timeZone: "America/Guayaquil",
    maxInstances: 1,
    timeoutSeconds: 60,
  },
  async () => {
    const db = getFirestore();
    const ahora = new Date(); // la única llamada al reloj real

    const pasos: Array<[string, () => Promise<unknown>]> = [
      ["apertura", () => createDailySessions(db, ahora, notifyRoom)],
      ["retraso", () => notifyLateWindow(db, ahora, notifyRoom)],
      ["cierre", () => closeExpiredSessions(db, ahora, notifyRoom)],
    ];

    const resumen: Record<string, unknown> = {};

    for (const [nombre, ejecutar] of pasos) {
      try {
        await ejecutar();
      } catch (e) {
        resumen[nombre] = "ERROR";
        console.error(`[tick] falló ${nombre}:`, e);
      }
    }
    console.log("[tick] resumen", JSON.stringify(resumen));
  },
);
