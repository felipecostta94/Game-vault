import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

import {
  getGameDetails,
  getGameTrailers,
  getGameScreenshots,
  translateText,
  type GameTrailer,
  type GameScreenshot,
} from '../services/api';
import type { GameDetailsType } from '../types/game';

import {
  Loader2,
  ArrowLeft,
  Star,
  Globe,
  Calendar,
  Building,
  Code,
  Languages,
  Play,
  ExternalLink,
  Image as ImageIcon,
  Maximize2,
} from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const GameDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<GameDetailsType | null>(null);
  const [trailers, setTrailers] = useState<GameTrailer[]>([]);
  const [screenshots, setScreenshots] = useState<GameScreenshot[]>([]);
  const [descriptionPt, setDescriptionPt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [translating, setTranslating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);

        // Busca os detalhes, trailers e screenshots em paralelo
        const [gameData, trailersData, screenshotsData] = await Promise.all([
          getGameDetails(id),
          getGameTrailers(id),
          getGameScreenshots(id),
        ]);

        setGame(gameData);
        setTrailers(trailersData);
        setScreenshots(screenshotsData);

        if (gameData && gameData.description_raw) {
          setTranslating(true);
          const translated = await translateText(gameData.description_raw);
          setDescriptionPt(translated);
          setTranslating(false);
        }
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os detalhes do jogo.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // Inicializa a instância do Fancybox para os links com data-fancybox="gallery"
 useEffect(() => {
    // O Fancybox v5 já vem com miniaturas e navegação ativadas por padrão
    Fancybox.bind('[data-fancybox="gallery"]');

    return () => {
      Fancybox.unbind('[data-fancybox="gallery"]');
      Fancybox.close();
    };
  }, [screenshots]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-blue-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-slate-400 text-sm">Carregando detalhes do jogo...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="text-center py-12 text-red-400 font-medium">
        {error || 'Jogo não encontrado.'}
      </div>
    );
  }

  const primaryTrailer = trailers.length > 0 ? trailers[0] : null;

  return (
    <div className="space-y-8">
      {/* Botão de Voltar */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para o catálogo
      </Link>

      {/* Banner de Destaque */}
      <div className="relative h-80 md:h-96 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex items-end p-6 md:p-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-white">{game.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              {game.metacritic && (
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-emerald-400" />
                  Metacritic: {game.metacritic}
                </span>
              )}
              {game.website && (
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Site Oficial
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grade Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Coluna Principal */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Descrição */}
          <div className="space-y-4 bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white">Sobre o Jogo</h2>
              <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                <Languages className="w-3.5 h-3.5 text-blue-400" />
                Tradução Automática
              </span>
            </div>

            {translating ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span>Traduzindo descrição para português...</span>
              </div>
            ) : (
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                {descriptionPt || game.description_raw || 'Nenhuma descrição disponível para este jogo.'}
              </p>
            )}
          </div>

          {/* Carrossel de Galeria / Screenshots com Fancybox */}
          {screenshots.length > 0 && (
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Capturas de Tela</h2>
                </div>
                <span className="text-xs text-slate-400">Clique para expandir</span>
              </div>

              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                }}
                navigation
                pagination={{ clickable: true }}
                style={{
                  '--swiper-pagination-bullet-inactive-color': '#475569',
                  '--swiper-pagination-bullet-inactive-opacity': '1',
                  '--swiper-pagination-color': '#3b82f6',
                } as React.CSSProperties}
                className="pb-10 [&_.swiper-button-next]:text-white [&_.swiper-button-prev]:text-white [&_.swiper-button-next]:scale-75 [&_.swiper-button-prev]:scale-75"
              >
                {screenshots.map((shot) => (
                  <SwiperSlide key={shot.id}>
                    <a
                      href={shot.image}
                      data-fancybox="gallery"
                      data-caption={`Captura de tela de ${game.name}`}
                      className="relative group block rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video cursor-pointer"
                    >
                      <img
                        src={shot.image}
                        alt={`Screenshot ${shot.id}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-blue-600 text-white p-2.5 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* Seção do Trailer */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Play className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="text-xl font-bold text-white">Trailer Oficial</h2>
            </div>

            {primaryTrailer ? (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                <video
                  src={primaryTrailer.data.max || primaryTrailer.data[480]}
                  poster={primaryTrailer.preview}
                  controls
                  className="w-full h-full object-cover"
                >
                  Seu navegador não suporta a exibição de vídeos.
                </video>
              </div>
            ) : (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-6 text-center group">
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm group-hover:scale-105 transition-transform duration-500"
                />
                <div className="relative z-10 space-y-3 max-w-md">
                  <div className="w-12 h-12 bg-red-600/90 text-white rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">Assista ao Trailer no YouTube</h3>
                    <p className="text-slate-400 text-xs mt-1">
                      O trailer oficial deste jogo pode ser reproduzido diretamente na plataforma.
                    </p>
                  </div>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      `${game.name} official trailer`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-lg"
                  >
                    <span>Abrir no YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Ficha Técnica Lateral */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl space-y-6 h-fit">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
            Ficha Técnica
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3 text-slate-300">
              <Calendar className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Data de Lançamento
                </p>
                <p>{game.released || 'Não informada'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-300">
              <Code className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Desenvolvedor
                </p>
                <p>{game.developers?.map((d) => d.name).join(', ') || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-300">
              <Building className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Editora / Publisher
                </p>
                <p>{game.publishers?.map((p) => p.name).join(', ') || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};