# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

**pi2-frontend** é a SPA do **TaGravado**, sistema de replay para quadras esportivas. Este repo contém apenas a interface — a API vive em [pi2-backend](https://github.com/PI2-2026-2-equipe-03/pi2-backend) e precisa estar rodando em paralelo (por padrão em `http://localhost:3000`) para o app funcionar completamente.

Dois públicos: **cliente da arena** (mobile-first, baixa clipes) e **administrador** (desktop, gerencia conteúdos). As mesmas telas atendem mobile/tablet/desktop (RNF-02).

## Comandos

```bash
npm run dev           # vite dev server em http://localhost:5173 (host 0.0.0.0, strictPort)
npm run build         # tsc -b && vite build
npm run lint          # eslint --fix + prettier --write em src/
npm run format        # apenas prettier --write em src/
npm run preview       # preview do build de produção
npm run api:generate  # orval: gera src/lib/api/{endpoints.ts,model/} a partir do OpenAPI do backend
```

Alternativa via Docker: `docker compose up` (sobe o dev server mapeando `.:/app`, com `CHOKIDAR_USEPOLLING=true`).

**Observação sobre `api:generate`**: lê de `http://localhost:3000/api/openapi.json` — o backend precisa estar no ar para regenerar o client.

Não há suíte de testes neste repo.

## Arquitetura

### Bootstrap e providers

- `src/main.tsx` monta `<App />` dentro de `StrictMode`.
- `src/app.tsx` empilha providers em ordem fixa (importa): **Theme → QueryClient → Tooltip → Router**, com `<Toaster />` do `sonner` ao lado do router.
- `src/routes.tsx` define `createBrowserRouter` com um wrapper `NuqsAdapter` acima de todas as rotas (query params gerenciados por `nuqs` em qualquer tela).

### Rotas e layouts

Três áreas, cada uma com seu layout em `src/pages/_layouts/`:

- `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password` → `AuthLayout`
- `/app`, `/app/replays`, `/app/arenas`, `/app/quadras` → `AppLayout` (área autenticada do cliente)
- `/admin` → `AdminLayout`
- `/` e `*` redirecionam para `/sign-in`.

Páginas vivem em `src/pages/{auth,app,admin}/*.tsx`. Componentes específicos de cada área ficam em `src/pages/<área>/components/`.

### Camada de API (TanStack Query + axios + Orval)

- `src/lib/api/endpoints.ts` e `src/lib/api/model/` são **gerados pelo orval** (`npm run api:generate`) — não editar à mão.
- Modo `tags-split` + cliente `react-query`: cada tag do OpenAPI vira um hook `useX()` tipado.
- Todas as chamadas passam pelo mutator `src/lib/api/mutator/axios-instance.ts` (`customInstance`), ponto único para interceptors, baseURL e auth.
- `queryClient` configurado em `src/lib/react-query.ts` (padrão `staleTime` 5min / `gcTime` 10min — ver `docs/stack-frontend.md`).
- Dev: `vite.config.ts` proxia `/api` → `http://localhost:3000`. A env `VITE_API_URL` só é obrigatória em `staging`/`production` (validado por zod em `src/env.ts` — boot quebra cedo se faltar).
- **Toggle mock/real por domínio**: a flag `VITE_USE_MOCKS` (default `true`) é consumida em cada stub de `src/lib/api/*.ts`. Em modo mock, o stub devolve dados de `src/lib/api/mocks/<domínio>.ts` com o mesmo envelope `{ data: ... }` do backend. Páginas usam `useQuery` sem saber da flag.

### Formulários e validação

- **Zod schemas são a única fonte de verdade** — vivem em `src/lib/schemas/`. Os tipos TS são inferidos via `z.infer<typeof schema>`.
- Padrão: `useForm({ resolver: zodResolver(schema) })` com os primitivos do shadcn em `src/components/ui/form.tsx`.
- O mesmo zod valida `import.meta.env` em `src/env.ts`.

### Estilo e UI

- **Tailwind CSS 4** via `@tailwindcss/vite` — configuração vive em `src/style.css` (`@theme inline`, tokens de marca TaGravado, variáveis shadcn para claro/escuro).
- **shadcn/ui estilo "new-york"** (`components.json`): componentes copiados para `src/components/ui/` — editáveis, não são dependência. Base color `neutral`, CSS variables ligadas.
- **Tema** gerenciado pelo `next-themes` via `ThemeProvider` em `src/components/theme/` (persiste em `localStorage` com chave `tagravado-theme` — RNF-01).
- **Ícones apenas do `lucide-react`**: regra ESLint (`no-restricted-imports`) bloqueia `react-icons`.
- Sem CSS Modules ou CSS-in-JS. Classes do Tailwind são auto-ordenadas pelo `prettier-plugin-tailwindcss`.

### Convenções do código

- Arquivos em **kebab-case** (`sign-in.tsx`, `theme-toggle.tsx`).
- **Named exports** sempre; nada de `export default`.
- Comments: **short English, lowercase. Explain WHY, not WHAT.** Applies to new code only.
- Path alias **`@/`** → `src/` (replicado em `tsconfig.app.json` e `vite.config.ts`).
- TypeScript strict com `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`.
- Prettier: `semi: false`, `singleQuote: true`, `printWidth: 80`, `arrowParens: 'always'`.
- ESLint ignora `.claude/**` e `.agents/**` (skills versionadas, não fazem parte do app).

### Commits

Convenção do time: prefixo **`F-XX:`** referenciando a feature/issue (ex.: `F-01: setup inicial`). Emojis de categoria (`:sparkles:`, `:bug:`, `:books:`) são comuns no histórico.

## Skills versionadas

O repo versiona skills do Claude Code em `.claude/skills/` (rastreadas por `skills-lock.json`, estilo `mattpocock/skills`):

- `grilling`, `to-spec`, `to-tickets` — do `mattpocock/skills` (travadas por hash em `skills-lock.json`).
- `react-best-practices`, `ui-styling`, `ui-ux-pro-max` — adicionadas manualmente.

Agents customizados ficariam em `.claude/agents/` (vazio no momento). `.agents/skills/` existe mas também está vazio.

## Documentação adicional

- `README.md` — quickstart (Docker e Node local), estrutura resumida, time.
- `docs/stack-frontend.md` — justificativa longa da stack (personas, decisões, trade-offs). Ler antes de propor trocar bibliotecas estruturais.
- `docs/frontend-recomendacoes.md` — recomendações de implementação.
