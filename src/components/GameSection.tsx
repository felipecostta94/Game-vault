import React from 'react';
import { Link } from 'react-router-dom';
import { GameCard } from './GameCard';
import type { Game } from '../types/game';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface GameSectionProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  games: Game[];
  categorySlug: string;
}

export const GameSection: React.FC<GameSectionProps> = ({
  title,
  icon: Icon,
  iconColor = 'text-amber-500',
  games,
  categorySlug,
}) => {
  if (!games || games.length === 0) return null;

  return (
    <section className="space-y-6">
      {/* Cabeçalho Reutilizável */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Icon className={`w-6 h-6 ${iconColor}`} />
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>

        <Link
          to={`/category/${categorySlug}`}
          className="flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group"
        >
          <span>Ver Mais</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid Responsivo Reutilizável */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game, index) => {
          const responsiveClass =
            index < 4 ? 'block' :
            index < 8 ? 'hidden md:block' :
            'hidden lg:block';

          return (
            <div key={game.id} className={responsiveClass}>
              <GameCard game={game} />
            </div>
          );
        })}
      </div>
    </section>
  );
};