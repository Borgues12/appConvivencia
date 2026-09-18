import type { Firestore } from "firebase-admin/firestore";

// Firma del notificador: el disparador real pasa FCM, el script local pasa un console.log
// TYPE: la firma del notificador
export type Notificador = (salaId: string) => Promise<void>;

// FUNCIÓN: devuelve la fecha en Ecuador en formato YYYY-MM-DD
export function getEcuadorDate(ahora: Date): string {
  return ahora.toLocaleDateString("en-CA", {
    timeZone: "America/Guayaquil",
  }); // YYYY-MM-DD
}

// FUNCION: crea las sesiones diarias para todas las salas
export async function createDailySessions(
  db: Firestore,
  ahora: Date,
  notificar: Notificador,
): Promise<number> {
  const fecha = getEcuadorDate(ahora);
  const salasSnapshot = await db.collection("salas").get();
  let sesionesCreadas = 0;

  for (const salaDoc of salasSnapshot.docs) {
    const salaId = salaDoc.id;

    const existente = await db
      .collection("sesiones")
      .where("sesionSalaId", "==", salaId)
      .where("sesionFecha", "==", fecha)
      .limit(1)
      .get();

    if (!existente.empty) continue;

    const sesionRef = db.collection("sesiones").doc();
    await sesionRef.set({
      sesionId: sesionRef.id,
      sesionSalaId: salaId,
      sesionEstado: "pendiente",
      sesionPin: null,
      sesionIniciadaPorUid: null,
      sesionFecha: fecha,
      sesionCreadaEn: ahora,
      sesionCanceladaPorUid: null,
      sesionCanceladaMotivo: null,
    });
    sesionesCreadas++;

    try {
      await notificar(salaId);
    } catch (error) {
      console.warn(`Notificación fallida para sala_${salaId}:`, error);
    }
  }

  return sesionesCreadas;
}