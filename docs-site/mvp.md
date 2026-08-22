# Convivencia Audiovisual — Modelo del MVP

## ◆ Visión General

	▸ Modelo de datos preparado para multi-sala desde el día 1, pero probado en producción con una sola sala real antes de invitar a otras
	▸ Prioridad de desarrollo: Faltas, luego Películas, luego Series, y Cine al final

## ◆ Alcance por Módulo

### Sala

	▸ Login con Firebase Auth
	▸ Crear sala o unirse mediante código de invitación

### Faltas

	▸ Registrar llegada, cálculo de retraso, falta automática vía Cloud Function
	▸ Contador e historial por persona
	▸ Notificación recordatoria a las 20:25

### Películas

	▸ Búsqueda TMDB, 1 propuesta por miembro activo de la sala
	▸ Ruleta virtual para el sorteo
	▸ Historial: título, quién propuso, resultado, fecha

### Series

	▸ Búsqueda TMDB, propuestas, ruleta virtual, historial
	▸ Cronograma automático de episodios entra si el tiempo alcanza, si no pasa a Ola 2

## ◆ Fuera del MVP

	▸ Módulo Cine completo
	▸ Carta de Ventaja con pulido visual y su efecto en la ruleta
	▸ Escalas de penalización de 5 y 7 faltas
	▸ Gestión avanzada de roles dentro de la sala
	▸ Documentación exhaustiva en Docusaurus, se profundiza con el uso real
