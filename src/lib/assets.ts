// urls unsplash para placeholders visuais das arenas/quadras
// substituir por assets próprios quando o backend expor uploads (sprint 3+)
// todos os IDs foram verificados retornando 200 no formato images.unsplash.com
const UNSPLASH_BASE = 'https://images.unsplash.com'
const q = (id: string, w = 800) =>
  `${UNSPLASH_BASE}/${id}?auto=format&fit=crop&w=${w}&q=80`

export const ARENA_COVERS = {
  beachVolley1: q('photo-1612872087720-bb876e2e67d1'),
  volleyIndoor: q('photo-1547347298-4074fc3086f0'),
  soccerAction: q('photo-1517927033932-b3d18e61fb3a'),
  soccerBalls: q('photo-1518604666860-9ed391f76460'),
  tennisCourt: q('photo-1554068865-24cecd4e34b8'),
  tennisAction: q('photo-1614743758466-e569f4791116'),
  padel: q('photo-1626224583764-f87db24ac4ea'),
  cycling: q('photo-1517649763962-0c623066013b'),
  soccerTraining: q('photo-1526232761682-d26e03ac148e'),
} as const

// fundo do layout de autenticação (silhueta beach volley ao pôr do sol)
export const AUTH_BG = q('photo-1612872087720-bb876e2e67d1', 1600)

// thumbnail padrão de replay
export const REPLAY_THUMB = q('photo-1517927033932-b3d18e61fb3a', 600)
