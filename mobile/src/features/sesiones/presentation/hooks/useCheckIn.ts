// features/sesiones/presentation/hooks/useCheckinPin.ts
import { useEffect, useState } from "react";
import { useSesionStore } from "../store/sesion.store";
import { classifyCheckin } from "../../domain/checkin.domain";
import {
  LONGITUD_PIN,
  MOTIVO_MIN_CARACTERES,
} from "../../../../core/constants/sesion.constantes";

export function useCheckinPin(sesionId?: string, userUid?: string) {
  const sesionActual = useSesionStore((s) => s.sesionActual);
  const yaHiceCheckin = useSesionStore((s) => s.yaHiceCheckin);
  const sesionCargando = useSesionStore((s) => s.sesionCargando);
  const checkinForPinStore = useSesionStore((s) => s.CheckinForPin);
  const suscribeToMyCheckinStore = useSesionStore((s) => s.suscribeToMyCheckin);

  const [pin, setPin] = useState("");
  const [motivo, setMotivo] = useState("");
  const [mostrandoModalMotivo, setMostrandoModalMotivo] = useState(false);
  const [errorPin, setErrorPin] = useState<string | null>(null);

  // Listener: mantiene yaHiceCheckin sincronizado con la subcolección
  useEffect(() => {
    if (!sesionId || !userUid) return;
    const unsubscribe = suscribeToMyCheckinStore(sesionId, userUid);
    return unsubscribe;
  }, [sesionId, userUid, suscribeToMyCheckinStore]);

  // HANDLE: manejar cambios en el PIN, verificando que sean numéricos
  const handleChangePin = (texto: string) => {
    setPin(texto.replace(/\D/g, "")); // solo acepta dígitos
    setErrorPin(null);
  };

  // METODO: registrar el check-in
  const enviarCheckin = async (motivoFinal: string | null) => {
    if (!sesionActual || !sesionId || !userUid) return;
    try {
      await checkinForPinStore(
        sesionId,
        userUid,
        pin,
        sesionActual.sesionHoraInicio,
        motivoFinal,
      );
      setPin("");
      setMotivo("");
      setMostrandoModalMotivo(false);
    } catch (err) {
      setMostrandoModalMotivo(false);
      setErrorPin(
        err instanceof Error ? err.message : "Error al registrar el check-in",
      );
    }
  };

  // HANDLE: para enviar el check-in
  const handleSubmitPin = async () => {
    if (!sesionActual) return;

    if (pin !== sesionActual.sesionPin) {
      setErrorPin("El PIN ingresado es incorrecto");
      return;
    }

    const estado = classifyCheckin(sesionActual.sesionHoraInicio, new Date());
    if (estado === "fuera_de_ventana") {
      setErrorPin("El check-in ya no está disponible");
      return;
    }

    if (estado === "retraso") {
      setMostrandoModalMotivo(true); // pedimos el motivo antes de enviar
      return;
    }

    await enviarCheckin(null);
  };

  // HANDLE: para enviar el check-in con motivo
  const handleConfirmMotivo = async () => {
    await enviarCheckin(motivo.trim());
  };

  // HANDLE: para cancelar el motivo
  const handleCancelMotivo = () => {
    setMostrandoModalMotivo(false);
    setMotivo("");
  };

  return {
    pin,
    motivo,
    setMotivo,
    errorPin,
    mostrandoModalMotivo,
    yaHiceCheckin,
    sesionCargando,
    puedeEnviarPin:
      pin.length === LONGITUD_PIN && !sesionCargando && !yaHiceCheckin,
    puedeEnviarMotivo:
      motivo.trim().length >= MOTIVO_MIN_CARACTERES && !sesionCargando,
    longitudPin: LONGITUD_PIN,
    handleChangePin,
    handleSubmitPin,
    handleConfirmMotivo,
    handleCancelMotivo,
  };
}
