import React, { useState, useEffect } from 'react';
import {
  KeywordGroup,
  KeywordItem,
  HiddenSource,
  TimeframeFilter,
  SavedSearchPreset,
  LibraryJob,
  JobLibraryStatus,
  MainAppTab,
} from './types';
import {
  INITIAL_KEYWORD_GROUPS,
  INITIAL_HIDDEN_SOURCES,
  INITIAL_SEARCH_PRESETS,
} from './constants/initialData';
import { Header } from './components/Header';
import { KeywordsPanel } from './components/KeywordsPanel';
import { SearchGenerator } from './components/SearchGenerator';
import { HiddenSourcesSection } from './components/HiddenSourcesSection';
import { LibrarySection } from './components/LibrarySection';
import { FloatingHeartsContainer, FloatingHeart } from './components/FloatingHearts';
import { MascotMood } from './components/MiczinhoMascot';
import { Radio, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // 1. Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('radar_audio_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('radar_audio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('radar_audio_theme', 'light');
    }
  }, [darkMode]);

  // 2. Active Tab State ('radar' | 'fontes' | 'biblioteca')
  const [activeTab, setActiveTab] = useState<MainAppTab>(() => {
    const saved = localStorage.getItem('radar_audio_tab');
    if (saved === 'radar' || saved === 'fontes' || saved === 'biblioteca') {
      return saved;
    }
    return 'radar';
  });

  useEffect(() => {
    localStorage.setItem('radar_audio_tab', activeTab);
  }, [activeTab]);

  // 3. Keyword Groups State
  const [groups, setGroups] = useState<KeywordGroup[]>(() => {
    const saved = localStorage.getItem('radar_audio_keywords_v5');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_KEYWORD_GROUPS;
      }
    }
    return INITIAL_KEYWORD_GROUPS;
  });

  useEffect(() => {
    localStorage.setItem('radar_audio_keywords_v5', JSON.stringify(groups));
  }, [groups]);

  // 4. Timeframe Filter State (24h / 7dias / 30dias)
  const [timeframe, setTimeframe] = useState<TimeframeFilter>(() => {
    const saved = localStorage.getItem('radar_audio_timeframe_v4');
    return (saved as TimeframeFilter) || '30dias';
  });

  useEffect(() => {
    localStorage.setItem('radar_audio_timeframe_v4', timeframe);
  }, [timeframe]);

  // 5. Hidden Sources State (with persistent custom fields)
  const [sources, setSources] = useState<HiddenSource[]>(() => {
    const saved = localStorage.getItem('radar_audio_sources_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_HIDDEN_SOURCES;
      }
    }
    return INITIAL_HIDDEN_SOURCES;
  });

  useEffect(() => {
    localStorage.setItem('radar_audio_sources_v4', JSON.stringify(sources));
  }, [sources]);

  // 6. Saved Search Presets State
  const [presets, setPresets] = useState<SavedSearchPreset[]>(() => {
    const saved = localStorage.getItem('radar_audio_presets_v5');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SEARCH_PRESETS;
      }
    }
    return INITIAL_SEARCH_PRESETS;
  });

  useEffect(() => {
    localStorage.setItem('radar_audio_presets_v5', JSON.stringify(presets));
  }, [presets]);

  // 7. Saved Jobs Library State
  const [jobs, setJobs] = useState<LibraryJob[]>(() => {
    const saved = localStorage.getItem('radar_audio_jobs_v4') || localStorage.getItem('radar_audio_jobs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('radar_audio_jobs_v4', JSON.stringify(jobs));
  }, [jobs]);

  // 8. Mascot Mood & Floating Hearts
  const [mascotMood, setMascotMood] = useState<MascotMood>('happy');
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const spawnHearts = (count = 5) => {
    const colors = ['#FF6FA5', '#FFD6E7', '#FFE9A8', '#9ED8FF', '#C8EC8A', '#F2394F'];
    const newHearts: FloatingHeart[] = [];
    const clientX = window.innerWidth / 2;
    const clientY = window.innerHeight * 0.4;

    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 120;
      const offsetY = (Math.random() - 0.5) * 80;
      newHearts.push({
        id: `heart-${Date.now()}-${i}-${Math.random()}`,
        x: clientX + offsetX,
        y: clientY + offsetY,
        size: Math.floor(Math.random() * 12) + 20,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setFloatingHearts((prev) => [...prev, ...newHearts]);
    setMascotMood('saved');
    setTimeout(() => {
      setMascotMood('happy');
    }, 2400);
  };

  const handleRemoveHeart = (id: string) => {
    setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
  };

  // Keyword actions
  const handleToggleKeyword = (groupId: string, itemId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          items: g.items.map((i) => (i.id === itemId ? { ...i, active: !i.active } : i)),
        };
      })
    );
  };

  const handleAddKeyword = (groupId: string, text: string) => {
    const newId = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          items: [...g.items, { id: newId, text, active: true }],
        };
      })
    );
  };

  const handleRemoveKeyword = (groupId: string, itemId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          items: g.items.filter((i) => i.id !== itemId),
        };
      })
    );
  };

  const handleRestoreRemovedKeyword = (groupId: string, item: KeywordItem) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          items: [...g.items, item],
        };
      })
    );
  };

  const handleResetGroupDefaults = (groupId: string) => {
    const defaultGroup = INITIAL_KEYWORD_GROUPS.find((g) => g.id === groupId);
    if (!defaultGroup) return;

    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? JSON.parse(JSON.stringify(defaultGroup)) : g))
    );
    showToast(`Padrões de "${defaultGroup.title}" restaurados com sucesso!`);
  };

  const handleResetAllDefaults = () => {
    setGroups(JSON.parse(JSON.stringify(INITIAL_KEYWORD_GROUPS)));
    showToast('Todas as palavras-chave foram restauradas para o padrão inicial!');
  };

  const handleClearGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          items: g.items.map((i) => ({ ...i, active: false })),
        };
      })
    );
    const group = groups.find((g) => g.id === groupId);
    showToast(`Seleção de "${group?.title || 'grupo'}" desmarcada! Selecione apenas o cargo desejado.`);
  };

  const handleSelectAllGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          items: g.items.map((i) => ({ ...i, active: true })),
        };
      })
    );
    const group = groups.find((g) => g.id === groupId);
    showToast(`Todos os itens de "${group?.title || 'grupo'}" foram ativados!`);
  };

  // Sources actions
  const handleAddSource = (newSource: Omit<HiddenSource, 'id'>) => {
    const id = `custom-source-${Date.now()}`;
    setSources((prev) => [{ ...newSource, id }, ...prev]);
    showToast('Nova fonte adicionada com sucesso!');
  };

  const handleUpdateSource = (id: string, updates: Partial<HiddenSource>) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    showToast('Dados da emissora atualizados!');
  };

  const handleRemoveSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetSources = () => {
    if (window.confirm('Restaurar a lista de fontes e emissoras para os dados iniciais verificados?')) {
      setSources(JSON.parse(JSON.stringify(INITIAL_HIDDEN_SOURCES)));
      showToast('Fontes restauradas para os padrões verificados.');
    }
  };

  // Presets actions
  const handleApplyPreset = (preset: SavedSearchPreset) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id === 'roles') {
          return {
            ...group,
            items: group.items.map((item) => ({
              ...item,
              active: preset.activeRoles.includes(item.text),
            })),
          };
        }
        if (group.id === 'contexts') {
          return {
            ...group,
            items: group.items.map((item) => ({
              ...item,
              active: preset.activeContexts.includes(item.text),
            })),
          };
        }
        if (group.id === 'exclusions') {
          return {
            ...group,
            items: group.items.map((item) => ({
              ...item,
              active: preset.activeExclusions.includes(item.text),
            })),
          };
        }
        if (group.id === 'locations') {
          return {
            ...group,
            items: group.items.map((item) => ({
              ...item,
              active: preset.activeLocations.includes(item.text),
            })),
          };
        }
        return group;
      })
    );

    setTimeframe(preset.timeframe);
    setActiveTab('radar');
    spawnHearts(6);
    showToast(`Perfil carregado: "${preset.title}"`);
  };

  const handleSavePreset = (title: string) => {
    const activeRoles =
      groups.find((g) => g.id === 'roles')?.items.filter((i) => i.active).map((i) => i.text) || [];
    const activeContexts =
      groups.find((g) => g.id === 'contexts')?.items.filter((i) => i.active).map((i) => i.text) || [];
    const activeExclusions =
      groups.find((g) => g.id === 'exclusions')?.items.filter((i) => i.active).map((i) => i.text) || [];
    const activeLocations =
      groups.find((g) => g.id === 'locations')?.items.filter((i) => i.active).map((i) => i.text) || [];

    const newPreset: SavedSearchPreset = {
      id: `preset-${Date.now()}`,
      title,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      activeRoles,
      activeContexts,
      activeExclusions,
      activeLocations,
      timeframe,
    };

    setPresets((prev) => [newPreset, ...prev]);
    spawnHearts(5);
    showToast(`Perfil de busca "${title}" salvo com sucesso!`);
  };

  const handleDeletePreset = (id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
    showToast('Perfil de busca removido.');
  };

  // Jobs actions
  const handleAddJob = (jobData: Omit<LibraryJob, 'id' | 'dateAdded'>) => {
    const newJob: LibraryJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      dateAdded: new Date().toLocaleDateString('pt-BR'),
    };
    setJobs((prev) => [newJob, ...prev]);
    spawnHearts(6);
    showToast(`Vaga em "${newJob.company}" salva na sua biblioteca!`);
  };

  const handleUpdateJobStatus = (id: string, status: JobLibraryStatus) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status } : j))
    );
    spawnHearts(3);
    showToast('Status da vaga atualizado!');
  };

  const handleUpdateJob = (id: string, updates: Partial<LibraryJob>) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...updates } : j))
    );
    showToast('Dados da vaga atualizados!');
  };

  const handleDeleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    showToast('Vaga removida da biblioteca.');
  };

  return (
    <div className="min-h-screen bg-poa px-3 sm:px-6 py-6 sm:py-10 transition-colors">
      {/* Floating Hearts Container */}
      <FloatingHeartsContainer hearts={floatingHearts} onRemoveHeart={handleRemoveHeart} />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-200">
          <div className="kawaii-box bg-[#FFE9A8] text-[#4A2B3F] px-4 py-2.5 text-xs font-bold flex items-center gap-2 shadow-[3px_3px_0px_#4A2B3F]">
            <CheckCircle2 className="w-4 h-4 text-green-700" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-5xl mx-auto">
        {/* Header with Top Tabs */}
        <Header
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          mascotMood={mascotMood}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          savedPresetsCount={presets.length}
          savedJobsCount={jobs.length}
        />

        {/* TAB 1: RADAR DE BUSCAS */}
        {activeTab === 'radar' && (
          <div>
            {/* 1. Keywords Panel with Edit Mode, Undo, and Exclusions visible */}
            <KeywordsPanel
              groups={groups}
              onToggleKeyword={handleToggleKeyword}
              onAddKeyword={handleAddKeyword}
              onRemoveKeyword={handleRemoveKeyword}
              onRestoreRemovedKeyword={handleRestoreRemovedKeyword}
              onResetGroupDefaults={handleResetGroupDefaults}
              onResetAllDefaults={handleResetAllDefaults}
              onClearGroup={handleClearGroup}
              onSelectAllGroup={handleSelectAllGroup}
            />

            {/* 2. Search Generator with 1 link per active role, Gupy & Presets Quick Switcher */}
            <SearchGenerator
              groups={groups}
              timeframe={timeframe}
              onChangeTimeframe={setTimeframe}
              presets={presets}
              onApplyPreset={handleApplyPreset}
              onOpenSavePreset={() => {
                const title = window.prompt(
                  'Nome para este perfil de busca:',
                  'Meu Perfil de Busca'
                );
                if (title && title.trim()) {
                  handleSavePreset(title.trim());
                }
              }}
            />
          </div>
        )}

        {/* TAB 2: FONTES & EMISSORAS */}
        {activeTab === 'fontes' && (
          <HiddenSourcesSection
            sources={sources}
            onAddSource={handleAddSource}
            onUpdateSource={handleUpdateSource}
            onRemoveSource={handleRemoveSource}
            onResetSources={handleResetSources}
            groups={groups}
            onToggleKeyword={handleToggleKeyword}
            onClearGroup={handleClearGroup}
          />
        )}

        {/* TAB 3: BIBLIOTECA & HISTÓRICO */}
        {activeTab === 'biblioteca' && (
          <LibrarySection
            presets={presets}
            jobs={jobs}
            currentGroups={groups}
            currentTimeframe={timeframe}
            onApplyPreset={handleApplyPreset}
            onSavePreset={handleSavePreset}
            onDeletePreset={handleDeletePreset}
            onAddJob={handleAddJob}
            onUpdateJobStatus={handleUpdateJobStatus}
            onUpdateJob={handleUpdateJob}
            onDeleteJob={handleDeleteJob}
          />
        )}

        {/* Kawaii Footer */}
        <footer className="mt-12 mb-6 text-center text-xs text-[#745167] dark:text-[#C5A6BC] font-medium">
          <div className="flex items-center justify-center gap-1.5 mb-2 font-display text-sm font-bold text-[#4A2B3F] dark:text-[#FFF0F5]">
            <Radio className="w-4 h-4 text-[#FF6FA5]" />
            <span>Radar de Vagas de Áudio • São Paulo & Brasil</span>
            <Sparkles className="w-3.5 h-3.5 text-[#FFE9A8]" />
          </div>
          <p className="max-w-md mx-auto text-[11px] leading-relaxed">
            Feito para locutoras, radialistas, apresentadoras de podcasts e comunicadoras de voz.
            Sem necessidade de login • Salva dados localmente no navegador.
          </p>
          <div className="flex items-center justify-center gap-1 mt-3 text-[10px] text-[#745167]/70 dark:text-[#C5A6BC]/70">
            <span>Feito com</span>
            <Heart className="w-3 h-3 text-[#FF6FA5] fill-[#FF6FA5]" />
            <span>para profissionais de rádio e áudio</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
