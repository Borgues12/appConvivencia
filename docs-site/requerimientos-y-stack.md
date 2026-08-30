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
    ▸ Cloud Functions (Node/TypeScript) para lógica automática de faltas
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

	▸ core/ — constantes, tema visual Art Decó, utilidades puras y manejo global de errores
	▸ features/ — módulos de negocio aislados (`salas`, `faltas`, `peliculas`, `series`, `cine`), cada uno con:
		▸ domain/ — esquemas Zod, tipos de TypeScript y contratos de repositorios (sin dependencias externas)
		▸ data/ — implementación de repositorios para lectura y escritura en Firestore, TMDB o storage local
		▸ presentation/ — pantallas (screens), componentes de interfaz y gestión de estado (Zustand / TanStack Query)
	▸ shared/ — componentes visuales atómicos reutilizables (botones, modales) y servicios compartidos (Firebase, notificaciones)

## ◆ Modelo de Datos Multi-Sala

### Colecciones Firestore

    ▸ salas/{salaId} — nombre, código de invitación, miembros, configuración de horarios
    ▸ faltas/{id}, peliculas/{id}, series/{id}, cine/{id} — mismo patrón, con campo salaId
    ▸ Sin anidación profunda: colecciones planas filtradas por salaId en cada consulta

### Ingreso y seguridad

    ▸ Unirse a una sala mediante código corto de invitación (6 caracteres)
    ▸ Roles: admin (creador) y miembro; sin gestión avanzada de roles en MVP
    ▸ Firestore Security Rules deben validar membresía en la sala desde el primer commit del módulo, no como tarea postergable
    ▸ Notificaciones vía FCM Topic por sala (sala_{salaId})

## ◆ Módulo Faltas

### Reglas de negocio

    ▸ Horario de sesión: 20:30, límite de inicio: 21:00
    ▸ Sin registro antes de 21:00 → falta automática generada al día siguiente vía Cloud Function
    ▸ Retraso mayor a 5 minutos equivale a falta; motivo corto obligatorio si hay tardanza
    ▸ Escala de penalización: 3 faltas habilita Carta de Ventaja; 5 genera botana/dulce; 7 da inmunidad y reinicia el contador
    ▸ Notificación recordatoria a las 20:25 a todos los miembros de la sala
    ▸ Sistema de justificantes para tardanza/falta: el miembro solicita anular la penalización con un motivo, sujeto a aprobación (a definir quién aprueba — ¿admin de sala, votación, o automático bajo ciertas condiciones?). No confundir con el campo `motivo` actual, que es solo descriptivo y no anula la falta. Se define con feedback real de uso, según Reglas No Negociables.

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

    ▸ Registro de visita programada, asistencia por persona, penalización si no asiste, aplazamiento si ambas partes acuerdan no ir
