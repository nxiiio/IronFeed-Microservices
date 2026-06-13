# IronFeed Microservicios

IronFeed es una red social fitness construida con una arquitectura de microservicios Spring Boot, un API Gateway centralizado, bases PostgreSQL separadas por dominio y un frontend Angular. El objetivo del proyecto es mantener una arquitectura simple, explícita y fácil de levantar localmente.

## Inicio Rápido

1. Crear el archivo `.env` desde el ejemplo:

```bash
cp .env.example .env
```

2. Asegurar que `JWT_SECRET` tenga al menos 32 caracteres:

```env
JWT_SECRET=change-me-with-at-least-32-characters
```

3. Levantar el backend completo con Docker Compose:

```bash
docker compose up -d --build
```

4. Abrir Swagger desde el API Gateway:

```text
http://localhost:8080/api/swagger-ui.html
```

El detalle de los endpoints de negocio se consulta desde Swagger.

## Arquitectura

El backend se comunica de forma sincrónica por REST. El frontend y los clientes consumen el sistema a través del API Gateway.

```text
Cliente / Angular
      |
      v
api-gateway :8080
      |
      +--> users-ms   :8081 --> users_db
      +--> workout-ms :8082 --> workout_db
      +--> social-ms  :8083 --> social_db
      +--> posts-ms   :8084 --> posts_db
```

Cada microservicio propietario de datos usa su propia base PostgreSQL. No hay joins entre microservicios ni base de datos compartida.

## Módulos

| Módulo | Responsabilidad | Puerto local |
|---|---|---:|
| `api-gateway` | Entrada principal al backend, ruteo REST y validación JWT para rutas protegidas | `8080` |
| `users-ms` | Registro, login, emisión JWT, perfiles y datos de usuario | `8081` |
| `workout-ms` | Ejercicios, rutinas, sesiones de entrenamiento y records personales | `8082` |
| `social-ms` | Relaciones de seguimiento entre usuarios | `8083` |
| `posts-ms` | Publicaciones, reacciones, comentarios y feed paginado global | `8084` |
| `IronFeed-Frontend` | Cliente Angular para autenticación y feed | Servidor de desarrollo Angular |

## Tecnologías

| Área | Tecnología |
|---|---|
| Backend | Java 21, Spring Boot 4 |
| Gateway | Spring Cloud Gateway Server MVC |
| Seguridad | Spring Security, JWT |
| Persistencia | PostgreSQL, Spring Data JPA |
| Frontend | Angular 21 con SSR |
| Contenedores | Docker Compose |

## Variables De Entorno

El proyecto usa `.env` para compartir secretos entre `users-ms` y `api-gateway`.

| Variable | Uso | Requisito |
|---|---|---|
| `JWT_SECRET` | Firma y validación de tokens JWT | Mínimo 32 caracteres |

Ejemplo:

```env
JWT_SECRET=change-me-with-at-least-32-characters
```

No commitear valores reales de `.env`.

## Ejecución Con Docker

Levantar todo el backend:

```bash
docker compose up -d --build
```

Ver contenedores:

```bash
docker compose ps
```

Ver logs del Gateway:

```bash
docker compose logs -f api-gateway
```

Apagar el entorno:

```bash
docker compose down
```

## Documentación Swagger

La documentación OpenAPI se publica desde el API Gateway. Los endpoints de negocio de cada microservicio deben consultarse ahí, no en este README.

| Recurso | URL |
|---|---|
| Swagger UI agregado | `http://localhost:8080/api/swagger-ui.html` |
| OpenAPI `users-ms` | `http://localhost:8080/api/openapi/users` |
| OpenAPI `workout-ms` | `http://localhost:8080/api/openapi/workout` |
| OpenAPI `social-ms` | `http://localhost:8080/api/openapi/social` |
| OpenAPI `posts-ms` | `http://localhost:8080/api/openapi/posts` |

Swagger UI muestra un selector con las APIs disponibles. Desde ahí se revisan rutas, parámetros, cuerpos de request, respuestas y validaciones.

## Endpoints BaseController

Cada microservicio expone un endpoint base de metadata con el nombre y versión del servicio. Como los microservicios están pensados para ser privados, se consumen desde el API Gateway.

| Servicio | Endpoint Gateway | Respuesta esperada |
|---|---|---|
| `users-ms` | `GET http://localhost:8080/api/users/info` | `{ "name": "users-ms", "version": "0.0.1-SNAPSHOT" }` |
| `workout-ms` | `GET http://localhost:8080/api/workout/info` | `{ "name": "workout-ms", "version": "0.0.1-SNAPSHOT" }` |
| `social-ms` | `GET http://localhost:8080/api/social/info` | `{ "name": "social-ms", "version": "0.0.1-SNAPSHOT" }` |
| `posts-ms` | `GET http://localhost:8080/api/posts/info` | `{ "name": "posts-ms", "version": "0.0.1-SNAPSHOT" }` |

Estos endpoints son útiles para validar rápidamente que el Gateway está ruteando al microservicio correcto.

## Frontend

El frontend está en `IronFeed-Frontend/` y es una aplicación Angular.

Instalar dependencias:

```bash
cd IronFeed-Frontend
npm install
```

Levantar frontend en desarrollo:

```bash
npm start
```

El frontend debe consumir el backend por el API Gateway en `http://localhost:8080`.

## Bases De Datos

Docker Compose levanta un contenedor PostgreSQL y ejecuta scripts de inicialización desde:

```text
docker/postgres/init
```

Cada microservicio apunta a su propia base:

| Servicio | Base |
|---|---|
| `users-ms` | `users_db` |
| `workout-ms` | `workout_db` |
| `social-ms` | `social_db` |
| `posts-ms` | `posts_db` |

## Decisiones De Arquitectura

- El API Gateway es el punto de entrada del backend.
- Los microservicios deben tratarse como privados en despliegues reales.
- Cada microservicio propietario de datos tiene su propia base PostgreSQL.
- Las referencias entre servicios usan IDs lógicos, no foreign keys entre bases.
- La documentación de endpoints de negocio vive en Swagger.
