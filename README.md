# Instituto Mão Amiga

Aplicativo mobile (React Native + Expo) para gerenciar **pontos de coleta/distribuição** e **doações** do Instituto Mão Amiga. Os dados ficam em uma API Spring Boot própria, na pasta [`api/`](./api).

## Funcionalidades

- **Pontos:** listar com busca (nome ou bairro) e rolagem infinita, ver detalhe, cadastrar, editar e excluir.
- **Favoritos:** marcar pontos com ♡/♥ (salvos no aparelho) e ver a tela "Meus pontos".
- **Doações:** registrar escolhendo o ponto de destino, histórico com filtro por tipo e rolagem infinita, detalhe, edição e exclusão.
- **Tratamento de erros:** carregando, vazio, API desligada (400/404 com mensagem clara).

## Tecnologias

| Camada | Stack |
|---|---|
| App | Expo, React Native, TypeScript, React Navigation, AsyncStorage |
| API | Java 17+, Spring Boot 3.5, Spring Data JPA, H2 (arquivo), Bean Validation, springdoc (Swagger) |

## Estrutura

```
.
├── App.tsx                  # navegação
├── Tela*.tsx                # telas (lista, detalhe, formulários, doações, favoritos)
├── src/services/
│   ├── api.ts               # único lugar com fetch + URL da API
│   ├── pontosService.ts     # chamadas de pontos
│   ├── doacoesService.ts    # chamadas de doações
│   └── favoritosStorage.ts  # favoritos (ids) no AsyncStorage
└── api/                     # API Spring Boot (ver api/README.md)
```

## Como rodar

### 1. API

Requisitos: Java 17+ (testada no JDK 25) e Maven 3.9.

```bash
cd api
mvn spring-boot:run
```

- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- Os dados ficam em `api/data/` (H2 em arquivo) e o seed de pontos roda só na primeira execução.

### 2. App

Requisitos: Node.js e npm.

```bash
npm install
npx expo start
```

### 3. Configurar o IP da API

A URL vem da variável `EXPO_PUBLIC_API_URL` no arquivo `.env`:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
```

- No **navegador** pode usar o padrão (`http://localhost:8080`).
- No **celular** use o IP do computador na rede local (não `localhost`). Celular e computador devem estar na mesma rede.
- Reinicie o `expo start` depois de alterar o `.env`.

## Endpoints da API

Resumo (detalhes em [`api/README.md`](./api/README.md)):

| Recurso | Rotas |
|---|---|
| Pontos | `GET/POST /api/v1/pontos`, `GET/PUT/DELETE /api/v1/pontos/{id}`, `GET /api/v1/pontos/filtro?filtro=&page=&size=` |
| Doações | `POST /api/v1/doacoes`, `GET/PUT/DELETE /api/v1/doacoes/{id}`, `GET /api/v1/doacoes/filtro?filtro=&page=&size=` |

## Roteiro de demonstração (até 3 minutos)

1. **Pontos (0:00–1:00):** buscar por bairro; "+ Novo ponto"; abrir o ponto e "Editar ponto"; "Excluir ponto" (confirmação Cancelar/Excluir).
2. **Favoritos (1:00–1:20):** tocar no ♡ de um ponto; abrir "♥ Meus pontos"; desmarcar.
3. **Doações (1:20–2:20):** "Minhas doações" → "+ Nova doação" escolhendo o ponto; ver no topo do histórico; filtrar por tipo; abrir, "Editar doação" e "Excluir doação".
4. **Erros (2:20–2:45):** no Swagger mostrar um 400 (campo vazio ou quantidade 0) e um 404 (id inexistente); desligar a API e mostrar a mensagem no app.
5. **Decisão técnica (2:45–3:00):** favoritos ficam no aparelho (só os ids, em AsyncStorage) por serem preferência pessoal; pontos e doações ficam no servidor para serem compartilhados e validados em um só lugar.

## Fluxo de trabalho

Issues `[N2-1]` a `[N2-8]`, uma branch por camada (`feature/api-n2`, `feature/app-n2`), commits no padrão Conventional Commits com `refs #N` e PR para a `main`.
