// features/sesiones/domain/checkin.domain.ts
import { z } from 'zod';

// MODELO: para representar el check-in individual de un miembro en una sesión
export const CheckinSchema = z.object({
  checkinUserUid: z.string(),
  checkinEstado: z.enum(['a_tiempo', 'retraso']),
  checkinMotivo: z.string().nullable(), // obligatorio solo si checkinEstado es retraso
  checkinHora: z.date(),
});
export type Checkin = z.infer<typeof CheckinSchema>;

export const CrearCheckinSchema = CheckinSchema;
export type CrearCheckinInput = z.infer<typeof CrearCheckinSchema>;