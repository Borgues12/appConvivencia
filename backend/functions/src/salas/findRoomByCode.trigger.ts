import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { findRoomByInvitationCode } from "./buscarSalaPorCodigo.logica";

export const findRoomByCode = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Debes iniciar sesión");
  }

  const { salaCodigoInvitacion } = request.data;
  if (!salaCodigoInvitacion || salaCodigoInvitacion.length !== 6) {
    throw new HttpsError("invalid-argument", "Código inválido");
  }

  const sala = await findRoomByInvitationCode(getFirestore(), salaCodigoInvitacion);
  return { sala };
});