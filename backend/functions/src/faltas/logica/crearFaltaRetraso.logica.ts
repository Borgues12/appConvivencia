// backend/functions/src/faltas/crearFaltaRetraso.logica.ts
import type { Firestore } from "firebase-admin/firestore";

const CODIGO_YA_EXISTE = 6; // código gRPC ALREADY_EXISTS

// FUNCIÓN: crea la falta por retraso de un check-in tardío
export async function createLateFault(
  db: Firestore,
  sesionId: string,
  userUid: string,
  checkinMotivo: string,
): Promise<boolean> {
  const sesionDoc = await db.collection("sesiones").doc(sesionId).get();
  if (!sesionDoc.exists) return false;
  const sesion = sesionDoc.data()!;

  const faltaRef = db.collection("faltas").doc(`${sesionId}_${userUid}`);
  try {
    // create() falla si el documento ya existe, así un reintento no pisa nada
    await faltaRef.create({
      faltaId: faltaRef.id,
      faltaUserUid: userUid,
      faltaSalaId: sesion.sesionSalaId,
      faltaSesionId: sesionId,
      faltaFecha: sesion.sesionFecha,
      faltaTipo: "retraso",
      faltaMotivo: checkinMotivo,
      faltaEstado: "activa",
    });
    return true;
  } catch (error) {
    if ((error as { code?: number }).code === CODIGO_YA_EXISTE) return false;
    throw error;
  }
}
