# recomendações de frontend — tagravado

documento vivo com propostas de melhoria de design, bibliotecas e componentes para o frontend do tagravado. atualize à medida que decisões forem tomadas.

## bibliotecas adicionadas nesta rodada

| pacote                     | motivo                                                                   |
| -------------------------- | ------------------------------------------------------------------------ |
| `framer-motion`            | transições declarativas — usadas em `Home` (stagger) e `ComingSoon`.     |
| `@radix-ui/react-avatar`   | avatar do usuário no header/perfil (fallback com iniciais).              |
| `@radix-ui/react-tooltip`  | tooltips nos botões-icon do header (a11y: intenção sem texto visível).   |
| `@radix-ui/react-hover-card` | preview rápido de arena/quadra sem tirar o usuário da lista.           |
| `@radix-ui/react-separator`| separadores semânticos em formulários e cards.                           |

## propostas ainda não implementadas

### 1. Skeleton loading em vez de spinner

Quando integrarmos com o backend, cards de arena/replay devem exibir `Skeleton` (já
criado em `components/ui/skeleton.tsx`) enquanto a query está em `pending`. Reduz o
efeito de "flash" e casa com o RNF-03 de resposta rápida percebida.

### 2. embla-carousel-react para "arenas favoritas" no mobile

No breakpoint sm o grid de arenas quebra em coluna única, forçando scroll longo.
Sugestão: usar carrossel horizontal com `embla-carousel-react` (~5kb, mantido pelo
time do Radix) — segue o padrão de apps como Airbnb/Booking.

### 3. `react-aria-components` para inputs mascarados

Cadastro tem telefone e (futuramente) CPF. `react-aria-components` oferece máscara
acessível pronta, alinhada com o restante do stack (shadcn já é headless em cima
de Radix). Alternativa: `react-imask`.

### 4. sistema de imagens com `next-cloudinary` ou similar

Enquanto usamos Unsplash como placeholder (`src/lib/assets.ts`), o backend
eventualmente servirá imagens de arenas reais. Recomendo padronizar formatos
(webp/avif) e servir via CDN com `srcset` para atingir o RNF de performance.

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

- `Dialog`/`Sheet`: modal de reserva de quadra (sprint 2).
- `DropdownMenu`: menu de perfil no header (substituindo o botão isolado).
- `Command`: paleta de busca global — atalho `⌘K` para achar arena por cidade.
- `Calendar` + `Popover`: seletor de data no fluxo de reserva.
- `Sonner` (já instalado): usar toasts em toda ação assíncrona pós-integração.

### 9. testes visuais

Recomendo `@storybook/react-vite` só pros componentes de `components/ui/*` +
`components/coming-soon.tsx`. Barato de configurar e permite o time de UX
revisar variações sem subir tela inteira.

### 10. lint/prettier de css

`stylelint` com `stylelint-config-tailwindcss` valida a ordem dos utilities e
identifica classes obsoletas. Roda em CI junto do eslint atual.

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

- `.claude/skills/` versionado (9 skills: ui-ux-pro-max e sub-skills + tlc-spec-driven
  + react-best-practices).
- `.claude/agents/` versionado (esqueleto — cada dev pode adicionar subagents
  específicos do fluxo dele).
- rodar `git pull` já expõe as skills para todo o time no claude code / cursor.
