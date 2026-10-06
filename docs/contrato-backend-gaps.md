# Gaps de contrato — backend ↔ frontend

> Documento vivo listando o que o frontend espera e o `pi2-backend` ainda não entrega. Cada seção já traz um corpo pronto para virar issue no repositório do backend.

Varredura feita em 2026-10-06 contra `pi2-backend` (branch `main`), com integração real exercitada via `docker compose up` + frontend em modo `VITE_USE_MOCKS=false`.

---

## 1. Expor OpenAPI em `GET /api/openapi.json`

**Estado atual**: nenhum plugin de OpenAPI/Swagger instalado. Nenhum endpoint devolve schema. O frontend configura `orval` para ler de `http://localhost:3000/api/openapi.json` e o comando `npm run api:generate` falha.

**Esperado pelo frontend**:

- Endpoint `GET /api/openapi.json` retorna o schema OpenAPI 3.1 do serviço.
- Todas as rotas públicas descritas com body/response via Zod (ou outro gerador).
- Tags por domínio (`auth`, `replays`, `arenas`, `quadras`) para o orval produzir hooks separados.

**Issue sugerida** (`pi2-backend`):

```
Título: Expor contrato OpenAPI em /api/openapi.json

O frontend consome o schema via orval (ver pi2-frontend/orval.config.ts) e hoje npm run api:generate falha porque o endpoint não existe.

Tarefas:
- adicionar @fastify/swagger + @fastify/swagger-ui
- registrar schemas Zod por rota (fastify-type-provider-zod já instalado)
- expor /api/openapi.json e, opcionalmente, /docs
- tags: auth, replays, arenas, quadras

Critério de aceitação:
- GET /api/openapi.json retorna JSON válido 3.1
- cada rota pública tem body/response/params descritos
- rodar npm run api:generate no pi2-frontend gera endpoints.ts sem erros
```

---

## 2. `GET /arenas` — listar arenas

**Estado atual**: endpoint não existe. Frontend fallback: `VITE_USE_MOCKS=true` para servir mock local.

**Contrato esperado** (IDs são UUIDs — mesma convenção que `GET /replays` já usa):

- Método: `GET /arenas`
- Query params (opcionais): `cidade?: string`, `q?: string` (busca por nome/cidade).
- Resposta `200`:

```ts
{
  data: Array<{
    id: string        // uuid
    clienteId: string // uuid do gestor
    nome: string
    cidade: string
    endereco: string
    fotoUrl: string
  }>
}
```

- Erros: `500` genérico.
- Filtra arenas de gestores inativos (quando aplicável).

**Observação sobre tipo do id no frontend**: o stub `src/lib/api/arenas.ts` hoje tipa `id` como `number` porque esse era o shape dos mocks. Quando o endpoint entrar, precisa trocar para `string` (ou `number | string`) para aceitar UUID.

**Issue sugerida** (`pi2-backend`):

```
Título: Implementar GET /arenas (listagem com filtros)

Frontend precisa listar arenas na tela "/app/arenas" (ver pi2-frontend/src/pages/app/arenas.tsx).

Contrato:
- GET /arenas?cidade=<string>&q=<string>
- 200 { data: ArenaDto[] } onde ArenaDto = {
    id: uuid, clienteId: uuid, nome, cidade, endereco, fotoUrl
  }

Tarefas:
- query SELECT a.id, a.id_gestor AS clienteId, a.nome, a.cidade, a.endereco, a.foto_url AS fotoUrl FROM arena a
- filtros LIKE para cidade e q (q busca em nome e cidade)
- ordenação por nome ASC
- registrar schema no OpenAPI (bloqueado pelo gap #1)
```

---

## 3. `GET /arenas/:id/quadras` — listar quadras de uma arena

**Estado atual**: endpoint não existe. Frontend fallback: mock local via `VITE_USE_MOCKS=true`. O stub do frontend em `src/lib/api/quadras.ts` hoje aponta para `GET /quadras` (listagem global); se o backend preferir `GET /arenas/:id/quadras`, o stub é atualizado — avisar via comentário na issue.

**Contrato esperado** (listagem global, forma mais simples; IDs são UUIDs):

- Método: `GET /quadras`
- Query params (opcionais): `arenaId?: string` (uuid), `disponivel?: boolean`.
- Resposta `200`:

```ts
{
  data: Array<{
    id: string      // uuid
    arenaId: string // uuid
    nome: string
    disponivel: boolean
  }>
}
```

