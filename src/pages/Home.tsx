import React, { useEffect, useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { GameSection } from '../components/GameSection';
import { DealsCarousel } from '../components/DealsCarousel';
import {
  getPopularGames,
  getFeaturedGames,
  getRecentGames,
  getSteamDeals,
  type DealGame,
} from '../services/api';
import type { Game } from '../types/game';
import { Loader2, Flame, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [steamDeals, setSteamDeals] = useState<DealGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Busca os 4 conjuntos de dados simultaneamente para manter o app ultra-rápido
        const [featured, popular, recent, deals] = await Promise.all([
          getFeaturedGames(),
          getPopularGames(),
          getRecentGames(),
          getSteamDeals(),
        ]);
        setFeaturedGames(featured);
        setPopularGames(popular);
        setRecentGames(recent);
        setSteamDeals(deals);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-blue-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-slate-400 text-sm">Carregando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 md:space-y-20 pb-12">
      {/* Banner Hero */}
      <HeroBanner games={featuredGames} /> 

      {/* Seção 1: Jogos Populares (Em Alta) */}
      <section id="em-alta" className="scroll-mt-24">
        <GameSection
          title="Jogos Mais Populares"
          icon={Flame}
          iconColor="text-amber-500"
          games={popularGames}
          categorySlug="popular"
        />
      </section>

      {/* Seção 2: Lançamentos Recentes */}
      <section id="lancamentos" className="scroll-mt-24">
        <GameSection
          title="Lançamentos Recentes"
          icon={Sparkles}
          iconColor="text-blue-400"
          games={recentGames}
          categorySlug="recent"
        />
      </section>

      {/* Seção 3: Ofertas da Steam */}
      <section id="ofertas" className="scroll-mt-24">
        <DealsCarousel deals={steamDeals} />
      </section>
    </div>
  );
};