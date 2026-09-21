# Justificativa da Stack — Frontend TaGravado

Documento de suporte à issue #18 (F-01 · Sprint 1). Explica por que a interface do TaGravado é implementada com **React 19 + Vite + TypeScript strict + Tailwind CSS 4 + shadcn/ui + TanStack Query + React Hook Form + Zod** sobre **Node.js 22+**, considerando o perfil de dispositivo de cada persona.

## 1. Perfis de dispositivo

O TaGravado atende dois públicos com padrões de uso distintos, mapeados no [fluxo de navegação](../../f-01-setup-do-frontend-e-telas-iniciais/docs/fluxo-navegacao.md) e nos wireframes.

| Persona | Contexto de uso | Dispositivo alvo | Impacto na stack |
|---|---|---|---|
| **Cliente da arena** | Acessa após a partida, na areia ou no estacionamento, para baixar o clipe do replay. | **Mobile-first** (celular, rede móvel, uma mão). | Bundle pequeno, tempo até interativo rápido, layout responsivo, toque como primeira classe. |
| **Administrador da arena** | Configura quadras, câmeras e conteúdos gerados pela botoeira, tipicamente no balcão. | **Desktop** (navegador em computador da recepção). | Densidade de informação alta, formulários e tabelas amplas, atalhos de teclado, várias colunas. |

O RNF-02 (Responsividade) exige que as mesmas telas sirvam mobile, tablet e desktop sem perda de funcionalidade. O RNF-01 (tema escuro/claro) e o RNF-03 (tempo de resposta) empurram a decisão para uma SPA leve com CSS utilitário, tokens de tema em CSS vars e bundler moderno.

## 2. Base do projeto

### 2.1 React 19 — biblioteca de UI

- Ecossistema maduro, corresponde à experiência declarada pela equipe de frontend (Kaik, Alan) no plano de projeto.
- React 19 traz Actions e `useTransition` melhorados, úteis para o fluxo de busca da tela **Início** e para o download de clipes sem travar a UI.
- Suporte estável a Suspense em rotas — ajuda a manter o RNF-03 no fluxo cliente.
- Alternativas descartadas: Vue e Svelte trazem curvas adicionais para a equipe; Next.js foi descartado porque acopla SSR/servidor que não agrega valor num backend REST separado (`pi2-backend`).

### 2.2 Vite (com plugin SWC) — build e dev server

- Dev server com HMR sub-segundo, essencial numa Sprint 1 curta com bootstrap de várias telas.
- `@vitejs/plugin-react-swc` compila com SWC (Rust), mais rápido que Babel em cold-start.
- Build de produção baseado em Rollup gera bundles pequenos com _code splitting_ automático por rota.
- Plugin oficial do Tailwind 4 (`@tailwindcss/vite`) elimina a etapa PostCSS legada.
- Path alias `@/` → `src/` configurado no `vite.config.ts` e replicado em `tsconfig.app.json`.
- Facilita a conteinerização (RNF-03, entrega Docker exigida na issue): expondo `--host 0.0.0.0` a mesma imagem serve dev dentro do container.

### 2.3 TypeScript strict — linguagem

- Contratos explícitos entre componentes reduzem retrabalho quando cliente e admin compartilham peças de UI.
- Vai encaixar diretamente com os DTOs do `pi2-backend` na Sprint 2 (reserva de horários), diminuindo o risco de regressão no consumo de API.
- Flags ativadas em `tsconfig.app.json`: `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUncheckedSideEffectImports`.

### 2.4 Node.js 22+ — runtime de build/dev

- Versão LTS ativa em 2026; requisito do Vite 7 e Tailwind 4.
- Fixada em `package.json` (`engines.node`) e na imagem base `node:22-alpine` do Dockerfile.

## 3. Estilização e biblioteca de UI

### 3.1 Tailwind CSS 4

- Utilitários atendem bem o **mobile-first** do cliente: classes responsivas (`sm:`, `md:`, `lg:`) tornam o mesmo componente adequado a celular e desktop, atendendo o RNF-02 sem manter dois _stylesheets_.
- Suporte nativo a **tema escuro/claro** via variantes (`dark:`), pré-requisito do RNF-01 — sem depender de biblioteca extra de theming.
- Tailwind 4 traz configuração via CSS (`@theme inline`), centralizando os tokens de marca (azul TaGravado, amarelo do "G") em `src/style.css`.
- JIT/engine v4 gera CSS enxuto — ganho relevante para o cliente mobile em rede móvel (RNF-03).
- **Nada de CSS Modules ou CSS-in-JS (styled-components / emotion)** — evitamos runtime overhead e cascata de imports que atrasa first paint.

### 3.2 shadcn/ui (estilo "new-york") + Radix UI

- Componentes copiados para o próprio repo (`src/components/ui/`), não versionados como dependência de terceiros — controle total sobre marca e acessibilidade.
- Radix UI garante primitivas acessíveis (keyboard nav, ARIA), atendendo RNF-05 (Usabilidade).
- CVA + `tailwind-merge` compõem variantes de botão/input tipadas.
- Ícones exclusivamente da **`lucide-react`** (regra imposta pelo ESLint via `no-restricted-imports` contra `react-icons`).
- Toasts via **`sonner`** integrado ao tema.

