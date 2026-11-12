# Mao Amiga API

Spring Boot 3.5 / Java 17+ (tested on JDK 25) / H2 file database (`./data/maoamiga`).

## Run

```
cd api
mvn spring-boot:run
```

Swagger UI: http://localhost:8080/swagger-ui.html

## Endpoints

### Pontos (refs #20, #21)
| Method | URL | Notes |
|---|---|---|
| GET | `/api/v1/pontos` | list all |
| GET | `/api/v1/pontos/{id}` | 404 if missing |
| POST | `/api/v1/pontos` | 201, 400 on empty field |
| PUT | `/api/v1/pontos/{id}` | 404 / 400 |
| DELETE | `/api/v1/pontos/{id}` | 204 |
| GET | `/api/v1/pontos/filtro?filtro=&page=0&size=10&sort=bairro,asc` | search by name or neighborhood; default 10 items sorted by name |

Paged response format: `{ "content": [...], "page": { "size", "number", "totalElements", "totalPages" } }`

Examples:
- No filter: `GET /api/v1/pontos/filtro`
- By neighborhood: `GET /api/v1/pontos/filtro?filtro=bueno`
- Second page: `GET /api/v1/pontos/filtro?page=1`

### Doacoes (refs #24)
| Method | URL | Notes |
|---|---|---|
| GET | `/api/v1/doacoes/filtro?filtro=&page=0&size=10` | by item type, newest first |
| GET | `/api/v1/doacoes/{id}` | 404 if missing |
| POST | `/api/v1/doacoes` | 400 if quantity <= 0 or empty fields; `criadoEm` set by server |
| PUT | `/api/v1/doacoes/{id}` | keeps `id` and `criadoEm` |
| DELETE | `/api/v1/doacoes/{id}` | 204 |

Request body: `{ "tipoItem": "Arroz", "quantidade": 3, "pontoDestino": "Banco de Alimentos Centro" }`

Swagger screenshots (including a 400 and a 404) must be added by the author before the presentation.
