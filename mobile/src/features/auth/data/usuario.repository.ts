import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../../shared/services/firebase';
import {
  UsuarioSchema,
  CrearUsuarioSchema,
  type Usuario,
  type CrearUsuarioInput,
} from '../domain/usuario.schema';

const COLECCION = 'usuarios';

// MÉTODO: busca un usuario por userUid. Retorna null si no existe.
export async function findyByUserUid(userUid: string): Promise<Usuario | null> {
  const ref = doc(db, COLECCION, userUid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = { userUid, ...snap.data() };
  return UsuarioSchema.parse(data);
}

// MÉTODO: crea el documento de usuario solo si no existe todavía
export async function createIfNotExists(
  userUid: string,
  datos: CrearUsuarioInput
): Promise<Usuario> {
  const existente = await findyByUserUid(userUid);
  if (existente) return existente;

  const datosValidados = CrearUsuarioSchema.parse(datos);
  const ref = doc(db, COLECCION, userUid);

  await setDoc(ref, {
    ...datosValidados,
    creadoEn: serverTimestamp(),
  });

  return { userUid, ...datosValidados };
}

// MÉTODO: actualiza la sala actual del usuario
export async function updateUserRoom(userUid: string, salaId: string): Promise<void> {
  const ref = doc(db, COLECCION, userUid);
  await updateDoc(ref, { userSalaActualId: salaId });
}