import { Firestore } from "firebase-admin/firestore";

// FUNCIÓN: agrega al batch la creación de un registro de falta
export function addFaultToBatch(
  db: Firestore,
  batch: FirebaseFirestore.WriteBatch,
  datos: { sesionId: string; salaId: string; fecha: string; userUid: string; tipo: "ausencia" | "abandono" | "retraso"; motivo: string | null },
) {
  const faltaRef = db.collection("faltas").doc(`${datos.sesionId}_${datos.userUid}`);
  batch.set(faltaRef, {
    faltaId: faltaRef.id,
    faltaUserUid: datos.userUid,
    faltaSalaId: datos.salaId,
    faltaSesionId: datos.sesionId,
    faltaFecha: datos.fecha,
    faltaTipo: datos.tipo,
    faltaMotivo: datos.motivo,
    faltaEstado: "activa",
  });
}