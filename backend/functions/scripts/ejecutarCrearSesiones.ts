import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createDailySessions } from "../src/sesiones/crearSesionesDiarias.logica";

const rutaCredencial =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "./serviceAccountKey.json";
const credencial = JSON.parse(readFileSync(rutaCredencial, "utf-8"));

initializeApp({ credential: cert(credencial) });

async function main(): Promise<void> {
  const ahora = new Date();

  const sesionesCreadas = await createDailySessions(
    getFirestore(),
    ahora,
    async (salaId) => {
      console.log(`[simulado] notificación a sala_${salaId}`);
    },
  );

  console.log(`Sesiones creadas: ${sesionesCreadas}`);
}

main().catch((error) => {
  console.error("Falló la ejecución:", error);
  process.exit(1);
});

