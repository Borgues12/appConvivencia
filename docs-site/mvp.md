# Convivencia Audiovisual — Modelo del MVP

## ◆ Visión General

	▸ Modelo de datos preparado para multi-sala desde el día 1, pero probado en producción con una sola sala real antes de invitar a otras
	▸ Prioridad de desarrollo: Sesión y Cancelar Sesion (simplificar flujo), luego Faltas sobre esa base, luego Películas, luego Series, y Cine al final
	▸ El nuevo modelo de Sesión con PIN reemplaza el registro individual de llegada; se construye como pieza propia porque Faltas depende de ella, no al revés

## ◆ Alcance por Módulo

### Sala

	▸ Login con Firebase Auth
	▸ Crear sala o unirse mediante código de invitación

### Sesión (nuevo, prerequisito de Faltas)

	▸ Apertura de ventana de check-in a las 20:25 vía notificación, estado pendiente
	▸ Inicio manual por el primer miembro presente, genera PIN de 3 dígitos, estado en_curso
	▸ Check-in por PIN: a_tiempo (20:25-20:35) o retraso con motivo obligatorio (20:35-21:00)
	▸ Cierre automático a las 21:00 vía Cloud Function: falta para ausentes, o cancelada con falta para todos si nadie inició sesión
	▸ Sincronización en tiempo real de estado entre dispositivos

### Cancelar
   	▸ Ante cualquier razon establecer un boton para admin para cancelar la sesion sin consecuencias para ningun miembro registrando la razon de la cancelacion

### Faltas

	▸ Contador e historial por persona, alimentado por el resultado de cada Sesión diaria
	▸ Escala de penalización (3/5/7) fuera del MVP en su versión completa; en Ola 1 solo se lleva el contador simple

### Películas

	▸ Búsqueda TMDB, 1 propuesta por miembro activo de la sala
	▸ Ruleta virtual para el sorteo
	▸ Historial: título, quién propuso, resultado, fecha

### Series

	▸ Búsqueda TMDB, propuestas, ruleta virtual, historial
	▸ Cronograma automático de episodios entra si el tiempo alcanza, si no pasa a Ola 2

## ◆ Fuera del MVP

	▸ Aplazamiento de las sesiones con concenso mayor
	▸ Módulo Cine completo (pero su futuro aplazamiento ya reutilizará el mecanismo genérico construido en Sesión)
	▸ Carta de Ventaja con pulido visual y su efecto en la ruleta
	▸ Escalas de penalización de 5 y 7 faltas
	▸ Sistema de justificantes con flujo de aprobación
	▸ Gestión avanzada de roles dentro de la sala
	▸ Documentación exhaustiva en Docusaurus, se profundiza con el uso real