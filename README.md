# pi2-frontend — TaGravado

SPA (Single Page Application) do **TaGravado**, sistema de replay para quadras esportivas. Este repositório contém apenas a camada de interface; a API está em [pi2-backend](https://github.com/PI2-2026-2-equipe-03/pi2-backend). Para a visão geral do projeto (contexto, equipe, roadmap), veja [PI2-2026-2-equipe-03](https://github.com/PI2-2026-2-equipe-03/PI2-2026-2-equipe-03).

## Objetivo

Oferecer aos clientes da arena uma interface simples e intuitiva para:

1. Localizar e baixar os clipes de replay das suas partidas.
2. Consultar horários disponíveis e reservar quadras (Sprint 2).

E aos administradores, o painel para gerenciar os conteúdos gerados pela botoeira instalada nas quadras.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 |
| Build | Vite |
| Estilização | Tailwind CSS 4 |
| Linguagem | TypeScript |

## Quickstart

### Opção 1 — Docker (recomendado)

Requer Docker + Docker Compose.

```bash
git clone https://github.com/PI2-2026-2-equipe-03/pi2-frontend
cd pi2-frontend
cp .env.example .env      # ajuste VITE_API_URL se necessário
docker compose up --build # http://localhost:5173
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
  main.tsx           # bootstrap do React + RouterProvider
  index.css          # tokens Tailwind 4 (@theme) e reset base
  routes/            # telas por rota (Login, Início)
  components/        # peças reutilizáveis (Logo, etc.)
```

Ver [docs/stack-frontend.md](docs/stack-frontend.md) para a justificativa de tecnologia.

## Licença

[MIT](LICENSE)
