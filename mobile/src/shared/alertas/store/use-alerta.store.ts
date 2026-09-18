// shared/alertas/store/use-alerta-store.ts
import { create } from "zustand";
import { Alerta, AlertaTipo } from "../alertas.schema";


interface AlertaState {
  alertaActual: Alerta | null;
  mostrarAlerta: (params: { tipo: AlertaTipo; mensaje: string; duracionMs?: number }) => void;
  ocultarAlerta: () => void;
}

// VARIABLE: sirve para almacenar y disparar alertas globales de la app
export const useAlertaStore = create<AlertaState>((set) => ({
  alertaActual: null,

  mostrarAlerta: ({ tipo, mensaje, duracionMs = 4000 }) => {
    set({
      alertaActual: {
        alertaId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        alertaTipo: tipo,
        alertaMensaje: mensaje,
        alertaDuracionMs: duracionMs,
      },
    });
  },

  ocultarAlerta: () => set({ alertaActual: null }),
}));