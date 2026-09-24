import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GameCard } from '../components/GameCard';
import { searchGames } from '../services/api';
import type { Game } from '../types/game';
import { Loader2, Search as SearchIcon } from 'lucide-react';

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      try {
        setLoading(true);
        const data = await searchGames(query);
        setGames(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <SearchIcon className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">
          Resultados para: <span className="text-blue-400">"{query}"</span>
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-blue-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-slate-400 text-sm">Buscando jogos...</p>
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          Nenhum jogo encontrado para a sua busca.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};