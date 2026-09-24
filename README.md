# pi2-frontend — TaGravado

SPA (Single Page Application) do **TaGravado**, sistema de replay para quadras esportivas. Este repositório contém apenas a camada de interface; a API está em [pi2-backend](https://github.com/PI2-2026-2-equipe-03/pi2-backend). Para a visão geral do projeto (contexto, equipe, roadmap), veja [PI2-2026-2-equipe-03](https://github.com/PI2-2026-2-equipe-03/PI2-2026-2-equipe-03).

## Objetivo

Oferecer aos clientes da arena uma interface simples e intuitiva para:

1. Localizar e baixar os clipes de replay das suas partidas.
2. Consultar horários disponíveis e reservar quadras (Sprint 2).

E aos administradores, o painel para gerenciar os conteúdos gerados pela botoeira instalada nas quadras.

## Stack

| Camada      | Tecnologia                               |
| ----------- | ---------------------------------------- |
| Framework   | React 19                                 |
| Build       | Vite 7 + `@vitejs/plugin-react-swc`      |
| Linguagem   | TypeScript strict                        |
| Estilização | Tailwind CSS 4 (via `@tailwindcss/vite`) |
| UI kit      | shadcn/ui (estilo "new-york") + Radix UI |
| Ícones      | `lucide-react`                           |
| Formulários | React Hook Form + Zod                    |
| Dados       | TanStack Query + axios                   |
| URL state   | `nuqs`                                   |
| Tema        | `next-themes` (RNF-01)                   |
| Toaster     | `sonner`                                 |
| Qualidade   | ESLint + `simple-import-sort` + Prettier |

Ver [docs/stack-frontend.md](docs/stack-frontend.md) para a justificativa completa.

## Quickstart

### Opção 1 — Docker (recomendado)

Requer Docker + Docker Compose.

```bash
git clone https://github.com/PI2-2026-2-equipe-03/pi2-frontend
cd pi2-frontend
cp .env.example .env
docker compose up --build  # primeira vez (ou após instalar nova dependência)
docker compose up          # uso diário → http://localhost:5173
```

### Opção 2 — Node local

Requer Node.js 22+.

```bash
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

O backend precisa estar rodando em paralelo (por padrão em `http://localhost:3000`). Consulte o [pi2-backend](https://github.com/PI2-2026-2-equipe-03/pi2-backend) para subir a API.

## Estrutura

```
src/
  main.tsx                # bootstrap + StrictMode
  app.tsx                 # providers (theme, query, router, toaster)
  routes.tsx              # createBrowserRouter centralizado
  env.ts                  # zod schema para import.meta.env
  style.css               # tokens shadcn + marca (@theme inline)
  components/
    logo.tsx
    theme/                # theme-provider + theme-toggle (RNF-01)
    ui/                   # primitivas shadcn (button, input, label, form, sonner)
  lib/
    utils.ts              # cn()
    react-query.ts        # queryClient
    schemas/              # zod schemas
  pages/
    _layouts/             # layouts compartilhados (Outlet)
    auth/                 # /sign-in
    app/                  # área autenticada (/app)
```

Convenções:

- Arquivos em kebab-case; named exports (nada de `default export`).
- Comentários curtos, em pt-BR, em caixa baixa.
- Path alias `@/` → `src/`.
- Sem CSS Modules / CSS-in-JS — só Tailwind + tokens do shadcn.

## Time

<table>
  <tr>
    <td align="center"><a href="https://github.com/KaikMcpe12"><img src="https://github.com/KaikMcpe12.png" width="80" alt="Kaik"/><br/><sub><b>Kaik</b></sub></a><br/>Frontend</td>
    <td align="center"><a href="https://github.com/alanbfx-dev"><img src="https://github.com/alanbfx-dev.png" width="80" alt="Alan"/><br/><sub><b>Alan</b></sub></a><br/>Frontend</td>
  </tr>
</table>

## Licença

[MIT](LICENSE)
