import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getGamesByGenre,
  getPopularGames,
  getRecentGames,
} from '../services/api';
import type { Game } from '../types/game';
import { GameCard } from '../components/GameCard';
import { translateGenre } from '../utils/translateGenre';
import {
  Loader2,
  Gamepad2,
  ArrowLeft,
  Flame,
  Sparkles,
} from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Define o título e ícone da categoria dinamicamente
  const getHeaderInfo = () => {
    if (categorySlug === 'popular') {
      return {
        title: 'Jogos Mais Populares',
        icon: Flame,
        color: 'text-amber-500',
        description: 'Os títulos mais aclamados e jogados da comunidade.',
      };
    }
    if (categorySlug === 'recent') {
      return {
        title: 'Lançamentos Recentes',
        icon: Sparkles,
        color: 'text-purple-400',
        description: 'Os últimos lançamentos que chegaram ao mercado.',
      };
    }

    // Traduz o gênero dinamicamente usando o slug
    const translatedName = categorySlug
      ? translateGenre({ slug: categorySlug, name: categorySlug })
      : 'Categoria';

    return {
      title: translatedName,
      icon: Gamepad2,
      color: 'text-blue-400',
      description: `Explore os melhores jogos da categoria ${translatedName}.`,
    };
  };

  const headerInfo = getHeaderInfo();
  const IconComponent = headerInfo.icon;

  useEffect(() => {
    const fetchCategoryGames = async () => {
      if (!categorySlug) return;

      try {
        setLoading(true);
        let result: Game[] = [];

        if (categorySlug === 'popular') {
          result = await getPopularGames();
        } else if (categorySlug === 'recent') {
          result = await getRecentGames();
        } else {
          // Busca jogos filtrados pelo slug do gênero na API RAWG
          result = await getGamesByGenre(categorySlug);
        }

        setGames(result);
      } catch (error) {
        console.error('Erro ao carregar jogos da categoria:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryGames();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Botão de Voltar */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Voltar para a página inicial</span>
      </Link>

      {/* Cabeçalho do Gênero / Categoria */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-slate-800/80 border border-slate-700/50 rounded-xl shadow-inner">
            <IconComponent className={`w-8 h-8 ${headerInfo.color}`} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {headerInfo.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {headerInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Estado de Carregamento ou Grid de Jogos */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-blue-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-slate-400 text-sm">Carregando catálogo...</p>
        </div>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/60">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">
            Nenhum jogo encontrado para esta categoria.
          </p>
        </div>
      )}
    </div>
  );
};