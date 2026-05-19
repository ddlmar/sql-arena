import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { QUESTIONS } from '@/data/questions';
import { executeQuery } from '@/data/dbEngine';
import { Table, CheckCircle2, XCircle, Database, HelpCircle } from 'lucide-react';

export default function QueryResultTable() {
  const {
    currentQuestionIndex,
    executionResult,
    executionColumns,
    executionError,
    hasSubmitted,
    isCorrect,
    errorMessage,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'mine' | 'expected'>('mine');

  const question = QUESTIONS[currentQuestionIndex];

  const expectedRes = executeQuery(question.expectedQuery);
  const expectedRows = expectedRes.data || [];
  const expectedCols = expectedRes.columns || [];

  const userRows = executionResult || [];
  const userCols = executionColumns || [];

  return (
    <div className="island-shell flex flex-col rounded-2xl p-5 h-full">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-(--line) pb-3">
        <div className="flex items-center gap-2">
          <Table className="h-5 w-5 text-(--lagoon-deep)" />
          <h2 className="text-base font-semibold text-(--sea-ink)">Painel de Resultados</h2>
        </div>

        <div className="flex bg-white/20 p-1 rounded-lg border border-(--line) self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('mine')}
            className={`rounded-md px-3.5 py-1 text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'mine'
                ? 'bg-(--lagoon-deep) text-white shadow-sm'
                : 'text-(--sea-ink-soft) hover:bg-(--hover-bg) hover:text-(--hover-text)'
            }`}
          >
            <span>Seu Resultado</span>
            <span className="rounded bg-black/10 px-1 py-0.5 text-[9px] font-mono font-bold">
              {userRows.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('expected')}
            className={`rounded-md px-3.5 py-1 text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'expected'
                ? 'bg-(--sea-ink-soft) text-white shadow-sm'
                : 'text-(--sea-ink-soft) hover:bg-(--hover-bg) hover:text-(--hover-text)'
            }`}
          >
            <span>Gabarito Esperado</span>
            <span className="rounded bg-black/10 px-1 py-0.5 text-[9px] font-mono font-bold">
              {expectedRows.length}
            </span>
          </button>
        </div>
      </div>

      {hasSubmitted && (
        <div
          className={`mb-4 rounded-xl p-4 border animate-pulse-subtle flex items-start gap-3 ${
            isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300'
          }`}
        >
          {isCorrect ? (
            <>
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Resposta Correta! 🎉</h4>
                <p className="text-xs mt-1">
                  Parabéns! Sua consulta retornou exatamente o conjunto de dados esperado. Prossiga
                  para o próximo desafio!
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Consulta Incorreta ou Incompleta ⚠️</h4>
                <p className="text-xs mt-1 leading-relaxed font-semibold">{errorMessage}</p>
                <p className="text-[10px] opacity-75 mt-1.5">
                  Dica: Compare a tabela do &apos;Seu Resultado&apos; com a do &apos;Gabarito
                  Esperado&apos; para ver quais linhas ou colunas diferem.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex-1 min-h-[220px] overflow-hidden flex flex-col">
        {activeTab === 'mine' ? (
          executionError ? (
            <div className="flex-1 flex flex-col items-center justify-center border border-rose-500/20 bg-rose-500/5 rounded-lg p-6 text-center">
              <XCircle className="h-8 w-8 text-rose-500/80 mb-2" />
              <h4 className="text-sm font-bold text-(--sea-ink) mb-1">Erro ao executar SQL</h4>
              <p className="font-mono text-xs text-rose-600 dark:text-rose-400 bg-white/40 p-3 rounded border border-rose-500/15 max-w-md break-all">
                {executionError}
              </p>
            </div>
          ) : userRows.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-(--line) rounded-lg p-6 text-center bg-white/10">
              <Database className="h-8 w-8 text-(--sea-ink-soft)/50 mb-2" />
              <h4 className="text-xs font-bold text-(--sea-ink) mb-1">Sem registros a exibir</h4>
              <p className="text-[11px] text-(--sea-ink-soft) max-w-xs">
                Sua consulta executou com sucesso, mas retornou zero linhas ou você ainda não
                digitou uma consulta completa.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto rounded-lg border border-(--line) bg-white/20 overflow-y-auto">
              <table className="w-full border-collapse text-left text-xs font-sans">
                <thead>
                  <tr className="bg-(--chip-bg) border-b border-(--line) sticky top-0 z-10 backdrop-blur-sm">
                    {userCols.map((col) => (
                      <th key={col} className="px-4 py-2 font-mono font-bold text-(--sea-ink)">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userRows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="group border-b border-(--line)/30 hover:bg-(--hover-bg) last:border-b-0 transition-colors"
                    >
                      {userCols.map((col) => {
                        const val = row[col];
                        return (
                          <td
                            key={col}
                            className="px-4 py-2 font-mono text-(--sea-ink-soft) group-hover:text-(--hover-text)"
                          >
                            {val === null || val === undefined ? (
                              <span className="italic text-rose-500/70 font-semibold uppercase text-[10px]">
                                NULL
                              </span>
                            ) : typeof val === 'number' &&
                              (col.toLowerCase().includes('preco') ||
                                col.toLowerCase().includes('total')) ? (
                              `R$ ${val.toFixed(2)}`
                            ) : (
                              String(val)
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="mb-2 text-[10px] text-(--sea-ink-soft) flex items-center gap-1">
              <HelpCircle className="h-3 w-3 text-(--lagoon-deep)" />
              <span>Esta é a resposta correta esperada para validar a questão.</span>
            </div>

            <div className="flex-1 overflow-x-auto rounded-lg border border-(--line) bg-emerald-500/5 overflow-y-auto">
              <table className="w-full border-collapse text-left text-xs font-sans">
                <thead>
                  <tr className="bg-emerald-500/10 border-b border-emerald-500/20 sticky top-0 z-10 backdrop-blur-sm">
                    {expectedCols.map((col) => (
                      <th key={col} className="px-4 py-2 font-mono font-bold text-(--sea-ink)">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {expectedRows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="group border-b border-emerald-500/10 hover:bg-(--hover-bg) last:border-b-0 transition-colors"
                    >
                      {expectedCols.map((col) => {
                        const val = row[col];
                        return (
                          <td
                            key={col}
                            className="px-4 py-2 font-mono text-(--sea-ink-soft) group-hover:text-(--hover-text)"
                          >
                            {val === null || val === undefined ? (
                              <span className="italic text-rose-500/70 font-semibold uppercase text-[10px]">
                                NULL
                              </span>
                            ) : typeof val === 'number' &&
                              (col.toLowerCase().includes('preco') ||
                                col.toLowerCase().includes('total')) ? (
                              `R$ ${val.toFixed(2)}`
                            ) : (
                              String(val)
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
