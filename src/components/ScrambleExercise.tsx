import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle2, RotateCcw, ArrowRight, Award, Delete } from 'lucide-react';
import { WordCard } from '../types';
import { speakWord } from '../utils/speech';

interface ScrambleExerciseProps {
  words: WordCard[];
  audioSpeed: number;
  onFinishScramble: (score: number) => void;
  onBackToHub: () => void;
}

interface LetterTile {
  id: number;
  letter: string;
  isUsed: boolean;
}

export const ScrambleExercise: React.FC<ScrambleExerciseProps> = ({
  words,
  audioSpeed,
  onFinishScramble,
  onBackToHub,
}) => {
  const [questions, setQuestions] = useState<WordCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [availableTiles, setAvailableTiles] = useState<LetterTile[]>([]);
  const [userLetters, setUserLetters] = useState<LetterTile[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    // Pick words without spaces for clean scramble
    const singleWordList = words.filter((w) => !w.word.includes(' ') && !w.word.includes('/'));
    const pool = [...singleWordList].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuestions(pool);
    setCurrentIndex(0);
    setScore(0);
    setIsCompleted(false);
  }, [words]);

  const currentCard = questions[currentIndex];

  useEffect(() => {
    if (!currentCard) return;

    const letters = currentCard.word.toUpperCase().split('');
    const tiles: LetterTile[] = letters.map((l, idx) => ({
      id: idx,
      letter: l,
      isUsed: false,
    }));

    // Shuffle tiles
    setAvailableTiles([...tiles].sort(() => 0.5 - Math.random()));
    setUserLetters([]);
    setIsAnswerChecked(false);
    setIsCorrect(false);
  }, [currentIndex, currentCard]);

  const handlePickLetter = (tile: LetterTile) => {
    if (tile.isUsed || isAnswerChecked) return;

    setAvailableTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, isUsed: true } : t))
    );
    setUserLetters((prev) => [...prev, tile]);
  };

  const handleRemoveLetter = (tile: LetterTile) => {
    if (isAnswerChecked) return;

    setUserLetters((prev) => prev.filter((t) => t.id !== tile.id));
    setAvailableTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, isUsed: false } : t))
    );
  };

  const handleClear = () => {
    if (isAnswerChecked) return;
    setUserLetters([]);
    setAvailableTiles((prev) => prev.map((t) => ({ ...t, isUsed: false })));
  };

  const handleCheck = () => {
    if (!currentCard || userLetters.length === 0) return;

    const assembled = userLetters.map((t) => t.letter).join('');
    const correct = assembled.toLowerCase() === currentCard.word.toLowerCase();

    setIsAnswerChecked(true);
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + 1);
      speakWord(currentCard.word, audioSpeed);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      onFinishScramble(score * 10);
    }
  };

  if (!currentCard) {
    return <div className="p-8 text-center text-slate-500">Yuklanmoqda...</div>;
  }

  if (isCompleted) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Award className="w-9 h-9" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">
          Harf terish mashqi yakunlandi!
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Siz {questions.length} tadan {score} ta so'zni xatosiz yig'dingiz.
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 flex items-center justify-around">
          <div>
            <div className="text-2xl font-bold text-indigo-600">+{score * 10}</div>
            <div className="text-xs text-slate-500">XP qo'shildi</div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <div className="text-2xl font-bold text-emerald-600">{score}/{questions.length}</div>
            <div className="text-xs text-slate-500">To'g'ri so'zlar</div>
          </div>
        </div>

        <button
          onClick={onBackToHub}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition cursor-pointer"
        >
          Mashqlar bo'limiga qaytish
        </button>
      </div>
    );
  }

  const isFull = userLetters.length === currentCard.word.length;

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-20">
      <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
        <button
          onClick={onBackToHub}
          className="font-medium text-indigo-600 hover:text-indigo-800"
        >
          ← Chiqish
        </button>
        <span className="font-semibold text-slate-700 tabular-nums">
          {currentIndex + 1} / {questions.length}
        </span>
        <span className="font-semibold text-indigo-600">
          Ball: {score * 10} XP
        </span>
      </div>

      {/* Target Word Clue Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          So'zning o'zbekcha tarjimasi:
        </p>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
          {currentCard.translation}
        </h2>
        {currentCard.partOfSpeech && (
          <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium">
            {currentCard.partOfSpeech}
          </span>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2">
          <button
            onClick={() => speakWord(currentCard.word, audioSpeed)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ovozli yordam (eshitish)</span>
          </button>
        </div>
      </div>

      {/* Assembled Letters Display */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500">
            Sizning javobingiz:
          </span>
          {userLetters.length > 0 && !isAnswerChecked && (
            <button
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
            >
              <Delete className="w-3.5 h-3.5" />
              <span>Tozalash</span>
            </button>
          )}
        </div>

        <div
          className={`min-h-[64px] p-3 rounded-2xl border flex flex-wrap items-center justify-center gap-2 transition ${
            isAnswerChecked
              ? isCorrect
                ? 'bg-emerald-50 border-emerald-400'
                : 'bg-red-50 border-red-400'
              : 'bg-white border-slate-200'
          }`}
        >
          {userLetters.length === 0 ? (
            <span className="text-xs text-slate-400 italic">
              Quyidagi harflarni bosib so'zni yig'ing
            </span>
          ) : (
            userLetters.map((tile) => (
              <button
                key={tile.id}
                onClick={() => handleRemoveLetter(tile)}
                className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-xs cursor-pointer hover:bg-indigo-700 active:scale-95 transition"
                title="O'chirish"
              >
                {tile.letter}
              </button>
            ))
          )}
        </div>

        {isAnswerChecked && !isCorrect && (
          <p className="text-xs text-red-600 mt-2 text-center font-medium">
            To'g'ri javob: <strong className="font-bold">{currentCard.word.toUpperCase()}</strong>
          </p>
        )}
      </div>

      {/* Available Scrambled Letter Tiles */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {availableTiles.map((tile) => (
            <button
              key={tile.id}
              onClick={() => handlePickLetter(tile)}
              disabled={tile.isUsed || isAnswerChecked}
              className={`w-11 h-11 rounded-xl text-lg font-bold border transition cursor-pointer ${
                tile.isUsed
                  ? 'opacity-20 border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white border-slate-300 text-slate-800 shadow-xs hover:border-indigo-400 hover:bg-indigo-50/50 active:scale-95'
              }`}
            >
              {tile.letter}
            </button>
          ))}
        </div>
      </div>

      {/* Check or Next Button */}
      {!isAnswerChecked ? (
        <button
          onClick={handleCheck}
          disabled={!isFull}
          className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
            isFull
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Tekshirish</span>
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-semibold text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <span>{currentIndex + 1 < questions.length ? 'Keyingisi' : 'Natijani ko\'rish'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
