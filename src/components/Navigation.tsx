import React from 'react';
import { Layers, Dumbbell, BookOpen, Target } from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingQuestsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  pendingQuestsCount,
}) => {
  const tabs = [
    {
      id: 'cards' as TabType,
      label: 'Flesh-karta',
      icon: Layers,
    },
    {
      id: 'exercises' as TabType,
      label: 'Mashqlar',
      icon: Dumbbell,
    },
    {
      id: 'vocabulary' as TabType,
      label: 'Lug\'atim',
      icon: BookOpen,
    },
    {
      id: 'quests' as TabType,
      label: 'Vazifalar',
      icon: Target,
      badge: pendingQuestsCount > 0 ? pendingQuestsCount : undefined,
    },
  ];

  return (
    <>
      {/* Mobile Fixed Bottom Bar (safe area support, touch target >= 44px) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden">
        <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
                  isActive
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                    }`}
                  />
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-amber-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] tracking-tight mt-1 truncate">
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Top Segmented Navigation Tabs */}
      <div className="hidden md:flex justify-center border-b border-slate-200 bg-white">
        <div className="max-w-4xl w-full px-4 flex items-center gap-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-indigo-600 stroke-[2.2]' : 'text-slate-500'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
