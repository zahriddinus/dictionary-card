import React, { useState } from 'react';
import {
  Search,
  Plus,
  Sparkles,
  Volume2,
  Star,
  CheckCircle2,
  Clock,
  Trash2,
  Filter,
} from 'lucide-react';
import { Category, WordCard } from '../types';
import { speakWord } from '../utils/speech';
import { AddWordModal } from './AddWordModal';
import { AiWordGeneratorModal } from './AiWordGeneratorModal';

interface VocabularyManagerProps {
  words: WordCard[];
  categories: Category[];
  audioSpeed: number;
  onAddWord: (word: Omit<WordCard, 'id' | 'reviewCount' | 'status'>) => void;
  onAddBatchWords: (words: Omit<WordCard, 'id' | 'reviewCount' | 'status'>[]) => void;
  onToggleFavorite: (cardId: string) => void;
  onDeleteWord: (cardId: string) => void;
}

export const VocabularyManager: React.FC<VocabularyManagerProps> = ({
  words,
  categories,
  audioSpeed,
  onAddWord,
  onAddBatchWords,
  onToggleFavorite,
  onDeleteWord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'mastered' | 'learning' | 'new' | 'favorites'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const filteredWords = words.filter((card) => {
    const matchesSearch =
      card.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.exampleEn.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'favorites') return card.isFavorite;
    return card.status === statusFilter;
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 md:pb-12">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Mening Lug'atim
          </h2>
          <p className="text-xs text-slate-500">
            Jami {words.length} ta so'z mavjud
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            title="AI yordamida to'plam yaratish"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI to'plam</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>So'z qo'shish</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Inglizcha yoki o'zbekcha so'z qidirish..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-sm shadow-2xs"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none no-scrollbar">
        {[
          { id: 'all', label: 'Barchasi', count: words.length },
          {
            id: 'mastered',
            label: 'O\'zlashtirilgan',
            count: words.filter((w) => w.status === 'mastered').length,
          },
          {
            id: 'learning',
            label: 'O\'rganilmoqda',
            count: words.filter((w) => w.status === 'learning').length,
          },
          {
            id: 'new',
            label: 'Yangi',
            count: words.filter((w) => w.status === 'new').length,
          },
          {
            id: 'favorites',
            label: 'Sevimlilar',
            count: words.filter((w) => w.isFavorite).length,
          },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Words List */}
      <div className="flex flex-col gap-2.5">
        {filteredWords.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-700 mb-1">
              So'z topilmadi
            </p>
            <p className="text-xs text-slate-400">
              Qidiruv so'zini o'zgartiring yoki yangi so'z qo'shing
            </p>
          </div>
        ) : (
          filteredWords.map((card) => {
            const isMastered = card.status === 'mastered';
            const isLearning = card.status === 'learning';

            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-slate-300 transition shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-slate-900">
                      {card.word}
                    </h3>
                    {card.phonetic && (
                      <span className="text-xs text-slate-400 font-mono">
                        {card.phonetic}
                      </span>
                    )}
                    <button
                      onClick={() => speakWord(card.word, audioSpeed)}
                      className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Talaffuz"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onToggleFavorite(card.id)}
                      className={`p-1.5 rounded-lg transition ${
                        card.isFavorite
                          ? 'text-amber-500 hover:bg-amber-50'
                          : 'text-slate-300 hover:text-slate-500'
                      }`}
                      title="Sevimlilar"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          card.isFavorite ? 'fill-amber-500' : ''
                        }`}
                      />
                    </button>

                    {card.isCustom && (
                      <button
                        onClick={() => onDeleteWord(card.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Translation */}
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  {card.translation}
                </p>

                {/* Example sentence */}
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs">
                  <p className="font-medium text-slate-800 leading-snug">
                    {card.exampleEn}
                  </p>
                  <p className="text-slate-500 italic mt-0.5">
                    {card.exampleUz}
                  </p>
                </div>

                {/* Card footer metadata */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-600 uppercase">
                      {card.partOfSpeech}
                    </span>
                    <span>·</span>
                    <span>Takrorlandi: {card.reviewCount} marta</span>
                  </div>

                  <div>
                    {isMastered ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        O'zlashtirilgan
                      </span>
                    ) : isLearning ? (
                      <span className="text-amber-600 font-medium">
                        O'rganilmoqda
                      </span>
                    ) : (
                      <span className="text-slate-400">Yangi</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Word Modal */}
      <AddWordModal
        categories={categories}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddWord={onAddWord}
      />

      {/* AI Word Generator Modal */}
      <AiWordGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAddGeneratedWords={onAddBatchWords}
      />
    </div>
  );
};
