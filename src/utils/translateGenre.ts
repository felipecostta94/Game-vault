const GENRE_TRANSLATIONS: Record<string, string> = {
  action: 'Ação',
  'role-playing-games-rpg': 'RPG',
  adventure: 'Aventura',
  strategy: 'Estratégia',
  shooter: 'Tiro (FPS)',
  sports: 'Esportes',
  puzzle: 'Enigmas',
  racing: 'Corrida',
  casual: 'Casual',
  simulation: 'Simulação',
  arcade: 'Arcade',
  platformer: 'Plataforma',
  fighting: 'Luta',
  family: 'Família',
  'board-games': 'Tabuleiro',
  educational: 'Educacional',
  card: 'Cartas',
  indie: 'Indie',
  'massively-multiplayer': 'MMO',
};

/**
 * Traduz o nome de um gênero com base no seu slug ou nome original.
 */
export const translateGenre = (genre: { slug?: string; name: string }): string => {
  if (genre.slug && GENRE_TRANSLATIONS[genre.slug]) {
    return GENRE_TRANSLATIONS[genre.slug];
  }
  
  // Tratamento fallback por nome simples caso o slug não venha informado
  const lowerName = genre.name.toLowerCase();
  if (GENRE_TRANSLATIONS[lowerName]) {
    return GENRE_TRANSLATIONS[lowerName];
  }

  return genre.name;
};