// features/sesiones/presentation/sesion.store.ts

import { create } from "zustand";
import { Sesion } from "../../domain/sesion.domain";
import { SesionRepository } from "../../data/sesion.repository";
import { generatePin } from "../../domain/generate-pin";
import { doc, onSnapshot, setDoc } from "firebase/firestore";


interface SesionState {
  sesionActual: Sesion | null;
  sesionCargando: boolean;
  sesionError: string | null;

  //verificar que el usuario haya hecho check-in
  yaHiceCheckin: boolean;

  iniciarSesion: (salaId: string, userUid: string) => Promise<void>;
  cancelarSesionPorAdmin: (
    sesionId: string,
    userUid: string,
    motivo: string,
  ) => Promise<void>;

  CheckinForPin: (
    sesionId: string,
    userUid: string,
    pinIngresado: string,
  ) => Promise<void>;
  suscribeToMyCheckin: (sesionId: string, userUid: string) => () => void;
  suscribirseASesionDeHoy: (salaId: string) => () => void;
}

function getFechaHoy(): string {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

export const useSesionStore = create<SesionState>((set, get) => ({
  sesionActual: null,
  sesionCargando: false,
  sesionError: null,

  yaHiceCheckin: false,

  async iniciarSesion(salaId: string, userUid: string) {
    set({ sesionCargando: true, sesionError: null });
    try {
      const fecha = getFechaHoy();

      // evita doble inicio si ya existe una sesión activa hoy
      const existente = await SesionRepository.getSesionDeHoy(salaId, fecha);
      // ya en_curso: alguien más la inició mientras tanto, solo reflejamos el estado
      if (existente?.sesionEstado === "en_curso") {
        set({ sesionActual: existente, sesionCargando: false });
        return;
      }

      // pendiente: transición atómica vía transacción, protege contra doble inicio
      if (existente?.sesionEstado === "pendiente") {
        const actualizada = await SesionRepository.updateToEnCurso(
          existente.sesionId,
          {
            sesionPin: generatePin(),
            sesionIniciadaPorUid: userUid,
          },
        );
        set({ sesionActual: actualizada, sesionCargando: false });
        return;
      }

      // aplazada o cancelada: no se puede iniciar, se refleja el estado tal cual
      if (
        existente?.sesionEstado === "aplazada" ||
        existente?.sesionEstado === "cancelada"
      ) {
        set({ sesionActual: existente, sesionCargando: false });
        return;
      }

      // caso borde: aún no existe doc (la Cloud Function de las 20:25 no ha corrido)
      const nuevaSesion = await SesionRepository.startSesion({
        sesionSalaId: salaId,
        sesionEstado: "en_curso",
        sesionPin: generatePin(),
        sesionIniciadaPorUid: userUid,
        sesionFecha: fecha,
        sesionCanceladaPorUid: null,
        sesionCanceladaMotivo: null,
      });

      set({ sesionActual: nuevaSesion, sesionCargando: false });
    } catch (err) {
      set({
        sesionError:
          err instanceof Error ? err.message : "Error al iniciar sesión",
        sesionCargando: false,
      });
    }
  },

  // METODO: realizar el check-in de un usuario por PIN
  async CheckinForPin(sesionId, userUid, pinIngresado) {
    const { sesionActual } = get();
    if (!sesionActual) throw new Error("No hay sesión activa");

    // Validar PIN ingresado contra el estado actual
    if (sesionActual.sesionPin !== pinIngresado.trim()) {
      throw new Error("El PIN ingresado es incorrecto");
    }

    set({ sesionCargando: true, sesionError: null });

    try {
      // Delegación completa al Repositorio
      await SesionRepository.checkIn(sesionId, userUid, "a_tiempo", null);
      set({ yaHiceCheckin: true, sesionCargando: false });
    } catch (err) {
      const msj =
        err instanceof Error ? err.message : "Error al registrar el check-in";
      set({ sesionError: msj, sesionCargando: false });
      throw err;
    }
  },

  suscribeToMyCheckin(sesionId, userUid) {
    return SesionRepository.suscribeToCheckin(
      sesionId,
      userUid,
      (existe) => set({ yaHiceCheckin: existe })
    );
  },

  async cancelarSesionPorAdmin(
    sesionId: string,
    userUid: string,
    motivo: string,
  ) {
    set({ sesionCargando: true, sesionError: null });
    try {
      await SesionRepository.cancelarPorAdmin(sesionId, userUid, motivo);
      set({ sesionCargando: false });
    } catch (err) {
      const msj =
        err instanceof Error ? err.message : "No se pudo cancelar la sesión";
      set({ sesionError: msj, sesionCargando: false });
      throw err; // Re-lanzamos para que la UI capture el fallo y muestre la alerta
    }
  },

  suscribirseASesionDeHoy(salaId: string) {
    const fecha = getFechaHoy();
    const unsubscribe = SesionRepository.subscribeToSesionDeHoy(
      salaId,
      fecha,
      (sesion) => {
        set({ sesionActual: sesion });
      },
    );
    return unsubscribe;
  },
}));
