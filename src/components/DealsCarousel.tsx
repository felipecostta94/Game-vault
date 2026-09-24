import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Tag, ExternalLink, Percent, Loader2 } from 'lucide-react';
import type { DealGame } from '../services/api';

import 'swiper/css';
import 'swiper/css/pagination';

interface DealsCarouselProps {
  deals: DealGame[];
  loading?: boolean;
}

export const DealsCarousel: React.FC<DealsCarouselProps> = ({ deals, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-slate-900/50 rounded-2xl border border-slate-800 text-blue-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="text-slate-400 text-xs">Carregando promoções da Steam...</p>
      </div>
    );
  }

  if (!deals || deals.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <Tag className="w-6 h-6 text-emerald-400" />
        <h2 className="text-2xl font-bold text-white">Ofertas Especiais da Steam</h2>
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        style={{
        '--swiper-pagination-bullet-inactive-color': '#475569',
        '--swiper-pagination-bullet-inactive-opacity': '1',
        '--swiper-pagination-color': '#34d399',
      } as React.CSSProperties}
      className="pb-8"
    >
        {deals.map((deal) => (
          <SwiperSlide key={deal.id} className="h-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col h-full group p-4">
              {/* Imagem do Jogo na Steam */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md flex items-center gap-0.5 shadow-lg">
                  <Percent className="w-3 h-3" />
                  -{deal.discountPercentage}%
                </span>
                <span className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-800">
                  {deal.store}
                </span>
              </div>

              {/* Informações de Preço e Link da Oferta */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {deal.name}
                </h3>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <div>
                    <p className="text-xs text-slate-500 line-through">
                      ${deal.originalPrice.toFixed(2)}
                    </p>
                    <p className="text-xl font-black text-emerald-400">
                      ${deal.discountPrice.toFixed(2)}
                    </p>
                  </div>

                  <a
                    href={`https://www.cheapshark.com/redirect?dealID=${deal.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs"
                  >
                    <span>Ver Oferta</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};