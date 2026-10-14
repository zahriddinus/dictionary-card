import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle, XCircle, ArrowRight, RotateCcw, Headphones } from 'lucide-react';
import { WordCard } from '../types';
import { speakWord } from '../utils/speech';

interface ListeningExerciseProps {
  words: WordCard[];
  audioSpeed: number;
  onFinishListening: (score: number, total: number) => void;
  onBackToHub: () => void;
}

interface ListeningQuestion {
  card: WordCard;
  correctAnswer: string;
  options: string[];
}

export const ListeningExercise: React.FC<ListeningExerciseProps> = ({
  words,
  audioSpeed,
  onFinishListening,
  onBackToHub,
}) => {
  const [questions, setQuestions] = useState<ListeningQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isPlayingSlow, setIsPlayingSlow] = useState<boolean>(false);

  useEffect(() => {
    if (words.length < 4) return;
    const shuffledWords = [...words].sort(() => 0.5 - Math.random()).slice(0, 5);

    const generated: ListeningQuestion[] = shuffledWords.map((card) => {
      const otherWords = words.filter((w) => w.id !== card.id);
      const distractors = [...otherWords]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((w) => w.translation);

      const options = [...distractors, card.translation].sort(() => 0.5 - Math.random());

      return {
        card,
        correctAnswer: card.translation,
        options,
      };
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setScore(0);
    setIsCompleted(false);
    setSelectedOption(null);
    setIsAnswered(false);
  }, [words]);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (currentQ) {
      speakWord(currentQ.card.word, audioSpeed);
    }
  }, [currentIndex, currentQ, audioSpeed]);

  const handlePlayWord = (slow: boolean = false) => {
    if (!currentQ) return;
    setIsPlayingSlow(slow);
    speakWord(currentQ.card.word, slow ? 0.7 : audioSpeed);
  };

  const handleSelect = (option: string) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      onFinishListening(score, questions.length);
    }
  };

  if (questions.length === 0) {
    return <div className="p-8 text-center text-slate-500">Tayyorlanmoqda...</div>;
  }

  if (isCompleted) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Headphones className="w-9 h-9" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">
          Eshitish mashqi tugadi!
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Siz {questions.length} tadan {score} ta so'zni aniq eshitib topdingiz.
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 flex items-center justify-around">
          <div>
            <div className="text-2xl font-bold text-indigo-600">+{score * 12}</div>
            <div className="text-xs text-slate-500">XP qo'shildi</div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <div className="text-2xl font-bold text-emerald-600">{score}/{questions.length}</div>
            <div className="text-xs text-slate-500">Natija</div>
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

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-20">
      <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
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
          Ball: {score * 12} XP
        </span>
      </div>

      {/* Audio Listening Center Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          So'zni diqqat bilan eshiting va tarjimasini toping
        </p>

        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => handlePlayWord(false)}
            className="w-18 h-18 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 active:scale-95 transition cursor-pointer"
            title="Qayta eshitish"
          >
            <Volume2 className="w-9 h-9" />
          </button>
        </div>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => handlePlayWord(true)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            🐢 Sekinroq eshitish (0.7x)
          </button>
          <button
            onClick={() => handlePlayWord(false)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            🔊 Qayta tinglash
          </button>
        </div>

        {isAnswered && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-lg font-bold text-slate-900 block">
              {currentQ.card.word}
            </span>
            {currentQ.card.phonetic && (
              <span className="text-xs text-slate-500 font-mono">
                {currentQ.card.phonetic}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-6">
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === currentQ.correctAnswer;

          let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/30';

          if (isAnswered) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold';
            } else if (isSelected) {
              btnStyle = 'bg-red-50 border-red-500 text-red-800';
            } else {
              btnStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              className={`w-full min-h-[52px] p-4 rounded-2xl border text-left flex items-center justify-between text-sm sm:text-base transition cursor-pointer ${btnStyle}`}
            >
              <span className="font-medium">{option}</span>
              {isAnswered && isCorrect && (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
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
