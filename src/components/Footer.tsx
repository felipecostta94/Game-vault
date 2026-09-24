import React from 'react';
import { Gamepad2, Code, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800/80 mt-20 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center space-y-6">
        
        {/* Logo Centralizada */}
        <div className="flex items-center gap-2 text-xl font-black text-white tracking-wider">
          <Gamepad2 className="w-7 h-7 text-blue-500" />
          <span>GAME<span className="text-blue-500">VAULT</span></span>
        </div>

        {/* Descrição Básica e Créditos */}
        <p className="text-slate-400 text-sm max-w-md leading-relaxed">
          Sua plataforma para explorar os jogos mais populares, lançamentos recentes e ofertas imperdíveis.
        </p>

        {/* Links Sociais / Portfólio */}
        <div className="flex items-center gap-4 text-slate-400">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-slate-900 hover:bg-slate-800 hover:text-white rounded-full transition-colors border border-slate-800"
            aria-label="GitHub"
            title="GitHub"
          >
            <Code className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-slate-900 hover:bg-slate-800 hover:text-white rounded-full transition-colors border border-slate-800"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <Globe className="w-5 h-5" />
          </a>
        </div>

        {/* Divisor */}
        <div className="w-24 h-px bg-slate-800 my-2" />

        {/* Rodapé Final */}
        <div className="text-xs text-slate-500 space-y-1">
            <p className="flex items-center justify-center gap-1">
                Desenvolvido para fins de portfólio.
            </p>
            <p>Dados fornecidos por RAWG API & CheapShark API.</p>
        </div>
      </div>
    </footer>
  );
};