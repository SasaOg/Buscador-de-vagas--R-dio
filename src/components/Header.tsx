import React, { useState } from 'react';
import { MiczinhoMascot, MascotMood } from './MiczinhoMascot';
import { MainAppTab } from '../types';
import { Moon, Sun, Sparkles, Radio, Compass, Bookmark, Search, Share2, Check } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  mascotMood: MascotMood;
  activeTab: MainAppTab;
  onSelectTab: (tab: MainAppTab) => void;
  savedPresetsCount: number;
  savedJobsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  mascotMood,
  activeTab,
  onSelectTab,
  savedPresetsCount,
  savedJobsCount,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    const publicUrl = 'https://ais-pre-2e57gvt45upyhr5wr4wu43-93801786580.us-east5.run.app';
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <header className="relative w-full max-w-5xl mx-auto mb-6">
      {/* Main Header Card */}
      <div className="kawaii-box bg-white dark:bg-[#2D1B2B] p-4 sm:p-6 transition-colors mb-4 relative">
        {/* Top Right Controls: Share Clean Link & Dark Mode Toggle */}
        <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 flex items-center gap-1.5">
          <button
            onClick={handleCopyLink}
            className="kawaii-button px-2.5 py-1.5 sm:py-2 bg-[#FFE9A8] dark:bg-[#341F30] text-[#4A2B3F] dark:text-[#FFE9A8] text-xs font-bold cursor-pointer flex items-center gap-1 shadow-[1.5px_1.5px_0px_#4A2B3F]"
            title="Copiar link público direto para colar no WhatsApp ou navegador"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600 stroke-[3]" /> : <Share2 className="w-3.5 h-3.5 text-[#FF6FA5]" />}
            <span className="hidden xs:inline">{copiedLink ? 'Copiado!' : 'Compartilhar'}</span>
          </button>

          <button
            onClick={onToggleDarkMode}
            className="kawaii-button p-2 sm:p-2 bg-[#9ED8FF] dark:bg-[#4A2B3F] text-[#4A2B3F] dark:text-[#FFE9A8] text-xs cursor-pointer flex items-center justify-center shadow-[1.5px_1.5px_0px_#4A2B3F]"
            title={darkMode ? 'Mudar para modo dia' : 'Mudar para modo noite fofo'}
            aria-label="Alternar modo escuro"
          >
            {darkMode ? <Sun className="w-4 h-4 text-[#FFE9A8]" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Content Container - 100% Centered on Mobile, Row on Desktop */}
        <div className="w-full flex flex-col items-center sm:flex-row sm:items-center gap-3.5 sm:gap-6 text-center sm:text-left pt-1 sm:pt-0">
          {/* Brand & Mascot with Blinking On-Air Transmission Light */}
          <div className="relative shrink-0 flex flex-col items-center">
            <MiczinhoMascot mood={mascotMood} size={76} />
            <div className="mt-1 bg-[#FFE9A8] dark:bg-[#4A2B3F] text-[#4A2B3F] dark:text-[#FFE9A8] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border-2 border-[#4A2B3F] dark:border-[#FFA6C9] flex items-center gap-1.5 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span>ON AIR</span>
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1.5 flex-wrap">
              <span className="text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFD6E7] dark:bg-[#4A2B3F] text-[#4A2B3F] dark:text-[#FFA6C9] border border-[#4A2B3F] dark:border-[#FFA6C9] flex items-center gap-1">
                <Radio className="w-3 h-3 text-[#F2394F]" /> Rádio & Áudio
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#C8EC8A] text-[#4A2B3F] border border-[#4A2B3F] hidden xs:inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Kawaii Radar
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#4A2B3F] dark:text-[#FFF0F5] leading-tight font-display text-center sm:text-left">
              Radar de Vagas de Áudio
            </h1>

            <p className="text-xs sm:text-sm text-[#745167] dark:text-[#E2C5D8] font-medium max-w-xl mx-auto sm:mx-0 mt-1 leading-relaxed text-center sm:text-left">
              Plataforma de busca de vagas de áudio para profissionais. Buscas direcionadas no LinkedIn, Indeed, Google Vagas, Gupy e canais diretos de emissoras e universidades.
            </p>
          </div>
        </div>
      </div>

      {/* Main Top Navigation Tabs - 100% responsive grid without overflow/scrollbar */}
      <nav className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-[#2D1B2B]/90 backdrop-blur-md border-3 border-[#4A2B3F] dark:border-[#FFA6C9] shadow-[3px_3px_0px_#4A2B3F] dark:shadow-[3px_3px_0px_#FFA6C9]/40">
        {/* Tab 1: Radar de Buscas */}
        <button
          onClick={() => onSelectTab('radar')}
          className={`py-2 px-1 text-center font-bold rounded-xl sm:rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs sm:text-sm min-w-0 ${
            activeTab === 'radar'
              ? 'bg-[#FF6FA5] text-white shadow-[2px_2px_0px_#4A2B3F]'
              : 'text-[#4A2B3F] dark:text-white hover:bg-[#FFD6E7]/50 dark:hover:bg-white/5'
          }`}
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate hidden sm:inline">Radar de Buscas</span>
          <span className="truncate sm:hidden">Radar</span>
        </button>

        {/* Tab 2: Fontes & Emissoras */}
        <button
          onClick={() => onSelectTab('fontes')}
          className={`py-2 px-1 text-center font-bold rounded-xl sm:rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs sm:text-sm min-w-0 ${
            activeTab === 'fontes'
              ? 'bg-[#FF6FA5] text-white shadow-[2px_2px_0px_#4A2B3F]'
              : 'text-[#4A2B3F] dark:text-white hover:bg-[#FFD6E7]/50 dark:hover:bg-white/5'
          }`}
        >
          <Compass className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate hidden sm:inline">Fontes & Emissoras</span>
          <span className="truncate sm:hidden">Fontes</span>
        </button>

        {/* Tab 3: Biblioteca & Histórico */}
        <button
          onClick={() => onSelectTab('biblioteca')}
          className={`py-2 px-1 text-center font-bold rounded-xl sm:rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1 text-xs sm:text-sm min-w-0 ${
            activeTab === 'biblioteca'
              ? 'bg-[#FF6FA5] text-white shadow-[2px_2px_0px_#4A2B3F]'
              : 'text-[#4A2B3F] dark:text-white hover:bg-[#FFD6E7]/50 dark:hover:bg-white/5'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate hidden sm:inline">Biblioteca</span>
          <span className="truncate sm:hidden">Salvas</span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#FFE9A8] text-[#4A2B3F] border border-[#4A2B3F]/30 shrink-0">
            {savedPresetsCount + savedJobsCount}
          </span>
        </button>
      </nav>
    </header>
  );
};

