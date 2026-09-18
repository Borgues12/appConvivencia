## Estructura y Organización del Proyecto

### Core (Núcleo Global)

- `core/constants/`
  Contiene los valores fijos del proyecto (URLs de APIs externas como TMDB, límites de la aplicación, claves de almacenamiento). No incluye lógica.

- `core/errors/`
  Define las clases de error personalizadas del dominio (por ejemplo, `SesionYaExisteError`), permitiendo diferenciarlos de los errores genéricos de JavaScript.

- `core/theme/`
  Almacena la configuración visual global del proyecto: paleta de colores (tema Art Decó), tipografía, espaciados y tokens de diseño compartidos.

- `core/utils/`
  Agrupa funciones auxiliares puras (formateadores de fecha, funciones de apoyo genéricas) que no dependen del dominio de una característica en específico.

---

### Features (Funcionalidades)

Cada módulo dentro de `features/{feature}/` sigue la separación de responsabilidades:

- `domain/`
  Contiene los modelos de validación (Zod), tipos de TypeScript y la lógica de negocio pura sin operaciones de entrada/salida (I/O).

- `data/`
  Implementa el patrón repositorio para la comunicación con servicios externos (Firestore, TMDB). Centraliza el acceso a datos externos.

- `presentation/store/`
  Almacena los estados globales de la interfaz (Zustand). Orquesta las llamadas a los repositorios y expone el estado hacia la UI.

- `presentation/screens/`
  Componentes de pantalla (`.tsx`). Consumen los estados del store e incluyen sus propios estilos locales mediante `StyleSheet.create`.

---

### Shared (Recursos Compartidos)

- `shared/components/`
  Componentes de interfaz reutilizables entre múltiples características (botones, campos de texto, tarjetas genéricas).

- `shared/navigation/`
  Configuración de rutas y navegación de la aplicación (React Navigation Stacks, definición de tipos de rutas).

- `shared/services/`
  Servicios técnicos compartidos a nivel de infraestructura (inicialización de Firebase, cliente de Axios para TMDB, gestión de notificaciones).

---

### Reglas para la Gestión de Estilos

1. **Estilos locales de pantalla:**
   Si un estilo pertenece exclusivamente a una vista, debe permanecer en el `StyleSheet.create()` dentro de su respectiva pantalla en `presentation/screens/`.

2. **Tokens globales:**
   Si un valor visual es global (paleta de colores, tamaños de fuente base, espaciado estándar), se define en `core/theme/`.

3. **Patrones visuales repetidos:**
   Si una estructura visual o interactiva se utiliza en dos o más pantallas, se abstrae como un componente reutilizable en `shared/components/` en lugar de duplicar los estilos en múltiples archivos.