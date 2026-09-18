import { onSchedule } from "firebase-functions/v2/scheduler";
import { getFirestore } from "firebase-admin/firestore";
import { createDailySessions } from "./crearSesionesDiarias.logica";
import { notifyRoom } from "../notificaciones/sala-notificaciones";


export const openCheckIn = onSchedule(
  {
    schedule: "00 19 * * *",
    timeZone: "America/Guayaquil",
  },
  async () => {
    await createDailySessions(getFirestore(), new Date(), (salaId) =>
      notifyRoom(salaId, "Check-in abierto", "Ya puedes iniciar la sesión de hoy."),
    );
  },
);