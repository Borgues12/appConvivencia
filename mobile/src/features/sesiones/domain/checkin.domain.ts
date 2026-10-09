import { z } from 'zod';
import { getEcuadorMinutes, parseTimeToMinutes } from '../../../shared/services/hora';
import { MINUTOS_CIERRE, MINUTOS_A_TIEMPO, TOLERANCIA_PREVIA  } from '../../../core/constants/sesion.constantes';

export const CheckinEstadoSchema = z.enum(['a_tiempo', 'retraso']);
export type CheckinEstado = z.infer<typeof CheckinEstadoSchema>;

// FUNCIÓN: decide qué estado de checkin corresponde según la hora actual
export function classifyCheckin(
  sesionHoraInicio: string,
  ahora: Date,
): "a_tiempo" | "retraso" | "fuera_de_ventana" {
  const transcurridos = getEcuadorMinutes(ahora) - parseTimeToMinutes(sesionHoraInicio);

  if (transcurridos < -TOLERANCIA_PREVIA || transcurridos > MINUTOS_CIERRE) return "fuera_de_ventana";
  if (transcurridos <= MINUTOS_A_TIEMPO) return "a_tiempo";
  return "retraso";
}

export const CheckinSchema = z.object({
  checkinUserUid: z.string(),
  checkinEstado: CheckinEstadoSchema,
  checkinMotivo: z.string().nullable(),
  checkinHora: z.date(),
}).superRefine((datos, ctx) => {
  // El motivo es obligatorio solo en retraso (mínimo 10 caracteres)
  if (datos.checkinEstado === 'retraso' && (datos.checkinMotivo ?? '').trim().length < 10) {
    ctx.addIssue({
      code: 'custom',
      path: ['checkinMotivo'],
      message: 'El motivo del retraso debe tener al menos 10 caracteres',
    });
  }
});
export type Checkin = z.infer<typeof CheckinSchema>;

export const CrearCheckinSchema = CheckinSchema;
export type CrearCheckinInput = z.infer<typeof CrearCheckinSchema>;