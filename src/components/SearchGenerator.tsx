import React, { useState } from 'react';
import { KeywordGroup, TimeframeFilter } from '../types';
import {
  ExternalLink,
  Search,
  Share2,
  Clock,
  Sparkles,
  Linkedin,
  Briefcase,
  Globe,
  Instagram,
  Copy,
  Check,
  Bookmark,
} from 'lucide-react';
import { SavedSearchPreset } from '../types';

interface SearchGeneratorProps {
  groups: KeywordGroup[];
  timeframe: TimeframeFilter;
  onChangeTimeframe: (tf: TimeframeFilter) => void;
  presets?: SavedSearchPreset[];
  onApplyPreset?: (preset: SavedSearchPreset) => void;
  onOpenSavePreset?: () => void;
}

export const SearchGenerator: React.FC<SearchGeneratorProps> = ({
  groups,
  timeframe,
  onChangeTimeframe,
  presets = [],
  onApplyPreset,
  onOpenSavePreset,
}) => {
  const [copiedQuery, setCopiedQuery] = useState(false);

  // Extract active keywords
  const activeRoles = groups.find((g) => g.id === 'roles')?.items.filter((i) => i.active).map((i) => i.text) || [];
  const activeExclusions = groups.find((g) => g.id === 'exclusions')?.items.filter((i) => i.active).map((i) => i.text) || [];
  const activeLocations = groups.find((g) => g.id === 'locations')?.items.filter((i) => i.active).map((i) => i.text) || [];

  const primaryLocation = activeLocations[0] || 'São Paulo';

  // Timeframe parameters
  const getLinkedInTPR = () => {
    if (timeframe === '24h') return 'r86400';
    if (timeframe === '7dias') return 'r604800';
    return 'r2592000'; // 30 dias
  };

  const getIndeedFromage = () => {
    if (timeframe === '24h') return '1';
    if (timeframe === '7dias') return '7';
    return '30'; // 30 dias
  };

  const getGoogleTbs = () => {
    if (timeframe === '24h') return '&tbs=qdr:d';
    if (timeframe === '7dias') return '&tbs=qdr:w';
    return '&tbs=qdr:m'; // 30 dias
  };

  // Combined Google Query (up to 5 active roles combined with OR + intent terms) - without exclusion bloating
  const topRoles = activeRoles.slice(0, 5);
  const rolesOr = topRoles.length > 1 ? `(${topRoles.map((r) => `"${r}"`).join(' OR ')})` : `"${topRoles[0] || 'locutor'}"`;
  const intentTerms = '(vaga OR contratando OR "procura-se" OR seleção)';
  const googleNormalQuery = `${rolesOr} ${intentTerms} "${primaryLocation}"`.trim();

  // Social searches with negative celebratory terms
  const socialNegativeTerms = '-parabéns -homenagem -"dia do radialista"';
  const instagramSearchQuery = `site:instagram.com ${rolesOr} ${intentTerms} "${primaryLocation}" ${socialNegativeTerms}`.trim();
  const linkedinPostsQuery = `site:linkedin.com/posts ${rolesOr} ${intentTerms} "${primaryLocation}" ${socialNegativeTerms}`.trim();
  const facebookSearchQuery = `site:facebook.com ${rolesOr} ${intentTerms} "${primaryLocation}" ${socialNegativeTerms}`.trim();
  const gupySearchQuery = `site:gupy.io ${rolesOr} "${primaryLocation}"`.trim();

  const handleCopyGoogleQuery = () => {
    navigator.clipboard.writeText(googleNormalQuery);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <section className="w-full max-w-5xl mx-auto mb-8">
      <div className="kawaii-box bg-white dark:bg-[#2D1B2B] p-5 sm:p-7 transition-colors">
        {/* Header & Timeframe Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b-2 border-dashed border-[#FFD6E7] dark:border-[#4A2B3F] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-[#FFE9A8] text-[#4A2B3F]">
                <Search className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#4A2B3F] dark:text-[#FFF0F5]">
                Gerador de Buscas Prontas
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#745167] dark:text-[#E2C5D8] mt-0.5">
              Buscas precisas com <strong>1 link individual por cargo</strong> para evitar resultados vazios nos portais.
            </p>
          </div>

          {/* Timeframe Selector: 24h / 7 dias / 30 dias */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#FFF7E8] dark:bg-[#231622] border-2 border-[#4A2B3F] self-start sm:self-auto">
            <span className="text-[11px] font-bold text-[#745167] dark:text-[#FFA6C9] px-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Publicadas há:
            </span>
            <button
              onClick={() => onChangeTimeframe('24h')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                timeframe === '24h'
                  ? 'bg-[#FF6FA5] text-white shadow-sm'
                  : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => onChangeTimeframe('7dias')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                timeframe === '7dias'
                  ? 'bg-[#FF6FA5] text-white shadow-sm'
                  : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => onChangeTimeframe('30dias')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                timeframe === '30dias'
                  ? 'bg-[#FF6FA5] text-white shadow-sm'
                  : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
              }`}
            >
              30 dias
            </button>
          </div>
        </div>

        {/* Quick Presets Bar */}
        {(presets.length > 0 || onOpenSavePreset) && (
          <div className="mb-5 p-3 rounded-2xl bg-[#FFFDF7] dark:bg-[#251523] border-2 border-[#4A2B3F] dark:border-[#FFA6C9]/40 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-extrabold text-[#745167] dark:text-[#FFA6C9] flex items-center gap-1 px-1">
                <Bookmark className="w-3.5 h-3.5 text-[#FF6FA5]" /> Perfis Prontos:
              </span>
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onApplyPreset?.(preset)}
                  className="px-2.5 py-1 text-xs font-bold rounded-xl bg-white dark:bg-[#1E111D] border-2 border-[#4A2B3F]/30 hover:border-[#FF6FA5] hover:bg-[#FFD6E7] dark:hover:bg-[#341F30] text-[#4A2B3F] dark:text-white transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                  title={`Carregar perfil: ${preset.title} (${preset.activeRoles.length} cargos)`}
                >
                  <span>{preset.title}</span>
                </button>
              ))}
            </div>

            {onOpenSavePreset && (
              <button
                onClick={onOpenSavePreset}
                className="kawaii-button px-2.5 py-1 bg-[#FFE9A8] hover:bg-[#ffd771] text-[#4A2B3F] text-[11px] font-bold flex items-center gap-1 shadow-[1px_1px_0px_#4A2B3F] cursor-pointer"
              >
                <span>💾 Salvar Combinação Atual</span>
              </button>
            )}
          </div>
        )}

        {/* 1. Individual Per-Cargo Searches */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF6FA5] dark:text-[#FFA6C9] flex items-center gap-1.5 font-display">
              <Briefcase className="w-4 h-4" />
              Buscas Diretas por Cargo Ativo (LinkedIn, Indeed & Google Vagas)
            </h3>
            <span className="text-[11px] text-[#745167] dark:text-[#C5A6BC]">
              {activeRoles.length} cargos ativos
            </span>
          </div>

          {activeRoles.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">
              Nenhum cargo ativo no momento. Ative pelo menos um cargo no painel acima.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeRoles.map((role) => {
                const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
                  role
                )}&location=${encodeURIComponent(`${primaryLocation}, Brasil`)}&f_TPR=${getLinkedInTPR()}`;

                const indeedUrl = `https://br.indeed.com/jobs?q=${encodeURIComponent(
                  role
                )}&l=${encodeURIComponent(primaryLocation)}&fromage=${getIndeedFromage()}`;

                const googleJobsUrl = `https://www.google.com/search?q=${encodeURIComponent(
                  `${role} ${primaryLocation}`
                )}&ibp=htl;jobs${getGoogleTbs()}`;

                return (
                  <div
                    key={role}
                    className="rounded-2xl p-3.5 bg-[#FFFDF7] dark:bg-[#251523] border-2 border-[#4A2B3F] dark:border-[#FFA6C9]/40 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#4A2B3F] dark:text-white font-display capitalize">
                        {role} • {primaryLocation}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* LinkedIn Direct */}
                      <a
                        href={linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kawaii-button py-1.5 px-2 bg-[#FFD6E7] hover:bg-[#ffbcd7] text-[#4A2B3F] text-[11px] font-bold flex items-center justify-center gap-1 text-center"
                        title={`Buscar vagas de ${role} no LinkedIn`}
                      >
                        <Linkedin className="w-3 h-3 text-[#FF6FA5]" />
                        <span>LinkedIn</span>
                      </a>

                      {/* Indeed Brasil Direct */}
                      <a
                        href={indeedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kawaii-button py-1.5 px-2 bg-[#FFE9A8] hover:bg-[#ffd778] text-[#4A2B3F] text-[11px] font-bold flex items-center justify-center gap-1 text-center"
                        title={`Buscar vagas de ${role} no Indeed`}
                      >
                        <Briefcase className="w-3 h-3" />
                        <span>Indeed</span>
                      </a>

                      {/* Google Vagas Direct */}
                      <a
                        href={googleJobsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kawaii-button py-1.5 px-2 bg-[#9ED8FF] hover:bg-[#80c8fd] text-[#4A2B3F] text-[11px] font-bold flex items-center justify-center gap-1 text-center"
                        title={`Buscar ${role} no Google Vagas`}
                      >
                        <Globe className="w-3 h-3" />
                        <span>G. Vagas</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Google Amplo com Operadores */}
        <div className="pt-5 border-t-2 border-dashed border-[#FFD6E7] dark:border-[#4A2B3F] mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF6FA5] dark:text-[#FFA6C9] flex items-center gap-1.5 font-display">
                <Search className="w-4 h-4 shrink-0" />
                <span>Busca Ampla no Google</span>
              </h3>
              <p className="text-[11px] text-[#745167] dark:text-[#E2C5D8]">
                Combina até 5 cargos ativos com OR e termos de intenção
              </p>
            </div>
            <button
              onClick={handleCopyGoogleQuery}
              className="kawaii-button px-3 py-1.5 bg-[#FFF7E8] dark:bg-[#341F30] text-[#4A2B3F] dark:text-[#FFE9A8] text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-[1px_1px_0px_#4A2B3F]"
            >
              {copiedQuery ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedQuery ? 'Copiado!' : 'Copiar Expressão'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] dark:bg-[#251523] border-3 border-[#4A2B3F] dark:border-[#FFA6C9] flex flex-col gap-3 shadow-[2px_2px_0px_#4A2B3F]">
            {/* Expression Box - No truncate, wraps cleanly */}
            <div className="p-3 rounded-xl bg-white/80 dark:bg-black/30 border border-[#FFD6E7] dark:border-[#4A2B3F]">
              <p className="text-xs sm:text-[13px] font-mono text-[#4A2B3F] dark:text-[#FFE9A8] break-words whitespace-normal leading-relaxed select-all">
                {googleNormalQuery}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <span className="text-[11px] text-[#745167] dark:text-[#C5A6BC]">
                Inclui termos de intenção de contratação (vaga OR contratando OR &quot;procura-se&quot; OR seleção).
              </span>

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(googleNormalQuery)}${getGoogleTbs()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="kawaii-button px-4 py-2.5 bg-[#FF6FA5] hover:bg-[#ff5595] text-white text-xs font-bold flex items-center justify-center gap-2 shrink-0 shadow-[2px_2px_0px_#4A2B3F]"
              >
                <span>Abrir Google Normal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 3. Redes Sociais & Portais */}
        <div className="pt-5 border-t-2 border-dashed border-[#FFD6E7] dark:border-[#4A2B3F]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF6FA5] dark:text-[#FFA6C9] mb-1 flex items-center gap-1.5 font-display">
            <Share2 className="w-4 h-4 shrink-0" />
            <span>Buscas em Redes Sociais & Portais</span>
          </h3>
          <p className="text-[11px] text-[#745167] dark:text-[#C5A6BC] mb-3">
            Buscas direcionadas por anúncios de contratação no Gupy, Instagram, LinkedIn e Facebook.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Gupy */}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(gupySearchQuery)}${getGoogleTbs()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl p-3 bg-[#FFFDF7] dark:bg-[#251523] border-2 border-[#4A2B3F] dark:border-[#FFA6C9]/40 hover:shadow-[3px_3px_0px_#4A2B3F] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C8EC8A] text-[#4A2B3F] border border-[#4A2B3F]/40 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[#4A2B3F]" /> site:gupy.io
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#4A2B3F] dark:text-[#FFA6C9]" />
                </div>
                <h4 className="font-bold text-xs text-[#4A2B3F] dark:text-white font-display">
                  Gupy (Recrutamento Oficial)
                </h4>
                <p className="text-[10px] text-[#745167] dark:text-[#C5A6BC] mt-0.5">
                  Vagas de emissoras cadastradas na Gupy
                </p>
              </div>
              <span className="mt-2 text-[11px] font-bold text-[#FF6FA5] dark:text-[#FFA6C9]">
                Buscar na Gupy ↗
              </span>
            </a>

            {/* Instagram */}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(instagramSearchQuery)}${getGoogleTbs()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl p-3 bg-[#FFFDF7] dark:bg-[#251523] border-2 border-[#4A2B3F] dark:border-[#FFA6C9]/40 hover:shadow-[3px_3px_0px_#4A2B3F] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD6E7] dark:bg-[#341F30] text-[#4A2B3F] dark:text-[#FFA6C9] border border-[#4A2B3F]/40 flex items-center gap-1">
                    <Instagram className="w-3 h-3 text-[#FF6FA5]" /> site:instagram.com
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#4A2B3F] dark:text-[#FFA6C9]" />
                </div>
                <h4 className="font-bold text-xs text-[#4A2B3F] dark:text-white font-display">
                  Instagram (Chamadas & Cast)
                </h4>
                <p className="text-[10px] text-[#745167] dark:text-[#C5A6BC] mt-0.5">
                  Vagas divulgadas em perfis e stories
                </p>
              </div>
              <span className="mt-2 text-[11px] font-bold text-[#FF6FA5] dark:text-[#FFA6C9]">
                Abrir busca ↗
              </span>
            </a>

            {/* LinkedIn Posts */}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(linkedinPostsQuery)}${getGoogleTbs()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl p-3 bg-[#FFFDF7] dark:bg-[#251523] border-2 border-[#4A2B3F] dark:border-[#FFA6C9]/40 hover:shadow-[3px_3px_0px_#4A2B3F] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9ED8FF] dark:bg-[#341F30] text-[#4A2B3F] dark:text-[#9ED8FF] border border-[#4A2B3F]/40 flex items-center gap-1">
                    <Linkedin className="w-3 h-3" /> site:linkedin.com/posts
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#4A2B3F] dark:text-[#FFA6C9]" />
                </div>
                <h4 className="font-bold text-xs text-[#4A2B3F] dark:text-white font-display">
                  Publicações no LinkedIn
                </h4>
                <p className="text-[10px] text-[#745167] dark:text-[#C5A6BC] mt-0.5">
                  Posts de diretores procurando voz
                </p>
              </div>
              <span className="mt-2 text-[11px] font-bold text-[#FF6FA5] dark:text-[#FFA6C9]">
                Abrir busca ↗
              </span>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(facebookSearchQuery)}${getGoogleTbs()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl p-3 bg-[#FFFDF7] dark:bg-[#251523] border-2 border-[#4A2B3F] dark:border-[#FFA6C9]/40 hover:shadow-[3px_3px_0px_#4A2B3F] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE9A8] dark:bg-[#341F30] text-[#4A2B3F] dark:text-[#FFE9A8] border border-[#4A2B3F]/40 flex items-center gap-1">
                    <Share2 className="w-3 h-3" /> site:facebook.com
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#4A2B3F] dark:text-[#FFA6C9]" />
                </div>
                <h4 className="font-bold text-xs text-[#4A2B3F] dark:text-white font-display">
                  Grupos no Facebook
                </h4>
                <p className="text-[10px] text-[#745167] dark:text-[#C5A6BC] mt-0.5">
                  Murais e grupos de radialistas
                </p>
              </div>
              <span className="mt-2 text-[11px] font-bold text-[#FF6FA5] dark:text-[#FFA6C9]">
                Abrir busca ↗
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
