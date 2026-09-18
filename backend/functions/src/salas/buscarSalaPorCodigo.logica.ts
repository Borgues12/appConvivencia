import type { Firestore } from "firebase-admin/firestore";

export interface SalaPublica {
  salaId: string;
  salaNombre: string;
  salaCodigoInvitacion: string;
}


export async function findRoomByInvitationCode(
  db: Firestore,
  salaCodigoInvitacion: string,
): Promise<SalaPublica | null> {
  const snapshot = await db
    .collection("salas")
    .where("salaCodigoInvitacion", "==", salaCodigoInvitacion)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    salaId: doc.id,
    salaNombre: doc.data().salaNombre,
    salaCodigoInvitacion: doc.data().salaCodigoInvitacion,
  };
}