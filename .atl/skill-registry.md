# Skill Registry — IronFeed-Microservicios

Generated: 2026-04-22

## User Skills

| Skill | Trigger |
|-------|---------|
| `branch-pr` | When creating a pull request, opening a PR, or preparing changes for review |
| `go-testing` | When writing Go tests, using teatest, or adding test coverage |
| `issue-creation` | When creating a GitHub issue, reporting a bug, or requesting a feature |
| `judgment-day` | Parallel adversarial review — when completing a major feature or needing independent review |
| `skill-creator` | When creating a new skill or documenting patterns for AI |
| `skill-registry` | When updating skills, "actualizar skills", or after installing/removing skills |
| `sdd-init` | Initialize SDD context in a project |
| `sdd-explore` | Investigate an idea before committing to a change |
| `sdd-propose` | Create a change proposal |
| `sdd-spec` | Write specifications with requirements and scenarios |
| `sdd-design` | Create technical design document |
| `sdd-tasks` | Break down a change into implementation tasks |
| `sdd-apply` | Implement tasks from the change |
| `sdd-verify` | Validate implementation against specs |
| `sdd-archive` | Sync delta specs and archive a completed change |
| `sdd-onboard` | Guided end-to-end SDD walkthrough |

## Compact Rules

### branch-pr
- Always follow the issue-first enforcement system before creating PRs
- Create a GitHub issue first if one doesn't exist
- Branch name format: `{type}/{issue-number}-{short-description}`

### issue-creation
- Follow the issue-first enforcement system
- Include clear acceptance criteria
- Link to related issues or PRs

### judgment-day
- Use for adversarial parallel review of completed major features
- Launch two independent blind judge sub-agents simultaneously
- Synthesize findings and apply fixes

### sdd-apply (Java/Spring Boot context)
- Follow existing package structure: `cl.worellana.users_ms`
- Use Lombok annotations (`@Data`, `@Builder`, `@NoArgsConstructor`, `@RequiredArgsConstructor`) to reduce boilerplate
- JPA entities use proper annotations; repositories extend `JpaRepository`
- Spring Security config goes in a `@Configuration` class (not yet added — add when implementing JWT)
- Tests use JUnit 5 + Spring Boot test slices (`@WebMvcTest`, `@DataJpaTest`, `@SpringBootTest`)
- Test command: `./mvnw test` (run from `users-ms/` directory)
- Each microservice has its own PostgreSQL DB — no cross-service joins
- Cross-service data consistency is achieved through Kafka events, not DB-level FKs
- AppUser currently uses Long ID with IDENTITY strategy (docs spec UUID — alignment needed before adding new microservices)

## Project Conventions

- **No CLAUDE.md, AGENTS.md, or .cursorrules found** — no project-level agent instructions
- **Build tool**: Maven (mvnw wrapper)
- **Test command**: `./mvnw test` (from `users-ms/`)
- **Docker**: PostgreSQL 15.17-alpine3.22 via root `docker-compose.yml`
- **Docs**: `.docs/` directory contains db-architecture.md, functional-requirements.md, proyect-info.md, kafka-architecture.md
- **Architecture**: Microservices + EDA; 8 services total; only `users-ms` implemented so far
- **Planned but not yet implemented**: JWT auth, Spring Security, Testcontainers, API Gateway (Spring Cloud Gateway), Kafka
