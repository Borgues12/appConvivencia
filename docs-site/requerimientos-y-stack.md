# Documento de Requerimientos y Reglas de Negocio — Convivencia Audiovisual

## 1. Información General

### 1.1 Objetivo del Sistema
Aplicar y gestionar un Acuerdo de Convivencia Audiovisual entre los miembros de una sala privada (de 2 a 10 personas) mediante una aplicación móvil.

---

## 2. Gestión de Salas y Acceso

### 2.1 Creación e Ingreso a Salas
* **Capacidad:** Las salas soportan entre 2 y 10 miembros activos.
* **Unión por Código:** Un usuario se une a una sala existente mediante un código único de invitación de 6 caracteres.
* **Roles:**
  * **Administrador:** Creador de la sala.
  * **Miembro:** Usuario unido mediante código.
* **Notificaciones:** Cada sala dispone de un canal de notificaciones Push independiente (`sala_{salaId}`).

### 2.2 Seguridad y Control de Acceso
* **Validación de Membresía:** Las reglas de seguridad de la base de datos deben validar la pertenencia del usuario a la sala antes de conceder acceso de lectura o escritura a cualquier entidad.

---

## 3. Módulo Sesión

### 3.1 Propósito
Representa la jornada diaria compartida por todos los miembros de la sala. Reemplaza el registro individual de llegada y sirve como la fuente de verdad sobre la cual se calculan las faltas o asistencias.

### 3.2 Ciclo de Vida y Estados de la Sesión
* **Estados posibles:** `pendiente` → `en_curso` → (`a_tiempo` / `retraso` por miembro) | `aplazada` | `cancelada`.

### 3.3 Flujo Diario y Reglas de Apertura
* **Notificación de Apertura (`HORA_INICIO`):** El sistema notifica automáticamente a la sala sobre la apertura de la ventana de check-in y marca la sesión del día como `pendiente`.
* **Apertura Manual Obligatoria:** Un miembro presente físicamente debe presionar "Iniciar Sesión" en la app para cambiar el estado a `en_curso`.
  * **Regla estricta:** El sistema nunca inicia una sesión de forma automática. Si nadie presiona el botón, la sesión permanece en `pendiente`.
* **Generación de PIN:** Al iniciar la sesión, la app genera un PIN dinámico de 3 dígitos visible únicamente en el dispositivo del miembro que inició.

### 3.4 Check-in por Proximidad (PIN)
Para registrar asistencia, los miembros presentes deben ingresar en sus propios dispositivos el PIN dinámico mostrado por el iniciador.

* **Ventana A Tiempo (`HORA_INICIO` a +10 min):** Check-in con PIN correcto se registra como `a_tiempo`.
* **Ventana Retraso (+10 a +35 min):** Check-in con PIN correcto se registra como `retraso`.
  * Requiere obligatoriamente redactar un motivo corto (con longitud mínima validada) para habilitar el botón de envío.

### 3.5 Cierre Automático de Sesión (`HORA_INICIO` +36 min)
El sistema evalúa el estado final de la jornada de forma automática:

* **Evaluación de Ausencias:** Si la sesión está `en_curso`, los miembros que no ingresaron el PIN reciben una falta automática por ausencia.
* **Abandono de Regla:** Si la sesión continúa en `pendiente` (ningún miembro inició la sesión y no hubo aplazamiento previo), la sesión pasa a `cancelada` y se genera una falta automática a **todos** los miembros de la sala.
* **Sesión Aplazada:** Si la sesión alcanzó el estado `aplazada` antes del cierre, el sistema ignora la fecha y no genera faltas ni altera contadores.

### 3.6 Sincronización en Tiempo Real
Cualquier cambio de estado en la sesión o confirmación de aplazamiento se propaga inmediatamente a los dispositivos de todos los miembros activos.

---

## 4. Módulo Aplazamiento (Transversal)

### 4.1 Propósito
Mecanismo reutilizable para posponer eventos programados de la sala (Sesión diaria, visitas a Cine, etc.) sin generar penalizaciones.

### 4.2 Reglas y Flujo de Consenso
* **Solicitud:** Cualquier miembro puede solicitar el aplazamiento dentro de la ventana permitida (ej. 20:00 a 21:00 para la sesión diaria) indicando una razón.
* **Alerta en Tiempo Real:** El sistema notifica de inmediato a los demás miembros con una alerta visual en pantalla.
* **Regla de Consenso:** Requiere la aprobación explícita del **100% de los miembros activos** de la sala.
* **Efecto:** Al completarse el consenso, el evento referenciado pasa al estado `aplazado` y se cancela cualquier penalización asociada a esa fecha.

---

## 5. Módulo Faltas

### 5.1 Registro y Cálculo
* Las faltas o retrasos son determinados por el resultado del Módulo Sesión (`a_tiempo`, `retraso`, o `falta` por ausencia/abandono).
* Requiere motivo descriptivo obligatorio para cualquier registro en ventana de retraso.

### 5.2 Escala de Penalización y Recompensas
* **3 Faltas:** Habilita el beneficio "Carta de Ventaja".
* **5 Faltas:** Genera penalización de aportación de botana/dulce para la sala.
* **7 Faltas:** Otorga inmunidad temporal y reinicia el contador acumulado de faltas a cero.

### 5.3 Sistema de Justificantes
* Permite solicitar la anulación de una penalización mediante una justificación formal sujeta a proceso de aprobación.

---

## 6. Módulo Películas

### 6.1 Propuestas
* **Propuestas Dinámicas:** Se habilita exactamente 1 propuesta de película por cada miembro activo de la sala (mínimo 2, máximo 10 opciones).
* **Integración TMDB:** Búsqueda e importación de metadatos (portada, sinopsis, duración, género) desde la API de TMDB.

### 6.2 Selección por Ruleta Virtual
* La elección de la película a ver se realiza mediante una ruleta virtual integrada en la app.
* **Efecto Carta de Ventaja:** Si un miembro posee la Carta de Ventaja activa, su propuesta obtiene el doble de espacio (doble de probabilidad) dentro de la ruleta.

---

## 7. Módulo Series

### 7.1 Propuestas y Selección
* **Propuestas:** 1 serie por cada miembro activo de la sala.
* **Sorteo:** Utiliza el mismo componente reutilizable de ruleta virtual que el Módulo Películas.

### 7.2 Programación según Duración de Episodio
El cronograma de emisión en la sesión diaria se determina por la duración de los episodios:
* **Menos de 15 minutos:** 4 episodios por sesión.
* **De 15 a 30 minutos:** 2 episodios por sesión.
* **Más de 40 minutos:** 1 episodio por sesión.

### 7.3 Restricción entre Temporadas
* Se exige un periodo de bloqueo obligatorio de **3 días** tras finalizar una temporada antes de poder registrar o proponer nuevas series.

---

## 8. Módulo Cine

### 8.1 Registro y Asistencia
* Permite programar salidas o visitas al cine notificando a la sala.
* Registro individual de asistencia con asignación de penalización en caso de inasistencia no justificada.

### 8.2 Aplazamientos
* Las visitas de cine reutilizan la lógica transversal del **Módulo Aplazamiento** (consenso del 100% de los miembros) para reprogramar fechas sin penalización.