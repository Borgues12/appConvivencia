import { z } from "zod";
import { HORA_INICIO_POR_DEFECTO, MINUTOS_CIERRE, MINUTOS_DEL_DIA } from "../../../core/constants/sesion.constantes";
import { parseTimeToMinutes } from "../../../shared/services/hora";

// VARIABLE: hora de inicio de una sala (para modificarla)
export const HoraInicioSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:mm inválido')
  .refine(
    (hora) => parseTimeToMinutes(hora) + MINUTOS_CIERRE < MINUTOS_DEL_DIA,
    'La sesión debe terminar antes de medianoche',
  );

// MODELO: para representar una sala
export const SalaSchema = z.object({
  salaId: z.string(),
  salaNombre: z.string().min(1),
  salaCodigoInvitacion: z.string().length(6),
  salaAdminUid: z.string(),
  salaMiembros: z.array(z.string()), // array de userUid
  salaHoraInicio: HoraInicioSchema.default(HORA_INICIO_POR_DEFECTO),
});

// MODELO: para representar un preview de una sala
export const SalaPreviewSchema = SalaSchema.pick({
  salaId: true,
  salaNombre: true,
  salaCodigoInvitacion: true,
});
// TIPO: para representar un preview de una sala en TS
export type SalaPreview = z.infer<typeof SalaPreviewSchema>;

// TIPO: para representar una sala en TS
export type Sala = z.infer<typeof SalaSchema>;

// MOLDE: para crear una sala sin salaId
export const CrearSalaSchema = SalaSchema.omit({ salaId: true });
export type CrearSalaInput = z.infer<typeof CrearSalaSchema>;
