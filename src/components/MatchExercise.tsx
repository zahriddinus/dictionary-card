import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Clock, Zap } from 'lucide-react';
import { WordCard } from '../types';
import { speakWord } from '../utils/speech';

interface MatchExerciseProps {
  words: WordCard[];
  audioSpeed: number;
  onFinishMatch: (score: number) => void;
  onBackToHub: () => void;
}

interface TileItem {
  id: string; // unique tile id
  cardId: string;
  text: string;
  lang: 'en' | 'uz';
  isMatched: boolean;
}

export const MatchExercise: React.FC<MatchExerciseProps> = ({
  words,
  audioSpeed,
  onFinishMatch,
  onBackToHub,
}) => {
  const [tiles, setTiles] = useState<TileItem[]>([]);
  const [selectedFirst, setSelectedFirst] = useState<TileItem | null>(null);
  const [selectedSecond, setSelectedSecond] = useState<TileItem | null>(null);
  const [mismatched, setMismatched] = useState<boolean>(false);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [totalPairs, setTotalPairs] = useState<number>(5);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Initialize game
  const initGame = () => {
    const pool = [...words].sort(() => 0.5 - Math.random()).slice(0, 5);
    setTotalPairs(pool.length);
    setMatchedPairs(0);
    setSelectedFirst(null);
    setSelectedSecond(null);
    setMismatched(false);
    setIsCompleted(false);
    setTimerSeconds(0);

    const generatedTiles: TileItem[] = [];
    pool.forEach((card) => {
      generatedTiles.push({
        id: `en-${card.id}`,
        cardId: card.id,
        text: card.word,
        lang: 'en',
        isMatched: false,
      });
      generatedTiles.push({
        id: `uz-${card.id}`,
        cardId: card.id,
        text: card.translation,
        lang: 'uz',
        isMatched: false,
      });
    });

    // Shuffle tiles
    setTiles(generatedTiles.sort(() => 0.5 - Math.random()));
  };

  useEffect(() => {
    initGame();
  }, [words]);

  // Timer
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  const handleTileClick = (tile: TileItem) => {
    if (tile.isMatched || mismatched) return;
    if (selectedFirst && selectedFirst.id === tile.id) return; // clicking same tile

    // If no first selection, select it
    if (!selectedFirst) {
      setSelectedFirst(tile);
      if (tile.lang === 'en') {
        speakWord(tile.text, audioSpeed);
      }
      return;
    }

    // Second selection
    setSelectedSecond(tile);

    // Check if match
    if (selectedFirst.cardId === tile.cardId && selectedFirst.lang !== tile.lang) {
      // Match found!
      const englishWord = selectedFirst.lang === 'en' ? selectedFirst.text : tile.text;
      speakWord(englishWord, audioSpeed);

      setTimeout(() => {
        setTiles((prev) =>
          prev.map((t) =>
            t.cardId === tile.cardId ? { ...t, isMatched: true } : t
          )
        );
        setSelectedFirst(null);
        setSelectedSecond(null);

        setMatchedPairs((mp) => {
          const next = mp + 1;
          if (next >= totalPairs) {
            setIsCompleted(true);
            try {
              confetti({
                particleCount: 90,
                spread: 100,
                origin: { y: 0.6 },
              });
            } catch {
              // ignore
            }
            onFinishMatch(40);
          }
          return next;
        });
      }, 350);
    } else {
      // Wrong match
      setMismatched(true);
      setTimeout(() => {
        setSelectedFirst(null);
        setSelectedSecond(null);
        setMismatched(false);
      }, 700);
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap className="w-9 h-9" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-1">
          Ajoyib tezlik!
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Barcha {totalPairs} ta so'z juftligini {timerSeconds} soniyada topdingiz.
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 flex items-center justify-around">
          <div>
            <div className="text-2xl font-bold text-indigo-600">+40</div>
            <div className="text-xs text-slate-500">XP qo'shildi</div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <div className="text-2xl font-bold text-slate-800">{timerSeconds}s</div>
            <div className="text-xs text-slate-500">Vaqt</div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={initGame}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yana o'ynash</span>
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

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-20">
      <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
        <button
          onClick={onBackToHub}
          className="font-medium text-indigo-600 hover:text-indigo-800"
        >
          ← Chiqish
        </button>
        <div className="flex items-center gap-1 text-slate-700 font-semibold">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="tabular-nums">{timerSeconds}s</span>
        </div>
        <span className="font-semibold text-emerald-600">
          Juftliklar: {matchedPairs} / {totalPairs}
        </span>
      </div>

      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold text-slate-900">
          So'z juftligini toping
        </h3>
        <p className="text-xs text-slate-500">
          Inglizcha so'z va uning o'zbekcha tarjimasini ketma-ket bosing
        </p>
      </div>

      {/* Grid of Tiles */}
      <div className="grid grid-cols-2 gap-2.5">
        {tiles.map((tile) => {
          const isSelected =
            (selectedFirst && selectedFirst.id === tile.id) ||
            (selectedSecond && selectedSecond.id === tile.id);

          if (tile.isMatched) {
            return (
              <div
                key={tile.id}
                className="min-h-[64px] rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 flex items-center justify-center p-3 opacity-30 select-none"
              >
                <span className="text-xs text-slate-400 line-through truncate">
                  {tile.text}
                </span>
              </div>
            );
          }

          let style = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300';

          if (isSelected) {
            if (mismatched) {
              style = 'bg-red-50 border-red-500 text-red-800 animate-shake';
            } else {
              style = 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold shadow-sm';
            }
          }

          return (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile)}
              className={`min-h-[68px] p-3 rounded-2xl border text-center flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-[0.98] ${style}`}
            >
              <span className="text-sm font-semibold leading-tight line-clamp-2">
                {tile.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
