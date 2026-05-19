import React from 'react';
import { useGameStore } from '../store/gameStore';
import { QUESTIONS } from '../data/questions';
import { HelpCircle, Award, Star, BookOpen, Check, ChevronRight, Lock } from 'lucide-react';

export default function QuestionDetails() {
  const {
    currentQuestionIndex,
    completedQuestions,
    currentHintIndex,
    selectQuestion,
    revealHint,
  } = useGameStore();

  const question = QUESTIONS[currentQuestionIndex];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Médio':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Difícil':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Active Question details */}
      <div className="island-shell flex flex-col rounded-2xl p-5 relative overflow-hidden">
        {/* Visual corner accents */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.18),transparent_66%)]" />
        
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[var(--lagoon-deep)]" />
            <span className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider">
              Questão {currentQuestionIndex + 1} de {QUESTIONS.length}
            </span>
          </div>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${getDifficultyColor(
              question.difficulty
            )}`}
          >
            {question.difficulty}
          </span>
        </div>

        <h1 className="text-xl font-bold text-[var(--sea-ink)] leading-tight mb-2">
          {question.title}
        </h1>

        <p className="text-sm text-[var(--sea-ink-soft)] leading-relaxed mb-4">
          {question.description}
        </p>

        {/* Dynamic Hints Accordion */}
        <div className="mt-auto border-t border-[var(--line)] pt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[var(--sea-ink)] flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-[var(--lagoon-deep)]" />
              <span>Dicas de Apoio ({question.hints.length})</span>
            </h4>
            
            {currentHintIndex < question.hints.length - 1 && (
              <button
                onClick={revealHint}
                className="text-[10px] font-bold text-[var(--lagoon-deep)] hover:underline flex items-center gap-0.5 bg-white/50 px-2 py-1 rounded-md border border-[var(--line)] transition"
              >
                <span>Revelar Dica ({currentHintIndex + 2})</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>

          {currentHintIndex === -1 ? (
            <p className="text-xs text-[var(--sea-ink-soft)] italic bg-white/20 p-2.5 rounded-lg border border-dashed border-[var(--line)]">
              Está com dificuldades? Clique em "Revelar Dica" para obter pistas graduais!
            </p>
          ) : (
            <div className="space-y-1.5">
              {question.hints.slice(0, currentHintIndex + 1).map((hint, idx) => (
                <div
                  key={idx}
                  className="text-xs text-[var(--sea-ink-soft)] bg-white/40 p-2.5 rounded-lg border border-[var(--line)] flex gap-2 animate-rise-in"
                >
                  <span className="font-bold text-[var(--lagoon-deep)] shrink-0">#{idx + 1}:</span>
                  <span>{hint}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid selector of all questions */}
      <div className="island-shell flex flex-col rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2 border-b border-[var(--line)] pb-3">
          <Award className="h-5 w-5 text-[var(--lagoon-deep)]" />
          <h3 className="text-base font-semibold text-[var(--sea-ink)]">Mapa do Desafio</h3>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-3 gap-2">
          {QUESTIONS.map((q, idx) => {
            const isSelected = idx === currentQuestionIndex;
            const isCompleted = completedQuestions.includes(idx);
            
            return (
              <button
                key={q.id}
                onClick={() => selectQuestion(idx)}
                className={`relative flex h-11 flex-col items-center justify-center rounded-xl border font-mono text-sm font-bold transition-all hover:scale-102 ${
                  isSelected
                    ? 'bg-[var(--lagoon-deep)] border-[var(--lagoon-deep)] text-white shadow-md'
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20'
                    : 'bg-white/40 border-[var(--line)] text-[var(--sea-ink-soft)] hover:border-[rgba(23,58,64,0.3)] hover:bg-white/70'
                }`}
                title={`${q.title} (${q.difficulty})`}
              >
                <span>{q.id}</span>
                {isCompleted && (
                  <span className={`absolute -right-1 -top-1 rounded-full p-0.5 border ${
                    isSelected 
                      ? 'bg-white border-[var(--lagoon-deep)] text-[var(--lagoon-deep)]' 
                      : 'bg-emerald-500 border-white text-white'
                  }`}>
                    <Check className="h-2.5 w-2.5 stroke-[3px]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Progress bar info */}
        <div className="mt-4 border-t border-[var(--line)] pt-3">
          <div className="flex justify-between text-[11px] font-bold text-[var(--sea-ink-soft)] mb-1">
            <span>Progresso Geral</span>
            <span>{completedQuestions.length} / {QUESTIONS.length} Concluídos</span>
          </div>
          <div className="h-2 w-full bg-[var(--line)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--lagoon)] to-[var(--lagoon-deep)] transition-all duration-500"
              style={{ width: `${(completedQuestions.length / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
