import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { getFirestore } from "firebase-admin/firestore";
import { createLateFault } from "./logica/crearFaltaRetraso.logica";

//TRIGGER: cuando se crea un check-in con estado "retraso", se genera la falta correspondiente
export const tardiness = onDocumentCreated(
  "sesiones/{sesionId}/checkins/{userUid}",
  async (event) => {
    const checkin = event.data?.data();
    if (!checkin || checkin.checkinEstado !== "retraso") return;

    await createLateFault(
      getFirestore(),
      event.params.sesionId,
      event.params.userUid,
      String(checkin.checkinMotivo ?? ""),
    );
  },
);