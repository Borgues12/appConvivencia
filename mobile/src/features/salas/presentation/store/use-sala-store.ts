// mobile/src/features/salas/presentation/store/use-sala-store.ts
import { create } from "zustand";
import {
  HoraInicioSchema,
  type Sala,
  type SalaPreview,
} from "../../domain/sala.domain";
import {
  createRoom,
  findByInvitationCode,
  getRoomById,
  joinRoom,
  leaveRoom,
  updateStartTime,
} from "../../data/salas.repository";
import { updateUserRoom } from "../../../auth/data/usuario.repository";
import { useAuthStore } from "../../../auth/presentation/store/use-auth-store";
import {
  subscribeToRoomTopic,
  unsubscribeFromRoomTopic,
} from "../../../../shared/services/notificaciones.service";

//MODELO: para representar el estado de la sala
interface SalaState {
  sala: Sala | SalaPreview | null;
  isLoading: boolean;
  error: string | null;
  obtenerSala: (salaId: string) => Promise<Sala | null>;
  crear: (salaNombre: string, adminUid: string) => Promise<void>;
  unirse: (salaCodigoInvitacion: string, userUid: string) => Promise<void>;
  updateStartTime: (salaId: string, salaHoraInicio: string) => Promise<void>;
  salirDeSala: (salaId: string, userUid: string) => Promise<void>;
}

// VARIABLE: sirve para almacenar el estado de la sala
export const useSalaStore = create<SalaState>((set) => ({
  sala: null,
  isLoading: false,
  error: null,
  obtenerSala: async (salaId: string) => {
    set({ isLoading: true });
    try {
      const salaData = await getRoomById(salaId);
      set({ sala: salaData });
      return salaData;
    } finally {
      set({ isLoading: false });
    }
  },
  crear: async (salaNombre, adminUid) => {
    set({ isLoading: true, error: null });
    try {
      const nuevaSala = await createRoom(salaNombre, adminUid);
      console.log("[crear sala] 1 sala creada ok");
      await updateUserRoom(adminUid, nuevaSala.salaId);
      console.log("[crear sala] 2 updateUserRoom ok");
      //suscribirse al topic para recibir notificaciones
      subscribeToRoomTopic(nuevaSala.salaId).catch((e) =>
        console.warn("No se pudo suscribir al topic:", e),
      );
      console.log("[crear sala] 3 suscripción al topic ok");
      useAuthStore.getState().setUsuario({
        ...useAuthStore.getState().usuario!,
        userSalaActualId: nuevaSala.salaId,
      });
      console.log("[crear sala] 4 usuario actualizado ok");
      set({ sala: nuevaSala, isLoading: false });
    } catch (err) {
      console.error("[crear sala] stack:", (err as Error).stack);
      set({ error: "No se pudo crear la sala", isLoading: false });
    }
  },
  unirse: async (salaCodigoInvitacion, userUid) => {
    set({ isLoading: true, error: null });
    try {
      console.log("[unirse] buscando código");
      const sala = await findByInvitationCode(salaCodigoInvitacion);
      console.log("[unirse] sala encontrada:", sala?.salaId);
      if (!sala) {
        set({ error: "No existe una sala con ese código", isLoading: false });
        return;
      }
      await joinRoom(sala.salaId, userUid);
      console.log("[unirse] joinRoom ok");
      await updateUserRoom(userUid, sala.salaId);
      console.log("[unirse] updateUserRoom ok");
      //suscribirse al topic para recibir notificaciones
      subscribeToRoomTopic(sala.salaId).catch((e) =>
        console.warn("No se pudo suscribir al topic:", e),
      );
      //actualizar el userSalaActualId de el usuario en el store
      useAuthStore.getState().setUsuario({
        ...useAuthStore.getState().usuario!,
        userSalaActualId: sala.salaId,
      });
      set({ sala, isLoading: false });
    } catch (err) {
      console.error("Error al unirse a sala:", err);
      set({ error: "No se pudo unir a la sala", isLoading: false });
    }
  },
  // METODO: cambia la hora de inicio de la sala (solo admin, lo exige la regla de Firestore)
  async updateStartTime(salaId, salaHoraInicio) {
    const resultado = HoraInicioSchema.safeParse(salaHoraInicio);
    if (!resultado.success) {
      throw new Error(resultado.error.issues[0].message);
    }

    await updateStartTime(salaId, resultado.data);

    // Actualiza la sala en memoria; si ya la recibes por listener, esta línea sobra
    set((estado) =>
      estado.sala
        ? { sala: { ...estado.sala, salaHoraInicio: resultado.data } }
        : {},
    );
  },

  salirDeSala: async (salaId: string, userUid: string) => {
    await leaveRoom(salaId, userUid);
    unsubscribeFromRoomTopic(salaId).catch((e) =>
      console.warn("No se pudo desuscribir del topic:", e),
    );
    set({ sala: null });
  },
}));
