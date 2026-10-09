// functions/src/index.ts
import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions";

initializeApp();

setGlobalOptions({ region: "us-central1" });

export { findRoomByCode } from "./salas/findRoomByCode.trigger";
export { runSessionTick } from "./sesiones/sesionTick.trigger";
export { tardiness } from "./faltas/tardiness.trigger";