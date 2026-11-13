import React, { useState } from 'react';
import {
  SavedSearchPreset,
  LibraryJob,
  JobLibraryStatus,
  KeywordGroup,
  TimeframeFilter,
} from '../types';
import {
  Bookmark,
  History,
  Sparkles,
  Play,
  Trash2,
  Plus,
  ExternalLink,
  Check,
  Send,
  Calendar,
  UserCheck,
  FileText,
  Copy,
  Clock,
  Briefcase,
  Radio,
  Pencil,
  X,
  Heart,
  Star,
} from 'lucide-react';
import {
  RadinhoMascot,
  CasseteMascot,
  MesaDJMascot,
  MiczinhoSad,
} from './AudioCrewMascots';

interface LibrarySectionProps {
  presets: SavedSearchPreset[];
  jobs: LibraryJob[];
  currentGroups: KeywordGroup[];
  currentTimeframe: TimeframeFilter;
  onApplyPreset: (preset: SavedSearchPreset) => void;
  onSavePreset: (title: string) => void;
  onDeletePreset: (id: string) => void;
  onAddJob: (job: Omit<LibraryJob, 'id' | 'dateAdded'>) => void;
  onUpdateJobStatus: (id: string, status: JobLibraryStatus) => void;
  onUpdateJob: (id: string, updates: Partial<LibraryJob>) => void;
  onDeleteJob: (id: string) => void;
}

