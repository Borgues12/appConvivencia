import type { Firestore } from "firebase-admin/firestore";
import type { Notificador } from "../../notificaciones/sala-notificaciones";
import { getEcuadorDate, getEcuadorMinutes, parseTimeToMinutes } from "../../shared/hora";
import { MINUTOS_CIERRE, MINUTOS_RETRASO } from "../../shared/tiempo-sesion";

// FUNCIÓN: avisa una sola vez por sesión cuando entra la ventana de retraso
export async function notifyLateWindow(
  db: Firestore,
  ahora: Date,
  notificar: Notificador,
): Promise<number> {
  const fechaHoy = getEcuadorDate(ahora);
  const minutosAhora = getEcuadorMinutes(ahora);

  const sesionesSnapshot = await db
    .collection("sesiones")
    .where("sesionFecha", "==", fechaHoy)
    .where("sesionEstado", "==", "en_curso")
    .get();

  let avisos = 0;

  for (const sesionDoc of sesionesSnapshot.docs) {
    const sesion = sesionDoc.data();
    if (sesion.sesionRetrasoNotificado === true) continue;

    const minutosInicio = parseTimeToMinutes(sesion.sesionHoraInicio);
    const entraEnRetraso = minutosAhora >= minutosInicio + MINUTOS_RETRASO;
    const yaVencida = minutosAhora >= minutosInicio + MINUTOS_CIERRE;
    if (!entraEnRetraso || yaVencida) continue;

    // se marca ANTES de notificar: si el envío falla se pierde un aviso,
    // pero no se repite cada minuto
    await sesionDoc.ref.update({ sesionRetrasoNotificado: true });
    try {
      await notificar(
        sesion.sesionSalaId,
        "Ventana de retraso",
        `Pasaron ${MINUTOS_RETRASO} minutos: ahora el check-in cuenta como retraso y exige motivo.`,
      );
    } catch (error) {
      console.warn(`Aviso de retraso fallido para sala_${sesion.sesionSalaId}:`, error);
    }
    avisos++;
  }

  return avisos;
}