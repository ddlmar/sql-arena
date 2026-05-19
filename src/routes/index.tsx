import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { QUESTIONS } from '../data/questions';
import { initDb } from '../data/dbEngine';
import QuestionDetails from '../components/QuestionDetails';
import SchemaBrowser from '../components/SchemaBrowser';
import SqlEditor from '../components/SqlEditor';
import QueryResultTable from '../components/QueryResultTable';
import TableViewer from '../components/TableViewer';
import { Award, Flame, Trophy, RefreshCw, ChevronRight, CheckCircle2, Play } from 'lucide-react';

export const Route = createFileRoute('/')({ component: SQLGameApp });

function SQLGameApp() {
  const {
    score,
    streak,
    highScore,
    completedQuestions,
    currentQuestionIndex,
    isCorrect,
    hasSubmitted,
    resetGame,
    nextQuestion,
    selectQuestion,
  } = useGameStore();

  // Initialize AlaSQL tables on mount
  useEffect(() => {
    initDb();
    // Initialize first question placeholder state
    selectQuestion(0);
  }, []);

  const isArenaCompleted = completedQuestions.length === QUESTIONS.length;
  const activeQuestion = QUESTIONS[currentQuestionIndex];

  return (
    <main className="page-wrap px-4 pb-16 pt-8">
      {/* Game HUD (Score, HighScore, Streak) */}
      <section className="island-shell mb-6 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        {/* Glow behind stats */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.2),transparent_66%)]" />

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="rounded-full bg-gradient-to-tr from-[var(--lagoon-deep)] to-[var(--lagoon)] p-2.5 text-white shadow-md">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="display-title text-xl font-extrabold text-[var(--sea-ink)] leading-tight">
              SQL Arena ⚔️
            </h1>
            <p className="text-xs text-[var(--sea-ink-soft)] font-medium">
              Pratique e domine comandos SQL em tempo real!
            </p>
          </div>
        </div>

        {/* HUD Statistics counters */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-white/20 px-5 py-2.5 rounded-xl border border-[var(--line)] shadow-sm">
          {/* Score */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-[var(--sea-ink-soft)] tracking-wider">Pontos</span>
            <span className="font-mono text-base font-extrabold text-[var(--lagoon-deep)] flex items-center gap-1">
              <Award className="h-4 w-4 text-[var(--lagoon)] fill-current" />
              {score}
            </span>
          </div>

          <span className="h-8 w-[1px] bg-[var(--line)]" />

          {/* Streak Combo */}
          <div className="flex flex-col items-center min-w-[70px]">
            <span className="text-[10px] uppercase font-bold text-[var(--sea-ink-soft)] tracking-wider">Combo</span>
            {streak > 0 ? (
              <span className="font-mono text-base font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-0.5 animate-bounce">
                <Flame className="h-4 w-4 fill-current text-amber-500" />
                {streak}x
              </span>
            ) : (
              <span className="font-mono text-sm font-semibold text-[var(--sea-ink-soft)]">
                Sem combo
              </span>
            )}
          </div>

          <span className="h-8 w-[1px] bg-[var(--line)]" />

          {/* Record */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-[var(--sea-ink-soft)] tracking-wider">Recorde</span>
            <span className="font-mono text-base font-extrabold text-[var(--sea-ink)] flex items-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-500 fill-current" />
              {highScore}
            </span>
          </div>
        </div>

        {/* Global actions */}
        <button
          onClick={resetGame}
          className="flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white/50 px-4 py-2 text-xs font-bold text-[var(--sea-ink-soft)] shadow-sm hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/20 hover:-translate-y-0.5 transition-all self-stretch md:self-auto justify-center"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reiniciar Jogo</span>
        </button>
      </section>

      {isArenaCompleted ? (
        /* Victory Screen */
        <section className="island-shell rise-in rounded-[2rem] px-6 py-12 text-center max-w-2xl mx-auto my-8 relative overflow-hidden border border-[var(--line)]">
          <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.3),transparent_66%)]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.15),transparent_66%)]" />
          
          <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 mb-6 shadow-md">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>

          <p className="island-kicker mb-3">Arena Completada! 🏆</p>
          <h2 className="display-title mb-4 text-3xl sm:text-5xl font-extrabold text-[var(--sea-ink)] tracking-tight">
            Você é um Mestre do SQL!
          </h2>
          
          <p className="mb-8 text-base text-[var(--sea-ink-soft)] max-w-md mx-auto leading-relaxed">
            Parabéns! Você resolveu com êxito todas as <strong>{QUESTIONS.length} questões</strong> do banco de dados relacional. Seu domínio em filtros, junções de tabelas e agregações está afiado!
          </p>

          <div className="bg-white/30 border border-[var(--line)] p-5 rounded-2xl mb-8 max-w-sm mx-auto shadow-sm">
            <h4 className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider mb-2">Resumo da Conquista</h4>
            <div className="flex justify-between items-center py-1.5 border-b border-[var(--line)]/50 font-sans text-sm">
              <span className="text-[var(--sea-ink-soft)]">Pontuação Final:</span>
              <strong className="font-mono text-[var(--lagoon-deep)] text-base">{score} pts</strong>
            </div>
            <div className="flex justify-between items-center py-1.5 font-sans text-sm">
              <span className="text-[var(--sea-ink-soft)]">Questões Resolvidas:</span>
              <strong className="font-mono text-[var(--sea-ink)]">100% ({QUESTIONS.length}/{QUESTIONS.length})</strong>
            </div>
          </div>

          <button
            onClick={resetGame}
            className="rounded-full bg-[var(--lagoon-deep)] text-white px-8 py-3.5 text-sm font-bold shadow-md hover:bg-[var(--lagoon)] hover:-translate-y-0.5 transition-all"
          >
            Jogar Novamente / Recomeçar Arena
          </button>
        </section>
      ) : (
        /* Standard Game Playground Grid */
        <div className="space-y-6">
          {/* Main Playground: Question details, SQL Editor, schema, preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (Span 4): Question card and Database Schema Browser */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <QuestionDetails />
              <SchemaBrowser />
            </div>

            {/* Right Column (Span 8): SQL Editor and live result comparisons */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <SqlEditor />
              
              {/* Query Result Pane */}
              <div className="flex-1">
                <QueryResultTable />
              </div>

              {/* Navigation controller for questions */}
              {isCorrect && currentQuestionIndex < QUESTIONS.length - 1 && (
                <div className="island-shell rise-in rounded-xl p-4 bg-emerald-500/5 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Excelente trabalho! Você desbloqueou o próximo desafio.
                  </span>
                  <button
                    onClick={nextQuestion}
                    className="flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-5 py-2 text-xs font-bold shadow-md hover:bg-emerald-500 hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
                  >
                    <span>Ir para a Próxima Questão</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Large raw reference table display */}
          <div className="w-full">
            <TableViewer />
          </div>
        </div>
      )}
    </main>
  );
}
