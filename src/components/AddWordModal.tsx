import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Category, PartOfSpeech, WordCard } from '../types';

interface AddWordModalProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onAddWord: (word: Omit<WordCard, 'id' | 'reviewCount' | 'status'>) => void;
}

export const AddWordModal: React.FC<AddWordModalProps> = ({
  categories,
  isOpen,
  onClose,
  onAddWord,
}) => {
  const [word, setWord] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [translation, setTranslation] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech>('ot');
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || 'daily_a1');
  const [exampleEn, setExampleEn] = useState('');
  const [exampleUz, setExampleUz] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !translation.trim()) {
      setError("Iltimos, so'z va uning tarjimasini kiriting!");
      return;
    }

    onAddWord({
      word: word.trim(),
      phonetic: phonetic.trim() ? phonetic.trim() : undefined,
      translation: translation.trim(),
      partOfSpeech,
      categoryId,
      exampleEn: exampleEn.trim() || `I use the word "${word.trim()}" in daily conversation.`,
      exampleUz: exampleUz.trim() || `Men "${translation.trim()}" so'zini kundalik muloqotda ishlataman.`,
      isCustom: true,
      isFavorite: false,
    });

    // Reset and close
    setWord('');
    setPhonetic('');
    setTranslation('');
    setExampleEn('');
    setExampleUz('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">
              Yangi so'z qo'shish
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Inglizcha so'z *
              </label>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="masalan: Resilience"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transkripsiya (ixtiyoriy)
              </label>
              <input
                type="text"
                value={phonetic}
                onChange={(e) => setPhonetic(e.target.value)}
                placeholder="/rɪˈzɪl.jəns/"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              O'zbekcha tarjimasi *
            </label>
            <input
              type="text"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="masalan: Chidamlilik, metin iroda"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                So'z turkumi
              </label>
              <select
                value={partOfSpeech}
                onChange={(e) => setPartOfSpeech(e.target.value as PartOfSpeech)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm bg-white"
              >
                <option value="ot">Ot (Noun)</option>
                <option value="fe'l">Fe'l (Verb)</option>
                <option value="sifat">Sifat (Adjective)</option>
                <option value="ravish">Ravish (Adverb)</option>
                <option value="iboralar">Ibora (Idiom / Phrasal)</option>
                <option value="boshqa">Boshqa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategoriya
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Inglizcha misol gap
            </label>
            <input
              type="text"
              value={exampleEn}
              onChange={(e) => setExampleEn(e.target.value)}
              placeholder="She showed great resilience in difficult times."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Misolning o'zbekcha tarjimasi
            </label>
            <input
              type="text"
              value={exampleUz}
              onChange={(e) => setExampleUz(e.target.value)}
              placeholder="U qiyin paytlarda yuksak chidamlilik ko'rsatdi."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              Saqlash va qo'shish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
