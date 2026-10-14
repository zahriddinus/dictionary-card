import React from 'react';
import { Flame, Trophy, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
  isMuted: boolean;
  onToggleMute: () => void;
  onSelectTab: (tab: 'quests') => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  isMuted,
  onToggleMute,
  onSelectTab,
}) => {
  const goalProgress = Math.min(
    100,
    Math.round((stats.todayCardsReviewed / (stats.dailyGoalCards || 15)) * 100)
  );

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 h-15 flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
                LingoCard
              </span>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                UZB-ENG
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none mt-0.5 hidden sm:block">
              Flesh-kartalar va kundalik mashqlar
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak */}
          <button
            onClick={() => onSelectTab('quests')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
            title="Kundalik seriya (streak)"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="tabular-nums">{stats.streakDays}</span>
            <span className="hidden sm:inline text-amber-700">kun</span>
          </button>

          {/* XP & Level Badge */}
          <button
            onClick={() => onSelectTab('quests')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold hover:bg-indigo-100 transition-colors cursor-pointer"
            title="Sizning ballaringiz"
          >
            <Trophy className="w-4 h-4 text-indigo-600" />
            <span className="tabular-nums">{stats.xp}</span>
            <span className="text-indigo-600">XP</span>
          </button>

          {/* Daily Goal Mini Circle */}
          <button
            onClick={() => onSelectTab('quests')}
            className="hidden xs:flex items-center gap-1.5 px-2 py-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
            title={`Bugungi maqsad: ${stats.todayCardsReviewed}/${stats.dailyGoalCards} so'z`}
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="2.5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                  strokeDasharray={56.5}
                  strokeDashoffset={56.5 - (56.5 * goalProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-slate-700">
                {goalProgress}%
              </span>
            </div>
          </button>

          {/* Audio toggle */}
          <button
            onClick={onToggleMute}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
            aria-label="Toggle Audio"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
