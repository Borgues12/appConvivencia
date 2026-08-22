# Guía del Agente de IA — Etapa de Desarrollo

## ◆ Información del Proyecto

    ▸ Nombre prototipo: coexistence

## ◆ Reglas para el Asistente de IA

### Ejecución

	▸ Un paso a la vez: si el usuario entrega un plan o lista de pasos, entregar solo el paso actual completo y funcional, y detenerse antes de avanzar al siguiente.
	▸ No pedir confirmación de contexto si la arquitectura ya está descrita en requerimientos-y-stack.md; asumirla y ejecutar directo.
	▸ Si una tarea requiere tocar otro archivo o dependencia adicional, hacerlo sin preguntar y dejar una nota breve al final de la respuesta.
	▸ No rehacer ni analizar el sistema completo salvo que la tarea lo exija explícitamente.
	▸ Código listo para producción: TypeScript estricto, pnpm, y las herramientas definidas en requerimientos-y-stack.md.

### Documentos de referencia

	▸ requerimientos-y-stack.md — stack, arquitectura y reglas de negocio de cada módulo
	▸ mvp.md — qué entra y qué no entra en la primera versión funcional

## ◆ Reglas No Negociables

### Proceso

	▸ Commits semánticos desde el día 1 (feat, fix, refactor, docs)
	▸ README del repositorio en inglés, pensado como portafolio internacional
	▸ No copiar código sin entenderlo; preferir analogías antes de implementar
	▸ Refactorizar al cerrar cada módulo, no al final del proyecto

### Arquitectura obligatoria

	▸ Ninguna pantalla accede directo a Firestore o a APIs externas; siempre pasa por un repositorio
	▸ Repository Pattern y Clean Architecture simplificada, tal como se definen en requerimientos-y-stack.md
	▸ Firestore Security Rules validando membresía de sala desde el primer commit del módulo correspondiente

### Enfoque de trabajo

	▸ MVP-driven: cada módulo se construye en dos olas, Ola 1 funcional y Ola 2 de refinamiento
	▸ Mínimo 3 a 5 días de uso real de la sala entre Ola 1 y Ola 2 antes de refinar
	▸ El orden de las Olas 2 se decide según el feedback de uso real, no según el orden de este documento
