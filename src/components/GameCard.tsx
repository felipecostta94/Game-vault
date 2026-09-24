import React from 'react';
import { Link } from 'react-router-dom';
import type { Game } from '../types/game';
import { Star } from 'lucide-react';
import { translateGenre } from '../utils/translateGenre'; // Import do utilitário

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Link
      to={`/game/${game.id}`}
      className="group bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Imagem do Jogo */}
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        <img
          src={game.background_image || '/placeholder-game.jpg'}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Rating Badge */}
        {game.rating > 0 && (
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/50 flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{game.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
            {game.name}
          </h3>

          {/* Lista de Gêneros Traduzidos */}
          {game.genres && game.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {game.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre.id}
                  className="text-[11px] font-medium bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/40"
                >
                  {translateGenre(genre)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Data de Lançamento */}
        {game.released && (
          <div className="text-xs text-slate-400 border-t border-slate-800/60 pt-2.5 mt-auto">
            Lançamento: {new Date(game.released).toLocaleDateString('pt-BR')}
          </div>
        )}
      </div>
    </Link>
  );
};