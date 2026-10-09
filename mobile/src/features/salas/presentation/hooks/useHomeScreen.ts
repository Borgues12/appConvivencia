// features/salas/presentation/hooks/useHomeScreen.ts
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../auth/presentation/store/use-auth-store";
import { Sala } from "../../domain/sala.domain";
import { useAlertaStore } from "../../../../shared/alertas/store/use-alerta.store";
import { useSesionStore } from "../../../sesiones/presentation/store/sesion.store";
import { useSalaStore } from "../store/use-sala-store";

export function useHomeScreen() {
  const usuario = useAuthStore((state) => state.usuario);
  const actualizarUsuario = useAuthStore((state) => state.actualizarUsuario);
  const [sala, setSala] = useState<Sala | null>(null);
  const [cargandoSala, setCargandoSala] = useState(true);
  const [saliendoDeSala, setSaliendoDeSala] = useState(false);

  // Consumimos la acción desde el Store de la sala
  const actualitarTiempoStore = useSalaStore((state) => state.updateStartTime);
  const obtenerSalaStore = useSalaStore((state) => state.obtenerSala);
  const salirDeSalaStore = useSalaStore((state) => state.salirDeSala);

  const [mostrandoInputCancelar, setMostrandoInputCancelar] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [cancelandoSesion, setCancelandoSesion] = useState(false);

  const [mostrandoConfigHora, setMostrandoConfigHora] = useState(false);
  const [horaInicioInput, setHoraInicioInput] = useState("");
  const [guardandoHora, setGuardandoHora] = useState(false);
  const [errorHora, setErrorHora] = useState<string | null>(null);

  const {
    sesionActual,
    sesionCargando,
    iniciarSesion,
    suscribirseASesionDeHoy,
    cancelarSesionPorAdmin,
  } = useSesionStore();

  useEffect(() => {
    if (!usuario?.userSalaActualId) {
      setCargandoSala(false);
      return;
    }
    obtenerSalaStore(usuario.userSalaActualId)
      .then(setSala)
      .finally(() => setCargandoSala(false));
  }, [usuario?.userSalaActualId]);

  useEffect(() => {
    if (!usuario?.userSalaActualId) return;
    const unsubscribe = suscribirseASesionDeHoy(usuario.userSalaActualId);
    return unsubscribe;
  }, [usuario?.userSalaActualId]);

  const handleSalirDeSala = async () => {
    if (!usuario?.userSalaActualId) return;
    setSaliendoDeSala(true);
    try {
      await salirDeSalaStore(usuario.userSalaActualId, usuario.userUid);
      actualizarUsuario({ userSalaActualId: null });
      setSala(null);
    } catch {
      useAlertaStore.getState().mostrarAlerta({
        tipo: "error",
        mensaje: "No se pudo salir de la sala",
      });
    } finally {
      setSaliendoDeSala(false);
    }
  };

  const handleIniciarSesion = async () => {
    if (!usuario?.userSalaActualId) return;
    await iniciarSesion(usuario.userSalaActualId, usuario.userUid);
    const error = useSesionStore.getState().sesionError;
    if (error) {
      useAlertaStore
        .getState()
        .mostrarAlerta({ tipo: "error", mensaje: error });
    }
  };

  //HANDLER: configurar la hora de inicio de la sesion
  const handleGuardarHora = async () => {
    const ESTADOS_BLOQUEAN_CAMBIO_HORA = ["pendiente", "en_curso", "aplazada"];

    if (!sala) return;
    setGuardandoHora(true);
    setErrorHora(null);

    //no se puede cambiar la hora si hay una sesion activa
    if (
      sesionActual &&
      ESTADOS_BLOQUEAN_CAMBIO_HORA.includes(sesionActual.sesionEstado)
    ) {
      setErrorHora(
        "No puedes cambiar la hora mientras hay una sesión activa hoy",
      );
      return;
    }
    
    try {
      await actualitarTiempoStore(sala.salaId, horaInicioInput.trim());
      setMostrandoConfigHora(false);
    } catch (err) {
      setErrorHora(
        err instanceof Error ? err.message : "No se pudo guardar la hora",
      );
    } finally {
      setGuardandoHora(false);
    }
  };

  const handleCancelarSesion = async () => {
    if (!sesionActual || !usuario) return;
    if (motivoCancelacion.trim().length === 0) {
      useAlertaStore.getState().mostrarAlerta({
        tipo: "advertencia",
        mensaje: "Escribe un motivo para cancelar",
      });
      return;
    }
    setCancelandoSesion(true);
    try {
      await cancelarSesionPorAdmin(
        sesionActual.sesionId,
        usuario.userUid,
        motivoCancelacion.trim(),
      );
      setMostrandoInputCancelar(false);
      setMotivoCancelacion("");
    } catch {
      useAlertaStore.getState().mostrarAlerta({
        tipo: "error",
        mensaje: "No se pudo cancelar la sesión",
      });
    } finally {
      setCancelandoSesion(false);
    }
  };

  const esAdmin = !!(usuario && sala && usuario.userUid === sala.salaAdminUid);
  const sePuedeCancelar =
    esAdmin &&
    (sesionActual?.sesionEstado === "pendiente" ||
      sesionActual?.sesionEstado === "en_curso");

  return {
    usuario,
    sala,
    cargandoSala,
    saliendoDeSala,
    sesionActual,
    sesionCargando,
    esAdmin,
    sePuedeCancelar,
    handleSalirDeSala,
    handleIniciarSesion,
    handleGuardarHora,
    mostrandoInputCancelar,
    setMostrandoInputCancelar,
    motivoCancelacion,
    setMotivoCancelacion,
    cancelandoSesion,
    handleCancelarSesion,
    mostrandoConfigHora,
    setMostrandoConfigHora,
    horaInicioInput,
    setHoraInicioInput,
    guardandoHora,
    errorHora,
  };
}
