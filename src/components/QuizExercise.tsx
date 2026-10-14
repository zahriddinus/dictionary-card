import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { WordCard } from '../types';
import { speakWord } from '../utils/speech';

interface QuizExerciseProps {
  words: WordCard[];
  isMuted: boolean;
  audioSpeed: number;
  onFinishQuiz: (score: number, total: number) => void;
  onBackToHub: () => void;
}

interface Question {
  card: WordCard;
  type: 'en-to-uz' | 'uz-to-en';
  questionText: string;
  correctAnswer: string;
  options: string[];
}

export const QuizExercise: React.FC<QuizExerciseProps> = ({
  words,
  isMuted,
  audioSpeed,
  onFinishQuiz,
  onBackToHub,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Generate 5 questions from word list
  useEffect(() => {
    if (words.length < 4) return;

    const shuffledWords = [...words].sort(() => 0.5 - Math.random()).slice(0, 5);

    const generated: Question[] = shuffledWords.map((card) => {
      const type = Math.random() > 0.5 ? 'en-to-uz' : 'uz-to-en';
      const isEnToUz = type === 'en-to-uz';

      const questionText = isEnToUz ? card.word : card.translation;
      const correctAnswer = isEnToUz ? card.translation : card.word;

      // Distractors
      const otherWords = words.filter((w) => w.id !== card.id);
      const distractors = [...otherWords]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((w) => (isEnToUz ? w.translation : w.word));

      const options = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());

      return {
        card,
        type,
        questionText,
        correctAnswer,
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
    if (currentQ && currentQ.type === 'en-to-uz' && !isMuted) {
      speakWord(currentQ.card.word, audioSpeed);
    }
  }, [currentIndex, currentQ, isMuted, audioSpeed]);

  const handleSelect = (option: string) => {
    if (isAnswered || !currentQ) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
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
      const finalScore = score + (selectedOption === currentQ.correctAnswer ? 0 : 0);
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      onFinishQuiz(score, questions.length);
    }
  };

  const restartQuiz = () => {
    const shuffledWords = [...words].sort(() => 0.5 - Math.random()).slice(0, 5);
    const generated: Question[] = shuffledWords.map((card) => {
      const type = Math.random() > 0.5 ? 'en-to-uz' : 'uz-to-en';
      const isEnToUz = type === 'en-to-uz';
      const questionText = isEnToUz ? card.word : card.translation;
      const correctAnswer = isEnToUz ? card.translation : card.word;

      const otherWords = words.filter((w) => w.id !== card.id);
      const distractors = [...otherWords]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((w) => (isEnToUz ? w.translation : w.word));

      const options = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());

      return {
        card,
        type,
        questionText,
        correctAnswer,
        options,
      };
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setScore(0);
    setIsCompleted(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        Savollar tayyorlanmoqda...
      </div>
    );
  }

  if (isCompleted) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Award className="w-9 h-9" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">
          Test yakunlandi!
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Siz {questions.length} tadan {score} ta to'g'ri javob berdingiz ({percent}%).
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 flex items-center justify-around">
          <div>
            <div className="text-2xl font-bold text-indigo-600">+{score * 10}</div>
            <div className="text-xs text-slate-500">XP to'plandi</div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <div className="text-2xl font-bold text-emerald-600">{score}/{questions.length}</div>
            <div className="text-xs text-slate-500">To'g'ri javob</div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={restartQuiz}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Qaytadan boshlash</span>
          </button>
          <button
            onClick={onBackToHub}
            className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition cursor-pointer"
          >
            Mashqlar bo'limiga qaytish
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-20">
      {/* Top status */}
      <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
        <button
          onClick={onBackToHub}
          className="font-medium text-indigo-600 hover:text-indigo-800"
        >
          ← Chiqish
        </button>
        <span className="font-semibold text-slate-700 tabular-nums">
          Savol {currentIndex + 1} / {questions.length}
        </span>
        <span className="font-semibold text-emerald-600">
          Ball: {score * 10} XP
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-6 overflow-hidden">
        <div
          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6 text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          {currentQ.type === 'en-to-uz'
            ? "To'g'ri o'zbekcha tarjimani tanlang"
            : "To'g'ri inglizcha so'zni tanlang"}
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentQ.questionText}
          </h2>
          {currentQ.type === 'en-to-uz' && (
            <button
              onClick={() => speakWord(currentQ.card.word, audioSpeed)}
              className="p-1.5 rounded-full text-indigo-600 hover:bg-indigo-50"
              title="Talaffuz"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {currentQ.type === 'en-to-uz' && currentQ.card.phonetic && (
          <p className="text-xs text-slate-500 font-mono">
            {currentQ.card.phonetic}
          </p>
        )}
      </div>

      {/* Options List */}
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

      {/* Next Button */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl font-semibold text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/20 active:scale-[0.99] cursor-pointer"
        >
          <span>{currentIndex + 1 < questions.length ? 'Keyingisi' : 'Natijani ko\'rish'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
