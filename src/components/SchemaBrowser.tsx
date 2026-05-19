import React, { useState } from 'react';
import { DB_SCHEMA } from '../data/questions';
import type { TableSchema } from '../data/questions';
import { Database, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';

export default function SchemaBrowser() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [expandedTable, setExpandedTable] = useState<string | null>('usuarios');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1500);
  };

  const toggleTable = (tableName: string) => {
    if (expandedTable === tableName) {
      setExpandedTable(null);
    } else {
      setExpandedTable(tableName);
    }
  };

  return (
    <div className="island-shell flex h-full flex-col rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2 border-b border-[var(--line)] pb-3">
        <Database className="h-5 w-5 text-[var(--lagoon-deep)]" />
        <h2 className="text-base font-semibold text-[var(--sea-ink)]">Navegador do Schema</h2>
      </div>

      <p className="mb-4 text-xs text-[var(--sea-ink-soft)]">
        Visualize a estrutura do banco de dados. Clique em um nome para copiar.
      </p>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {DB_SCHEMA.map((table: TableSchema) => {
          const isExpanded = expandedTable === table.name;
          return (
            <div
              key={table.name}
              className="rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] transition-colors hover:border-[rgba(79,184,178,0.3)]"
            >
              {/* Table Header Row */}
              <button
                onClick={() => toggleTable(table.name)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left font-mono text-sm font-bold text-[var(--sea-ink)]"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-[var(--sea-ink-soft)]" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-[var(--sea-ink-soft)]" />
                  )}
                  <span className="hover:text-[var(--lagoon-deep)]">{table.name}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(table.name);
                  }}
                  className="rounded p-1 text-[var(--sea-ink-soft)] hover:bg-white/40 hover:text-[var(--lagoon-deep)]"
                  title="Copiar nome da tabela"
                >
                  {copiedText === table.name ? (
                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </button>

              {/* Table Columns List */}
              {isExpanded && (
                <div className="border-t border-[var(--line)] bg-white/20 p-2 space-y-1">
                  {table.columns.map((col) => {
                    const isCopied = copiedText === col.name;
                    return (
                      <div
                        key={col.name}
                        onClick={() => copyToClipboard(col.name)}
                        className="group flex cursor-pointer items-start justify-between rounded p-1.5 hover:bg-white/60"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-[var(--sea-ink)] group-hover:text-[var(--lagoon-deep)]">
                              {col.name}
                            </span>
                            <span className="rounded bg-[var(--line)] px-1 py-0.5 text-[9px] font-mono text-[var(--sea-ink-soft)] uppercase">
                              {col.type}
                            </span>
                          </div>
                          <span className="text-[10px] text-[var(--sea-ink-soft)] mt-0.5">
                            {col.description}
                          </span>
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-[var(--sea-ink-soft)]">
                          {isCopied ? (
                            <Check className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="h-2.5 w-2.5" />
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
