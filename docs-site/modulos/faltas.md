**Escenarios y Requerimientos del Flujo de Sesión**

---

**Escenario 1: Sesión Normal (Todos o la mayoría presentes)**

* **Disparador inicial (20:25):** El sistema envía una notificación push a todos los miembros de la sala informando que la ventana de check-in está abierta. La sesión de la noche pasa a estado `pendiente`.
* **Inicio por primer miembro:** El primer usuario en llegar físicamente a la sala presiona **"Iniciar Sesión"**. Esto cambia el estado a `en_curso` y genera un PIN dinámico de 3 dígitos visible solo en la pantalla de su dispositivo.
* **Check-in a tiempo (20:25 - 20:35):** Los miembros presentes en la sala leen el PIN de la pantalla del iniciador y lo ingresan en sus apps. La app registra su asistencia como `a_tiempo`.
* **Check-in con retraso (20:35 - 21:00):** Si un usuario llega después de las 20:35, ingresa el PIN de la sala, pero la app le exige obligatoriamente redactar un motivo corto mediante un modal. Se registra como `retraso`.

---

**Escenario 2: Fuerza Mayor o Cancelación Mutua (Apretón de Manos)**

* **Solicitud de aplazamiento:** Si ocurre un imprevisto o el grupo acuerda no ver contenido ese día, cualquier miembro puede presionar **"Solicitar Aplazamiento"** desde su app (entre las 20:00 y las 21:00) e ingresar la razón.
* **Consenso obligado:** Se despliega una alerta visual en los teléfonos de los demás miembros. Para salas de 2 a 10 personas, se requiere la aprobación del 100% de los miembros activos (o la mayoría según reglas fijas).
* **Cierre sin castigo:** Al completarse todas las confirmaciones, la sesión pasa a estado `aplazada`. El sistema congela la jornada sin registrar faltas ni alterar contadores para ningún participante.

---

**Escenario 3: Cierre Automático por Cloud Function (21:01)**

* **Evaluación de sesión en curso (`en_curso`):** Si la sesión fue iniciada por alguien pero hay miembros que nunca ingresaron el PIN antes de las 21:00, el servidor genera una `falta` automática para cada ausente.
* **Evaluación de sesión olvidada o abandonada (`pendiente`):** Si llegaron las 21:01 y nadie presionó "Iniciar Sesión" ni se completó un "Aplazamiento", el servidor marca la sesión como `cancelada` y aplica una `falta` automática a **todos** los miembros de la sala por abandono de regla.
* **Evaluación de sesión aplazada (`aplazada`):** El servidor detecta la marca de acuerdo mutuo e ignora la sala por completo durante esa fecha.

---

**Requerimientos de Dominio y UX a Alcanzar**

* **Cero inicios remotos desatendidos:** La sesión nunca debe abrirse sola ni generar PINs de forma automática en el servidor sin que una persona real presione el botón en la sala.
* **Validación de presencia visual:** El PIN de 3 dígitos exige que el usuario esté en el mismo espacio físico observando la pantalla del iniciador.
* **Obligatoriedad de motivo:** La interfaz debe bloquear el envío del check-in si es tardío hasta que el campo de texto cumpla con la validación de longitud mínima.
* **Sincronización en tiempo real:** Los cambios de estado de la sesión (`pendiente` $\rightarrow$ `en_curso` $\rightarrow$ `aplazada`) y las confirmaciones del apretón de manos deben reflejarse de inmediato en los dispositivos de todos los miembros.