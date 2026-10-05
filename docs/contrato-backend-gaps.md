# Gaps de contrato — backend ↔ frontend

> Documento vivo listando o que o frontend espera e o `pi2-backend` ainda não entrega. Cada seção já traz um corpo pronto para virar issue no repositório do backend.

Varredura feita em 2026-10-04 contra `pi2-backend` (branch `main`).

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

**Contrato esperado**:

- Método: `GET /arenas`
- Query params (opcionais): `cidade?: string`, `q?: string` (busca por nome/cidade).
- Resposta `200`:

```ts
{
  data: Array<{
    id: number
    clienteId: number
    nome: string
    cidade: string
    endereco: string
    fotoUrl: string
  }>
}
```

- Erros: `500` genérico.
- Filtra arenas de gestores inativos (quando aplicável).

**Issue sugerida** (`pi2-backend`):

```
Título: Implementar GET /arenas (listagem com filtros)

Frontend precisa listar arenas na tela "/app/arenas" (ver pi2-frontend/src/pages/app/arenas.tsx).

Contrato:
- GET /arenas?cidade=<string>&q=<string>
- 200 { data: ArenaDto[] } onde ArenaDto = {
    id, clienteId, nome, cidade, endereco, fotoUrl
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

**Contrato esperado** (listagem global, forma mais simples):

- Método: `GET /quadras`
- Query params (opcionais): `arenaId?: number`, `disponivel?: boolean`.
- Resposta `200`:

```ts
{
  data: Array<{
    id: number
    arenaId: number
    nome: string
    disponivel: boolean
  }>
}
```

- Erros: `500` genérico.

**Issue sugerida** (`pi2-backend`):

```
Título: Implementar GET /quadras (listagem com filtro por arena)

Frontend precisa listar quadras na tela "/app/quadras" (ver pi2-frontend/src/pages/app/quadras.tsx), com filtro opcional por arena.

Contrato:
- GET /quadras?arenaId=<number>&disponivel=<boolean>
- 200 { data: QuadraDto[] } onde QuadraDto = { id, arenaId, nome, disponivel }

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
```

Priorizar #1 primeiro para evitar re-trabalho de schema nas três issues de endpoint.

## Progresso do frontend

Enquanto os gaps não forem fechados, o frontend roda com `VITE_USE_MOCKS=true` (padrão). Trocar para `false` em `.env.local` liga as chamadas reais; as telas Arenas e Quadras vão exibir o estado de erro ("Confira se a API está no ar") até os gaps #2 e #3 serem fechados.
