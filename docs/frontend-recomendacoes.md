# recomendações de frontend — tagravado

documento vivo com propostas de melhoria de design, bibliotecas e componentes para o frontend do tagravado. atualize à medida que decisões forem tomadas.

> revisado em 17/10/2026: itens entregues foram marcados, a recomendação de storybook
> foi descartada por decisão do time (sem dependências de teste) e a seção de imagens
> partia de uma premissa errada — ver item 4.

## bibliotecas adicionadas nesta rodada

| pacote                     | motivo                                                                   |
| -------------------------- | ------------------------------------------------------------------------ |
| `framer-motion`            | transições declarativas — usadas em `Home` (stagger) e `ComingSoon`.     |
| `@radix-ui/react-avatar`   | avatar do usuário no header/perfil (fallback com iniciais).              |
| `@radix-ui/react-tooltip`  | tooltips nos botões-icon do header (a11y: intenção sem texto visível).   |
| `@radix-ui/react-hover-card` | preview rápido de arena/quadra sem tirar o usuário da lista.           |
| `@radix-ui/react-separator`| separadores semânticos em formulários e cards.                           |

## propostas ainda não implementadas

### 1. ~~Skeleton loading em vez de spinner~~ — IMPLEMENTADO

Cards de arena/quadra/replay exibem `Skeleton` enquanto a query está em `pending`
(`arena-card-skeleton.tsx`, `quadra-card-skeleton.tsx`, `replay-card-skeleton.tsx`).

### 2. embla-carousel-react para "arenas favoritas" no mobile

No breakpoint sm o grid de arenas quebra em coluna única, forçando scroll longo.
Sugestão: usar carrossel horizontal com `embla-carousel-react` (~5kb, mantido pelo
time do Radix) — segue o padrão de apps como Airbnb/Booking.

### 3. `react-aria-components` para inputs mascarados

Cadastro tem telefone e (futuramente) CPF. `react-aria-components` oferece máscara
acessível pronta, alinhada com o restante do stack (shadcn já é headless em cima
de Radix). Alternativa: `react-imask`.

### 4. sistema de imagens — premissa revista em 17/10/2026

A versão original dizia "enquanto usamos Unsplash como placeholder
(`src/lib/assets.ts`)". **Aquilo não era placeholder:** as fotos do Unsplash eram
escolhidas por hash do id, então uma arena aparecia com a foto de outra quadra
real. Isso foi removido — hoje `ARENA_COVERS` só alimenta os mocks, e a ausência
de foto rende um placeholder vetorial local (`MediaPlaceholder`).

O que continua valendo como recomendação: quando o backend servir fotos de arena
de verdade, padronizar formatos (webp/avif) e servir via CDN com `srcset` para
atingir o RNF de performance. Hoje `arena.foto_url` existe no schema mas a seed
não preenche, então o app roda inteiro em placeholder.

### 5. `@vercel/analytics` + `@vercel/speed-insights`

Como a stack é vercel-friendly, medir CLS/LCP/INP em produção com essas libs é
custo baixo (dois `<Analytics />` no `app.tsx`). Útil pra sprints futuras validarem
os RNF de performance sem precisar montar dashboard.

### 6. dark mode: revisar contraste do card sobre background

O `--card` no dark está em `oklch(0.26 0.035 260)` e o `--background` em
`oklch(0.18 0.04 265)` — contraste borderline com o texto secundário. Vale rodar
o WCAG contrast checker e, se necessário, aumentar diferença ou adicionar
`ring-1 ring-border` nos cards.

### 7. animação da rota (page transitions)

`framer-motion` + `<AnimatePresence mode="wait">` no `RouteWrapper` daria transição
suave entre `/app/*`. Cuidado: precisa desabilitar quando `prefers-reduced-motion`
estiver ligado (acessibilidade).

### 8. componentes shadcn que valem trazer sob demanda

- ~~`Dialog`/`Sheet`~~ — trazidos. `Dialog` é o detalhe de quadra; `Sheet` é o menu mobile.
- ~~`DropdownMenu`~~ — trazido, menu de perfil no header.
- ~~`Command` + `Popover`~~ — trazidos. Viraram `SearchCombobox` e `CityCombobox`
  (busca com filtro em tempo real, substituindo o `Select` de cidades).
- ~~`Sonner`~~ — em uso em toda ação assíncrona.
- `Calendar`: seletor de data no fluxo de reserva (ainda não existe).

### 9. ~~testes visuais com Storybook~~ — DESCARTADO

O time decidiu **não adicionar dependências de teste** a este repo (vale pra
Storybook, Vitest e Testing Library). A verificação é manual, no navegador, nas
resoluções exigidas pelo RNF-02.

### 10. lint/prettier de css

`stylelint` com `stylelint-config-tailwindcss` valida a ordem dos utilities e
identifica classes obsoletas. Roda em CI junto do eslint atual.

> Nota: o `prettier-plugin-tailwindcss` já ordena as classes automaticamente, então
> o ganho do stylelint aqui é menor do que era quando esta recomendação foi escrita.

## design — pontos identificados no figma

- as telas de mobile (`Meus replays`, `Arenas`) foram desenhadas em 430px de
  largura. O layout desktop atual tem sidebar fixo — sugestão: quando o desktop
  de cada tela mobile não existir no figma, adotar o padrão do figjam de container
  central `max-w-2xl` e simular o "recorte mobile" com preview lateral.
- ícones no figma usam preto suave (#020618) e amarelo (#ffd600). Já refletido
  nos tokens `--tg-brand-*`.
- os cards de replay têm timestamp overlay no canto superior esquerdo. Componente
  reutilizável a criar em sprint 2 (`components/replay-card.tsx`).

## versionamento de skills e agents

- `.claude/skills/` versionado, rastreado por `skills-lock.json`. O conjunto atual
  está descrito no `CLAUDE.md` — `tlc-spec-driven` foi descartado; o fluxo adotado
  é o do `mattpocock/skills` (`grilling`, `to-spec`, `to-tickets`).
- `.claude/agents/` versionado (esqueleto — cada dev pode adicionar subagents
  específicos do fluxo dele).
- rodar `git pull` já expõe as skills para todo o time no claude code / cursor.