export const LibrarySection: React.FC<LibrarySectionProps> = ({
  presets,
  jobs,
  currentGroups,
  currentTimeframe,
  onApplyPreset,
  onSavePreset,
  onDeletePreset,
  onAddJob,
  onUpdateJobStatus,
  onUpdateJob,
  onDeleteJob,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'presets' | 'jobs'>('presets');

  // New Preset Modal state
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [presetTitleInput, setPresetTitleInput] = useState('');

  // New Job Modal state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobStatus, setJobStatus] = useState<JobLibraryStatus>('saved');
  const [jobNotes, setJobNotes] = useState('');
  const [jobContactPerson, setJobContactPerson] = useState('');

  // Editing existing job state
  const [editingJob, setEditingJob] = useState<LibraryJob | null>(null);

  // Status Filter for Jobs
  const [statusFilter, setStatusFilter] = useState<'all' | JobLibraryStatus>('all');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Active filters preview from current groups
  const currentActiveRoles =
    currentGroups.find((g) => g.id === 'roles')?.items.filter((i) => i.active).map((i) => i.text) || [];
  const currentActiveContexts =
    currentGroups.find((g) => g.id === 'contexts')?.items.filter((i) => i.active).map((i) => i.text) || [];
  const currentActiveExclusions =
    currentGroups.find((g) => g.id === 'exclusions')?.items.filter((i) => i.active).map((i) => i.text) || [];
  const currentActiveLocations =
    currentGroups.find((g) => g.id === 'locations')?.items.filter((i) => i.active).map((i) => i.text) || [];

  const handleOpenPresetModal = () => {
    // Generate an automatic smart suggestion based on top active roles
    const top = currentActiveRoles.slice(0, 2).join(' & ');
    const autoTitle = top ? `${top} (${currentActiveLocations[0] || 'SP'})` : 'Meu Perfil de Busca';
    setPresetTitleInput(autoTitle);
    setIsPresetModalOpen(true);
  };

  const handleConfirmSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetTitleInput.trim()) return;
    onSavePreset(presetTitleInput.trim());
    setIsPresetModalOpen(false);
  };

  const handleConfirmSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobCompany.trim()) return;

    if (editingJob) {
      onUpdateJob(editingJob.id, {
        title: jobTitle.trim(),
        company: jobCompany.trim(),
        url: jobUrl.trim() || undefined,
        status: jobStatus,
        notes: jobNotes.trim() || undefined,
        contactPerson: jobContactPerson.trim() || undefined,
      });
      setEditingJob(null);
    } else {
      onAddJob({
        title: jobTitle.trim(),
        company: jobCompany.trim(),
        url: jobUrl.trim(),
        status: jobStatus,
        notes: jobNotes.trim() || undefined,
        contactPerson: jobContactPerson.trim() || undefined,
      });
    }

    setJobTitle('');
    setJobCompany('');
    setJobUrl('');
    setJobNotes('');
    setJobContactPerson('');
    setJobStatus('saved');
    setIsJobModalOpen(false);
  };

  const handleStartEditJob = (job: LibraryJob) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobCompany(job.company);
    setJobUrl(job.url || '');
    setJobStatus(job.status);
    setJobNotes(job.notes || '');
    setJobContactPerson(job.contactPerson || '');
    setIsJobModalOpen(true);
  };

  // Filtered jobs
  const filteredJobs = jobs.filter((j) => {
    if (statusFilter === 'all') return true;
    return j.status === statusFilter;
  });

  const getStatusBadge = (status: JobLibraryStatus) => {
    switch (status) {
      case 'saved':
        return {
          label: '💖 Salva',
          bg: 'bg-[#FFE9A8]',
          text: 'text-[#4A2B3F]',
          border: 'border-[#4A2B3F]/30',
        };
      case 'applied':
        return {
          label: '⭐ Candidatura Enviada',
          bg: 'bg-[#9ED8FF]',
          text: 'text-[#4A2B3F]',
          border: 'border-[#4A2B3F]/30',
        };
      case 'interview':
        return {
          label: '🌈 Entrevista / Teste',
          bg: 'bg-[#FFD6E7]',
          text: 'text-[#4A2B3F]',
          border: 'border-[#4A2B3F]/30',
        };
      case 'archived':
        return {
          label: '📦 Arquivada',
          bg: 'bg-stone-200 dark:bg-stone-800',
          text: 'text-stone-700 dark:text-stone-300',
          border: 'border-stone-400',
        };
    }
  };

  // Export summary
  const handleCopySummary = () => {
    if (jobs.length === 0) return;
    const lines = [
      '# Minhas Vagas de Áudio & Candidaturas',
      `Data do relatório: ${new Date().toLocaleDateString('pt-BR')}`,
      '',
    ];

    jobs.forEach((j, index) => {
      lines.push(`${index + 1}. ${j.title} — ${j.company}`);
      lines.push(`   Status: ${getStatusBadge(j.status).label}`);
      if (j.url) lines.push(`   Link: ${j.url}`);
      if (j.contactPerson) lines.push(`   Contato: ${j.contactPerson}`);
      if (j.notes) lines.push(`   Notas: ${j.notes}`);
      lines.push('');
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  return (
    <section className="w-full max-w-5xl mx-auto mb-12">
      <div className="kawaii-box bg-white dark:bg-[#2D1B2B] p-5 sm:p-7 transition-colors">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b-2 border-dashed border-[#FFD6E7] dark:border-[#4A2B3F] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-[#FFE9A8] text-[#4A2B3F]">
                <Bookmark className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#4A2B3F] dark:text-[#FFF0F5]">
                Histórico de Buscas & Biblioteca de Vagas
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#745167] dark:text-[#E2C5D8] mt-0.5">
              Guarde suas combinações favoritas de filtros para alternar com 1 clique e acompanhe o status das suas candidaturas.
            </p>
          </div>

          {/* Quick Sub-tab selector */}
          <div className="grid grid-cols-2 sm:flex items-center gap-1.5 p-1 rounded-2xl bg-[#FFF7E8] dark:bg-[#231622] border-2 border-[#4A2B3F] w-full sm:w-auto">
            <button
              onClick={() => setActiveSubTab('presets')}
              className={`px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                activeSubTab === 'presets'
                  ? 'bg-[#FF6FA5] text-white shadow-sm'
                  : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
              }`}
            >
              <History className="w-3.5 h-3.5 shrink-0" />
              <span>Perfis ({presets.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('jobs')}
              className={`px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                activeSubTab === 'jobs'
                  ? 'bg-[#FF6FA5] text-white shadow-sm'
                  : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span>Vagas Salvas ({jobs.length})</span>
            </button>
          </div>
        </div>

        {/* SUBTAB 1: PERFIS DE BUSCA / HISTÓRICO */}
        {activeSubTab === 'presets' && (
          <div>
            {/* Banner: Current Active Filter Preview + Save button */}
            <div className="mb-6 p-4 rounded-3xl bg-[#FFFDF7] dark:bg-[#251523] border-3 border-[#4A2B3F] dark:border-[#FFA6C9] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[2px_2px_0px_#4A2B3F]">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#C8EC8A] text-[#4A2B3F] border border-[#4A2B3F]/30 uppercase">
                    Filtro Atual no Radar
                  </span>
                  <span className="text-xs font-bold text-[#4A2B3F] dark:text-white">
                    {currentActiveRoles.length} cargos • {currentActiveLocations.join(', ')} • {currentTimeframe}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  {currentActiveRoles.map((r) => (
                    <span
                      key={r}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD6E7] text-[#4A2B3F] border border-[#4A2B3F]/20"
                    >
                      {r}
                    </span>
                  ))}
                  {currentActiveContexts.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9ED8FF] text-[#4A2B3F] border border-[#4A2B3F]/20"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleOpenPresetModal}
                className="kawaii-button px-4 py-2.5 bg-[#FF6FA5] hover:bg-[#ff5595] text-white text-xs font-bold flex items-center justify-center gap-2 shrink-0 shadow-[2px_2px_0px_#4A2B3F] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Salvar Este Filtro como Perfil</span>
              </button>
            </div>

            {/* List of Presets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="rounded-3xl p-5 bg-[#FFFDF7] dark:bg-[#251523] border-3 border-[#4A2B3F] dark:border-[#FFA6C9]/40 flex flex-col justify-between shadow-[3px_3px_0px_#4A2B3F] dark:shadow-[3px_3px_0px_#FFA6C9]/30"
                >
                  <div>
                    {/* Top line with title and date */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-base text-[#4A2B3F] dark:text-white font-display">
                          {preset.title}
                        </h3>
                        <span className="text-[10px] font-bold text-[#745167] dark:text-[#C5A6BC] flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-[#FF6FA5]" /> Criado em {preset.createdAt}
                        </span>
                      </div>

                      <button
                        onClick={() => onDeletePreset(preset.id)}
                        className="p-1.5 text-slate-400 hover:text-[#F2394F] cursor-pointer rounded-lg hover:bg-black/5"
                        title="Excluir perfil de busca"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Chips Preview */}
                    <div className="space-y-2 my-3 text-xs">
                      {/* Cargos */}
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-[#FF6FA5] dark:text-[#FFA6C9] block mb-1">
                          Cargos Ativos ({preset.activeRoles.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {preset.activeRoles.map((role) => (
                            <span
                              key={role}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD6E7] dark:bg-[#341F30] text-[#4A2B3F] dark:text-[#FFA6C9] border border-[#4A2B3F]/30"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Contexto e Local */}
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9ED8FF] dark:bg-[#341F30] text-[#4A2B3F] dark:text-[#9ED8FF] border border-[#4A2B3F]/30 flex items-center gap-1">
                          <Radio className="w-3 h-3" /> {preset.activeContexts.join(', ')}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C8EC8A] text-[#4A2B3F] border border-[#4A2B3F]/30">
                          📍 {preset.activeLocations.join(', ')}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE9A8] text-[#4A2B3F] border border-[#4A2B3F]/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {preset.timeframe}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action: Apply Preset to Radar */}
                  <div className="pt-3 border-t-2 border-[#FFD6E7] dark:border-[#4A2B3F] mt-2">
                    <button
                      onClick={() => onApplyPreset(preset)}
                      className="kawaii-button w-full py-2.5 px-3 bg-[#FFE9A8] hover:bg-[#ffd670] text-[#4A2B3F] text-xs font-bold flex items-center justify-center gap-2 shadow-[2px_2px_0px_#4A2B3F] cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#4A2B3F]" />
                      <span>Carregar Este Perfil no Radar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {presets.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-xs">
                Nenhum perfil de busca salvo ainda. Clique no botão &quot;Salvar Este Filtro como Perfil&quot; acima para criar seu primeiro preset!
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: BIBLIOTECA DE VAGAS SALVAS */}
        {activeSubTab === 'jobs' && (
          <div>
            {/* Top Bar: Action to add job + Filter by Status + Export button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
              {/* Status pills - Balanced 2x2 grid on mobile, inline on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 rounded-2xl bg-[#FFF7E8] dark:bg-[#231622] border-2 border-[#4A2B3F] w-full sm:w-auto">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`w-full px-2 py-2 sm:py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-center ${
                    statusFilter === 'all'
                      ? 'bg-[#FF6FA5] text-white shadow-sm'
                      : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
                  }`}
                >
                  <span>Todas ({jobs.length})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('saved')}
                  className={`w-full px-2 py-2 sm:py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-center ${
                    statusFilter === 'saved'
                      ? 'bg-[#FF6FA5] text-white shadow-sm'
                      : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
                  }`}
                >
                  <span>💖 Salvas ({jobs.filter((j) => j.status === 'saved').length})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('applied')}
                  className={`w-full px-2 py-2 sm:py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-center ${
                    statusFilter === 'applied'
                      ? 'bg-[#FF6FA5] text-white shadow-sm'
                      : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
                  }`}
                >
                  <span>⭐ Enviadas ({jobs.filter((j) => j.status === 'applied').length})</span>
                </button>
                <button
                  onClick={() => setStatusFilter('interview')}
                  className={`w-full px-2 py-2 sm:py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-center ${
                    statusFilter === 'interview'
                      ? 'bg-[#FF6FA5] text-white shadow-sm'
                      : 'text-[#4A2B3F] dark:text-white hover:bg-black/5'
                  }`}
                >
                  <span>🌈 Entrevistas ({jobs.filter((j) => j.status === 'interview').length})</span>
                </button>
              </div>

              {/* Action buttons - 2 balanced columns on mobile */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopySummary}
                  disabled={jobs.length === 0}
                  className="kawaii-button w-full sm:w-auto px-3 py-2 sm:py-1.5 bg-[#FFF7E8] dark:bg-[#3B2338] text-[#4A2B3F] dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                  title="Copiar lista de vagas para WhatsApp ou e-mail"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Copiado!' : 'Exportar Lista'}</span>
                </button>

                <button
                  onClick={() => {
                    setEditingJob(null);
                    setJobTitle('');
                    setJobCompany('');
                    setJobUrl('');
                    setJobNotes('');
                    setJobContactPerson('');
                    setJobStatus('saved');
                    setIsJobModalOpen(true);
                  }}
                  className="kawaii-button w-full sm:w-auto px-3.5 py-2 sm:py-1.5 bg-[#FF6FA5] hover:bg-[#ff5595] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#4A2B3F]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Salvar Vaga</span>
                </button>
              </div>
            </div>

            {/* Turminha do Áudio - Personagem Interativo do Filtro */}
            {(() => {
              const savedCount = jobs.filter((j) => j.status === 'saved').length;
              const appliedCount = jobs.filter((j) => j.status === 'applied').length;
              const interviewCount = jobs.filter((j) => j.status === 'interview').length;

              return (
                <div className="mb-5 p-3.5 sm:p-4 rounded-3xl bg-[#FFFDF7] dark:bg-[#251523] border-3 border-[#4A2B3F] dark:border-[#FFA6C9]/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[2px_2px_0px_#4A2B3F]">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {statusFilter === 'all' && (
                      <div className="flex items-center -space-x-2 shrink-0">
                        <RadinhoMascot mood={savedCount > 0 ? 'happy' : 'sad'} size={48} />
                        <CasseteMascot mood={appliedCount > 0 ? 'happy' : 'sad'} size={48} />
                        <MesaDJMascot mood={interviewCount > 0 ? 'happy' : 'sad'} size={48} />
                      </div>
                    )}
                    {statusFilter === 'saved' && (
                      <RadinhoMascot mood={savedCount > 0 ? 'happy' : 'sad'} size={54} className="shrink-0" />
                    )}
                    {statusFilter === 'applied' && (
                      <CasseteMascot mood={appliedCount > 0 ? 'happy' : 'sad'} size={54} className="shrink-0" />
                    )}
                    {statusFilter === 'interview' && (
                      <MesaDJMascot mood={interviewCount > 0 ? 'happy' : 'sad'} size={54} className="shrink-0" />
                    )}

                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#4A2B3F] dark:text-white font-display flex items-center gap-1.5">
                        {statusFilter === 'all' && 'Turminha do Áudio na Biblioteca! 🎙️'}
                        {statusFilter === 'saved' && (savedCount > 0 ? 'Radinho Feliz com suas Favoritas! 💖' : 'Radinho Tristonho sem Vagas Salvas 🥺')}
                        {statusFilter === 'applied' && (appliedCount > 0 ? 'Fita Cassete Torcendo pelas Demos! ⭐' : 'Fita Cassete sem Envios Registrados 🥺')}
                        {statusFilter === 'interview' && (interviewCount > 0 ? 'Mesa DJ com Arco-Íris no Ar! 🌈' : 'Mesa de Som Aguardando Testes 🥺')}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-[#745167] dark:text-[#C5A6BC] mt-0.5 leading-snug">
                        {statusFilter === 'all' && 'Cada personagem cuida de uma etapa: o Radinho guarda as favoritas 💖, a Fita acompanha as enviadas ⭐ e a Mesa DJ celebra as entrevistas 🌈!'}
                        {statusFilter === 'saved' && (savedCount > 0 ? `O Radinho guardou ${savedCount} vaga(s) favoritada(s) com carinho no coração!` : 'Nenhuma vaga com o coraçãozinho 💖 ainda. Encontrou uma vaga boa no Radar? Salve aqui para alegrá-lo!')}
                        {statusFilter === 'applied' && (appliedCount > 0 ? `${appliedCount} candidatura(s) enviada(s)! A Fita Cassete está girando animada e comemorando com estrelas!` : 'Nenhuma demo ou currículo registrado com a estrelinha ⭐. Anote seus envios para não perder prazos!')}
                        {statusFilter === 'interview' && (interviewCount > 0 ? `${interviewCount} entrevista(s) ou teste(s) agendado(s)! Mesa conectada, pilotos prontos e arco-íris brilhando!` : 'Nenhum teste de locução ou entrevista agendada com o arco-íris 🌈. Quando te chamarem, registre aqui!')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Jobs List */}
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-[#FFFDF7] dark:bg-[#251523] border-2 border-dashed border-[#FFD6E7] dark:border-[#4A2B3F] flex flex-col items-center justify-center">
                <div className="mb-3">
                  {statusFilter === 'saved' && <RadinhoMascot mood="sad" size={88} />}
                  {statusFilter === 'applied' && <CasseteMascot mood="sad" size={88} />}
                  {statusFilter === 'interview' && <MesaDJMascot mood="sad" size={88} />}
                  {statusFilter === 'all' && <MiczinhoSad size={88} />}
                </div>
                <h4 className="text-sm sm:text-base font-bold text-[#4A2B3F] dark:text-white font-display">
                  {statusFilter === 'saved' && 'O Radinho está tristonho... Nenhuma vaga salva 🥺'}
                  {statusFilter === 'applied' && 'A Fita Cassete está com a fita murcha... Nenhum envio registrado 🥺'}
                  {statusFilter === 'interview' && 'A Mesa DJ está com os faders desligados... Nenhuma entrevista 🥺'}
                  {statusFilter === 'all' && 'O Miczinho está com a biblioteca vazia 🥺'}
                </h4>
                <p className="text-xs text-[#745167] dark:text-[#C5A6BC] mt-1.5 max-w-md mx-auto leading-relaxed">
                  {statusFilter === 'saved' && 'Você ainda não favoritou nenhuma oportunidade neste filtro. Encontrou uma vaga interessante? Clique em "Salvar Vaga" para aquecer o coraçãozinho 💖 do Radinho!'}
                  {statusFilter === 'applied' && 'Nenhuma candidatura marcada com a estrelinha ⭐. Ao mandar sua demo de voz ou currículo para uma rádio ou estúdio, registre aqui para acompanhar!'}
                  {statusFilter === 'interview' && 'Nenhum teste de locução ou entrevista agendada com o arco-íris 🌈. Assim que a emissora chamar para um teste presencial ou gravação, anote aqui!'}
                  {statusFilter === 'all' && 'Sua biblioteca ainda não possui vagas registradas. Explore os portais no Radar de Buscas e clique no botão "Salvar Vaga" para começar seu histórico!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map((job) => {
                  const badge = getStatusBadge(job.status);
                  return (
                    <div
                      key={job.id}
                      className="rounded-3xl p-4 sm:p-5 bg-[#FFFDF7] dark:bg-[#251523] border-3 border-[#4A2B3F] dark:border-[#FFA6C9]/40 flex flex-col justify-between shadow-[3px_3px_0px_#4A2B3F] dark:shadow-[3px_3px_0px_#FFA6C9]/30"
                    >
                      <div>
                        {/* Status Badge & Actions */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            {job.status === 'saved' && <RadinhoMascot mood="happy" size={26} />}
                            {job.status === 'applied' && <CasseteMascot mood="happy" size={26} />}
                            {job.status === 'interview' && <MesaDJMascot mood="happy" size={26} />}
                            <span
                              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}
                            >
                              {badge.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEditJob(job)}
                              className="p-1 text-slate-400 hover:text-[#4A2B3F] dark:hover:text-white cursor-pointer"
                              title="Editar dados da vaga"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteJob(job.id)}
                              className="p-1 text-slate-400 hover:text-[#F2394F] cursor-pointer"
                              title="Remover da biblioteca"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title & Company */}
                        <h3 className="font-bold text-base text-[#4A2B3F] dark:text-white font-display">
                          {job.title}
                        </h3>
                        <p className="text-xs font-bold text-[#FF6FA5] dark:text-[#FFA6C9] mb-2 flex items-center gap-1">
                          <Radio className="w-3 h-3" /> {job.company}
                        </p>

                        {/* Contact & Notes */}
                        {job.contactPerson && (
                          <p className="text-[11px] text-[#4A2B3F] dark:text-[#E2C5D8] flex items-center gap-1 mb-1 font-medium">
                            <UserCheck className="w-3 h-3 text-[#9ED8FF]" /> Contato: {job.contactPerson}
                          </p>
                        )}

                        {job.notes && (
                          <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-[#1E111D] border border-[#FFD6E7] dark:border-[#4A2B3F] text-[11px] text-[#745167] dark:text-[#C5A6BC] my-2 leading-relaxed">
                            {job.notes}
                          </div>
                        )}

                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                          Salva em {job.dateAdded}
                        </span>
                      </div>

                      {/* Bottom Controls: Direct Link & Status Switcher */}
                      <div className="pt-3 border-t-2 border-[#FFD6E7] dark:border-[#4A2B3F] mt-3 space-y-2">
                        {job.url && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="kawaii-button w-full py-1.5 px-3 bg-[#FFE9A8] hover:bg-[#ffd778] text-[#4A2B3F] text-xs font-bold flex items-center justify-center gap-1.5 shadow-[1px_1px_0px_#4A2B3F]"
                          >
                            <span>Abrir Link da Vaga</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {/* Quick Status Buttons */}
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => onUpdateJobStatus(job.id, 'saved')}
                            className={`py-1.5 px-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              job.status === 'saved'
                                ? 'bg-[#FFE9A8] border-[#4A2B3F] text-[#4A2B3F] font-extrabold shadow-xs'
                                : 'bg-white/40 dark:bg-black/20 text-slate-600 dark:text-slate-300 border-black/10 hover:bg-[#FFE9A8]/40'
                            }`}
                          >
                            <span>💖 Salva</span>
                          </button>
                          <button
                            onClick={() => onUpdateJobStatus(job.id, 'applied')}
                            className={`py-1.5 px-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              job.status === 'applied'
                                ? 'bg-[#9ED8FF] border-[#4A2B3F] text-[#4A2B3F] font-extrabold shadow-xs'
                                : 'bg-white/40 dark:bg-black/20 text-slate-600 dark:text-slate-300 border-black/10 hover:bg-[#9ED8FF]/40'
                            }`}
                          >
                            <span>⭐ Enviei</span>
                          </button>
                          <button
                            onClick={() => onUpdateJobStatus(job.id, 'interview')}
                            className={`py-1.5 px-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              job.status === 'interview'
                                ? 'bg-[#FFD6E7] border-[#4A2B3F] text-[#4A2B3F] font-extrabold shadow-xs'
                                : 'bg-white/40 dark:bg-black/20 text-slate-600 dark:text-slate-300 border-black/10 hover:bg-[#FFD6E7]/40'
                            }`}
                          >
                            <span>🌈 Entrevista</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: Salvar Perfil de Busca */}
      {isPresetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="kawaii-box bg-white dark:bg-[#2D1B2B] p-6 max-w-md w-full animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#FFD6E7] dark:border-[#4A2B3F]">
              <h3 className="text-base font-bold font-display text-[#4A2B3F] dark:text-[#FFF0F5] flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-[#FF6FA5]" /> Salvar Perfil de Busca
              </h3>
              <button
                onClick={() => setIsPresetModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSavePreset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Nome do Perfil de Busca:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Assistente de Estúdio & Locutor Operador"
                  value={presetTitleInput}
                  onChange={(e) => setPresetTitleInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-2xl bg-[#FFFDF7] dark:bg-[#1E111D] border border-[#FFD6E7] dark:border-[#4A2B3F] text-xs text-[#745167] dark:text-[#C5A6BC] space-y-1">
                <p className="font-bold text-[#4A2B3F] dark:text-white">Este perfil salvará exatamente:</p>
                <p>• {currentActiveRoles.length} cargos ativos</p>
                <p>• Contextos: {currentActiveContexts.join(', ')}</p>
                <p>• Local: {currentActiveLocations.join(', ')}</p>
                <p>• Período: {currentTimeframe}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#FFD6E7] dark:border-[#4A2B3F]">
                <button
                  type="button"
                  onClick={() => setIsPresetModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="kawaii-button px-4 py-2 bg-[#FF6FA5] hover:bg-[#ff5595] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#4A2B3F]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Perfil</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Adicionar / Editar Vaga na Biblioteca */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="kawaii-box bg-white dark:bg-[#2D1B2B] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#FFD6E7] dark:border-[#4A2B3F]">
              <h3 className="text-base font-bold font-display text-[#4A2B3F] dark:text-[#FFF0F5] flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#FF6FA5]" />
                <span>{editingJob ? 'Editar Vaga na Biblioteca' : 'Salvar Nova Vaga na Biblioteca'}</span>
              </h3>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSaveJob} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Título da Vaga / Função:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Locutora da Manhã, Produtora de Áudio, Host de Podcast..."
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Emissora, Produtora ou Empresa:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mix FM, Rádio Novelo, B9 Studios, Rádio Itatiaia..."
                  value={jobCompany}
                  onChange={(e) => setJobCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Link da Vaga ou Canal de Contato:
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                    Status da Candidatura:
                  </label>
                  <select
                    value={jobStatus}
                    onChange={(e) => setJobStatus(e.target.value as JobLibraryStatus)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                  >
                    <option value="saved">💖 Salva (vou analisar)</option>
                    <option value="applied">⭐ Candidatura Enviada</option>
                    <option value="interview">🌈 Entrevista / Teste Agendado</option>
                    <option value="archived">📦 Arquivada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                    Contato / Recrutador:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Produtor Carlos, RH..."
                    value={jobContactPerson}
                    onChange={(e) => setJobContactPerson(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2B3F] dark:text-white mb-1">
                  Anotações particulares:
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Enviei demo de voz comercial e portfólio de podcasts. Resposta prevista para sexta."
                  value={jobNotes}
                  onChange={(e) => setJobNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-[#FFFDF7] dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#FFD6E7] dark:border-[#4A2B3F]">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="kawaii-button px-4 py-2 bg-[#FF6FA5] hover:bg-[#ff5595] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#4A2B3F]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar na Biblioteca</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
