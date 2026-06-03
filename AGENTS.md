# AGENTS.md

## Scope

These instructions apply to the entire repository.

## Project Overview

IronFeed is a fitness social network built as a **Spring Boot microservices backend** plus an **Angular frontend**. The current architecture is intentionally synchronous and simple: REST through the API Gateway, PostgreSQL per persistence-owning microservice, and no Kafka or dedicated feed service.

Always verify the existing directories and code before claiming what is implemented. The project has changed significantly over time; older docs can be stale.

## Current Modules

These modules currently exist in the repository:

| Module | Responsibility | Current role | Port |
|---|---|---|---|
| `api-gateway` | Routes frontend/API traffic to backend services and validates JWT for protected routes | Gateway module | `8080` |
| `users-ms` | Registration, login, JWT issuing, profile and user-owned data | Microservice | `8081` |
| `workout-ms` | Exercises, routines, workout sessions, personal records | Microservice | `8082` |
| `social-ms` | Follow/unfollow relationships | Microservice | `8083` |
| `posts-ms` | Posts, reactions, comments, and global paginated feed | Microservice | `8084` |
| `IronFeed-Frontend` | Angular client for auth and feed UI | Frontend application | Angular dev server when explicitly started |

Pending microservices:

| Service | Responsibility |
|---|---|
| `challenges-ms` | Challenge creation, enrollment, progress tracking |
| `rankings-ms` | Weekly volume, active streak, personal record rankings |
| `notifications-ms` | Real-time notifications |

## Working Directory and Commands

For commands, work from the specific module being changed, for example `users-ms/`, `posts-ms/`, `api-gateway/`, or `IronFeed-Frontend/`.

```bash
./mvnw spring-boot:run          # start the selected Spring module only when explicitly requested
npm start                       # start the Angular frontend only when explicitly requested
```

To start the database, run from the project root only when explicitly requested:

```bash
docker compose up -d
```

## Backend Architecture Rules

- Treat the backend as **microservices first**: each microservice owns its own domain and boundaries.
- Each persistence-owning microservice owns its own PostgreSQL database.
- Never design shared databases or cross-service joins.
- Cross-service user references are logical UUID references, not physical foreign keys.
- Cross-service consistency must not rely on database-level foreign keys across services.
- Do not introduce Kafka, messaging infrastructure, or event distribution.
- Personal records are auto-detected by the workout service; users do not report them manually.
- Challenge progress is auto-updated from workout sessions; users do not report it manually.
- `users-ms` currently issues JWTs.
- `api-gateway` currently validates JWTs as a resource server for protected routes.
- Do not expand authentication, authorization, roles, permissions, or security rules unless the user explicitly asks.

## Current Feed Phase

- `feed-ms` has been removed permanently.
- `posts-ms` owns the current global paginated feed.
- `GET /api/posts/page` is the current paginated feed endpoint and is routed through `api-gateway` to `posts-ms`.
- The feed does **not** use a separate `feed_db`, read model, Kafka, or event distribution.
- Public pagination is one-based: clients request `page=1` for the first page.

## Deferred Infrastructure

The following are roadmap items only. Do **not** implement or expand them unless the user explicitly asks:

- Testcontainers or test infrastructure.
- Service discovery, Eureka, or new Spring Cloud infrastructure beyond the current gateway and Feign usage.
- Additional API Gateway infrastructure beyond explicitly requested route/error/security changes.
- Additional JWT/security behavior beyond the current implemented login/token validation flow.

## Microservice Structure Pattern

Apply this structure pattern to every backend microservice unless the existing code in that microservice already establishes a deliberate variation:

```text
{microservice}/src/main/java/cl/worellana/{microservice_package}/
├── config/       Configuration classes, when needed
├── model/        JPA entities and domain models
├── model/dto/    Request and response DTOs
├── exception/    Custom exceptions for the microservice
├── repository/   Spring Data repositories
├── service/      Business logic and transactions
└── controller/   REST endpoints and local error handling
```

