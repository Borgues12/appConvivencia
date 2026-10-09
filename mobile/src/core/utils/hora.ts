// core/utilidades/hora.utilidades.ts

//FUNCTION: Convierte una cadena de texto en formato "HH:mm" a un objeto Date
export function timeStringToDate(horaTexto: string): Date {
  const [horas, minutos] = horaTexto.split(":").map(Number);
  const fecha = new Date();
  fecha.setHours(horas || 0, minutos || 0, 0, 0);
  return fecha;
}

//FUNCTION: Convierte un objeto Date a una cadena de texto en formato "HH:mm"
export function dateToTimeString(fecha: Date): string {
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  return `${horas}:${minutos}`;
}