- Erros: `500` genérico.

**Observação sobre tipo do id no frontend**: igual ao gap #2 — stub tipa como `number` por legado dos mocks, trocar para `string` quando o endpoint entrar.

**Issue sugerida** (`pi2-backend`):

```
Título: Implementar GET /quadras (listagem com filtro por arena)

Frontend precisa listar quadras na tela "/app/quadras" (ver pi2-frontend/src/pages/app/quadras.tsx), com filtro opcional por arena.

Contrato:
- GET /quadras?arenaId=<uuid>&disponivel=<boolean>
- 200 { data: QuadraDto[] } onde QuadraDto = { id: uuid, arenaId: uuid, nome, disponivel }

Tarefas:
- query SELECT q.id, q.id_arena AS arenaId, q.nome, q.disponivel FROM quadra q
- filtros por id_arena e disponivel
- ordenação por nome ASC
- registrar schema no OpenAPI (bloqueado pelo gap #1)

Alternativa: expor como GET /arenas/:id/quadras — se preferir essa forma, me chama no PR do pi2-frontend que ajusto o stub.
```

---

## 4. `POST /login` — emitir JWT real + middleware de auth

**Estado atual**:

- Controller usa array em memória; usuário hardcoded `teste@email.com` / `123456`.
- Response tem campo `token?: string`, mas nunca é preenchido.
- Nenhuma rota é protegida.

**Esperado pelo frontend**:

- `POST /login` com body `{ email, password }` retorna `200 { message, data: { id, name, email, token } }`.
- `token` é um JWT HS256/RS256 com expiração ≥ 1 dia.
- Rotas sensíveis (ex.: `POST /replays`, `GET /replays/:id/download`) validam `Authorization: Bearer <token>`.
- Password hash via bcrypt na tabela `usuario.senha_hash`.
- Erro `401` com `{ message }` quando credenciais inválidas, usuário bloqueado ou JWT inválido/expirado.

**Issue sugerida** (`pi2-backend`):

```
Título: Emitir JWT em POST /login e proteger rotas sensíveis

Login atual retorna sucesso sem token real. Frontend injeta Authorization: Bearer <token> no axios (ver pi2-frontend/src/lib/api/mutator/axios-instance.ts) mas o header fica vazio porque o backend não emite.

Tarefas:
- adicionar @fastify/jwt (secret via env)
- /register: salvar senha com bcrypt (10 rounds) em usuario.senha_hash
- /login: comparar com bcrypt, incrementar tentativas_login, bloquear após 5 (RNF-04)
- resposta de /login: { data: { id, name, email, token } } com JWT (exp 1d)
- middleware verifyJwt plugin para rotas protegidas
- aplicar em: POST /replays, GET /replays/:id/download, qualquer rota de admin
- 401 padronizado: { message: "Credenciais inválidas" | "Sessão expirada" }
```

---

## 5. `GET /replays/:id/download` — aceitar UUID no path

**Estado atual**: a seed (`src/db/init/002_seed.sql`) usa UUIDs em todas as tabelas, inclusive `replay.id` (ex.: `60000000-0000-0000-0000-000000000010`). `GET /replays` já devolve `id` como UUID. Mas o handler de `GET /replays/:id/download` valida o `:id` como numérico e rejeita UUIDs com:

```json
{ "error": { "message": "ID do replay inválido" } }
```

Reproduzível com:

```bash
curl http://localhost:3000/replays/60000000-0000-0000-0000-000000000010/download
```

**Efeito no frontend**: na tela `/app/replays/:id` o botão "Baixar replay" dispara o toast de erro ("Não foi possível baixar o replay") para qualquer replay vindo da seed.

**Esperado pelo frontend**: aceitar `:id` como UUID (ou `number | string`), consultar `replay` pelo id, retornar `{ data: { id, fileName, downloadUrl } }`.

**Issue sugerida** (`pi2-backend`):

```
Título: GET /replays/:id/download rejeita UUIDs; permitir id da seed

GET /replays já devolve ids UUID (ex.: 60000000-0000-0000-0000-000000000010) porque é esse o shape da seed em src/db/init/002_seed.sql. Mas o handler de /download valida o :id como numérico e retorna 400 { error: { message: "ID do replay inválido" } }.

Repro:
  curl http://localhost:3000/replays/60000000-0000-0000-0000-000000000010/download

Esperado: aceitar UUID, buscar replay pelo id, devolver 200 { data: { id, fileName, downloadUrl } }.

Impacto no frontend: a página /app/replays/:id (botão "Baixar replay") só funciona hoje se o replay tiver id numérico, o que não acontece com os dados seedados.
```

