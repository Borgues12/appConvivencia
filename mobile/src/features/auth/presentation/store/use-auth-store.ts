//@/features/auth/presentation/store/use-auth-store.ts
import { create } from "zustand";
import { User } from "firebase/auth";
import { createIfNotExists } from "../../data/usuario.repository";
import { Usuario } from "../../domain/usuario.schema";

interface AuthState {
  user: User | null;
  usuario: Usuario | null;
  isLoading: boolean;
  setUser: (user: User | null) => Promise<void>;
  setUsuario: (usuario: Usuario | null) => void;
  actualizarUsuario: (cambios: Partial<Usuario>) => void;

  setLoading: (loading: boolean) => void;
}

// VARIABLE: sirve para almacenar el estado de la app
// y crea un usuario en la base si no existe
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  usuario: null,
  isLoading: true,
  setUser: async (user) => {
    if (user) {
      const usuario = await createIfNotExists(user.uid, {
        userDisplayName: user.displayName,
        userPhotoURL: user.photoURL,
        userEmail: user.email ?? "",
        userSalaActualId: null,
      });
      set({ user, usuario, isLoading: false });
    } else {
      set({ user: null, usuario: null, isLoading: false });
    }
  },
  setUsuario: (usuario) => set({ usuario }),
  actualizarUsuario: (cambios) =>
    set((state) => ({
      usuario: state.usuario ? { ...state.usuario, ...cambios } : state.usuario,
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));
