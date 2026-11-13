import React, { useState, useEffect } from 'react';
import { KeywordGroup, KeywordItem } from '../types';
import {
  Pencil,
  PencilOff,
  Plus,
  X,
  RotateCcw,
  Check,
  SlidersHorizontal,
  Undo2,
  AlertCircle,
} from 'lucide-react';

interface KeywordsPanelProps {
  groups: KeywordGroup[];
  onToggleKeyword: (groupId: string, itemId: string) => void;
  onAddKeyword: (groupId: string, text: string) => void;
  onRemoveKeyword: (groupId: string, itemId: string) => void;
  onRestoreRemovedKeyword: (groupId: string, item: KeywordItem) => void;
  onResetGroupDefaults: (groupId: string) => void;
  onResetAllDefaults: () => void;
  onClearGroup?: (groupId: string) => void;
  onSelectAllGroup?: (groupId: string) => void;
}

export const KeywordsPanel: React.FC<KeywordsPanelProps> = ({
  groups,
  onToggleKeyword,
  onAddKeyword,
  onRemoveKeyword,
  onRestoreRemovedKeyword,
  onResetGroupDefaults,
  onResetAllDefaults,
  onClearGroup,
  onSelectAllGroup,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [newKeywordInput, setNewKeywordInput] = useState<{ [key: string]: string }>({});
  const [activeInputGroup, setActiveInputGroup] = useState<string | null>(null);

  // Confirmation state for deleting
  const [itemToDelete, setItemToDelete] = useState<{
    groupId: string;
    item: KeywordItem;
  } | null>(null);

  // Undo state (lasts 10 seconds)
  const [recentlyDeleted, setRecentlyDeleted] = useState<{
    groupId: string;
    item: KeywordItem;
    groupTitle: string;
    expiresAt: number;
  } | null>(null);

  useEffect(() => {
    if (!recentlyDeleted) return;
    const interval = setInterval(() => {
      if (Date.now() > recentlyDeleted.expiresAt) {
        setRecentlyDeleted(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [recentlyDeleted]);

  const handleInputChange = (groupId: string, val: string) => {
    setNewKeywordInput((prev) => ({ ...prev, [groupId]: val }));
  };

  const handleAddSubmit = (groupId: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = (newKeywordInput[groupId] || '').trim();
    if (!val) return;
    onAddKeyword(groupId, val);
    setNewKeywordInput((prev) => ({ ...prev, [groupId]: '' }));
    setActiveInputGroup(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const { groupId, item } = itemToDelete;
    const group = groups.find((g) => g.id === groupId);

    onRemoveKeyword(groupId, item.id);
    setRecentlyDeleted({
      groupId,
      item,
      groupTitle: group?.title || '',
      expiresAt: Date.now() + 10000, // 10 seconds
    });
    setItemToDelete(null);
  };

  const handleUndo = () => {
    if (!recentlyDeleted) return;
    onRestoreRemovedKeyword(recentlyDeleted.groupId, recentlyDeleted.item);
    setRecentlyDeleted(null);
  };

  const getColorStyles = (color: KeywordGroup['color'], active: boolean) => {
    switch (color) {
      case 'pink':
        return active
          ? 'bg-[#FF6FA5] text-white border-[#4A2B3F] shadow-[2px_2px_0px_#4A2B3F]'
          : 'bg-[#FFF0F6] dark:bg-[#341F30] text-[#745167] dark:text-[#A7889D] border-dashed border-[#FF6FA5]/60 opacity-60 line-through';
      case 'blue':
        return active
          ? 'bg-[#9ED8FF] text-[#4A2B3F] border-[#4A2B3F] shadow-[2px_2px_0px_#4A2B3F]'
          : 'bg-[#F0F8FF] dark:bg-[#1E2E3A] text-[#557790] dark:text-[#7A9BB3] border-dashed border-[#9ED8FF]/60 opacity-60 line-through';
      case 'yellow':
        return active
          ? 'bg-[#FFE9A8] text-[#4A2B3F] border-[#4A2B3F] shadow-[2px_2px_0px_#4A2B3F]'
          : 'bg-[#FFFDF4] dark:bg-[#3A3521] text-[#7A6B43] dark:text-[#B5A574] border-dashed border-[#FFE9A8]/60 opacity-60 line-through';
      case 'green':
        return active
          ? 'bg-[#C8EC8A] text-[#4A2B3F] border-[#4A2B3F] shadow-[2px_2px_0px_#4A2B3F]'
          : 'bg-[#F6FCF0] dark:bg-[#23351C] text-[#5E7934] dark:text-[#8BAF55] border-dashed border-[#C8EC8A]/60 opacity-60 line-through';
      default:
        return active ? 'bg-slate-200' : 'bg-slate-50 opacity-60';
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto mb-8">
      {/* Undo Toast Notification (10 seconds) */}
      {recentlyDeleted && (
        <div className="mb-4 p-3.5 rounded-2xl bg-[#FFE9A8] dark:bg-[#3D331A] border-2 border-[#4A2B3F] dark:border-[#FFE9A8] flex items-center justify-between shadow-[3px_3px_0px_#4A2B3F] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 text-xs font-bold text-[#4A2B3F] dark:text-[#FFE9A8]">
            <AlertCircle className="w-4 h-4 text-[#F2394F]" />
            <span>
              Termo &quot;{recentlyDeleted.item.text}&quot; foi removido de {recentlyDeleted.groupTitle}.
            </span>
          </div>
          <button
            onClick={handleUndo}
            className="kawaii-button px-3 py-1 bg-[#FF6FA5] hover:bg-[#ff5595] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_#4A2B3F]"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Desfazer</span>
          </button>
        </div>
      )}

      <div className="kawaii-box bg-white dark:bg-[#2D1B2B] p-5 sm:p-7 transition-colors">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b-2 border-dashed border-[#FFD6E7] dark:border-[#4A2B3F] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-[#FFD6E7] text-[#FF6FA5] dark:bg-[#4A2B3F]">
                <SlidersHorizontal className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-[#4A2B3F] dark:text-[#FFF0F5]">
                Painel de Palavras-Chave
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#745167] dark:text-[#E2C5D8] mt-0.5">
              Toque nos chips para ligar/desligar. Use o modo editar (lápis) se quiser excluir termos permanentemente.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* Modo Editar Button */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`kawaii-button px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isEditMode
                  ? 'bg-[#FF6FA5] text-white shadow-[3px_3px_0px_#4A2B3F]'
                  : 'bg-[#FFF7E8] dark:bg-[#3B2338] text-[#4A2B3F] dark:text-[#FFE9A8]'
              }`}
              title={isEditMode ? 'Sair do modo de edição de termos' : 'Ativar modo de edição para remover termos'}
            >
              {isEditMode ? <PencilOff className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
              <span>{isEditMode ? 'Concluir Edição' : 'Modo Editar'}</span>
            </button>

            {/* Restaurar Tudo */}
            <button
              onClick={onResetAllDefaults}
              className="kawaii-button px-3 py-1.5 bg-[#FFF7E8] dark:bg-[#3B2338] text-[#4A2B3F] dark:text-[#FFE9A8] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Restaurar todos os grupos de palavras-chave para o padrão"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Tudo</span>
            </button>
          </div>
        </div>

        {/* 4 Keyword Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map((group) => {
            const activeCount = group.items.filter((i) => i.active).length;
            const isAdding = activeInputGroup === group.id;

            return (
              <div
                key={group.id}
                className="rounded-2xl p-4 bg-[#FFFDF7] dark:bg-[#251523] border-2 border-[#4A2B3F] dark:border-[#FFA6C9]/40 flex flex-col justify-between"
              >
                <div>
                  {/* Group Title Bar */}
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full border border-[#4A2B3F] ${
                          group.color === 'pink'
                            ? 'bg-[#FF6FA5]'
                            : group.color === 'blue'
                            ? 'bg-[#9ED8FF]'
                            : group.color === 'yellow'
                            ? 'bg-[#FFE9A8]'
                            : 'bg-[#C8EC8A]'
                        }`}
                      />
                      <h3 className="font-bold text-sm sm:text-base font-display text-[#4A2B3F] dark:text-[#FFF0F5]">
                        {group.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Botão Limpar Tudo / Marcar Todos */}
                      {activeCount > 0 ? (
                        <button
                          type="button"
                          onClick={() => onClearGroup?.(group.id)}
                          className="kawaii-button text-[11px] font-extrabold px-2.5 py-0.5 bg-[#FFE9A8] hover:bg-[#ffd771] text-[#4A2B3F] border-2 border-[#4A2B3F] shadow-[1.5px_1.5px_0px_#4A2B3F] transition-all cursor-pointer flex items-center gap-1"
                          title={`Desmarcar todos os itens de ${group.title} para selecionar apenas o que desejar`}
                        >
                          <span>✕ Limpar tudo</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectAllGroup?.(group.id)}
                          className="kawaii-button text-[11px] font-extrabold px-2.5 py-0.5 bg-[#C8EC8A] hover:bg-[#b5e06b] text-[#4A2B3F] border-2 border-[#4A2B3F] shadow-[1.5px_1.5px_0px_#4A2B3F] transition-all cursor-pointer flex items-center gap-1"
                          title={`Marcar todos os itens de ${group.title}`}
                        >
                          <span>✓ Marcar todos</span>
                        </button>
                      )}

                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-[#341F30] text-[#4A2B3F] dark:text-[#FFA6C9] border border-[#4A2B3F]/40">
                        {activeCount} de {group.items.length} ativos
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#745167] dark:text-[#C5A6BC] mb-3">
                    {group.description}
                  </p>

                  {/* Chips Container */}
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className={`inline-flex items-center rounded-full text-xs font-bold border-2 transition-all ${getColorStyles(
                          group.color,
                          item.active
                        )}`}
                      >
                        {/* Toggle Area */}
                        <button
                          type="button"
                          onClick={() => onToggleKeyword(group.id, item.id)}
                          className={`pl-3 ${
                            isEditMode ? 'pr-1.5' : 'pr-3'
                          } py-1 flex items-center gap-1.5 cursor-pointer`}
                          title={item.active ? 'Desativar este termo' : 'Ativar este termo'}
                        >
                          {item.active && <Check className="w-3 h-3 stroke-[3]" />}
                          <span>{item.text}</span>
                        </button>

                        {/* Remove Action - ONLY visible in edit mode */}
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setItemToDelete({ groupId: group.id, item });
                            }}
                            className="pr-2.5 pl-1 py-1 text-[#4A2B3F] dark:text-white hover:text-[#F2394F] dark:hover:text-[#F2394F] transition-colors cursor-pointer"
                            title={`Remover "${item.text}"`}
                            aria-label={`Remover ${item.text}`}
                          >
                            <X className="w-3.5 h-3.5 stroke-[3] text-[#F2394F]" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer with Group Reset & Add Term */}
                <div className="mt-4 pt-3 border-t border-[#FFD6E7] dark:border-[#4A2B3F] flex items-center justify-between gap-2">
                  {isAdding ? (
                    <form
                      onSubmit={(e) => handleAddSubmit(group.id, e)}
                      className="flex items-center gap-1.5 w-full"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={newKeywordInput[group.id] || ''}
                        onChange={(e) => handleInputChange(group.id, e.target.value)}
                        placeholder="Novo termo..."
                        className="flex-1 px-3 py-1 text-xs rounded-full border-2 border-[#4A2B3F] dark:border-[#FFA6C9] bg-white dark:bg-[#1E111D] text-[#4A2B3F] dark:text-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="kawaii-button px-2.5 py-1 bg-[#FF6FA5] text-white text-xs font-bold cursor-pointer"
                      >
                        Adicionar
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveInputGroup(null)}
                        className="p-1 text-[#745167] dark:text-[#E2C5D8] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveInputGroup(group.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6FA5] dark:text-[#FFA6C9] hover:underline cursor-pointer py-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar termo</span>
                      </button>

                      {/* Restaurar Padrões DESTE Grupo */}
                      <button
                        onClick={() => onResetGroupDefaults(group.id)}
                        className="text-[11px] font-bold text-[#745167] dark:text-[#C5A6BC] hover:text-[#4A2B3F] dark:hover:text-white flex items-center gap-1 cursor-pointer"
                        title="Restaura todos os termos e seleções originais de fábrica deste grupo"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restaurar padrões</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="kawaii-box bg-white dark:bg-[#2D1B2B] p-5 max-w-sm w-full animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold font-display text-[#4A2B3F] dark:text-[#FFF0F5] mb-2">
              Remover palavra-chave?
            </h3>
            <p className="text-xs text-[#745167] dark:text-[#E2C5D8] mb-4">
              Deseja realmente remover o termo <strong>&quot;{itemToDelete.item.text}&quot;</strong>?
              Você terá 10 segundos para desfazer caso mude de ideia.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="kawaii-button px-4 py-1.5 bg-[#F2394F] hover:bg-[#d92339] text-white text-xs font-bold cursor-pointer shadow-[2px_2px_0px_#4A2B3F]"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
