const ZONA_HORARIA = "America/Guayaquil";
// FUNCIÓN: convierte "HH:mm" a minutos desde medianoche
export function parseTimeToMinutes(hora: string): number {
  const [horas, minutos] = hora.split(":").map(Number);
  return horas * 60 + minutos;
}

// FUNCIÓN: minutos transcurridos del día en hora de Ecuador
export function getEcuadorMinutes(ahora: Date): number {
  const hora = ahora.toLocaleTimeString("en-GB", {
    timeZone: ZONA_HORARIA,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  return parseTimeToMinutes(hora);
}

// FUNCIÓN: devuelve la fecha en Ecuador en formato YYYY-MM-DD
export function getEcuadorDate(ahora: Date): string {
  return ahora.toLocaleDateString("en-CA", { timeZone: ZONA_HORARIA });
}
