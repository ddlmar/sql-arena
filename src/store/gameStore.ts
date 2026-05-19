import { create } from 'zustand';
import { QUESTIONS } from '@/data/questions';
import { executeQuery, compareResults } from '@/data/dbEngine';
import confetti from 'canvas-confetti';
import type { QueryResultRow } from '@/data/tables';

interface GameState {
  currentQuestionIndex: number;
  userSql: string;
  executionResult: QueryResultRow[] | null;
  executionColumns: string[];
  executionError: string | null;
  hasSubmitted: boolean;
  isCorrect: boolean | null;
  errorMessage: string | null;
  completedQuestions: number[];
  score: number;
  streak: number;
  highScore: number;
  currentHintIndex: number;

  selectQuestion: (index: number) => void;
  updateSql: (sql: string) => void;
  runUserQuery: () => void;
  submitAnswer: () => void;
  revealHint: () => void;
  resetGame: () => void;
  nextQuestion: () => void;
}

export const useGameStore = create<GameState>((set, get) => {
  const getInitialHighScore = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sql-game-highscore');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  };

  return {
    currentQuestionIndex: 0,
    userSql: QUESTIONS[0]?.placeholderSql || '',
    executionResult: null,
    executionColumns: [],
    executionError: null,
    hasSubmitted: false,
    isCorrect: null,
    errorMessage: null,
    completedQuestions: [],
    score: 0,
    streak: 0,
    highScore: getInitialHighScore(),
    currentHintIndex: -1,

    selectQuestion: (index: number) => {
      if (index < 0 || index >= QUESTIONS.length) return;
      const question = QUESTIONS[index];

      const initialExec = executeQuery(question.placeholderSql);

      set({
        currentQuestionIndex: index,
        userSql: question.placeholderSql,
        executionResult: initialExec.data,
        executionColumns: initialExec.columns,
        executionError: initialExec.error,
        hasSubmitted: false,
        isCorrect: null,
        errorMessage: null,
        currentHintIndex: -1,
      });
    },

    updateSql: (sql: string) => {
      set({ userSql: sql });

      const res = executeQuery(sql);

      set({
        executionResult: res.data,
        executionColumns: res.columns,
        executionError: res.error,

        hasSubmitted: false,
        isCorrect: null,
        errorMessage: null,
      });
    },

    runUserQuery: () => {
      const { userSql } = get();
      const res = executeQuery(userSql);
      set({
        executionResult: res.data,
        executionColumns: res.columns,
        executionError: res.error,
      });
    },

    submitAnswer: () => {
      const { currentQuestionIndex, userSql, completedQuestions, score, streak, highScore } = get();
      const question = QUESTIONS[currentQuestionIndex];

      const check = compareResults(userSql, question.expectedQuery);

      if (check.isCorrect) {
        let points = 100;
        if (question.difficulty === 'Médio') points = 200;
        if (question.difficulty === 'Difícil') points = 300;

        const multiplier = Math.min(1 + streak * 0.1, 2.0);
        const earnedPoints = Math.round(points * multiplier);

        const alreadyCompleted = completedQuestions.includes(currentQuestionIndex);
        const newCompleted = alreadyCompleted
          ? completedQuestions
          : [...completedQuestions, currentQuestionIndex];

        const newScore = alreadyCompleted ? score : score + earnedPoints;
        const newStreak = streak + 1;
        const newHighScore = Math.max(newScore, highScore);

        if (typeof window !== 'undefined') {
          localStorage.setItem('sql-game-highscore', newHighScore.toString());
        }

        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4fb8b2', '#2f6a4a', '#e7f0e8', '#328f97', '#6ec89a'],
        });

        set({
          isCorrect: true,
          hasSubmitted: true,
          errorMessage: null,
          completedQuestions: newCompleted,
          score: newScore,
          streak: newStreak,
          highScore: newHighScore,
        });
      } else {
        set({
          isCorrect: false,
          hasSubmitted: true,
          errorMessage: check.error || 'Resultado da consulta incorreto.',
          streak: 0,
        });
      }
    },

    revealHint: () => {
      const { currentQuestionIndex, currentHintIndex } = get();
      const question = QUESTIONS[currentQuestionIndex];

      if (currentHintIndex < question.hints.length - 1) {
        set({ currentHintIndex: currentHintIndex + 1 });
      }
    },

    resetGame: () => {
      const firstQuestion = QUESTIONS[0];
      const initialExec = executeQuery(firstQuestion.placeholderSql);

      set({
        currentQuestionIndex: 0,
        userSql: firstQuestion.placeholderSql,
        executionResult: initialExec.data,
        executionColumns: initialExec.columns,
        executionError: initialExec.error,
        hasSubmitted: false,
        isCorrect: null,
        errorMessage: null,
        completedQuestions: [],
        score: 0,
        streak: 0,
        currentHintIndex: -1,
      });
    },

    nextQuestion: () => {
      const { currentQuestionIndex } = get();
      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < QUESTIONS.length) {
        const question = QUESTIONS[nextIndex];
        const initialExec = executeQuery(question.placeholderSql);

        set({
          currentQuestionIndex: nextIndex,
          userSql: question.placeholderSql,
          executionResult: initialExec.data,
          executionColumns: initialExec.columns,
          executionError: initialExec.error,
          hasSubmitted: false,
          isCorrect: null,
          errorMessage: null,
          currentHintIndex: -1,
        });
      }
    },
  };
});