Before refactoring structure, verify the existing package organization and preserve it unless the user explicitly requests a refactor.

## Backend Development Flow

- Develop each microservice by layers in this order: **entity/model first**, then **service**, then **controller**.
- Keep controllers thin; business rules belong in services, and persistence details belong in repositories/entities.
- Prefer constructor injection for required dependencies.
- Use Lombok on entities as established in the codebase.
- Prefer UUID primary keys for microservice-owned entities unless existing code or documentation deliberately says otherwise.

## Frontend Architecture Rules

- `IronFeed-Frontend` is an Angular 21 application with SSR enabled.
- Check `.docs/frontend-architecture.md` before making frontend structure decisions.
- Use feature-first organization.
- Current features include `auth` and `feed`.
- `core/auth` contains auth guards, interceptor, models, storage service, and auth service.
- The frontend talks to the backend through `environment.apiGatewayUrl`, currently `http://localhost:8080`.
- Prefer standalone components.
- Use `ChangeDetectionStrategy.OnPush` when appropriate.
- Prefer `inject()` for Angular dependency injection.
- Prefer `signal()` and `computed()` for local state.
- Use modern Angular control flow (`@if`, `@for`, `@switch`) where appropriate.
- Do not introduce NgRx, global stores, facades, or heavy frontend architecture unless the user explicitly asks.
- Do not move code to `shared/` too early; share only when real reuse exists.

## Documentation and Database Rules

- Check `.docs/functional-requirements.md` for business requirements (RF-01 to RF-28) before implementing related features.
- Analyze the functional requirements for context, but do not assume every requirement must be implemented immediately.
- Implement only the requirements that match the current module, current layer, and the user's explicit request.
- Do not modify `.docs/functional-requirements.md` unless the user explicitly asks.
- Check `.docs/db-architecture.md` before making persistence decisions.
- `.docs/db-architecture.md` should document current entity names unless a deliberate code refactor is made first.
- Keep `.docs/kafka-architecture.md` empty; Kafka is not part of the project architecture.
- Use `data.sql` for seed data with `INSERT` statements only.
- Do not add DDL, constraints, indexes, `CREATE TABLE`, `DROP TABLE`, or schema management to `data.sql` unless explicitly requested.
- When adding seed rows with references, verify referenced UUIDs exist in the corresponding seed files.

## API Gateway and Error Handling

- `api-gateway` handles routes that do not exist at the Gateway level.
- Each microservice handles its own domain errors and local invalid routes.
- Do not centralize or rewrite downstream domain `404` responses in `api-gateway`.
- Gateway routing changes must stay aligned with existing microservice endpoints.
- Frontend requests should go through `api-gateway`, not directly to individual microservices, unless the user explicitly asks otherwise.

## Tests, Builds, and Commands

- Do not create tests.
- Do not implement tests.
- Do not run tests.
- Do not run builds.
- Do not run package commands.
- Do not start servers unless explicitly requested.
- Existing generated test files may remain, but do not use, expand, or rely on them unless the user explicitly changes this rule.

## Do Not

- Do not implement Kafka or recreate `feed-ms`.
- Do not implement Testcontainers yet.
- Do not add service discovery/Eureka yet.
- Do not expand API Gateway, JWT, or security behavior unless explicitly requested.
- Do not assume planned architecture pieces are already active in the current codebase.
- Do not add AI attribution or `Co-Authored-By` lines to commits.
- Use descriptive commit messages in Spanish without Conventional Commit prefixes unless the user explicitly asks otherwise.

## Agent Behavior for This Repo

- Always respond in the same language the user writes in.
- Verify the existing code before claiming something is implemented.
- Never agree with a technical claim without verification; check code or docs first.
- If the user is wrong, explain why with evidence. If you were wrong, acknowledge it with proof.
- Keep recommendations aligned with the current phase of the project, not the full future architecture.
- When adding or changing code, respect current package organization unless the user explicitly requests a refactor.
- Treat planned services and deferred infrastructure as roadmap context, not as permission to implement them. Kafka and `feed-ms` are not roadmap items.
