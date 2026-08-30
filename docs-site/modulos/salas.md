# Convivencia Audiovisual — Estado del Módulo Sala

## ◆ Qué hace el sistema hasta ahora

	▸ Un usuario puede iniciar sesión con su cuenta de Google y la app lo recuerda entre usos, sin pedirle loguearse de nuevo cada vez
	▸ Al loguearse por primera vez, el sistema le crea automáticamente un perfil interno; en logueos siguientes reconoce que ya existe y no lo altera
	▸ Un usuario logueado puede crear una sala nueva, y el sistema le entrega un código corto para invitar a otras personas
	▸ Otro usuario puede usar ese código para unirse a la sala existente, sin necesitar permiso manual de nadie
	▸ La app sabe distinguir automáticamente en qué momento del proceso está cada usuario y le muestra la pantalla correspondiente: si no ha iniciado sesión, si ya inició sesión pero no tiene sala, o si ya pertenece a una sala
	▸ Un usuario puede cerrar sesión y volver al inicio del proceso

## ◆ Qué se protegió

	▸ Nadie puede ver ni modificar el perfil de otro usuario, solo el propio
	▸ Nadie puede crear una sala haciéndose pasar por otra persona como administrador
	▸ Nadie puede unirse a una sala y de paso alterar su nombre, su código de invitación o quitarle el rol al administrador — unirse solo puede sumar a la propia persona como miembro nuevo

## ◆ Qué se reorganizó (sin cambiar el comportamiento)

	▸ Todo lo relacionado a "iniciar/cerrar sesión" quedó separado de todo lo relacionado a "sala" — son dos responsabilidades distintas que antes estaban mezcladas en el mismo lugar, ahora cada una vive en su propio espacio
	▸ Los nombres de los datos internos (por ejemplo, quién es el dueño de un campo) ahora dejan claro a qué entidad pertenecen, para que no haya ambigüedad al leer el código más adelante

## ◆ Qué falta pulir (no bloquea el uso, pero está pendiente)

	▸ Cuando alguien crea o se une a una sala, la app todavía no refresca ese dato en un rincón puntual del sistema — en la práctica puede no notarse porque la navegación igual funciona, pero es una inconsistencia interna a corregir
	▸ La pantalla principal (una vez dentro de la sala) es funcional pero visualmente básica — el diseño real del tema todavía no se aplicó
	▸ Falta probar el flujo de "unirse a sala" con una segunda persona real, no solo como quien crea la sala
	▸ Un archivo quedó con un nombre mal escrito, sin efecto en el funcionamiento, pendiente de corregir por prolijidad

## ◆ Qué sigue

	▸ Módulo de Faltas (registrar llegadas, retrasos, e historial) — siguiente prioridad según el plan original del proyecto