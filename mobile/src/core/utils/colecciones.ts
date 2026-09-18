export const COLLECTIONS = {
  SALAS: "salas",
  USUARIOS: "usuarios",
  SESIONES: "sesiones",
  CHECKINS: "checkins",
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];