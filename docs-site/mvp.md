
# Checklist de Requerimientos — Versión Beta / MVP

## 1. Módulo Sala y Autenticación

* [ ] **Autenticación:** Registro e inicio de sesión con correo y contraseña vía Firebase Auth.
* [ ] **Creación de Sala:** Permite a un usuario crear una sala privada, asignándole un nombre y nombrándolo administrador.
* [ ] **Unión por Código:** Permite a cualquier usuario unirse a una sala ingresando un código único de 6 caracteres.
* [ ] **Membresía:** Restricción de acceso para que los datos de la sala solo sean visibles/modificables por sus miembros activos (2 a 10 personas).

---
## 2. Módulo Sesión (Flujo Diario con Tiempos Dinámicos)

* [ ] **Configuración por Admin:** El administrador puede modificar la `HORA_INICIO` de la sala (valor por defecto: `20:25`).
* [ ] **Apertura de Ventana (`HORA_INICIO`):**
* Disparo de notificación push a toda la sala.
* Creación automática de la sesión del día en estado `pendiente`, copiando la `HORA_INICIO` vigente de la sala como `sesionHoraInicio`.


* [ ] **Inicio Manual con PIN:**
* Un miembro presente presiona "Iniciar Sesión" para pasar el estado a `en_curso`.
* Generación de un PIN dinámico de 3 dígitos, visible únicamente en el dispositivo del iniciador.


* [ ] **Check-in A Tiempo (`sesionHoraInicio` a +10 min):**
* El miembro ingresa el PIN dinámico en su app.
* El sistema valida el PIN y registra la asistencia como `a_tiempo`.


* [ ] **Check-in con Retraso (+10 a +35 min):**
* El miembro ingresa el PIN dinámico.
* Se despliega un modal que exige redactar un motivo corto (mínimo de caracteres validado) para habilitar el envío.
* El sistema registra el estado como `retraso`.


* [ ] **Cierre Automático por Cloud Function (+36 min):**
* Si la sesión está `en_curso`, asigna falta automática a los miembros que no ingresaron PIN.
* Si la sesión se quedó en `pendiente` (nadie inició sesión), cambia el estado a `perdida` y asigna falta automática a todos los miembros de la sala por abandono.
* Si la sesión está `cancelada`, el cierre no evalúa faltas ni ausencias para nadie.


* [ ] **Sincronización:** Actualización en tiempo real mediante listeners de Firestore para que todos los dispositivos vean los cambios de estado al instante.

---

## 3. Módulo Cancelación Administrativa

* [ ] **Acción de Admin:** Botón visible únicamente para el creador/admin de la sala, para cancelar la sesión por fuerza mayor en cualquier momento del día (antes o después del cierre).
* [ ] **Motivo Obligatorio:** Formulario que exige al admin ingresar la razón de la cancelación antes de procesarla.
* [ ] **Efecto de Cancelación:** La sesión pasa a `cancelada` y el sistema ignora el cálculo de faltas o ausencias para todos los miembros ese día, sin importar si ya había check-ins o faltas registradas antes de cancelar.

---

## 4. Módulo Faltas (Versión Simplificada)

* [ ] **Registro Automático:** Generación de registros en la colección de faltas al momento del cierre de sesión o check-in con retraso.
* [ ] **Contador e Historial:** Pantalla que muestra el total acumulado de faltas/retrasos por persona y la lista histórica con fecha y motivo registrado.

---

## 5. Módulo Películas

* [ ] **Búsqueda TMDB:** Buscador integrado mediante Axios a la API de TMDB para obtener título, portada, sinopsis y género.
* [ ] **Propuestas por Sala:** Habilita el registro de exactamente 1 propuesta de película por cada miembro activo de la sala.
* [ ] **Sorteo por Ruleta:**
* Ruleta virtual interactiva que carga las propuestas activas de la sala.
* Selección aleatoria al girar la ruleta y despliegue de la película ganadora.


* [ ] **Historial de Elección:** Guardado automático del resultado con título, quién la propuso, fecha y estado de vista.

---

## 6. Módulo Series

* [ ] **Búsqueda TMDB:** Integración para buscar y seleccionar series desde TMDB.
* [ ] **Propuestas:** Permitir 1 propuesta por miembro activo.
* [ ] **Sorteo Reutilizable:** Reutilización del mismo componente de ruleta virtual usado en Películas para realizar la selección.
* [ ] **Historial de Series:** Registro de las series elegidas y la persona que las propuso.