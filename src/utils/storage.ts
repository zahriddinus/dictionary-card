import { INITIAL_WORDS } from '../data/initialWords';
import { DailyQuest, UserStats, WordCard } from '../types';

const STORAGE_KEYS = {
  WORDS: 'lingocard_words_v1',
  STATS: 'lingocard_stats_v1',
  QUESTS: 'lingocard_quests_v1',
};

const getTodayDateString = (): string => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

export const DEFAULT_STATS: UserStats = {
  xp: 120,
  level: 1,
  streakDays: 3,
  lastActiveDate: getTodayDateString(),
  todayCardsReviewed: 4,
  todayQuizzesCompleted: 1,
  todayMatchesCompleted: 0,
  todayListeningCompleted: 0,
  dailyGoalCards: 15,
  completedDates: [getYesterdayDateString(), getTodayDateString()],
  audioSpeed: 1.0,
};

export const DEFAULT_QUESTS: DailyQuest[] = [
  {
    id: 'q1',
    title: 'Flesh-kartalar bilan mashq',
    description: 'Bugun kamida 10 ta kartani ko\'rib chiqing',
    target: 10,
    current: 4,
    completed: false,
    xpReward: 30,
    type: 'review_cards',
  },
  {
    id: 'q2',
    title: 'Kundalik test',
    description: 'Tezkor testni kamida 1 marta yakunlang',
    target: 1,
    current: 1,
    completed: true,
    xpReward: 25,
    type: 'complete_quiz',
  },
  {
    id: 'q3',
    title: 'So\'z juftligi o\'yini',
    description: 'Juftliklarni topish mashqini yakunlang',
    target: 1,
    current: 0,
    completed: false,
    xpReward: 35,
    type: 'word_match',
  },
  {
    id: 'q4',
    title: 'Eshitib tushunish',
    description: 'Kamida 5 ta so\'zning talaffuzini eshiting',
    target: 5,
    current: 2,
    completed: false,
    xpReward: 20,
    type: 'audio_listen',
  },
];

export const loadStoredWords = (): WordCard[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(INITIAL_WORDS));
      return INITIAL_WORDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_WORDS;
  } catch {
    return INITIAL_WORDS;
  }
};

export const saveStoredWords = (words: WordCard[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
  } catch (err) {
    console.error('Failed to save words to localStorage:', err);
  }
};

export const loadStoredStats = (): UserStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(DEFAULT_STATS));
      return DEFAULT_STATS;
    }

    const stats: UserStats = JSON.parse(raw);

    // Check if new day
    if (stats.lastActiveDate !== today) {
      // Streak calculation
      let newStreak = stats.streakDays;
      if (stats.lastActiveDate === yesterday) {
        // active yesterday, streak maintained
      } else {
        // missed days
        newStreak = 1;
      }

      const updated: UserStats = {
        ...stats,
        streakDays: newStreak,
        lastActiveDate: today,
        todayCardsReviewed: 0,
        todayQuizzesCompleted: 0,
        todayMatchesCompleted: 0,
        todayListeningCompleted: 0,
      };

      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));
      return updated;
    }

    return stats;
  } catch {
    return DEFAULT_STATS;
  }
};

export const saveStoredStats = (stats: UserStats): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats:', err);
  }
};

export const loadStoredQuests = (): DailyQuest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(DEFAULT_QUESTS));
      return DEFAULT_QUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_QUESTS;
  }
};

export const saveStoredQuests = (quests: DailyQuest[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  } catch (err) {
    console.error('Failed to save quests:', err);
  }
};
