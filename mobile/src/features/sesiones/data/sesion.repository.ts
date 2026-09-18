// features/sesiones/data/SesionRepository.ts

import {
  collection,
  doc,
  query,
  where,
  getDocs,
  setDoc,
  onSnapshot,
  Unsubscribe,
  updateDoc,
  runTransaction,
} from "firebase/firestore";

import { db } from "../../../shared/services/firebase";
import {
  CrearSesionInput,
  Sesion,
  SesionEnCurso,
  SesionEnCursoSchema,
  SesionSchema,
} from "../domain/sesion.domain";
import { COLLECTIONS } from "../../../core/utils/colecciones";

export const SesionRepository = {
  // METODO: obtener la sesión de hoy de una sala
  async getSesionDeHoy(salaId: string, fecha: string): Promise<Sesion | null> {
    const q = query(
      collection(db, COLLECTIONS.SESIONES),
      where("sesionSalaId", "==", salaId),
      where("sesionFecha", "==", fecha),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    return SesionSchema.parse({ sesionId: docSnap.id, ...docSnap.data() });
  },

  // METODO: crea la sesión en_curso, generando el PIN antes de llamar aquí
  async startSesion(input: CrearSesionInput): Promise<Sesion> {
    const docRef = doc(collection(db, COLLECTIONS.SESIONES));
    const sesion: Sesion = SesionSchema.parse({
      ...input,
      sesionId: docRef.id,
      sesionCreadaEn: new Date(),
    });

    await setDoc(docRef, sesion);
    return sesion;
  },

  // METODO: transiciona pendiente -> en_curso de forma atómica, evitando que
  // dos miembros inicien la sesión al mismo tiempo y se pisen el PIN
  async updateToEnCurso(
    sesionId: string,
    input: { sesionPin: string; sesionIniciadaPorUid: string },
  ): Promise<SesionEnCurso> {
    const sesionRef = doc(db, COLLECTIONS.SESIONES, sesionId);

    // Referencia a la subcolección: sesiones/{sesionId}/checkins/{userUid}
    const checkinRef = doc(
      collection(db, COLLECTIONS.SESIONES, sesionId, COLLECTIONS.CHECKINS),
      input.sesionIniciadaPorUid,
    );

    const resultado = await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(sesionRef);
      if (!snap.exists()) {
        throw new Error("La sesión no existe");
      }

      const actual = SesionSchema.parse({ sesionId: snap.id, ...snap.data() });
      if (actual.sesionEstado !== "pendiente") {
        // alguien más ya la inició (o está cancelada/aplazada) entre que
        // leíste el estado en el store y presionaste el botón
        throw new Error(
          "La sesión ya no está pendiente, alguien más la inició",
        );
      }

      const actualizada = {
        ...actual,
        sesionEstado: "en_curso" as const,
        sesionPin: input.sesionPin,
        sesionIniciadaPorUid: input.sesionIniciadaPorUid,
      };

      //1. actualiza la sesión en la coleccion sesiones/{sesionId}
      transaction.update(sesionRef, {
        sesionEstado: actualizada.sesionEstado,
        sesionPin: actualizada.sesionPin,
        sesionIniciadaPorUid: actualizada.sesionIniciadaPorUid,
      });
      // 2. Crear automáticamente el check-in del iniciador en la subcolección
      transaction.set(checkinRef, {
        checkinUserUid: input.sesionIniciadaPorUid,
        checkinEstado: "a_tiempo",
        checkinMotivo: null,
        checkinHora: new Date(),
      });
      return actualizada;
    });

    return SesionEnCursoSchema.parse(resultado);
  },

  
  //METODO: realizar el check-in de un usuario por PIN
  async checkIn(
    sesionId: string,
    userUid: string,
    estado: "a_tiempo" | "retraso" = "a_tiempo",
    motivo: string | null = null,
  ): Promise<void> {
    const checkinRef = doc(db, COLLECTIONS.SESIONES, sesionId, COLLECTIONS.CHECKINS, userUid);

    await setDoc(checkinRef, {
      checkinUserUid: userUid,
      checkinEstado: estado,
      checkinMotivo: motivo,
      checkinHora: new Date(),
    });
  },

  // METODO: suscribirse al check-in de un usuario
  suscribeToCheckin(
    sesionId: string,
    userUid: string,
    onUpdate: (existe: boolean) => void
  ) {
    const checkinRef = doc(db, "sesiones", sesionId, "checkins", userUid);
    return onSnapshot(checkinRef, (docSnap) => {
      onUpdate(docSnap.exists());
    });
  },

  // METODO: listener en tiempo real para la sesión de hoy de una sala
  subscribeToSesionDeHoy(
    salaId: string,
    fecha: string,
    callback: (sesion: Sesion | null) => void,
  ): Unsubscribe {
    const q = query(
      collection(db, COLLECTIONS.SESIONES),
      where("sesionSalaId", "==", salaId),
      where("sesionFecha", "==", fecha),
    );

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        callback(null);
        return;
      }
      const docSnap = snapshot.docs[0];
      callback(SesionSchema.parse({ sesionId: docSnap.id, ...docSnap.data() }));
    });
  },

  // METODO: cancelar la sesión por el admin
  async cancelarPorAdmin(
    sesionId: string,
    adminUid: string,
    motivo: string,
  ): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.SESIONES, sesionId), {
      sesionEstado: "cancelada",
      sesionCanceladaPorUid: adminUid,
      sesionCanceladaMotivo: motivo,
    });
  },
};
