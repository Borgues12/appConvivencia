import { z } from 'zod';

// MODELO: para representar una sala
export const SalaSchema = z.object({
  salaId: z.string(),
  salaNombre: z.string().min(1),
  salaCodigoInvitacion: z.string().length(6),
  salaAdminUid: z.string(),
  salaMiembros: z.array(z.string()), // array de userUid
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