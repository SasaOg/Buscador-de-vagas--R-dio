import React, { useState } from 'react';
import { HiddenSource, SourceCategory, BrazilianState, KeywordGroup } from '../types';
import { SP_CITIES, BRAZILIAN_STATES } from '../constants/initialData';
import {
  Compass,
  ExternalLink,
  Plus,
  Trash2,
  Pencil,
  RotateCcw,
  Sparkles,
  X,
  Check,
  Radio,
  Mic,
  MapPin,
  GraduationCap,
  Search,
  Linkedin,
  Instagram,
  Building2,
  CornerDownRight,
  HelpCircle,
} from 'lucide-react';

interface HiddenSourcesSectionProps {
  sources: HiddenSource[];
  onAddSource: (source: Omit<HiddenSource, 'id'>) => void;
  onUpdateSource: (id: string, updates: Partial<HiddenSource>) => void;
  onRemoveSource: (id: string) => void;
  onResetSources: () => void;
  groups?: KeywordGroup[];
  onToggleKeyword?: (groupId: string, itemId: string) => void;
  onClearGroup?: (groupId: string) => void;
}

export const HiddenSourcesSection: React.FC<HiddenSourcesSectionProps> = ({
  sources,
  onAddSource,
  onUpdateSource,
  onRemoveSource,
  onResetSources,
  groups,
  onToggleKeyword,
  onClearGroup,
}) => {
  const [activeCategory, setActiveCategory] = useState<SourceCategory>('radios-sp');
  const [selectedSpCity, setSelectedSpCity] = useState<string>(SP_CITIES[0]);
  const [selectedState, setSelectedState] = useState<BrazilianState>('RJ');

  const rolesGroup = groups?.find((g) => g.id === 'roles');
  const activeRoles = rolesGroup?.items.filter((i) => i.active).map((i) => i.text) || [];
  const primaryRole = activeRoles[0] || 'locutor';

  // Edit fields modal
  const [editingSource, setEditingSource] = useState<HiddenSource | null>(null);
  const [editGrupo, setEditGrupo] = useState('');
  const [editLinkVagas, setEditLinkVagas] = useState('');
  const [editLinkRecrutamento, setEditLinkRecrutamento] = useState('');
  const [editLinkContato, setEditLinkContato] = useState('');
  const [editLinkedIn, setEditLinkedIn] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Add source modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<SourceCategory>('radios-sp');
  const [newState, setNewState] = useState<BrazilianState>('SP');
  const [newBadge, setNewBadge] = useState('');
  const [newGrupo, setNewGrupo] = useState('');
  const [newLinkVagas, setNewLinkVagas] = useState('');
  const [newLinkRecrutamento, setNewLinkRecrutamento] = useState('');
  const [newLinkContato, setNewLinkContato] = useState('');
  const [newLinkedIn, setNewLinkedIn] = useState('');
  const [newInstagram, setNewInstagram] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleOpenEdit = (source: HiddenSource) => {
    setEditingSource(source);
    setEditGrupo(source.grupo || '');
    setEditLinkVagas(source.linkVagas || '');
    setEditLinkRecrutamento(source.linkRecrutamento || '');
    setEditLinkContato(source.linkContato || '');
    setEditLinkedIn(source.linkedIn || '');
    setEditInstagram(source.instagram || '');
    setEditNotes(source.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSource) return;

    onUpdateSource(editingSource.id, {
      grupo: editGrupo.trim() || undefined,
      linkVagas: editLinkVagas.trim() || undefined,
      linkRecrutamento: editLinkRecrutamento.trim() || undefined,
      linkContato: editLinkContato.trim() || undefined,
      linkedIn: editLinkedIn.trim() || undefined,
      instagram: editInstagram.trim() || undefined,
      notes: editNotes.trim() || undefined,
    });

    setEditingSource(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddSource({
      name: newName.trim(),
      category: newCategory,
      state: newCategory === 'estados' ? newState : 'SP',
      badge: newBadge.trim() || undefined,
      grupo: newGrupo.trim() || undefined,
      linkVagas: newLinkVagas.trim() || undefined,
      linkRecrutamento: newLinkRecrutamento.trim() || undefined,
      linkContato: newLinkContato.trim() || undefined,
      linkedIn: newLinkedIn.trim() || undefined,
      instagram: newInstagram.trim() || undefined,
      notes: newNotes.trim() || undefined,
      isCustom: true,
      isUniversity: newCategory === 'universidades',
    });

    setNewName('');
    setNewBadge('');
    setNewGrupo('');
    setNewLinkVagas('');
    setNewLinkRecrutamento('');
    setNewLinkContato('');
    setNewLinkedIn('');
    setNewInstagram('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  // Filter sources according to active category and state
  const displayedSources = sources.filter((s) => {
    if (activeCategory === 'estados') {
      return s.category === 'estados' && s.state === selectedState;
    }
    return s.category === activeCategory;
  });

  // REGRA C: Botão "Vagas / Carreiras"
  const getVagasButtonInfo = (source: HiddenSource) => {
    const isUniv = source.isUniversity;

    // (1) Link de vagas oficial salvo
    if (source.linkVagas) {
      return {
        label: 'Vagas Salvas',
        url: source.linkVagas,
        hasCheck: true,
        googleFallbackUrl: null,
      };
    }
    // (2) Página de recrutamento do grupo salva (Vagas.com, Infojobs, Gupy)
    if (source.linkRecrutamento) {
      return {
        label: 'Recrutamento Grupo',
        url: source.linkRecrutamento,
        hasCheck: true,
        googleFallbackUrl: null,
      };
    }
    // (3) Se for universidade com LinkedIn oficial verificado
    if (isUniv && source.linkedIn) {
      return {
        label: 'Perfil LinkedIn',
        url: source.linkedIn,
        hasCheck: true,
        googleFallbackUrl: `https://www.google.com/search?q=${encodeURIComponent(
          `"${source.name}" (carreiras OR vagas OR "trabalhe conosco")`
        )}`,
      };
    }
    // Se for universidade sem LinkedIn salvo
    if (isUniv) {
      const query = `"${source.name}" (carreiras OR vagas OR "trabalhe conosco")`;
      return {
        label: 'Buscar Vagas Univ.',
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        hasCheck: false,
        googleFallbackUrl: null,
      };
    }

    // (4) Se houver grupo empresarial, busca de vagas do LinkedIn
    if (source.grupo) {
      return {
        label: 'Vagas no LinkedIn',
        url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
          source.grupo
        )}&location=${encodeURIComponent('São Paulo, Brasil')}`,
        hasCheck: false,
        googleFallbackUrl: `https://www.google.com/search?q=${encodeURIComponent(
          `"${source.grupo}" (carreiras OR "trabalhe conosco" OR vagas)`
        )}`,
      };
    }

    // (5) Último recurso: busca direta no Google com termos de contratação
    return {
      label: 'Buscar Vagas',
      url: `https://www.google.com/search?q=${encodeURIComponent(
        `"${source.name}" (carreiras OR "trabalhe conosco" OR vagas)`
      )}`,
      hasCheck: false,
      googleFallbackUrl: null,
    };
  };

  // REGRA C: Botão "Contato" (Direto se salvo, senão busca limpa no Google)
  const getContatoButtonInfo = (source: HiddenSource) => {
    if (source.linkContato) {
      return {
        label: 'Contato Direto',
        url: source.linkContato,
        hasCheck: true,
        googleFallbackUrl: null,
      };
    }

    return {
      label: 'Buscar Contato',
      url: `https://www.google.com/search?q=${encodeURIComponent(
        `"${source.name}" (contato OR "fale conosco")`
      )}`,
      hasCheck: false,
      googleFallbackUrl: null,
    };
  };

  // REGRA C & G: Botão "LinkedIn" (Abre perfil direto da empresa ou universidade)
  const getLinkedInButtonInfo = (source: HiddenSource) => {
    if (source.linkedIn) {
      return {
        label: source.isUniversity ? 'Perfil Univ.' : 'Perfil Oficial',
        url: source.linkedIn,
        hasCheck: true,
      };
    }

    const searchTarget = source.grupo || source.name;
    return {
      label: 'LinkedIn Empresa',
      url: `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(searchTarget)}`,
      hasCheck: false,
    };
  };

  // REGRA C: Botão "Instagram"
  const getInstagramButtonInfo = (source: HiddenSource) => {
    if (source.instagram) {
      return {
        label: 'Instagram Salvo',
        url: source.instagram,
        hasCheck: true,
      };
    }

    return {
      label: 'Buscar Instagram',
      url: `https://www.google.com/search?q=${encodeURIComponent(`site:instagram.com "${source.name}"`)}`,
      hasCheck: false,
    };
  };

  return (
    <section className="w-full max-w-5xl mx-auto mb-12">
      <div className="kawaii-box bg-white dark:bg-[#2D1B2B] p-5 sm:p-7 transition-colors">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b-2 border-dashed border-[#FFD6E7] dark:border-[#4A2B3F] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-[#C8EC8A] text-[#4A2B3F]">
                <Compass className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#4A2B3F] dark:text-[#FFF0F5]">
                Fontes, Emissoras & Universidades
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#745167] dark:text-[#E2C5D8] mt-0.5">
              Canais diretos organizados por grupo, links salvos com selo ✓ e navegação inteligente com atalhos diretos.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="kawaii-button px-3.5 py-1.5 bg-[#FF6FA5] hover:bg-[#ff5595] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#4A2B3F]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Fonte</span>
            </button>

            <button
              onClick={onResetSources}
              className="kawaii-button px-3.5 py-1.5 bg-[#FFF7E8] dark:bg-[#3B2338] text-[#4A2B3F] dark:text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Restaurar fontes padrão verificadas"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar</span>
            </button>
          </div>
        </div>

        {/* Active Queries Strip - Directly requested by user */}
        {rolesGroup && (
          <div className="mb-5 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#FFFDF7] dark:bg-[#251523] border-3 border-[#4A2B3F] dark:border-[#FFA6C9] shadow-[2px_2px_0px_#4A2B3F]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="p-1 rounded-full bg-[#FFD6E7] text-[#4A2B3F]">
                  <Mic className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-xs sm:text-sm font-bold font-display text-[#4A2B3F] dark:text-white">
                  Queries & Cargos Ativos para busca nas Emissoras:
                </h3>
                {activeRoles.length > 0 && onClearGroup && (
                  <button
                    type="button"
                    onClick={() => onClearGroup('roles')}
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FFE9A8] hover:bg-[#ffd771] text-[#4A2B3F] border border-[#4A2B3F] cursor-pointer ml-1"
                    title="Desmarcar todos para selecionar apenas o cargo desejado"
                  >
                    Limpar tudo
                  </button>
                )}
              </div>
              <span className="text-[11px] text-[#745167] dark:text-[#C5A6BC]">
                Clique para ligar ou desligar queries
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {rolesGroup.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onToggleKeyword?.('roles', item.id)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1 ${
                    item.active
                      ? 'bg-[#FF6FA5] text-white border-[#4A2B3F] shadow-[1px_1px_0px_#4A2B3F]'
                      : 'bg-white/60 dark:bg-[#1E111D] text-[#745167] dark:text-[#C5A6BC] border-[#4A2B3F]/20 hover:border-[#FF6FA5]'
                  }`}
                  title={item.active ? 'Clique para desativar esta query' : 'Clique para ativar esta query'}
                >
                  <span>{item.text}</span>
                  {item.active && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab Strip */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 p-1 rounded-2xl bg-[#FFF7E8] dark:bg-[#231622] border-2 border-[#4A2B3F]">
          {/* 1. Rádios de São Paulo */}
          <button
            onClick={() => setActiveCategory('radios-sp')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              activeCategory === 'radios-sp'
                ? 'bg-[#FF6FA5] text-white shadow-sm'
                : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Rádios de São Paulo</span>
          </button>

          {/* 2. Podcasts & Produtoras */}
          <button
            onClick={() => setActiveCategory('podcasts')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              activeCategory === 'podcasts'
                ? 'bg-[#FF6FA5] text-white shadow-sm'
                : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Podcasts & Produtoras</span>
          </button>

          {/* 3. Cidades de SP */}
          <button
            onClick={() => setActiveCategory('cidades-sp')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              activeCategory === 'cidades-sp'
                ? 'bg-[#FF6FA5] text-white shadow-sm'
                : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Cidades de SP</span>
          </button>

          {/* 4. Outros Estados */}
          <button
            onClick={() => setActiveCategory('estados')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              activeCategory === 'estados'
                ? 'bg-[#FF6FA5] text-white shadow-sm'
                : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Outros Estados ({selectedState})</span>
          </button>

          {/* 5. Universidades */}
          <button
            onClick={() => setActiveCategory('universidades')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              activeCategory === 'universidades'
                ? 'bg-[#FF6FA5] text-white shadow-sm'
                : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Universidades</span>
          </button>
        </div>

        {/* Section: Cidades de SP (19 cities selector) */}
        {activeCategory === 'cidades-sp' && (
          <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-[#FFFDF7] dark:bg-[#251523] border-3 border-[#4A2B3F] dark:border-[#FFA6C9]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-full bg-[#C8EC8A] text-[#4A2B3F]">
                  <MapPin className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-[#4A2B3F] dark:text-white font-display">
                    Polo Regional / Cidade de São Paulo
                  </h3>
                  <span className="text-[11px] text-[#745167] dark:text-[#C5A6BC]">
                    Selecione a cidade para gerar a busca direta por vagas em emissoras locais.
                  </span>
                </div>
              </div>

              {/* City selector with 19 cities */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 w-full sm:w-auto min-w-0">
                <label className="text-xs font-bold text-[#4A2B3F] dark:text-[#FFA6C9] shrink-0">Cidade:</label>
                <select
                  value={selectedSpCity}
                  onChange={(e) => setSelectedSpCity(e.target.value)}
                  className="w-full sm:w-auto max-w-full min-w-0 px-3 py-2 text-xs font-bold rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-white dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white cursor-pointer shadow-xs truncate"
                >
                  {SP_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generated Search Button for the City */}
            <div className="pt-2 border-t border-[#FFD6E7] dark:border-[#4A2B3F]">
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  `rádio ${selectedSpCity} vaga locutor`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="kawaii-button py-2.5 px-3 bg-[#FFE9A8] hover:bg-[#ffd771] text-[#4A2B3F] text-xs font-bold flex items-center justify-between gap-2 shadow-[2px_2px_0px_#4A2B3F] max-w-full"
              >
                <span className="truncate">🔍 Abrir busca: &quot;rádio {selectedSpCity} vaga locutor&quot; no Google</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>
        )}

        {/* Section: Outros Estados (State selector SP, RJ, MG, ES, PR, SC, RS) */}
        {activeCategory === 'estados' && (
          <div className="mb-6 p-4 rounded-3xl bg-[#FFFDF7] dark:bg-[#251523] border-3 border-[#4A2B3F] dark:border-[#FFA6C9]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-full bg-[#9ED8FF] text-[#4A2B3F]">
                  <Building2 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-[#4A2B3F] dark:text-white font-display">
                    Emissoras de Música e Entretenimento por Estado
                  </h3>
                  <span className="text-[11px] text-[#745167] dark:text-[#C5A6BC]">
                    Selecione um estado para listar as principais emissoras da capital e grandes centros.
                  </span>
                </div>
              </div>

              {/* State Pills */}
              <div className="flex flex-wrap items-center gap-1">
                {BRAZILIAN_STATES.filter((st) => st.uf !== 'SP').map((st) => (
                  <button
                    key={st.uf}
                    onClick={() => setSelectedState(st.uf)}
                    className={`px-3 py-1 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
                      selectedState === st.uf
                        ? 'bg-[#FF6FA5] text-white border-[#4A2B3F] shadow-[2px_2px_0px_#4A2B3F]'
                        : 'bg-white dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white border-[#4A2B3F]/30 hover:bg-[#FFD6E7]'
                    }`}
                  >
                    {st.uf} ({st.name})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sources Cards Grid (Regra C) */}
        {displayedSources.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            Nenhuma emissora cadastrada nesta categoria. Use o botão &quot;Adicionar Fonte&quot; acima para incluir.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedSources.map((source) => {
              const vagasBtn = getVagasButtonInfo(source);
              const contatoBtn = getContatoButtonInfo(source);
              const linkedInBtn = getLinkedInButtonInfo(source);
              const instagramBtn = getInstagramButtonInfo(source);

              const hasCustomLinks =
                Boolean(source.linkVagas) ||
                Boolean(source.linkRecrutamento) ||
                Boolean(source.linkContato) ||
                Boolean(source.linkedIn) ||
                Boolean(source.instagram);

              return (
                <div
                  key={source.id}
                  className="rounded-3xl p-4 bg-[#FFFDF7] dark:bg-[#251523] border-3 border-[#4A2B3F] dark:border-[#FFA6C9]/40 flex flex-col justify-between shadow-[3px_3px_0px_#4A2B3F] dark:shadow-[3px_3px_0px_#FFA6C9]/30"
                >
                  <div>
                    {/* Top Bar with Badge, Group and Edit Action */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {source.badge && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FFD6E7] dark:bg-[#341F30] text-[#4A2B3F] dark:text-[#FFA6C9] border border-[#4A2B3F]/40">
                            {source.badge}
                          </span>
                        )}
                        {hasCustomLinks && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#C8EC8A] text-[#4A2B3F] border border-[#4A2B3F]/40 flex items-center gap-0.5" title="Possui links personalizados verificados">
                            <Check className="w-2.5 h-2.5 stroke-[3]" /> Links ✓
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(source)}
                          className="p-1 text-[#745167] hover:text-[#4A2B3F] dark:text-[#C5A6BC] dark:hover:text-white cursor-pointer"
                          title="Editar links oficiais, grupo e notas"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {source.isCustom && (
                          <button
                            onClick={() => onRemoveSource(source.id)}
                            className="p-1 text-slate-400 hover:text-[#F2394F] cursor-pointer"
                            title="Remover fonte"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Source Name */}
                    <h3 className="font-bold text-base text-[#4A2B3F] dark:text-white font-display">
                      {source.name}
                    </h3>

                    {/* Grupo / Empresa */}
                    {source.grupo && (
                      <p className="text-[11px] font-bold text-[#FF6FA5] dark:text-[#FFA6C9] mb-1">
                        Grupo: {source.grupo}
                      </p>
                    )}

                    {/* Notes */}
                    {source.notes && (
                      <p className="text-[11px] text-[#745167] dark:text-[#C5A6BC] leading-relaxed mb-3">
                        {source.notes}
                      </p>
                    )}
                  </div>

                  {/* 4 Botões da Regra C */}
                  <div className="mt-3 pt-3 border-t-2 border-[#FFD6E7] dark:border-[#4A2B3F] space-y-2">
                    {/* Linha 1: Vagas/Carreiras e Contato */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {/* 1. VAGAS / CARREIRAS (Regra C: 1->linkVagas, 2->linkRecrutamento, 3->linkedIn, 4->linkedinJobs, 5->!ducky + google) */}
                      <div className="flex items-center gap-1">
                        <a
                          href={vagasBtn.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`kawaii-button flex-1 py-1.5 px-2 text-[11px] font-bold flex items-center justify-center gap-1 truncate ${
                            vagasBtn.hasCheck
                              ? 'bg-[#C8EC8A] text-[#4A2B3F] shadow-[1px_1px_0px_#4A2B3F]'
                              : 'bg-[#FFD6E7] hover:bg-[#ffbcd7] text-[#4A2B3F]'
                          }`}
                          title={`Abrir Vagas / Carreiras (${vagasBtn.label})`}
                        >
                          {vagasBtn.hasCheck && <Check className="w-3 h-3 text-[#4A2B3F] stroke-[3]" />}
                          <span className="truncate">{vagasBtn.label}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>

                        {vagasBtn.googleFallbackUrl && (
                          <a
                            href={vagasBtn.googleFallbackUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full bg-[#FFF7E8] dark:bg-[#341F30] border border-[#4A2B3F]/40 hover:bg-[#FFD6E7] text-[#4A2B3F] dark:text-white shrink-0"
                            title="Buscar vagas no Google"
                          >
                            <Search className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* 2. CONTATO (Regra C: linkContato salvo ou !ducky + Google) */}
                      <div className="flex items-center gap-1">
                        <a
                          href={contatoBtn.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`kawaii-button flex-1 py-1.5 px-2 text-[11px] font-bold flex items-center justify-center gap-1 truncate ${
                            contatoBtn.hasCheck
                              ? 'bg-[#C8EC8A] text-[#4A2B3F] shadow-[1px_1px_0px_#4A2B3F]'
                              : 'bg-[#FFE9A8] hover:bg-[#ffd977] text-[#4A2B3F]'
                          }`}
                          title={`Abrir Contato (${contatoBtn.label})`}
                        >
                          {contatoBtn.hasCheck && <Check className="w-3 h-3 text-[#4A2B3F] stroke-[3]" />}
                          <span className="truncate">{contatoBtn.label}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>

                        {contatoBtn.googleFallbackUrl && (
                          <a
                            href={contatoBtn.googleFallbackUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full bg-[#FFF7E8] dark:bg-[#341F30] border border-[#4A2B3F]/40 hover:bg-[#FFE9A8] text-[#4A2B3F] dark:text-white shrink-0"
                            title="Buscar contato no Google"
                          >
                            <Search className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Linha 2: LinkedIn e Instagram */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {/* 3. LINKEDIN */}
                      <a
                        href={linkedInBtn.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`kawaii-button py-1.5 px-2 text-[11px] font-bold flex items-center justify-center gap-1 truncate ${
                          linkedInBtn.hasCheck
                            ? 'bg-[#C8EC8A] text-[#4A2B3F]'
                            : 'bg-[#9ED8FF] hover:bg-[#86cbff] text-[#4A2B3F]'
                        }`}
                        title={linkedInBtn.hasCheck ? 'Abrir LinkedIn oficial salvo' : 'Buscar empresa no LinkedIn'}
                      >
                        {linkedInBtn.hasCheck && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        <Linkedin className="w-3 h-3 text-[#0077b5]" />
                        <span className="truncate">{linkedInBtn.label}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>

                      {/* 4. INSTAGRAM */}
                      <a
                        href={instagramBtn.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`kawaii-button py-1.5 px-2 text-[11px] font-bold flex items-center justify-center gap-1 truncate ${
                          instagramBtn.hasCheck
                            ? 'bg-[#C8EC8A] text-[#4A2B3F]'
                            : 'bg-[#FFF7E8] dark:bg-[#341F30] hover:bg-[#FFD6E7] text-[#4A2B3F] dark:text-[#FFA6C9]'
                        }`}
                        title={instagramBtn.hasCheck ? 'Abrir perfil salvo do Instagram' : 'Buscar perfil no Instagram'}
                      >
                        {instagramBtn.hasCheck && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        <Instagram className="w-3 h-3 text-[#e1306c]" />
                        <span className="truncate">{instagramBtn.label}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    </div>

                    {/* Linha 3: Busca Direta do Cargo Ativo nesta Emissora */}
                    {primaryRole && (
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(
                          `"${source.name}" "${primaryRole}" vaga`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kawaii-button w-full py-1.5 px-2 bg-[#FFE9A8] hover:bg-[#ffd771] text-[#4A2B3F] text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-[1px_1px_0px_#4A2B3F] truncate"
                        title={`Buscar vagas de "${primaryRole}" especificamente em "${source.name}"`}
                      >
                        <Search className="w-3 h-3 text-[#4A2B3F] shrink-0" />
                        <span className="truncate">Buscar vaga de &quot;{primaryRole}&quot; aqui</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Edit Source Fields (Regra C) */}
      {editingSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="kawaii-box bg-white dark:bg-[#2D1B2B] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#FFD6E7] dark:border-[#4A2B3F]">
              <div>
                <h3 className="text-base font-bold font-display text-[#4A2B3F] dark:text-[#FFF0F5] flex items-center gap-1.5">
                  <Pencil className="w-4 h-4 text-[#FF6FA5]" /> Editar Links da Fonte
                </h3>
                <span className="text-xs text-[#FF6FA5] font-bold">{editingSource.name}</span>
              </div>
              <button
                onClick={() => setEditingSource(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              {/* Grupo ou Empresa */}
              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Grupo ou Empresa (ex: Grupo Globo, Grupo Bandeirantes):
                </label>
                <input
                  type="text"
                  placeholder="Nome do conglomerado ou grupo de comunicação..."
                  value={editGrupo}
                  onChange={(e) => setEditGrupo(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              {/* Link de Vagas */}
              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Link oficial de vagas (prioridade 1):
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editLinkVagas}
                  onChange={(e) => setEditLinkVagas(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              {/* Link de Recrutamento do Grupo */}
              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Página de recrutamento do grupo (prioridade 2 - ex: Vagas.com, Gupy):
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editLinkRecrutamento}
                  onChange={(e) => setEditLinkRecrutamento(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              {/* Link de Contato */}
              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Link oficial de contato:
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={editLinkContato}
                  onChange={(e) => setEditLinkContato(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  LinkedIn da empresa / grupo:
                </label>
                <input
                  type="text"
                  placeholder="https://www.linkedin.com/company/..."
                  value={editLinkedIn}
                  onChange={(e) => setEditLinkedIn(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Instagram da empresa / emissora:
                </label>
                <input
                  type="text"
                  placeholder="https://www.instagram.com/..."
                  value={editInstagram}
                  onChange={(e) => setEditInstagram(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              {/* Notas */}
              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Anotações ou dicas particulares:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Foco em locução jovem, contato por e-mail..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#FFD6E7] dark:border-[#4A2B3F]">
                <button
                  type="button"
                  onClick={() => setEditingSource(null)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="kawaii-button px-4 py-2 bg-[#FF6FA5] hover:bg-[#ff5595] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#4A2B3F]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Dados</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Source */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="kawaii-box bg-white dark:bg-[#2D1B2B] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#FFD6E7] dark:border-[#4A2B3F]">
              <h3 className="text-base font-bold font-display text-[#4A2B3F] dark:text-[#FFF0F5] flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#FF6FA5]" /> Adicionar Nova Fonte
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Nome da Emissora ou Instituição:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rádio Cidade, Podcast X..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                    Categoria:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as SourceCategory)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                  >
                    <option value="radios-sp">Rádios de São Paulo</option>
                    <option value="podcasts">Podcasts & Produtoras</option>
                    <option value="estados">Outros Estados</option>
                    <option value="universidades">Universidades</option>
                  </select>
                </div>

                {newCategory === 'estados' ? (
                  <div>
                    <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                      Estado:
                    </label>
                    <select
                      value={newState}
                      onChange={(e) => setNewState(e.target.value as BrazilianState)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                    >
                      {BRAZILIAN_STATES.map((st) => (
                        <option key={st.uf} value={st.uf}>
                          {st.uf} ({st.name})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                      Etiqueta (ex: 92.5 FM):
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 92.5 FM, Web..."
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Grupo ou Empresa (opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Grupo Bandeirantes, Grupo Globo..."
                  value={newGrupo}
                  onChange={(e) => setNewGrupo(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Link oficial de vagas (opcional):
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newLinkVagas}
                  onChange={(e) => setNewLinkVagas(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Link oficial de contato (opcional):
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newLinkContato}
                  onChange={(e) => setNewLinkContato(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  LinkedIn da empresa (opcional):
                </label>
                <input
                  type="text"
                  placeholder="https://www.linkedin.com/company/..."
                  value={newLinkedIn}
                  onChange={(e) => setNewLinkedIn(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Instagram da emissora (opcional):
                </label>
                <input
                  type="text"
                  placeholder="https://www.instagram.com/..."
                  value={newInstagram}
                  onChange={(e) => setNewInstagram(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Notas sobre a fonte:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Programação pop e variedades..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#FFD6E7] dark:border-[#4A2B3F]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="kawaii-button px-4 py-2 bg-[#FF6FA5] hover:bg-[#ff5595] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#4A2B3F]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Fonte</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
