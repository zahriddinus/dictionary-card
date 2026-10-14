import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { FlashcardDeck } from './components/FlashcardDeck';
import { ExerciseHub } from './components/ExerciseHub';
import { QuizExercise } from './components/QuizExercise';
import { ListeningExercise } from './components/ListeningExercise';
import { MatchExercise } from './components/MatchExercise';
import { ScrambleExercise } from './components/ScrambleExercise';
import { DailyQuestsView } from './components/DailyQuestsView';
import { VocabularyManager } from './components/VocabularyManager';
import { INITIAL_CATEGORIES } from './data/initialWords';
import { DailyQuest, ExerciseType, TabType, UserStats, WordCard } from './types';
import {
  loadStoredQuests,
  loadStoredStats,
  loadStoredWords,
  saveStoredQuests,
  saveStoredStats,
  saveStoredWords,
} from './utils/storage';

export default function App() {
  const [words, setWords] = useState<WordCard[]>(() => loadStoredWords());
  const [stats, setStats] = useState<UserStats>(() => loadStoredStats());
  const [quests, setQuests] = useState<DailyQuest[]>(() => loadStoredQuests());
  const [categories] = useState(INITIAL_CATEGORIES);
  const [activeTab, setActiveTab] = useState<TabType>('cards');
  const [activeExercise, setActiveExercise] = useState<ExerciseType | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Sync state to local storage
  useEffect(() => {
    saveStoredWords(words);
  }, [words]);

  useEffect(() => {
    saveStoredStats(stats);
  }, [stats]);

  useEffect(() => {
    saveStoredQuests(quests);
  }, [quests]);

  // Card rating handler (Spaced repetition & quests progress)
  const handleRateCard = (
    cardId: string,
    rating: 'again' | 'hard' | 'good' | 'easy'
  ) => {
    const gainedXp = rating === 'easy' ? 10 : rating === 'good' ? 5 : 2;

    setWords((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card;
        let nextStatus = card.status;
        if (rating === 'easy') {
          nextStatus = 'mastered';
        } else if (rating === 'good' || rating === 'hard') {
          nextStatus = card.status === 'mastered' ? 'mastered' : 'learning';
        } else {
          nextStatus = 'learning';
        }

        return {
          ...card,
          status: nextStatus,
          reviewCount: card.reviewCount + 1,
          lastReviewedAt: new Date().toISOString(),
        };
      })
    );

    // Update stats
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + gainedXp,
      todayCardsReviewed: prev.todayCardsReviewed + 1,
    }));

    // Update quest progress for 'review_cards'
    setQuests((prev) =>
      prev.map((q) => {
        if (q.type === 'review_cards') {
          const nextVal = q.current + 1;
          const isNowDone = nextVal >= q.target;
          return {
            ...q,
            current: nextVal,
            completed: isNowDone,
          };
        }
        return q;
      })
    );
  };

  // Toggle favorite
  const handleToggleFavorite = (cardId: string) => {
    setWords((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, isFavorite: !card.isFavorite } : card
      )
    );
  };

  // Add custom word
  const handleAddWord = (newWordData: Omit<WordCard, 'id' | 'reviewCount' | 'status'>) => {
    const newCard: WordCard = {
      ...newWordData,
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'new',
      reviewCount: 0,
      isCustom: true,
    };

    setWords((prev) => [newCard, ...prev]);
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + 10,
    }));
  };

  // Add batch words from AI
  const handleAddBatchWords = (batch: Omit<WordCard, 'id' | 'reviewCount' | 'status'>[]) => {
    const newCards: WordCard[] = batch.map((item, idx) => ({
      ...item,
      id: `ai_${Date.now()}_${idx}`,
      status: 'new',
      reviewCount: 0,
      isCustom: true,
    }));

    setWords((prev) => [...newCards, ...prev]);
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + 25,
    }));
  };

  // Delete word
  const handleDeleteWord = (cardId: string) => {
    setWords((prev) => prev.filter((c) => c.id !== cardId));
  };

  // Quiz finish handler
  const handleFinishQuiz = (score: number, total: number) => {
    const gainedXp = score * 10;
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + gainedXp,
      todayQuizzesCompleted: prev.todayQuizzesCompleted + 1,
    }));

    // Update quest
    setQuests((prev) =>
      prev.map((q) => {
        if (q.type === 'complete_quiz') {
          return {
            ...q,
            current: q.current + 1,
            completed: true,
          };
        }
        return q;
      })
    );
  };

  // Listening finish handler
  const handleFinishListening = (score: number, total: number) => {
    const gainedXp = score * 12;
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + gainedXp,
      todayListeningCompleted: prev.todayListeningCompleted + 1,
    }));

    // Update quest
    setQuests((prev) =>
      prev.map((q) => {
        if (q.type === 'audio_listen') {
          const nextVal = q.current + score;
          return {
            ...q,
            current: nextVal,
            completed: nextVal >= q.target,
          };
        }
        return q;
      })
    );
  };

  // Match finish handler
  const handleFinishMatch = (rewardXp: number) => {
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + rewardXp,
      todayMatchesCompleted: prev.todayMatchesCompleted + 1,
    }));

    // Update quest
    setQuests((prev) =>
      prev.map((q) => {
        if (q.type === 'word_match') {
          return {
            ...q,
            current: q.current + 1,
            completed: true,
          };
        }
        return q;
      })
    );
  };

  // Scramble finish handler
  const handleFinishScramble = (rewardXp: number) => {
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + rewardXp,
    }));
  };

  // Claim quest reward
  const handleClaimQuestReward = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    setStats((prev) => ({
      ...prev,
      xp: prev.xp + quest.xpReward,
    }));
  };

  const pendingQuestsCount = quests.filter((q) => !q.completed && q.current < q.target).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      {/* Top Header */}
      <Header
        stats={stats}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        onSelectTab={() => {
          setActiveTab('quests');
          setActiveExercise(null);
        }}
      />

      {/* Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveExercise(null);
        }}
        pendingQuestsCount={pendingQuestsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto py-2">
        {activeTab === 'cards' && (
          <FlashcardDeck
            words={words}
            categories={categories}
            isMuted={isMuted}
            audioSpeed={stats.audioSpeed}
            onRateCard={handleRateCard}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToExercises={() => {
              setActiveTab('exercises');
              setActiveExercise(null);
            }}
          />
        )}

        {activeTab === 'exercises' && (
          <>
            {activeExercise === null && (
              <ExerciseHub
                stats={stats}
                onSelectExercise={(type) => setActiveExercise(type)}
              />
            )}
            {activeExercise === 'quiz' && (
              <QuizExercise
                words={words}
                isMuted={isMuted}
                audioSpeed={stats.audioSpeed}
                onFinishQuiz={handleFinishQuiz}
                onBackToHub={() => setActiveExercise(null)}
              />
            )}
            {activeExercise === 'listening' && (
              <ListeningExercise
                words={words}
                audioSpeed={stats.audioSpeed}
                onFinishListening={handleFinishListening}
                onBackToHub={() => setActiveExercise(null)}
              />
            )}
            {activeExercise === 'match' && (
              <MatchExercise
                words={words}
                audioSpeed={stats.audioSpeed}
                onFinishMatch={handleFinishMatch}
                onBackToHub={() => setActiveExercise(null)}
              />
            )}
            {activeExercise === 'scramble' && (
              <ScrambleExercise
                words={words}
                audioSpeed={stats.audioSpeed}
                onFinishScramble={handleFinishScramble}
                onBackToHub={() => setActiveExercise(null)}
              />
            )}
          </>
        )}

        {activeTab === 'vocabulary' && (
          <VocabularyManager
            words={words}
            categories={categories}
            audioSpeed={stats.audioSpeed}
            onAddWord={handleAddWord}
            onAddBatchWords={handleAddBatchWords}
            onToggleFavorite={handleToggleFavorite}
            onDeleteWord={handleDeleteWord}
          />
        )}

        {activeTab === 'quests' && (
          <DailyQuestsView
            stats={stats}
            quests={quests}
            words={words}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              setActiveExercise(null);
            }}
            onNavigateToExercise={(type) => {
              setActiveTab('exercises');
              setActiveExercise(type);
            }}
            onClaimQuestReward={handleClaimQuestReward}
          />
        )}
      </main>
    </div>
  );
}