### 3.3 next-themes

- Alterna claro/escuro persistindo em `localStorage` (`tagravado-theme`).
- Cumpre RNF-01 sem esforço adicional; os tokens vivem em `--background`, `--foreground`, `--primary`, etc. e apenas trocam de valor entre `:root` e `.dark`.

## 4. Estado, dados e formulários

### 4.1 TanStack Query (`@tanstack/react-query`)

- `staleTime` de 5 min e `gcTime` de 10 min em `src/lib/react-query.ts` — o mesmo padrão do projeto de referência (`vanhora-react`).
- Cache curto o suficiente para refletir mudanças administrativas rápidas, mas longo o bastante para atender RNF-03 (respostas < 2 s em ações repetidas do cliente).

### 4.2 React Hook Form + Zod

- Formulários (Login, e mais adiante criação de conta e reserva) montados com `useForm({ resolver: zodResolver(schema) })`.
- Schemas em `src/lib/schemas/` são a única fonte de verdade — tipo TS inferido de `z.infer<typeof schema>` evita divergência entre validação e tipagem.
- Zod também valida `import.meta.env` em `src/env.ts` no boot — se `VITE_API_URL` faltar em staging/prod, o app não sobe silenciosamente.
- Atende RNF-05: mensagens de erro claras e localizadas em pt-BR.

### 4.3 nuqs — estado em URL

- Filtros e drawers ficam em query params, o que torna telas de admin partilháveis via link (útil para o Rennan enviar links prontos ao suporte).
- Zero custo para o cliente mobile (só ativa quando necessário).

### 4.4 axios

- HTTP client com interceptors, para autenticação centralizada quando o backend estiver pronto na Sprint 2.

## 5. Roteamento

- `react-router-dom` v7 com `createBrowserRouter`.
- Layouts compartilhados em `src/pages/_layouts/`:
  - `auth.tsx` — usado em `/sign-in`.
  - `app.tsx` — usado em `/app/*` (topbar + sidebar do cliente).
- Rotas centralizadas em `src/routes.tsx`.

## 6. Organização de pastas

Replica o padrão que já é o de trabalho do dev responsável no repositório `vanhora-react`, para reduzir carga cognitiva ao alternar entre projetos.

```
src/
  main.tsx                    # bootstrap + StrictMode
  app.tsx                     # providers (theme, query, router, toaster)
  routes.tsx                  # createBrowserRouter centralizado
  env.ts                      # zod schema para import.meta.env
  style.css                   # tokens shadcn + marca (@theme inline)
  components/
    logo.tsx                  # wordmark tagravado
    theme/
      theme-provider.tsx
      theme-toggle.tsx
    ui/                       # primitivas shadcn (button, input, label, form, sonner)
  lib/
    utils.ts                  # cn()
    react-query.ts            # queryClient
    schemas/                  # zod schemas (única fonte de verdade)
  pages/
    _layouts/                 # layouts compartilhados (Outlet)
    auth/                     # sign-in, criar-conta (Sprint futura)
    app/                      # área autenticada do cliente
```

Convenções:

- **Arquivos em kebab-case** (`sign-in.tsx`, `theme-toggle.tsx`).
- **Named exports** (`export function X()`), sem `default export`.
- **Comentários em caixa baixa, pt-BR**, curtos.
- Path alias `@/` para `src/` — imports absolutos consistentes.

## 7. Ferramentas de qualidade

- **Prettier** com `semi: false`, `singleQuote: true`, `printWidth: 80`, `arrowParens: 'always'`. Ordena classes tailwind via `prettier-plugin-tailwindcss`.
- **ESLint** com `typescript-eslint`, `react-hooks`, `react-refresh` e `simple-import-sort`.
- Regra `no-restricted-imports` bloqueia `react-icons` — só `lucide-react`.

## 8. Como a stack atende cada persona

**Cliente (mobile):** Tailwind mobile-first + bundles pequenos do Vite + primitivas shadcn com foco em toque entregam Login e Início rapidamente; roteamento SPA mantém a experiência sem full reload.

**Admin (desktop):** as mesmas primitivas escalam para viewports amplas via `md:`/`lg:` (sidebar fixo, grade de cards em 3 colunas); Radix UI garante teclado/ARIA; TanStack Query mantém dados frescos sem refetch agressivo.

## 9. Referências

- [Plano de Projeto — §5 Governança Git](../../f-01-setup-do-frontend-e-telas-iniciais/docs/plano-de-projeto.md)
- [Fluxo de navegação](../../f-01-setup-do-frontend-e-telas-iniciais/docs/fluxo-navegacao.md)
- [Requisitos não funcionais](../../f-01-setup-do-frontend-e-telas-iniciais/docs/requisitos-nao-funcionais.md)
- Figma TaGravado: <https://www.figma.com/design/zLz9JwG8iKX8twcxCNoUO2/TaGravado>
- Projeto de referência de padrões: `vanhora-react` (privado).
