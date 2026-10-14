import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  RotateCw,
  Shuffle,
  Play,
  Pause,
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Category, WordCard } from '../types';
import { speakWord } from '../utils/speech';

interface FlashcardDeckProps {
  words: WordCard[];
  categories: Category[];
  isMuted: boolean;
  audioSpeed: number;
  onRateCard: (cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  onToggleFavorite: (cardId: string) => void;
  onNavigateToExercises: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  words,
  categories,
  isMuted,
  audioSpeed,
  onRateCard,
  onToggleFavorite,
  onNavigateToExercises,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [mode, setMode] = useState<'en-uz' | 'uz-en'>('en-uz');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter words by category
  const activeWords = React.useMemo(() => {
    if (selectedCategoryId === 'all') return words;
    if (selectedCategoryId === 'favorites') return words.filter((w) => w.isFavorite);
    if (selectedCategoryId === 'learning') return words.filter((w) => w.status === 'learning');
    return words.filter((w) => w.categoryId === selectedCategoryId);
  }, [words, selectedCategoryId]);

  const currentCard = activeWords[currentIndex] || null;

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCategoryId]);

  // Pronounce word when card changes (if not muted and mode is en-uz)
  useEffect(() => {
    if (currentCard && !isMuted && mode === 'en-uz') {
      speakWord(currentCard.word, audioSpeed);
    }
  }, [currentIndex, currentCard, isMuted, mode, audioSpeed]);

  // Auto-play feature
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setIsFlipped((prev) => {
        if (!prev) {
          return true;
        } else {
          // move to next
          setCurrentIndex((idx) => (idx + 1 < activeWords.length ? idx + 1 : 0));
          return false;
        }
      });
    }, 3200);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, activeWords.length]);

  const handleNext = () => {
    if (currentIndex + 1 < activeWords.length) {
      setIsFlipped(false);
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * activeWords.length));
  };

  const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    if (rating === 'easy') {
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {
        // ignore
      }
    }

    onRateCard(currentCard.id, rating);

    // If reached end
    if (currentIndex + 1 >= activeWords.length) {
      try {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }

    handleNext();
  };

  const playPronunciation = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakWord(text, audioSpeed);
  };

  if (activeWords.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Ushbu bo'limda so'zlar topilmadi
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Boshqa kategoriyani tanlang yoki "Lug'atim" bo'limidan yangi so'z qo'shing.
        </p>
        <button
          onClick={() => setSelectedCategoryId('all')}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition cursor-pointer"
        >
          Barcha so'zlarni ko'rish
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / activeWords.length) * 100);

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 md:pb-12">
      {/* Category Pills Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none no-scrollbar">
        <button
          onClick={() => setSelectedCategoryId('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            selectedCategoryId === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Barchasi ({words.length})
        </button>
        <button
          onClick={() => setSelectedCategoryId('favorites')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
            selectedCategoryId === 'favorites'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          Sevimlilar ({words.filter((w) => w.isFavorite).length})
        </button>
        {categories.map((cat) => {
          const count = words.filter((w) => w.categoryId === cat.id).length;
          const isActive = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Top Deck Controls */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          {/* Flip Mode Switcher */}
          <button
            onClick={() => {
              setMode((m) => (m === 'en-uz' ? 'uz-en' : 'en-uz'));
              setIsFlipped(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            title="Tartibni almashtirish"
          >
            <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
            <span>{mode === 'en-uz' ? 'Eng ➔ Uzb' : 'Uzb ➔ Eng'}</span>
          </button>

          {/* Auto-play toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              isAutoPlaying
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Avtomatik o'qish (hands-free)"
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>To'xtatish</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Avto-ijro</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
            title="Aralashtirish"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-700 tabular-nums">
            {currentIndex + 1} / {activeWords.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-4 overflow-hidden">
        <div
          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div className="perspective-1000 w-full mb-5">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full min-h-[340px] sm:min-h-[380px] rounded-3xl cursor-pointer transition-transform duration-500 transform-style-preserve-3d shadow-md hover:shadow-lg border border-slate-200 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT SIDE */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 uppercase tracking-wider">
                  {currentCard.partOfSpeech}
                </span>
                {currentCard.status === 'mastered' && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" />
                    O'zlashtirilgan
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(currentCard.id);
                  }}
                  className={`p-2 rounded-xl transition ${
                    currentCard.isFavorite
                      ? 'text-amber-500 hover:bg-amber-50'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Sevimlilarga qo'shish"
                >
                  <Star
                    className={`w-5 h-5 ${
                      currentCard.isFavorite ? 'fill-amber-500' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Center: Main Word */}
            <div className="my-auto text-center py-4">
              {mode === 'en-uz' ? (
                <>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                    {currentCard.word}
                  </h2>
                  {currentCard.phonetic && (
                    <p className="text-base text-slate-500 font-mono tracking-wide mb-4">
                      {currentCard.phonetic}
                    </p>
                  )}
                  <button
                    onClick={(e) => playPronunciation(e, currentCard.word)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-semibold text-sm hover:bg-indigo-100 transition shadow-xs cursor-pointer active:scale-95"
                  >
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span>Talaffuzni tinglash</span>
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-widest text-indigo-600 font-bold mb-2">
                    O'zbekcha so'z
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                    {currentCard.translation}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Inglizcha tarjimasini eslashga harakat qiling
                  </p>
                </>
              )}
            </div>

            {/* Bottom Hint */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                Kartani ag'darish uchun bosing
              </span>
              <span>Ko'rib chiqildi: {currentCard.reviewCount} marta</span>
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-b from-indigo-50/70 via-white to-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800">
                {mode === 'en-uz' ? "O'zbekcha tarjimasi" : "Inglizcha talaffuzi"}
              </span>
              <button
                onClick={(e) => playPronunciation(e, currentCard.word)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl"
                title="Talaffuz"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Center Content */}
            <div className="my-auto py-2">
              <div className="text-center mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                  {mode === 'en-uz' ? currentCard.translation : currentCard.word}
                </h3>
                {mode === 'uz-en' && currentCard.phonetic && (
                  <p className="text-sm text-slate-500 font-mono">
                    {currentCard.phonetic}
                  </p>
                )}
              </div>

              {/* Example sentences */}
              <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-xs">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-sm font-semibold text-slate-900 leading-snug">
                    "{currentCard.exampleEn}"
                  </p>
                  <button
                    onClick={(e) => playPronunciation(e, currentCard.exampleEn)}
                    className="p-1 text-slate-400 hover:text-indigo-600 shrink-0"
                    title="Misolni eshitish"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "{currentCard.exampleUz}"
                </p>
              </div>
            </div>

            {/* Flip back instruction */}
            <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-400">
              Qaytarish uchun kartani bosing yoki quyidagi bahoni tanlang
            </div>
          </div>
        </div>
      </div>

      {/* Rating Buttons / Spaced Repetition Controls */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center mb-2.5">
          Qanchalik yaxshi eslaysiz?
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleRating('again')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs border border-red-200 active:scale-95 transition cursor-pointer min-h-[44px]"
          >
            <span>Qayta</span>
            <span className="text-[10px] font-normal text-red-500 mt-0.5">Yana ko'rish</span>
          </button>

          <button
            onClick={() => handleRating('hard')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs border border-amber-200 active:scale-95 transition cursor-pointer min-h-[44px]"
          >
            <span>Qiyin</span>
            <span className="text-[10px] font-normal text-amber-600 mt-0.5">Esladim</span>
          </button>

          <button
            onClick={() => handleRating('good')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 active:scale-95 transition cursor-pointer min-h-[44px]"
          >
            <span>Yaxshi</span>
            <span className="text-[10px] font-normal text-emerald-600 mt-0.5">+5 XP</span>
          </button>

          <button
            onClick={() => handleRating('easy')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 active:scale-95 transition cursor-pointer min-h-[44px]"
          >
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              Oson
            </span>
            <span className="text-[10px] font-normal text-indigo-500 mt-0.5">+10 XP</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation arrows */}
      <div className="flex items-center justify-between mt-4 px-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 transition ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-50'
              : 'text-slate-700 bg-white hover:bg-slate-50 cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Oldingisi</span>
        </button>

        <button
          onClick={onNavigateToExercises}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-4 cursor-pointer"
        >
          Bugungi mashqlarga o'tish →
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex + 1 >= activeWords.length}
          className={`flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 transition ${
            currentIndex + 1 >= activeWords.length
              ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-50'
              : 'text-slate-700 bg-white hover:bg-slate-50 cursor-pointer'
          }`}
        >
          <span>Keyingisi</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
