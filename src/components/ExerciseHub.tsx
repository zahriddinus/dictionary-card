import React from 'react';
import { Target, Headphones, Puzzle, SpellCheck, CheckCircle2, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import { ExerciseType, UserStats } from '../types';

interface ExerciseHubProps {
  stats: UserStats;
  onSelectExercise: (type: ExerciseType) => void;
}

export const ExerciseHub: React.FC<ExerciseHubProps> = ({
  stats,
  onSelectExercise,
}) => {
  const exercises = [
    {
      id: 'quiz' as ExerciseType,
      title: 'Tezkor Test',
      subtitle: '4 ta variantli qiziqarli so\'z sinovi',
      reward: '+25 XP',
      icon: Target,
      iconColor: 'bg-indigo-50 text-indigo-600',
      isCompleted: stats.todayQuizzesCompleted > 0,
      timesCompleted: stats.todayQuizzesCompleted,
    },
    {
      id: 'listening' as ExerciseType,
      title: 'Eshitib Topish',
      subtitle: 'Talaffuzni tinglab to\'g\'ri tarjimani tanlang',
      reward: '+30 XP',
      icon: Headphones,
      iconColor: 'bg-emerald-50 text-emerald-600',
      isCompleted: stats.todayListeningCompleted > 0,
      timesCompleted: stats.todayListeningCompleted,
    },
    {
      id: 'match' as ExerciseType,
      title: 'So\'z Juftligi',
      subtitle: 'Inglizcha va o\'zbekcha kataklarni birlashtiring',
      reward: '+35 XP',
      icon: Puzzle,
      iconColor: 'bg-amber-50 text-amber-600',
      isCompleted: stats.todayMatchesCompleted > 0,
      timesCompleted: stats.todayMatchesCompleted,
    },
    {
      id: 'scramble' as ExerciseType,
      title: 'Harf Terish (Speller)',
      subtitle: 'Aralash harflardan to\'g\'ri so\'zni yig\'ing',
      reward: '+25 XP',
      icon: SpellCheck,
      iconColor: 'bg-violet-50 text-violet-600',
      isCompleted: false,
      timesCompleted: 0,
    },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 md:pb-12">
      {/* Exercise Hub Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-5 text-white mb-6 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-indigo-100 backdrop-blur-xs">
              Kundalik mashg'ulotlar
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
            Kundalik interaktiv mashqlar
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed max-w-sm">
            Har kuni turli formatdagi mashqlarni bajarib so'zlarni xotirangizda mustahkamlang va ball to'plang.
          </p>
        </div>
        <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-md">
          <img
            src="/src/assets/images/lingo_hero_banner_1791958606637.jpg"
            alt="Ingliz tili mashqlari"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Exercise Selection Grid */}
      <div className="flex flex-col gap-3">
        {exercises.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectExercise(item.id)}
              className="w-full bg-white rounded-2xl p-4 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition text-left flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.iconColor}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition">
                      {item.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {item.reward}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.subtitle}
                  </p>
                  {item.timesCompleted > 0 && (
                    <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Bugun {item.timesCompleted} marta bajarildi</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 text-slate-400 flex items-center justify-center shrink-0 transition">
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
