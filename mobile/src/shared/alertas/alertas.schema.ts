// shared/alertas/alerta.schema.ts
import { z } from "zod";

export const AlertaTipoSchema = z.enum(["error", "exito", "info", "advertencia"]);
export type AlertaTipo = z.infer<typeof AlertaTipoSchema>;

export const AlertaSchema = z.object({
  alertaId: z.string(),
  alertaTipo: AlertaTipoSchema,
  alertaMensaje: z.string(),
  alertaDuracionMs: z.number().default(4000),
});
export type Alerta = z.infer<typeof AlertaSchema>;