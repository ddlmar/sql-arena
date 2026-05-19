import React, { useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { Play, RotateCcw, AlertTriangle, CheckCircle, Terminal } from 'lucide-react';

export default function SqlEditor() {
  const {
    userSql,
    executionError,
    updateSql,
    submitAnswer,
    selectQuestion,
    currentQuestionIndex,
  } = useGameStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineCounterRef = useRef<HTMLDivElement>(null);

  // Compute number of lines for the line counter sidebar
  const lines = userSql.split('\n');

  // Synchronize scroll of line numbers and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineCounterRef.current) {
      lineCounterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to execute/submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      submitAnswer();
    }
  };

  const handleReset = () => {
    selectQuestion(currentQuestionIndex);
  };

  return (
    <div className="island-shell flex flex-col rounded-2xl overflow-hidden border border-[var(--line)]">
      {/* IDE Header Bar */}
      <div className="flex items-center justify-between bg-[var(--chip-bg)] border-b border-[var(--line)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          {/* Windows/Mac control dots */}
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          </div>
          <span className="h-4 w-[1px] bg-[var(--line)] mx-1" />
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--sea-ink-soft)] bg-white/40 px-2.5 py-1 rounded border border-[var(--line)]">
            <Terminal className="h-3.5 w-3.5 text-[var(--lagoon-deep)]" />
            <span>query.sql</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[10px] font-mono text-[var(--sea-ink-soft)] mr-1 bg-white/20 px-1.5 py-0.5 rounded border border-[var(--line)]">
            Ctrl + Enter para enviar
          </span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 px-2 py-1 rounded transition"
            title="Resetar código da questão"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Resetar</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex flex-1 relative bg-white/10 font-mono text-sm leading-6 min-h-[180px]">
        {/* Line Numbers column */}
        <div
          ref={lineCounterRef}
          className="select-none text-right px-3 py-3 border-r border-[var(--line)] bg-[var(--chip-bg)]/40 text-[var(--sea-ink-soft)]/50 text-xs text-right font-mono overflow-hidden"
          style={{ width: '42px', minHeight: '100%', lineHeight: '24px' }}
        >
          {lines.map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={userSql}
          onChange={(e) => updateSql(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          className="flex-1 w-full bg-transparent p-3 outline-none border-none text-[var(--sea-ink)] font-mono resize-y min-h-[180px] overflow-y-auto leading-[24px] z-10"
          placeholder="-- Escreva seu comando SQL aqui..."
          spellCheck={false}
          style={{ caretColor: 'var(--lagoon-deep)' }}
        />
      </div>

      {/* IDE Status Bar */}
      <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--chip-bg)]/60 px-4 py-2.5">
        {/* Live Syntax Status */}
        <div className="flex items-center gap-2 max-w-[70%]">
          {executionError ? (
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span className="truncate font-semibold" title={executionError}>
                Erro de Sintaxe: {executionError}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Sintaxe OK</span>
            </div>
          )}
        </div>

        {/* Big Submit Button */}
        <button
          onClick={submitAnswer}
          className="flex items-center gap-1.5 rounded-full bg-[var(--lagoon-deep)] text-white px-5 py-1.5 text-xs font-bold shadow-md hover:bg-[var(--lagoon)] hover:-translate-y-0.5 transition-all"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Enviar Resposta</span>
        </button>
      </div>
    </div>
  );
}
