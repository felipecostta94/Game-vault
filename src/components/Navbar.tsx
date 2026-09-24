import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Gamepad2,
  Search,
  ChevronDown,
  Menu,
  X,
  Flame,
  Sparkles,
  Tag,
  Swords,
  ShieldAlert,
  Compass,
  Cpu,
  Trophy,
  Zap,
} from 'lucide-react';
import { getGenres, type Genre } from '../services/api';

// Dicionário para traduzir os nomes das categorias da API RAWG
const GENRE_TRANSLATIONS: Record<string, string> = {
  action: 'Ação',
  'role-playing-games-rpg': 'RPG',
  adventure: 'Aventura',
  strategy: 'Estratégia',
  shooter: 'Tiro (FPS)',
  sports: 'Esportes',
  puzzle: 'Enigmas / Puzzle',
  racing: 'Corrida',
  casual: 'Casual',
  simulation: 'Simulação',
  arcade: 'Arcade',
  platformer: 'Plataforma',
  fighting: 'Luta',
  family: 'Família',
  'board-games': 'Jogos de Tabuleiro',
  educational: 'Educacional',
  card: 'Cartas',
  indie: 'Indie',
  'massively-multiplayer': 'MMO / Multijogador',
};

// Mapeamento opcional de ícones por slug
const GENRE_ICONS: Record<string, React.ElementType> = {
  action: Swords,
  'role-playing-games-rpg': ShieldAlert,
  adventure: Compass,
  strategy: Cpu,
  shooter: Zap,
  sports: Trophy,
};

// Função auxiliar para obter o nome traduzido
const translateGenre = (genre: Genre): string => {
  return GENRE_TRANSLATIONS[genre.slug] || genre.name;
};

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileGenresOpen, setIsMobileGenresOpen] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Busca as categorias dinamicamente da API RAWG
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await getGenres();
        // Seleciona os 8 primeiros gêneros principais
        setGenres(data.slice(0, 8));
      } catch (err) {
        console.error('Erro ao carregar gêneros:', err);
      }
    };
    loadGenres();
  }, []);

  // Fecha o dropdown no desktop ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fecha menus no mobile e dropdown na mudança de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  // Função para rolar suavemente até as seções da Home
  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);

    const performScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (location.pathname === '/') {
      setTimeout(performScroll, 150);
    } else {
      navigate('/');
      setTimeout(performScroll, 300);
    }
  };

  // Submissão do formulário de busca
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group shrink-0 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-500/10">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
              Game<span className="text-blue-500">Vault</span>
            </span>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            
            {/* Dropdown de Categorias */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors py-2 cursor-pointer ${
                  isDropdownOpen ? 'text-blue-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Categorias</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-blue-400' : ''
                  }`}
                />
              </button>

              {/* Menu Suspenso Desktop */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-2xl backdrop-blur-xl">
                    <div className="text-xs font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                      Gêneros Populares
                    </div>
                    <div className="grid grid-cols-1 gap-1 mt-1 max-h-80 overflow-y-auto">
                      {genres.map((genre) => {
                        const Icon = GENRE_ICONS[genre.slug] || Gamepad2;
                        return (
                          <Link
                            key={genre.id}
                            to={`/category/${genre.slug}`}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                          >
                            <Icon className="w-4 h-4 text-blue-400" />
                            <span>{translateGenre(genre)}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Links Rápidos Desktop */}
            <button
              onClick={() => scrollToSection('em-alta')}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Em Alta</span>
            </button>

            <button
              onClick={() => scrollToSection('lancamentos')}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Lançamentos</span>
            </button>

            <button
              onClick={() => scrollToSection('ofertas')}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Ofertas</span>
            </button>
          </nav>

          {/* Campo de Busca Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex relative max-w-xs w-full"
          >
            <input
              type="text"
              placeholder="Buscar jogos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Botão Sanduíche Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu"
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-4 animate-in slide-in-from-top duration-200">
          
          {/* Busca Mobile */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Buscar jogos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Navegação Mobile */}
          <nav className="space-y-1">
            {/* Sanfona de Categorias */}
            <div className="border-b border-slate-800/60 pb-2">
              <button
                onClick={() => setIsMobileGenresOpen(!isMobileGenresOpen)}
                className="w-full flex items-center justify-between py-2.5 text-sm font-semibold text-slate-200 hover:text-blue-400 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-blue-400" />
                  Categorias / Gêneros
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMobileGenresOpen ? 'rotate-180 text-blue-400' : ''
                  }`}
                />
              </button>

              {isMobileGenresOpen && (
                <div className="pl-4 pt-1 space-y-1 max-h-60 overflow-y-auto">
                  {genres.map((genre) => {
                    const Icon = GENRE_ICONS[genre.slug] || Gamepad2;
                    return (
                      <Link
                        key={genre.id}
                        to={`/category/${genre.slug}`}
                        className="flex items-center gap-3 py-2 text-sm text-slate-300 hover:text-white cursor-pointer"
                      >
                        <Icon className="w-4 h-4 text-blue-400" />
                        <span>{translateGenre(genre)}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Links Rápidos Mobile */}
            <button
              onClick={() => scrollToSection('em-alta')}
              className="w-full flex items-center gap-3 py-2.5 text-sm font-semibold text-slate-300 hover:text-white text-left cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Em Alta</span>
            </button>

            <button
              onClick={() => scrollToSection('lancamentos')}
              className="w-full flex items-center gap-3 py-2.5 text-sm font-semibold text-slate-300 hover:text-white text-left cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Lançamentos</span>
            </button>

            <button
              onClick={() => scrollToSection('ofertas')}
              className="w-full flex items-center gap-3 py-2.5 text-sm font-semibold text-slate-300 hover:text-white text-left cursor-pointer"
            >
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Ofertas da Steam</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};