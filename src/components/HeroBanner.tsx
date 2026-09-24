import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Star, Info } from 'lucide-react';
import type { Game } from '../types/game';

// Importação dos estilos do Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface HeroBannerProps {
  games: Game[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ games }) => {
  if (!games || games.length === 0) return null;

  return (
    <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl mb-10">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        style={{
          '--swiper-pagination-bullet-inactive-color': '#475569', // Cinza slate-600
          '--swiper-pagination-bullet-inactive-opacity': '1',
          '--swiper-pagination-color': '#3b82f6', // Mantém a cor azul ativa
        } as React.CSSProperties}
        className="h-[380px] md:h-[480px] w-full [&_.swiper-pagination]:bottom-4"  
      >
        {games.map((game) => (
          <SwiperSlide key={game.id} className="relative w-full h-full">
            {/* Imagem de Fundo em Alta Resolução */}
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-full object-cover"
            />

            {/* Degradê Escuro para leitura do texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6 md:p-12">
              <div className="max-w-2xl space-y-3">
                {/* Nota Metacritic */}
                {game.metacritic && (
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                    <Star className="w-3.5 h-3.5 fill-emerald-400" />
                    <span>Destaque Metacritic {game.metacritic}</span>
                  </div>
                )}

                {/* Título do Jogo */}
                <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-md">
                  {game.name}
                </h2>

                {/* Generos */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {game.genres?.slice(0, 3).map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-slate-800/80 backdrop-blur-md text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700/50"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Botão de Ver Detalhes */}
                <div className="pt-2">
                  <Link
                    to={`/game/${game.id}`}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25"
                  >
                    <Info className="w-4 h-4" />
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};