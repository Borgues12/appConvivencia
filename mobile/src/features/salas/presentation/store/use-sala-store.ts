import { create } from "zustand";
import type { Sala, SalaPreview } from "../../domain/sala.schema";
import {
  createRoom,
  findByInvitationCode,
  joinRoom,
} from "../../data/salas.repository";
import { updateUserRoom } from "../../../auth/data/usuario.repository";
import { useAuthStore } from "../../../auth/presentation/store/use-auth-store";

//MODELO: para representar el estado de la sala
interface SalaState {
  sala: Sala | SalaPreview | null;
  isLoading: boolean;
  error: string | null;
  crear: (salaNombre: string, adminUid: string) => Promise<void>;
  unirse: (salaCodigoInvitacion: string, userUid: string) => Promise<void>;
}

// VARIABLE: sirve para almacenar el estado de la sala
export const useSalaStore = create<SalaState>((set) => ({
  sala: null,
  isLoading: false,
  error: null,
  crear: async (salaNombre, adminUid) => {
    set({ isLoading: true, error: null });
    try {
      const nuevaSala = await createRoom(salaNombre, adminUid);
      await updateUserRoom(adminUid, nuevaSala.salaId); 
      useAuthStore.getState().setUsuario({
        ...useAuthStore.getState().usuario!,
        userSalaActualId: nuevaSala.salaId,
      });
      set({ sala: nuevaSala, isLoading: false });
    } catch (err) {
      set({ error: "No se pudo crear la sala", isLoading: false });
    }
  },
  unirse: async (salaCodigoInvitacion, userUid) => {
    set({ isLoading: true, error: null });
    try {
      const sala = await findByInvitationCode(salaCodigoInvitacion);
      if (!sala) {
        set({ error: "No existe una sala con ese código", isLoading: false });
        return;
      }
      await joinRoom(sala.salaId, userUid);
      await updateUserRoom(userUid, sala.salaId);
      //actualizar el userSalaActualId de el usuario en el store
      useAuthStore.getState().setUsuario({
        ...useAuthStore.getState().usuario!,
        userSalaActualId: sala.salaId,
      });
      set({ sala, isLoading: false });
    } catch (err) {
      console.error('Error al unirse a sala:', err); 
      set({ error: "No se pudo unir a la sala", isLoading: false });
    }
  },
}));
