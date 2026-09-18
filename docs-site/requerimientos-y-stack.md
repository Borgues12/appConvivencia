# Convivencia Audiovisual — Requerimientos y Stack

## ◆ Información General

### Objetivo

	▸ App móvil privada para gestionar un Acuerdo de Convivencia Audiovisual entre los miembros de una sala (2 a 10 personas)
	▸ Proyecto de práctica técnica y portafolio orientado a trabajo remoto en desarrollo de software

## ◆ Estructura del Repositorio

	▸ mobile/ — app React Native + Expo
	▸ backend/ — Firebase (Firestore, Auth, Cloud Functions), sin servidor propio
	▸ docs-site/ — sitio Docusaurus, publicado en GitHub Pages

## ◆ Stack Tecnológico

### Frontend

	▸ React Native con Expo (managed workflow)
	▸ Zustand para estado local de la app (sesión, UI, filtros)
	▸ TanStack Query para datos remotos (Firestore, TMDB), con cache y estados de carga/error
	▸ React Navigation para navegación
	▸ TypeScript + Zod para modelos y validación
	▸ axios como cliente HTTP para TMDB
	▸ expo-image para cache de imágenes

### Backend y Datos

	▸ Firebase Authentication
	▸ Firestore como base de datos, colecciones planas
	▸ Cloud Functions (Node/TypeScript) para lógica automática de faltas y cierre de sesión
	▸ Firestore listeners en tiempo real para sincronizar estado de sesión y confirmaciones de aplazamiento entre dispositivos
	▸ Firebase Cloud Messaging para notificaciones

### Documentación y Distribución

	▸ Docusaurus para documentación técnica, hosting gratuito en GitHub Pages
	▸ EAS Internal Distribution para compartir builds (.apk / ad hoc) sin pasar por tiendas
	▸ pnpm como único gestor de paquetes

## ◆ Entorno de Desarrollo y Distribución

### Build y ejecución local

	▸ EAS Build con perfil development (developmentClient: true, distribution: internal), no Expo Go, por incompatibilidad de Expo Go con módulos nativos como Firebase
	▸ Instalación del build en dispositivo físico vía adb install cuando la instalación por descarga directa falla en Android
	▸ Conexión al bundler local mediante npx expo start --dev-client, con el dispositivo en la misma red WiFi que la máquina de desarrollo
	▸ eas build:run -p android disponible para instalar directo en emulador o dispositivo detectado por adb devices

### Configuración EAS (eas.json)

	▸ Perfil development: developmentClient true, distribution internal
	▸ Perfil preview: distribution internal, sin developmentClient
	▸ Perfil production: autoIncrement activado
	▸ appVersionSource remote, el versionado lo gestionan los servidores de EAS

## ◆ Arquitectura

### Patrón general

	▸ Clean Architecture simplificada por feature: data / domain / presentation
	▸ Repository Pattern obligatorio: ninguna pantalla accede directo a Firestore ni a TMDB
	▸ Cada feature expone sus repositorios mediante stores de Zustand o hooks de TanStack Query

### Estructura de carpetas (mobile/src/)

	▸ core/ — constantes, tema visual Art Decó, utilidades, errores
	▸ features/salas, features/faltas, features/peliculas, features/series, features/cine
	▸ shared/ — componentes y servicios reutilizables (Firebase, notificaciones, aplazamiento)

## ◆ Modelo de Datos Multi-Sala

### Colecciones Firestore

	▸ salas/{salaId} — nombre, código de invitación, miembros, configuración de horarios
	▸ faltas/{id}, peliculas/{id}, series/{id}, cine/{id} — mismo patrón, con campo salaId
	▸ sesiones/{id} — nueva colección, representa la jornada diaria de una sala, con campo salaId
	▸ aplazamientos/{id} — nueva colección compartida entre módulos, con campo salaId y referencia al módulo/evento que aplaza
	▸ Sin anidación profunda: colecciones planas filtradas por salaId en cada consulta

### Ingreso y seguridad

	▸ Unirse a una sala mediante código corto de invitación (6 caracteres)
	▸ Roles: admin (creador) y miembro; sin gestión avanzada de roles en MVP
	▸ Firestore Security Rules deben validar membresía en la sala desde el primer commit del módulo, no como tarea postergable
	▸ Notificaciones vía FCM Topic por sala (sala_{salaId})

## ◆ Módulo Sesión (nuevo, base de Faltas)

### Propósito

	▸ Reemplaza el registro individual de llegada por un modelo de sesión diaria compartida por toda la sala
	▸ Es la pieza de dominio de la que depende Faltas; Faltas ya no calcula retraso por persona de forma aislada, sino que lee el resultado de la sesión del día

### Ciclo de vida de la sesión

	▸ Estados: pendiente → en_curso → (a_tiempo / retraso por miembro) | aplazada | cancelada
	▸ 20:25 — Cloud Function programada marca la sesión del día como pendiente y dispara notificación push a toda la sala anunciando apertura de check-in
	▸ Inicio manual obligatorio: un miembro presente físicamente presiona "Iniciar Sesión", cambia el estado a en_curso y genera un PIN dinámico de 3 dígitos, visible solo en su dispositivo
	▸ Regla no negociable de dominio: el servidor nunca genera ni abre una sesión por sí solo; siempre requiere la acción de una persona real presionando el botón

