import type { Game, GameDetailsType } from '../types/game';

// CONFIGURAÇÃO BASE DE APIS
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';
const CHEAPSHARK_BASE_URL = 'https://www.cheapshark.com/api/1.0';

export interface Genre {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

// TIPAGENS AUXILIARES
export interface GameTrailer {
  id: number;
  name: string;
  preview: string;
  data: {
    480: string;
    max: string;
  };
}

export interface GameScreenshot {
  id: number;
  image: string;
  width: number;
  height: number;
}

export interface DealGame {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  store: string;
  steamAppID: string;
}

// HELPER GENÉRICO PARA REQUISIÇÕES (DRY - Don't Repeat Yourself)
const fetchJson = async <T>(url: string, fallback: T): Promise<T> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro na requisição: ${response.statusText}`);
    return (await response.json()) as T;
  } catch (error) {
    console.error(`[API Error] URL: ${url}`, error);
    return fallback;
  }
};

// HELPER EXCLUSIVO DA RAWG (Anexa a chave de API automaticamente)
const fetchRawg = async <T>(endpoint: string, queryParams = '', fallback: T): Promise<T> => {
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${RAWG_BASE_URL}${endpoint}${separator}key=${RAWG_API_KEY}${queryParams ? `&${queryParams}` : ''}`;
  return fetchJson<T>(url, fallback);
};

// Busca a lista dinâmica de todos os gêneros/categorias da RAWG
export const getGenres = async (): Promise<Genre[]> => {
  const data = await fetchRawg<{ results?: Genre[] }>('/genres', '', { results: [] });
  return data.results || [];
};

// ============================================================================
// 1. ENDPOINTS DE JOGOS (RAWG)
// ============================================================================

export const searchGames = async (query: string): Promise<Game[]> => {
  const data = await fetchRawg<{ results?: Game[] }>(
    '/games',
    `search=${encodeURIComponent(query)}&page_size=20`,
    { results: [] }
  );
  return data.results || [];
};

export const getGameDetails = async (id: string): Promise<GameDetailsType | null> => {
  return fetchRawg<GameDetailsType | null>(`/games/${id}`, '', null);
};

export const getFeaturedGames = async (): Promise<Game[]> => {
  const data = await fetchRawg<{ results?: Game[] }>(
    '/games',
    'dates=2026-01-01,2026-12-31&ordering=-added&page_size=5',
    { results: [] }
  );
  return data.results || [];
};

export const getPopularGames = async (): Promise<Game[]> => {
  const data = await fetchRawg<{ results?: Game[] }>(
    '/games',
    'page_size=12&ordering=-rating',
    { results: [] }
  );
  return data.results || [];
};

export const getRecentGames = async (): Promise<Game[]> => {
  const data = await fetchRawg<{ results?: Game[] }>(
    '/games',
    'dates=2026-01-01,2026-12-31&ordering=-released&page_size=12',
    { results: [] }
  );
  return data.results || [];
};

// NOVA FUNÇÃO: Busca jogos de um gênero específico pelo slug
export const getGamesByGenre = async (genreSlug: string): Promise<Game[]> => {
  const data = await fetchRawg<{ results?: Game[] }>(
    '/games',
    `genres=${genreSlug}&page_size=20`,
    { results: [] }
  );
  return data.results || [];
};

// ============================================================================
// 2. ENDPOINTS DE MÍDIA (RAWG)
// ============================================================================

export const getGameTrailers = async (id: string): Promise<GameTrailer[]> => {
  const data = await fetchRawg<{ results?: GameTrailer[] }>(
    `/games/${id}/movies`,
    '',
    { results: [] }
  );
  return data.results || [];
};

export const getGameScreenshots = async (id: string): Promise<GameScreenshot[]> => {
  const data = await fetchRawg<{ results?: GameScreenshot[] }>(
    `/games/${id}/screenshots`,
    '',
    { results: [] }
  );
  return data.results || [];
};

// ============================================================================
// 3. TRADUÇÃO AUTOMÁTICA (MyMemory API)
// ============================================================================

export const translateText = async (text: string): Promise<string> => {
  if (!text) return '';

  const textToTranslate = text.length > 500 ? text.substring(0, 500) : text;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=autodetect|pt-BR`;

  const data = await fetchJson<{ responseData?: { translatedText?: string } }>(url, {});
  return data.responseData?.translatedText || text;
};

// ============================================================================
// 4. OFERTAS DA STEAM (CheapShark API)
// ============================================================================

export const getSteamDeals = async (): Promise<DealGame[]> => {
  const url = `${CHEAPSHARK_BASE_URL}/deals?storeID=1&upperPrice=50&sortBy=Metacritic&pageSize=6`;
  const data = await fetchJson<any[]>(url, []);

  return data.map((item) => ({
    id: item.dealID,
    name: item.title,
    image: item.steamAppID
      ? `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${item.steamAppID}/header.jpg`
      : item.thumb,
    originalPrice: parseFloat(item.normalPrice),
    discountPrice: parseFloat(item.salePrice),
    discountPercentage: Math.round(parseFloat(item.savings)),
    store: 'Steam',
    steamAppID: item.steamAppID,
  }));
};