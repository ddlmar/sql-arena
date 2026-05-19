import React, { useState } from 'react';
import { DB_MOCK_DATA } from '../data/questions';
import { Eye, Table } from 'lucide-react';

export default function TableViewer() {
  const tableNames = Object.keys(DB_MOCK_DATA);
  const [activeTable, setActiveTable] = useState<string>(tableNames[0]);

  const rawRows = DB_MOCK_DATA[activeTable] || [];
  const columns = rawRows.length > 0 ? Object.keys(rawRows[0]) : [];

  return (
    <div className="island-shell flex flex-col rounded-2xl p-5">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-[var(--lagoon-deep)]" />
          <h2 className="text-base font-semibold text-[var(--sea-ink)]">Visualizador de Dados das Tabelas</h2>
        </div>
        
        {/* Table Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-white/20 p-1 rounded-lg border border-[var(--line)]">
          {tableNames.map((name) => (
            <button
              key={name}
              onClick={() => setActiveTable(name)}
              className={`rounded-md px-3 py-1 font-mono text-xs font-semibold transition-all ${
                activeTable === name
                  ? 'bg-[var(--lagoon-deep)] text-white shadow-sm'
                  : 'text-[var(--sea-ink-soft)] hover:bg-white/40 hover:text-[var(--sea-ink)]'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-xs text-[var(--sea-ink-soft)] flex items-center gap-1.5">
        <Table className="h-3.5 w-3.5" /> Exibindo {rawRows.length} registros da tabela <strong className="font-mono">{activeTable}</strong>:
      </p>

      {/* Responsive Table Container */}
      <div className="flex-1 overflow-x-auto rounded-lg border border-[var(--line)] bg-white/30 max-h-[250px] overflow-y-auto">
        <table className="w-full border-collapse text-left text-xs font-sans">
          <thead>
            <tr className="bg-[var(--chip-bg)] border-b border-[var(--line)] sticky top-0 backdrop-blur-sm z-10">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2.5 font-mono font-bold text-[var(--sea-ink)]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rawRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-[var(--line)]/50 hover:bg-white/40 last:border-b-0 transition-colors"
              >
                {columns.map((col) => {
                  const val = row[col];
                  return (
                    <td
                      key={col}
                      className="px-4 py-2 font-mono text-[var(--sea-ink-soft)]"
                    >
                      {val === null || val === undefined ? (
                        <span className="italic text-rose-500/70 font-semibold uppercase text-[10px]">NULL</span>
                      ) : typeof val === 'number' && col === 'preco' || col === 'valor_total' || col === 'preco_unitario' ? (
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
  );
}
