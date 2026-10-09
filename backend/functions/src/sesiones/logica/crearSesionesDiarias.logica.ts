import type { Firestore } from "firebase-admin/firestore";
import type { Notificador } from "../../notificaciones/sala-notificaciones";
import {
  getEcuadorDate,
  getEcuadorMinutes,
  parseTimeToMinutes,
} from "../../shared/hora";
import {
  ANTICIPACION_MINUTOS,
  HORA_INICIO_POR_DEFECTO,
  MINUTOS_CIERRE,
} from "../../shared/tiempo-sesion";

// FUNCION: crea las sesiones diarias para todas las salas
export async function createDailySessions(
  db: Firestore,
  ahora: Date,
  notificar: Notificador,
): Promise<number> {
  const fecha = getEcuadorDate(ahora);
  const minutosAhora = getEcuadorMinutes(ahora);
  const salasSnapshot = await db.collection("salas").get();
  let sesionesCreadas = 0;

  for (const salaDoc of salasSnapshot.docs) {
    const salaId = salaDoc.id;

    // La sala debe tener hora de inicio y estar abierta
    const salaHoraInicio: string =
      salaDoc.data().salaHoraInicio ?? HORA_INICIO_POR_DEFECTO;
    const minutosInicio = parseTimeToMinutes(salaHoraInicio);
    const minutosApertura = minutosInicio - ANTICIPACION_MINUTOS;
    const minutosCierre = minutosInicio + MINUTOS_CIERRE;

    // Aún no es hora de abrir
    if (minutosAhora < minutosApertura) continue;

    const existente = await db
      .collection("sesiones")
      .where("sesionSalaId", "==", salaId)
      .where("sesionFecha", "==", fecha)
      .limit(1)
      .get();

    if (!existente.empty) continue;

    const fueraDeVentana = minutosAhora >= minutosCierre;

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
      sesionHoraInicio: salaHoraInicio,
      sesionRetrasoNotificado: false,
    });
    sesionesCreadas++;

    // Si ya pasó la hora de cierre, no se notifica
    if (fueraDeVentana) continue;

    try {
      await notificar(
        salaId,
        "Sesión del día abierta",
        `La sesión de hoy es a las ${salaHoraInicio}. Ya puedes iniciarla.`,
      );
    } catch (error) {
      console.warn(`Notificación fallida para sala_${salaId}:`, error);
    }
  }

  return sesionesCreadas;
}
