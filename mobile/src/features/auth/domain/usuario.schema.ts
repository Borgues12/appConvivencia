import { z } from 'zod';

// MODELO: para representar un usuario
export const UsuarioSchema = z.object({
  userUid: z.string(),
  userDisplayName: z.string().nullable(),
  userPhotoURL: z.string().nullable(),
  userEmail: z.string().email(),
  userSalaActualId: z.string().nullable(),
});

// TIPO: para representar un usuario en TS
export type Usuario = z.infer<typeof UsuarioSchema>;

// MOLDE: para crear un usuario sin userUid
export const CrearUsuarioSchema = UsuarioSchema.omit({ userUid: true });
export type CrearUsuarioInput = z.infer<typeof CrearUsuarioSchema>;