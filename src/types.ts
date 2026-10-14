export type CardStatus = 'new' | 'learning' | 'mastered';
export type PartOfSpeech = 'ot' | 'fe\'l' | 'sifat' | 'ravish' | 'iboralar' | 'boshqa';

export interface WordCard {
  id: string;
  word: string;
  phonetic?: string;
  translation: string;
  partOfSpeech: PartOfSpeech;
  categoryId: string;
  exampleEn: string;
  exampleUz: string;
  status: CardStatus;
  isFavorite?: boolean;
  reviewCount: number;
  lastReviewedAt?: string;
  isCustom?: boolean;
}

export interface Category {
  id: string;
  name: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'Maxsus';
  description: string;
  iconName: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  xpReward: number;
  type: 'review_cards' | 'complete_quiz' | 'word_match' | 'audio_listen' | 'perfect_streak';
}

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  todayCardsReviewed: number;
  todayQuizzesCompleted: number;
  todayMatchesCompleted: number;
  todayListeningCompleted: number;
  dailyGoalCards: number;
  completedDates: string[]; // ['2026-10-13', ...]
  audioSpeed: number; // 0.8 | 1 | 1.2
}

export type TabType = 'cards' | 'exercises' | 'vocabulary' | 'quests';
export type ExerciseType = 'quiz' | 'listening' | 'match' | 'scramble';
