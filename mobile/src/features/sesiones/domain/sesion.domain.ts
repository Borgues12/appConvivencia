import { Timestamp } from "firebase/firestore";
import { z } from "zod";

// MODELO: para representar una sesión diaria de una sala
// sesionPin y sesionIniciadaPorUid son null mientras está pendiente;
// se llenan solo al pasar a en_curso
export const SesionSchema = z.object({
  sesionId: z.string(),
  sesionSalaId: z.string(),
  sesionEstado: z.enum([
    "pendiente", //estado inicial
    "en_curso", // iniciada y no finalizada
    "aplazada", // aplazada por eventos externos
    "finalizada", // sesion terminada
    "perdida", // nadie presionó "Iniciar Sesión"
    "cancelada", // cancelada por el admin
  ]),
  sesionPin: z.string().length(4).nullable().optional(),
  sesionHoraInicio: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Formato HH:mm inválido"), // Hora en la cual se inicia la sesion
  sesionIniciadaPorUid: z.string().nullable().optional(),
  sesionFecha: z.string(), // formato YYYY-MM-DD, una sesión por sala por día
  sesionCreadaEn: z.union([
    z.date(),
    z.instanceof(Timestamp).transform((ts) => ts.toDate()),
  ]),
  sesionRetrasoNotificado: z.boolean().default(false),
  sesionCanceladaPorUid: z.string().nullable().optional(),
  sesionCanceladaMotivo: z.string().nullable().optional(),
  
});

// TIPO: para representar una sesión en TS
export type Sesion = z.infer<typeof SesionSchema>;

// MOLDE: para crear la sesión pendiente desde la Cloud Function (sin pin ni iniciador)
export const CrearSesionSchema = SesionSchema.omit({
  sesionId: true,
  sesionCreadaEn: true,
});
export type CrearSesionInput = z.infer<typeof CrearSesionSchema>;

// MOLDE: para representar una sesión ya en_curso, donde pin e iniciador son obligatorios
// útil para tipar el resultado de updateToEnCurso sin manejar null en la pantalla de check-in
export const SesionEnCursoSchema = SesionSchema.extend({
  sesionEstado: z.literal("en_curso"),
  sesionPin: z.string().length(3),
  sesionIniciadaPorUid: z.string(),
});
export type SesionEnCurso = z.infer<typeof SesionEnCursoSchema>;