### Check-in por PIN

	▸ El PIN de proximidad exige que cada miembro esté físicamente junto al iniciador para leerlo e ingresarlo en su propia app
	▸ 20:25 a 20:35 — check-in con PIN correcto se registra como a_tiempo
	▸ 20:35 a 21:00 — check-in con PIN correcto se registra como retraso, y bloquea el envío hasta que el usuario redacte un motivo corto que cumpla una longitud mínima validada en el modal

### Aplazamiento aplicado a Sesión

	▸ Cualquier miembro puede solicitar aplazamiento de la sesión del día entre las 20:00 y las 21:00, usando el mecanismo genérico de Aplazamiento (ver sección propia)
	▸ Al completarse el consenso requerido, la sesión pasa a aplazada: no se generan faltas ni se alteran contadores de nadie ese día

### Cierre automático — Cloud Function (21:01)

	▸ Sesión en en_curso con miembros que nunca ingresaron el PIN: se genera falta automática solo para los ausentes
	▸ Sesión que sigue en pendiente (nadie presionó "Iniciar Sesión" y no hubo aplazamiento completado): pasa a cancelada y se genera falta automática para todos los miembros de la sala, por abandono de la regla del día
	▸ Sesión en aplazada: la Cloud Function la ignora por completo esa fecha, sin tocar faltas ni contadores

### Sincronización en tiempo real

	▸ Cambios de estado de sesión (pendiente / en_curso / aplazada / cancelada) y confirmaciones de aplazamiento se propagan de inmediato a todos los dispositivos de la sala vía Firestore listeners, sin necesidad de refrescar manualmente

## ◆ Módulo Aplazamiento (nuevo, transversal)

### Propósito

	▸ Mecanismo genérico y reutilizable para posponer cualquier evento programado de cualquier módulo (sesión diaria de Faltas, visita de Cine a futuro, u otro evento con fecha fija), no exclusivo de un solo módulo
	▸ Vive en shared/, expuesto como repositorio único que cualquier feature puede invocar indicando a qué entidad y salaId aplica

### Flujo

	▸ Un miembro presiona "Solicitar Aplazamiento", ingresa una razón, y el sistema referencia el evento específico que se aplaza (ej. sesión del día, visita de cine)
	▸ Se despliega alerta visual a los demás miembros activos de la sala en tiempo real
	▸ Requiere aprobación del 100% de los miembros activos de la sala para confirmarse (regla fija para el MVP, sin variantes de mayoría todavía)
	▸ Al completar el consenso, el evento referenciado pasa a su estado de aplazado correspondiente, sin penalización para nadie

## ◆ Módulo Faltas

### Reglas de negocio

	▸ El resultado de Faltas depende del ciclo de vida de Sesión: a_tiempo, retraso, o falta automática por ausencia, cancelación o abandono (ver Módulo Sesión)
	▸ Umbral de retraso vigente: ventana 20:25-20:35 cuenta como a_tiempo, 20:35-21:00 como retraso; ya no se calcula como "más de 5 minutos desde las 20:30" sobre un registro individual
	▸ Motivo corto obligatorio en cualquier check-in con retraso
	▸ Escala de penalización se mantiene sin cambios: 3 faltas habilita Carta de Ventaja; 5 genera botana/dulce; 7 da inmunidad y reinicia el contador
	▸ Sistema de justificantes para tardanza/falta: el miembro solicita anular la penalización con un motivo, sujeto a aprobación (a definir quién aprueba — ¿admin de sala, votación, o automático bajo ciertas condiciones?). No confundir con el campo `motivo` actual, que es solo descriptivo y no anula la falta. Se define con feedback real de uso, según Reglas No Negociables
	▸ Solicitud de aplazamiento sobre cualquier evento programado (Sesión en el MVP; Cine queda preparado para reutilizarlo después)
	▸ Consenso del 100% de miembros activos, alerta en tiempo real
	▸ Al confirmarse, el evento queda aplazado sin penalización para nadie
	
## ◆ Módulo Películas

### Configuración de propuestas

	▸ Propuestas dinámicas según miembros activos de la sala: 1 propuesta por persona
	▸ Con 2 miembros hay 2 opciones, con 10 miembros hay 10 opciones; no hay número fijo
	▸ Búsqueda de películas vía TMDB: portada, sinopsis, duración, género

### Sorteo — ruleta virtual

	▸ Cambio respecto al documento original: se reemplaza el sorteo físico con cartas por una ruleta virtual dentro de la app, igual que en Series, porque el sorteo físico deja de ser práctico con una sala de tamaño variable
	▸ El mismo componente de ruleta se reutiliza entre Películas y Series
	▸ Si un miembro tiene la Carta de Ventaja activa, su propuesta ocupa dos espacios en la ruleta en vez de uno

## ◆ Módulo Series

### Reglas

	▸ Cada miembro propone 1 serie, mismo criterio dinámico que Películas
	▸ Ruleta virtual ya definida en el documento original; se mantiene y se comparte con Películas
	▸ Cronograma según duración de episodio: menos de 15 min, 4 episodios por sesión; 15 a 30 min, 2 por sesión; más de 40 min, 1 por sesión
	▸ 3 días de bloqueo entre temporadas antes de proponer nuevas series

## ◆ Módulo Cine

	▸ Registro de visita programada, asistencia por persona, penalización si no asiste
	▸ El aplazamiento por acuerdo mutuo ya no es lógica propia del módulo: usa el mecanismo genérico de Aplazamiento definido arriba