// FUNCIÓN: convierte "HH:mm" a minutos desde medianoche
export function parseTimeToMinutes(hora: string): number {
  const [horas, minutos] = hora.split(":").map(Number);
  return horas * 60 + minutos;
}

// FUNCIÓN: minutos transcurridos del día en hora de Ecuador
export function getEcuadorMinutes(ahora: Date): number {
  const hora = ahora.toLocaleTimeString("en-GB", {
    timeZone: "America/Guayaquil",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  return parseTimeToMinutes(hora);
}

// FUNCIÓN: devuelve la fecha en Ecuador en formato YYYY-MM-DD
export function getEcuadorDate(ahora: Date): string {
  return ahora.toLocaleDateString("en-CA", { timeZone: "America/Guayaquil" });
}

// FUNCIÓN: devuelve la hora actual en Ecuador en formato "HH:mm" (24h)
export function getEcuadorTimeString(ahora: Date = new Date()): string {
  return ahora.toLocaleTimeString("en-GB", {
    timeZone: "America/Guayaquil",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

// "20:25" -> Date de hoy con esa hora (el picker trabaja con Date)
export function timeStringToDate(hora: string): Date {
  const [horas, minutos] = hora.split(":").map(Number);
  const fecha = new Date();
  fecha.setHours(horas, minutos, 0, 0);
  return fecha;
}

// Date -> "20:25" (lo que guardas en salaHoraInicio)
export function dateToTimeString(fecha: Date): string {
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  return `${horas}:${minutos}`;
}