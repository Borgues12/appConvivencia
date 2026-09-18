import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import {
  SalaSchema,
  CrearSalaSchema,
  type Sala,
  SalaPreview,
  SalaPreviewSchema,
} from "../domain/sala.schema";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db, firebaseApp } from "../../../shared/services/firebase";
import { FindRoomByCodeRequest, FindRoomByCodeResponse } from "./dto/salas.dto";
import { COLLECTIONS } from "../../../core/utils/colecciones";

const functions = getFunctions(firebaseApp);

// MÉTODO: genera un código de invitación de 6 caracteres alfanuméricos
function generateInvitationCode(): string {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let codigo = "";
  for (let i = 0; i < 6; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

// MÉTODO: obtiene una sala por su id
export async function getRoomById(salaId: string): Promise<Sala | null> {
  const ref = doc(db, COLLECTIONS.SALAS, salaId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return SalaSchema.parse({ salaId: snap.id, ...snap.data() });
}

// MÉTODO: crea una sala nueva, el creador queda como admin y primer miembro
export async function createRoom(
  salaNombre: string,
  adminUid: string,
): Promise<Sala> {
  const datos = CrearSalaSchema.parse({
    salaNombre,
    salaCodigoInvitacion: generateInvitationCode(),
    salaAdminUid: adminUid,
    salaMiembros: [adminUid],
  });

  const ref = doc(collection(db, COLLECTIONS.SALAS));
  await setDoc(ref, datos);

  return SalaSchema.parse({ salaId: ref.id, ...datos });
}

// MÉTODO: busca una sala por su código de invitación, via Cloud Functions
export async function findByInvitationCode(
  salaCodigoInvitacion: string,
): Promise<SalaPreview | null> {
  const callable = httpsCallable<FindRoomByCodeRequest, FindRoomByCodeResponse>(
    functions,
    "findRoomByCode",
  );

  const result = await callable({ salaCodigoInvitacion });

  if (!result.data.sala) return null;

  return SalaPreviewSchema.parse(result.data.sala);
}

// MÉTODO: agrega un userUid al array de miembros de una sala
export async function joinRoom(salaId: string, userUid: string): Promise<void> {
  const ref = doc(db, "salas", salaId);
  await updateDoc(ref, {
    salaMiembros: arrayUnion(userUid),
  });
}

// MÉTODO: remueve al usuario de la sala, transfiere admin si corresponde, y limpia su referencia activa
export async function leaveRoom(
  salaId: string,
  userUid: string,
): Promise<void> {
  const salaRef = doc(db, COLLECTIONS.SALAS, salaId);
  const usuarioRef = doc(db, COLLECTIONS.USUARIOS, userUid);

  //llama desde la query porque es miembro y las firebase rules no lo restringen
  const salaSnap = await getDoc(salaRef);
  if (!salaSnap.exists()) {
    throw new Error("La sala no existe");
  }

  const salaData = salaSnap.data();
  const salaMiembros: string[] = salaData.salaMiembros;
  const esAdmin = salaData.salaAdminUid === userUid;

  if (esAdmin && salaMiembros.length <= 1) {
    throw new Error("No puedes salir siendo el único miembro de la sala");
  }

  const salaUpdate: Record<string, unknown> = {
    salaMiembros: arrayRemove(userUid),
  };

  if (esAdmin) {
    const siguienteAdminUid = salaMiembros.find((uid) => uid !== userUid);
    if (!siguienteAdminUid) {
      throw new Error("No se pudo determinar el siguiente admin");
    }
    salaUpdate.salaAdminUid = siguienteAdminUid;
  }

  const batch = writeBatch(db);
  batch.update(salaRef, salaUpdate);
  batch.update(usuarioRef, {
    userSalaActualId: null,
  });

  await batch.commit();
}
