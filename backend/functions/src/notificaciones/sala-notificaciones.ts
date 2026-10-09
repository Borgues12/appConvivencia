// functions/src/notificaciones/sala-notificaciones.ts
import { getMessaging } from "firebase-admin/messaging";

//FUNCIÓN: envia una notificacion a la sala sobre un evento
export async function notifyRoom(
  salaId: string,
  titulo: string,
  cuerpo: string,
): Promise<void> {
  await getMessaging().send({
    topic: `sala_${salaId}`,
    notification: { title: titulo, body: cuerpo },
    android: { priority: "high" },
  });
}

export type Notificador = (
  salaId: string,
  titulo: string,
  cuerpo: string,
) => Promise<void>;
