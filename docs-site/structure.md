## ◆ Estructura del Proyecto (mobile/src/)

### Core

    ▸ `core/constantes/` — valores fijos (URLs de TMDB, límites, ventanas de sesión). Sin lógica
    ▸ `core/errores/` — errores personalizados del dominio
    ▸ `core/tema/` — tokens visuales: colores Art Decó, tipografía, espaciado, constantes de animación
    ▸ `core/utilidades/` — funciones puras genéricas (fechas, horas) sin relación con una feature

### Features

Cada `features/{feature}/` se divide en capas. Cada capa habla solo con la de abajo:

    ▸ `domain/` — esquemas Zod, tipos y lógica de negocio pura, sin I/O (`.domain.ts`)
    ▸ `data/` — repositorios de Firestore y TMDB; solo leen y escriben (`.repository.ts`)
    ▸ `presentation/store/` — estado compartido (Zustand); aplica reglas y llama a repositorios (`.store.ts`)
    ▸ `presentation/hooks/` — estado efímero de formularios y sus handlers; llama al store (`useNombre.ts`)
    ▸ `presentation/components/` — solo JSX y estilos (`.tsx` y `.styles.ts`)
    ▸ `presentation/screens/` — componen componentes y deciden visibilidad; sin handlers (`.screen.tsx`)

### Shared

    ▸ `shared/components/{Componente}/` — componentes usados por más de una feature (ej. Ruleta), con `.tsx`, `.styles.ts` y, si anima, `use{Componente}Anim.ts`. Ese hook encapsula Reanimated, no llama al store y recibe un resultado ya decidido en `domain/`
    ▸ `shared/navigation/` — React Navigation y tipos de rutas
    ▸ `shared/services/` — infraestructura: Firebase, cliente Axios de TMDB, notificaciones

### Reglas de dependencia

    ▸ Una feature nunca importa de otra feature; lo común sube a `shared/` o `core/`
    ▸ `core/` y `shared/` nunca importan de `features/`
    ▸ Pantallas y componentes nunca acceden a repositorios ni a Firestore

### Reglas de estilos

    ▸ Estilo de un solo componente: `.styles.ts` junto a él
    ▸ Valor visual global (paleta, fuentes, espaciado): `core/tema/`
    ▸ Patrón usado en dos o más features: componente en `shared/components/`

## ◆ Estructura del Backend (backend/functions/)

▸ `src/{módulo}/*.trigger.ts` — disparadores de Firebase (onSchedule, onCall); solo definen cuándo se ejecutan, validan auth y entrada, y llaman a la lógica
▸ `src/{módulo}/*.ts` — lógica pura; recibe `db`, la hora y el notificador por parámetro, sin depender del disparador
▸ `scripts/` — ejecutores locales contra Firestore real con cuenta de servicio; fuera de `src/` para que no se compilen ni se desplieguen
▸ Gestor de paquetes: npm (mobile usa pnpm)
