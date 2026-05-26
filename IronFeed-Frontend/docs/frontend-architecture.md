# Arquitectura frontend de IronFeed

## Objetivo

El frontend usa una estructura **feature-first** para que cada funcionalidad grande tenga sus propias páginas, componentes y servicios sin mezclar todo en carpetas globales.

La regla principal es simple:

> Primero se agrupa por funcionalidad; solo se comparte lo que realmente será reutilizable.

Esto evita que `components/`, `services/` y `models/` se transformen en carpetas genéricas difíciles de mantener.

## Estructura actual

```txt
src/app/
├── core/
│   └── services/
│       └── toast.service.ts
│
├── features/
│   └── feed/
│       ├── components/
│       ├── pages/
│       │   └── feed-page/
│       └── services/
│
├── shared/
│   ├── models/
│   └── ui/
│       └── toast-container/
│
├── app.config.ts
├── app.routes.ts
└── app.ts
```

## Responsabilidades por carpeta

### `core/`

Contiene infraestructura global de la aplicación.

Ejemplos actuales o futuros:

- servicios globales, como `ToastService`;
- interceptors HTTP;
- servicios de autenticación global;
- configuración transversal de la app.

Regla:

> Si debe existir una sola vez para toda la aplicación, probablemente va en `core/`.

### `features/`

Contiene funcionalidades principales de la aplicación. Cada feature agrupa sus propias piezas internas.

Ejemplo actual:

```txt
features/feed/
├── components/
├── pages/
└── services/
```

Regla:

> Si algo pertenece solo al feed, vive dentro de `features/feed/`.

Cuando crezcan nuevas pantallas, pueden aparecer features como:

```txt
features/auth/
features/profile/
features/settings/
features/post-detail/
```

### `features/feed/pages/`

Contiene componentes de página.

Una página representa una vista enrutable de la aplicación. Por ejemplo:

```txt
features/feed/pages/feed-page/
```

Regla:

> Una página coordina la vista; no debería convertirse en un contenedor infinito de componentes reutilizables.

### `features/feed/components/`

Contiene componentes visuales que pertenecen al feed.

Ejemplos:

- `post-card`
- `post-list`
- `post-composer`
- `feed-header`
- `feed-pagination`
- `featured-exercises`
- `sidebar-nav`

Regla:

> Si el componente no tiene sentido fuera del feed, se queda dentro de la feature.

### `features/feed/services/`

Contiene servicios HTTP usados por la feature del feed.

Ejemplos actuales:

- `posts.service.ts`
- `users.service.ts`
- `exercises.service.ts`

Regla:

> Si el servicio existe para alimentar una feature concreta, puede vivir dentro de esa feature.

Si más adelante un servicio empieza a usarse en muchas features, se puede mover a una capa compartida o de API común.

### `shared/`

Contiene piezas reutilizables que no pertenecen a una feature específica.

#### `shared/models/`

Contiene tipos TypeScript compartidos entre varias partes del frontend.

Ejemplos:

- `Post`
- `AppUser`
- `Exercise`
- `Feed`

Regla:

> Si un tipo representa un dato usado por más de una feature, puede vivir en `shared/models/`.

#### `shared/ui/`

Contiene componentes visuales reutilizables.

Ejemplo actual:

- `toast-container`

Regla:

> Si un componente puede aparecer en cualquier parte de la app, va en `shared/ui/`.

## Reglas prácticas para seguir creciendo

### 1. Crear una feature por área funcional

Cuando agreguemos login, no debería ir a `components/login` ni `pages/login` global.

Debe ir en:

```txt
features/auth/
```

### 2. No mover algo a `shared/` demasiado temprano

Que dos componentes se parezcan no significa que ya deban ser compartidos.

Primero debe existir una reutilización real.

### 3. Mantener los componentes chicos

Un componente debería tener una responsabilidad clara:

- mostrar una card;
- renderizar una lista;
- mostrar un header;
- emitir un evento de paginación.

Si empieza a cargar datos, mostrar UI, manejar errores y manejar navegación al mismo tiempo, probablemente está creciendo demasiado.

### 4. Mantener Angular moderno

La convención del proyecto es usar:

- standalone components;
- `ChangeDetectionStrategy.OnPush`;
- `inject()` para inyección de dependencias;
- `signal()` y `computed()` para estado local;
- control flow moderno: `@if`, `@for`, `@switch`.

### 5. No meter arquitectura pesada antes de tiempo

Por ahora no se usará NgRx, stores globales ni facades complejas.

El proyecto debe crecer con una base clara, pero sin esconder complejidad innecesaria.

## Cuándo mover algo de lugar

| Caso | Ubicación recomendada |
|---|---|
| Componente usado solo por feed | `features/feed/components/` |
| Página enrutable del feed | `features/feed/pages/` |
| Servicio usado solo por feed | `features/feed/services/` |
| Servicio global | `core/services/` |
| Modelo reutilizable | `shared/models/` |
| Componente UI reutilizable | `shared/ui/` |

## Principio final

La estructura debe ayudar a entender el proyecto, no impresionar.

Si una carpeta hace más difícil encontrar el código, esa carpeta está mal pensada.
