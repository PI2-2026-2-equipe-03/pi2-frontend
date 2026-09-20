# Justificativa da Stack — Frontend TaGravado

Documento de suporte à issue #18 (F-01 · Sprint 1). Explica por que a interface do TaGravado é implementada com **React 19 + Vite + TypeScript + Tailwind CSS 4** sobre **Node.js 22+**, considerando o perfil de dispositivo de cada persona.

## 1. Perfis de dispositivo

O TaGravado atende dois públicos com padrões de uso distintos, mapeados no [fluxo de navegação](../../f-01-setup-do-frontend-e-telas-iniciais/docs/fluxo-navegacao.md) e nos wireframes.

| Persona | Contexto de uso | Dispositivo alvo | Impacto na stack |
|---|---|---|---|
| **Cliente da arena** | Acessa após a partida, na areia ou no estacionamento, para baixar o clipe do replay. | **Mobile-first** (celular, rede móvel, uma mão). | Bundle pequeno, tempo até interativo rápido, layout responsivo, toque como primeira classe. |
| **Administrador da arena** | Configura quadras, câmeras e conteúdos gerados pela botoeira, tipicamente no balcão. | **Desktop** (navegador em computador da recepção). | Densidade de informação alta, formulários e tabelas amplas, atalhos de teclado, várias colunas. |

O RNF-02 (Responsividade) exige que as mesmas telas sirvam mobile, tablet e desktop sem perda de funcionalidade. O RNF-03 (Tempo de resposta) exige feedback visual em menos de 2s. Ambos empurram a decisão para uma SPA leve com CSS utilitário e bundler moderno.

## 2. Decisões

### 2.1 React 19 — biblioteca de UI

- Ecossistema maduro, corresponde à experiência declarada pela equipe de frontend (Kaik, Alan) no plano de projeto.
- React 19 traz Actions e `useTransition` melhorados, úteis para os fluxos de busca da tela **Início** e download de clipes sem travar a UI.
- Suporte estável ao Suspense em rotas, o que ajuda a manter o RNF-03 no fluxo cliente (loading progressivo em conexões móveis).
- Alternativas descartadas: Vue e Svelte trazem curvas de aprendizado adicionais para a equipe; Next.js foi descartado por acoplar SSR/servidor que não agrega valor num backend REST separado (o backend vive em `pi2-backend`).

### 2.2 Vite — build e dev server

- Dev server com HMR sub-segundo, essencial em uma Sprint 1 curta com bootstrap de várias telas.
- Build de produção baseado em Rollup gera bundles pequenos (favorece o cliente mobile) com _code splitting_ automático por rota.
- Config mínima em `vite.config.ts`; plugin oficial do Tailwind 4 (`@tailwindcss/vite`) elimina a etapa PostCSS legada.
- Facilita a conteinerização (RNF-03, entrega Docker exigida na issue): expondo `--host 0.0.0.0` a mesma imagem serve dev dentro do container.
- Alternativas descartadas: CRA está descontinuado; Webpack puro exigiria configuração adicional sem benefício para o escopo atual.

### 2.3 TypeScript — linguagem

- Contratos explícitos entre componentes reduzem retrabalho quando cliente e admin compartilham peças de UI (ex.: `Logo`, cabeçalhos, cards de arena).
- Vai encaixar diretamente com os DTOs expostos pelo `pi2-backend` na Sprint 2 (reserva de horários), diminuindo o risco de regressão no consumo de API.
- Compatível com o restante da governança (§5 do plano de projeto): tipos servem como documentação viva revisada em PR.

### 2.4 Tailwind CSS 4 — estilização

- Utilitários atendem bem o **mobile-first** do cliente: classes responsivas (`sm:`, `md:`, `lg:`) tornam o mesmo componente adequado a celular e desktop, atendendo o RNF-02 sem manter dois _stylesheets_.
- Suporte nativo a **tema escuro/claro** via variantes (`dark:`), pré-requisito do RNF-01, sem depender de biblioteca externa.
- Tailwind 4 traz configuração via CSS (`@theme`), o que centraliza os tokens de marca (azul TaGravado, amarelo do "G") em um único ponto e mantém o design consistente com o Figma.
- JIT/engine v4 gera CSS enxuto — ganho relevante para o cliente mobile em rede móvel (RNF-03).

### 2.5 Node.js 22+ — runtime de build/dev

- Versão LTS ativa em 2026; requisito do Vite 6 e Tailwind 4.
- Fixada em `package.json` (`engines.node`) e na imagem base `node:22-alpine` do Dockerfile, garantindo reprodutibilidade entre a máquina de cada dev e a esteira.

## 3. Como a stack atende cada persona

**Cliente (mobile):** Tailwind mobile-first + bundles pequenos do Vite entregam a tela **Login** e **Início** em poucos segundos; o roteamento via `react-router-dom` mantém a experiência de SPA sem recarregar a página inteira ao trocar de arena.

**Admin (desktop):** as mesmas peças escalam para viewports amplas via `md:` e `lg:` (sidebar fixo, grade de cards de arena em 3 colunas), aproveitando espaço de tela sem esforço adicional.

## 4. Convenções de código

- Componentes de tela em `src/routes/`.
- Componentes reutilizáveis em `src/components/`.
- Tokens de marca declarados em `src/index.css` com `@theme` (Tailwind 4).
- Tipos estritos (`strict: true`, `noUnusedLocals`, `noUnusedParameters`) em `tsconfig.app.json`.

## 5. Referências

- [Plano de Projeto — §5 Governança Git](../../f-01-setup-do-frontend-e-telas-iniciais/docs/plano-de-projeto.md)
- [Fluxo de navegação](../../f-01-setup-do-frontend-e-telas-iniciais/docs/fluxo-navegacao.md)
- [Requisitos não funcionais](../../f-01-setup-do-frontend-e-telas-iniciais/docs/requisitos-nao-funcionais.md)
- Figma TaGravado: <https://www.figma.com/design/zLz9JwG8iKX8twcxCNoUO2/TaGravado>