---

## 6. `.env.example` do backend tem `POSTGRES_PORT=0000`

**Estado atual**: `pi2-backend/.env.example` entrega `POSTGRES_PORT=0000`, que invalida o `docker-compose.yml` (ao mapear `"${POSTGRES_PORT}:5432"` o Docker rejeita a porta). Quem clona o repo e segue o README (`cp .env.example .env && docker compose up`) recebe erro no primeiro boot.

**Esperado**: `POSTGRES_PORT=5432` (ou um comentário dizendo "escolha uma porta livre no host; o container sempre escuta em 5432 internamente").

**Issue sugerida** (`pi2-backend`):

```
Título: .env.example quebra o docker compose (POSTGRES_PORT=0000)

O arquivo .env.example define POSTGRES_PORT=0000. Como docker-compose.yml faz "${POSTGRES_PORT}:5432", o engine recusa a porta e o container tagravado-db não sobe.

Sugestão:
  POSTGRES_PORT=5432
  # porta no host — mude se já tiver um Postgres rodando (ex.: 5433)
  # o container escuta sempre em 5432 internamente

Também incluir no README que, se a 5432 estiver ocupada, basta trocar a env para outra porta livre.
```

---

## 7. CORS não registrado na API

**Estado atual**: `src/app.ts` do backend não registra `@fastify/cors`. Em dev isso não é problema porque o Vite proxy do frontend (`vite.config.ts`) encaminha `/api/*` → `localhost:3000/*` e o browser enxerga mesma-origem. Mas qualquer consumo direto do backend por outro front (ou deploy em subdomínio separado) vai bater em `CORS error`.

**Esperado**: registrar `@fastify/cors` com allowlist por ambiente.

**Issue sugerida** (`pi2-backend`):

```
Título: Registrar @fastify/cors com allowlist por ambiente

Hoje o frontend funciona em dev só porque o Vite proxy esconde o cross-origin. Em staging/produção, com o SPA servido de outro domínio, qualquer fetch direto para a API vai falhar por CORS.

Tarefas:
- adicionar @fastify/cors nas deps
- em src/app.ts: await app.register(cors, { origin: <lista por env>, credentials: true })
- allowlist mínima: http://localhost:5173 em dev, URL do SPA em staging/prod
- 404/500 continuam retornando com os headers CORS corretos
```

---

## Dependência entre gaps

```
#1 OpenAPI
  ├── desbloqueia npm run api:generate (orval) no frontend
  ├── pré-requisito para documentar #2, #3, #4
  └── independente de implementação

#2 GET /arenas } independentes entre si, dependem só do #1 para documentar
#3 GET /quadras }

#4 JWT
  └── independente, mas bloqueia qualquer rota protegida que entrar depois

#5 download aceita UUID
  └── independente; afeta a tela /app/replays/:id hoje

#6 .env.example inválido
  └── independente; afeta primeiro boot de qualquer dev

#7 CORS
  └── independente em dev; bloqueia deploy em subdomínio separado
```

Priorizar #1 primeiro para evitar re-trabalho de schema nas três issues de endpoint. #5 e #6 são correções pequenas e podem ir juntas em qualquer sprint.

## Progresso do frontend

- `VITE_USE_MOCKS=true` (default): tudo funciona offline com mocks locais em `src/lib/api/mocks/`.
- `VITE_USE_MOCKS=false` + backend ligado (`docker compose up` no `pi2-backend`): login e lista de replays usam dados reais da seed (`src/db/init/002_seed.sql`); detalhe de replay carrega mas o botão "Baixar" cai no toast de erro por conta do gap #5; Arenas e Quadras exibem o `EmptyState` de erro de rede por conta dos gaps #2 e #3.

Setup resumido para integração local (já validado em 2026-10-06):

```bash
# backend
cd pi2-backend
cp .env.example .env
# editar: POSTGRES_PORT=5432 (ou outra porta livre no host) — ver gap #6
docker compose up --build

# frontend (worktree do pi2-frontend)
cat > .env.local <<'EOF'
VITE_API_URL="/api"
VITE_USE_MOCKS="false"
EOF
npm run dev
```

Login no `http://localhost:5173/sign-in` com `teste@email.com` / `123456` (credencial hardcoded in-memory no backend — ver gap #4).
