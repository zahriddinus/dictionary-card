import React from 'react';
import {
  Flame,
  Award,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
} from 'lucide-react';
import { DailyQuest, UserStats, WordCard } from '../types';

interface DailyQuestsViewProps {
  stats: UserStats;
  quests: DailyQuest[];
  words: WordCard[];
  onNavigateToTab: (tab: 'cards' | 'exercises') => void;
  onNavigateToExercise?: (type: 'quiz' | 'listening' | 'match') => void;
  onClaimQuestReward: (questId: string) => void;
}

export const DailyQuestsView: React.FC<DailyQuestsViewProps> = ({
  stats,
  quests,
  words,
  onNavigateToTab,
  onNavigateToExercise,
  onClaimQuestReward,
}) => {
  const masteredCount = words.filter((w) => w.status === 'mastered').length;
  const learningCount = words.filter((w) => w.status === 'learning').length;

  // Level calculation
  const currentLevel = Math.floor(stats.xp / 100) + 1;
  const xpInCurrentLevel = stats.xp % 100;
  const levelNames = [
    'Boshlang\'ich O\'rganuvchi',
    'Faol Bilimdon',
    'Ilg\'or O\'quvchi',
    'Ingliz tili Ustasi',
    'Poliglot Ekspert',
  ];
  const levelName = levelNames[Math.min(currentLevel - 1, levelNames.length - 1)];

  // 7 Days of the week for streak tracker
  const daysOfWeek = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Monday=0

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 md:pb-12">
      {/* Streak & Level Hero Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Flame className="w-7 h-7 fill-amber-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-slate-900 tabular-nums">
                  {stats.streakDays}
                </span>
                <span className="text-sm font-bold text-slate-700">kunlik seriya!</span>
              </div>
              <p className="text-xs text-slate-500">
                Ajoyib! O'rganishni to'xtatmang.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              Daraja {currentLevel}
            </span>
          </div>
        </div>

        {/* 7-Day Streak Scroller */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-4">
          <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Oxirgi 7 kunlik faollik
            </span>
            <span className="text-emerald-600 font-bold">Har kuni +10 XP</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {daysOfWeek.map((day, idx) => {
              const isPast = idx < todayDayIndex;
              const isToday = idx === todayDayIndex;
              const hasActivity = isPast || (isToday && stats.todayCardsReviewed > 0);

              return (
                <div key={day} className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 mb-1">{day}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      hasActivity
                        ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/30'
                        : isToday
                        ? 'border-2 border-dashed border-amber-400 text-amber-600 bg-white'
                        : 'bg-slate-200/60 text-slate-400'
                    }`}
                  >
                    {hasActivity ? (
                      <Flame className="w-4 h-4 fill-white" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700">{levelName}</span>
            <span className="text-slate-500 tabular-nums">
              {stats.xp} / {(currentLevel) * 100} XP
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${xpInCurrentLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Daily Quests Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-base">
            Bugungi Vazifalar
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Kunlik tiklanadi
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {quests.map((quest) => {
            const isFinished = quest.current >= quest.target;
            const percent = Math.min(100, Math.round((quest.current / quest.target) * 100));

            return (
              <div
                key={quest.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {quest.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.2 rounded-md">
                      +{quest.xpReward} XP
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {quest.description}
                  </p>

                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          isFinished ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 tabular-nums shrink-0">
                      {quest.current}/{quest.target}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div className="shrink-0">
                  {isFinished ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Bajarildi</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (quest.type === 'review_cards') {
                          onNavigateToTab('cards');
                        } else if (quest.type === 'complete_quiz' && onNavigateToExercise) {
                          onNavigateToExercise('quiz');
                        } else if (quest.type === 'word_match' && onNavigateToExercise) {
                          onNavigateToExercise('match');
                        } else {
                          onNavigateToTab('exercises');
                        }
                      }}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <span>Bajarish</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall Statistics Summary */}
      <div className="mb-6">
        <h3 className="font-bold text-slate-900 text-base mb-3">
          Mening Natijalarim
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200">
            <span className="text-xs text-slate-500 block mb-1">
              O'zlashtirilgan
            </span>
            <div className="text-xl font-bold text-emerald-600 tabular-nums">
              {masteredCount}
            </div>
            <span className="text-[10px] text-slate-400">so'zlar</span>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-200">
            <span className="text-xs text-slate-500 block mb-1">
              O'rganilmoqda
            </span>
            <div className="text-xl font-bold text-amber-600 tabular-nums">
              {learningCount}
            </div>
            <span className="text-[10px] text-slate-400">takrorlash kerak</span>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-200">
            <span className="text-xs text-slate-500 block mb-1">
              Bugun ko'rildi
            </span>
            <div className="text-xl font-bold text-indigo-600 tabular-nums">
              {stats.todayCardsReviewed}
            </div>
            <span className="text-[10px] text-slate-400">ta karta</span>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-200">
            <span className="text-xs text-slate-500 block mb-1">
              Jami so'zlar
            </span>
            <div className="text-xl font-bold text-slate-900 tabular-nums">
              {words.length}
            </div>
            <span className="text-[10px] text-slate-400">lug'atda</span>
          </div>
        </div>
      </div>

      {/* Motivational Tip */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-900 mb-0.5">
            Bilimdon maslahati:
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            Kuniga atigi 10-15 daqiqa muntazam flesh-kartalarni ko'rib chiqish haftasiga 50 dan ortiq yangi so'zni mustahkam eslab qolishga yordam beradi!
          </p>
        </div>
      </div>
    </div>
  );
};
