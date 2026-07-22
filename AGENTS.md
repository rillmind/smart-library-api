# AGENTS.md

Guidance for AI agents working in the `smart-library-api` repository. This is a Spring Boot REST API for a smart library system (Portuguese-language project: "Biblioteca Inteligente").

## Essential Commands

This project uses the Maven wrapper (`mvnw`) with Maven 3.9.15 and Java 21. There is no CI configuration, Makefile, or lint setup.

```bash
# Run the application (requires DB env vars — see "Environment" below)
./mvnw spring-boot:run

# Compile
./mvnw compile

# Run tests (single smoke test: contextLoads)
./mvnw test

# Build a packaged jar (excludes Lombok from the final jar)
./mvnw clean package

# Run infrastructure (PostgreSQL + Redis) and/or the API via Docker
docker compose up -d
```

## Environment

The app requires environment variables, loaded via the `spring-dotenv` library (reads a local `.env` file, also injects system env vars). Variables consumed in `application.properties`:

- `DB_URL` — PostgreSQL JDBC URL (project targets **Neon** hosted Postgres)
- `DB_USER` — DB username
- `DB_PASSWORD` — DB password
- `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` — Redis config (active in `application.properties`; Redis is set up in `docker-compose.yml` with password protection and session storage is enabled via `spring.session.store-type=redis`)

Hibernate dialect is pinned to `PostgreSQLDialect` and `ddl-auto=update`, so entity changes will alter the live schema on startup. `show-sql=true` logs all SQL.

## Architecture

### Package layout

Single `@SpringBootApplication` entry point at `bibliotecaInteligente.api.ApiApplication`. Feature code is organized into **modules**, each module self-contained under `modules/<name>/`:

```
modules/<domain>/
  ├── model/      — JPA @Entity classes
  ├── dto/        — request DTOs with validation annotations
  ├── controller/ — @RestController endpoints
  ├── service/    — @Service business logic
  └── repository/ — Spring Data JPA repositories
```

Five modules exist today:
- **user** — registration, login, update, delete (drives Spring Security auth)
- **livro** — book CRUD (title, author, description)
- **emprestimo** — loan management (checkout, renewal, return, fines)
- **fila** — waitlist queue for unavailable books
- **notificacao** — in-app notifications

Shared infrastructure lives outside modules: `config/SecurityConfig.java`.

### Control & data flow

Typical Spring layered flow: Controller → Service → Repository → JPA → PostgreSQL.

- **Auth flow**: `AuthController.login` calls `AuthenticationManager.authenticate(...)` with a `UsernamePasswordAuthenticationToken`, then stashes the `SecurityContext` into the HTTP session under the `SPRING_SECURITY_CONTEXT` key. `UserService` implements `UserDetailsService` and is the user-lookup backing the auth manager. Passwords are hashed with `BCryptPasswordEncoder` (bean in `SecurityConfig`).
- **Security rules** (`SecurityConfig`): CSRF disabled; only `/api/user/register` and `/api/user/login` are `permitAll()`; every other route requires an authenticated session. There is **no JWT** — auth is traditional session-based via Spring Security.
- Route prefixes are inconsistent: `UserController` is `/api/user`, while `LivroController` is `/livro` (no `/api` prefix). Don't assume a global base path.

## Conventions & Gotchas

### Naming
- **Repository classes are misspelled `Rpository`** (missing "e"): `UserRpository`, `LivroRpository`, `EmprestimoRpository`. This is an established typo across the codebase — do NOT "fix" it without a coordinated rename of all references.
- Package and entity code use Portuguese identifiers (`Livro`, `Emprestimo`, `deletarUserPorCpf`, `atualizarLivroPorId`). Match the language of the surrounding module when extending.
- DB tables are prefixed `tb_`: `tb_usuarios`, `tb_livros`, `tb_emprestimo`.

### Idiomatic inconsistencies to be aware of
The two modules use **different DI styles** deliberately — follow the precedent of the module you're editing:
- `user` uses field injection (`@Autowired`) — e.g. `UserController`, `UserService`.
- `livro` uses constructor injection via Lombok `@RequiredArgsConstructor` on the controller, but `LivroService` is **plain (not annotated `@Service`)** with a hand-written constructor. As a result `LivroService` is currently **not a Spring bean** and the `LivroController` will fail to autowire it at runtime. If you touch the livro module, add `@Service` to `LivroService` (this is an outstanding bug, not intentional).

### Entity gotchas
- `User.cpf` is the `@Id`, typed as `Integer` and validated with `@CPF` (Brazilian CPF validator). CPFs are 11 digits and will overflow Int semantics in some cases — the ID type choice is fragile but intentional. Don't switch to `Long`/`String` casually; it would require schema and auth-flow changes.
- `Livro.id` and `Emprestimo.id` declare `@GeneratedValue(strategy = GenerationType.UUID)` but are typed `Integer`. UUID generation with an `Integer` column is a **runtime mismatch** — expect errors on insert. Treat this as a known issue; do not paper over it without deciding a consistent type strategy.
- `Livro` has a `@ManyToOne` to `User` (column `cpf_usuario`) and an untyped `@OneToMany` list of `Emprestimo` named `livros` — the field name does not match its contents.
- The `User` entity imports `java.util.UUID` but never uses it.

### Pattern: partial updates
Both `UserService.atualizarUserPorCpf` and `LivroService.atualizarLivroPorId` implement "update only non-null fields" by rebuilding the entity with Lombok `@Builder` and ternary null-fallbacks, then `saveAndFlush`. If you add update endpoints, follow this same pattern rather than copying fields blindly.

### Error handling
Services throw bare `RuntimeException` for not-found conflicts (`"Usuario não encontrado!"`, `"Id não encontrado!"`). There is no `@ControllerAdvice` / `@ExceptionHandler`. New error responses propagate as 500 by default — consider adding a global exception handler if asked to improve error semantics, but don't do it unprompted.

### Other
- `UserDto.cpf` is a `String`, but the `User.cpf` entity field is `Integer`. The `registerUser` service never maps `dto.getCpf()` into the entity — only `email` and `password` are set. Registering a user currently persists null `nome` and `cpf`, violating their `nullable = false` / unique constraints. This is another pre-existing bug; flagging it here so you don't accidentally "refactor" it away while debugging.
- `AuthController.logout` is mapped to `@PostMapping("logout")` (missing leading slash — Spring tolerates it, but it's non-standard).

## Tests

Only a single default Spring Boot smoke test exists: `ApiApplicationTests.contextLoads()` (annotated `@SpringBootTest`). It requires the DB env vars/`spring-boot-starter-data-jpa-test` and `spring-boot-starter-webmvc-test`. There are **no unit tests** for controllers, services, or repositories. JUnit 5 (Jupiter) is the test framework. `mvn test` is the canonical test command.

## Source files of note

- `src/main/java/bibliotecaInteligente/api/config/SecurityConfig.java` — security beans: filter chain, `PasswordEncoder`, `AuthenticationManager`.
- `src/main/java/bibliotecaInteligente/api/modules/user/service/UserService.java` — `UserDetailsService` impl; registration + update/delete by CPF.
- `src/main/java/bibliotecaInteligente/api/modules/user/controller/AuthController.java` — login / logout endpoints.
- `src/main/java/bibliotecaInteligente/api/modules/livro/service/LivroService.java` — **missing `@Service` annotation** (see gotchas).
- `src/main/resources/application.properties` — all externalized config; Redis section active.
- `docker-compose.yml` — PostgreSQL + Redis + API services.
