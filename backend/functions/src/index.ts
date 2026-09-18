// functions/src/index.ts
import { initializeApp } from "firebase-admin/app";

initializeApp();

export { findRoomByCode } from "./salas/findRoomByCode.trigger";
export { abrirCheckIn } from "./sesiones/openCheckIn.trigger";