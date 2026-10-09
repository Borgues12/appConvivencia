export const MINUTOS_RETRASO = 10; // desde sesionHoraInicio, el check-in cuenta como retraso
export const MINUTOS_CIERRE = 36; // desde sesionHoraInicio, la sesión se cierra
export const HORA_INICIO_POR_DEFECTO = "19:00"; // hora de inicio por defecto si no se indica otra
export const ANTICIPACION_MINUTOS = 5; // crea la sesión esta cantidad de min antes de salaHoraInicio
export const MARGEN_EJECUCION = 3; // debe ser mayor al intervalo del cron (1 min) para no perder ciclos