import alasql from 'alasql';
import { DB_MOCK_DATA } from './tables';
import type { QueryResultRow } from './tables';

let dbInitialized = false;

export function initDb() {
  if (dbInitialized) return;

  try {
    if (alasql.options) {
      (alasql.options as unknown as Record<string, boolean>).warnings = false;
    }

    const tables = ['itens_pedido', 'pedidos', 'produtos', 'usuarios'];
    tables.forEach((table) => {
      try {
        alasql(`DROP TABLE IF EXISTS ${table}`);
      } catch {}
    });

    Object.entries(DB_MOCK_DATA).forEach(([tableName, rows]) => {
      alasql(`CREATE TABLE ${tableName}`);

      alasql(`INSERT INTO ${tableName} SELECT * FROM ?`, [rows]);
    });

    dbInitialized = true;
  } catch (err) {
    console.error('Failed to initialize AlaSQL database:', err);
  }
}

export interface QueryExecutionResult {
  data: QueryResultRow[] | null;
  columns: string[];
  error: string | null;
}

export function executeQuery(sql: string): QueryExecutionResult {
  initDb();

  try {
    let query = sql.trim();
    if (query.endsWith(';')) {
      query = query.slice(0, -1);
    }

    const result = alasql(query);

    if (!result) {
      return { data: [], columns: [], error: null };
    }

    if (Array.isArray(result)) {
      if (result.length === 0) {
        return { data: [], columns: [], error: null };
      }

      const columns = Object.keys(result[0] || {});
      return { data: result as QueryResultRow[], columns, error: null };
    }

    return { data: [result as QueryResultRow], columns: ['resultado'], error: null };
  } catch (err) {
    return {
      data: null,
      columns: [],
      error: err instanceof Error ? err.message : 'Erro de sintaxe no SQL',
    };
  }
}

function normalizeRow(row: unknown): QueryResultRow {
  if (!row || typeof row !== 'object') return {};

  const normalized: QueryResultRow = {};
  const rowObj = row as Record<string, unknown>;
  Object.keys(rowObj).forEach((key) => {
    const rawValue = rowObj[key];
    let value: string | number | boolean | null = null;

    if (typeof rawValue === 'number') {
      value = Math.round(rawValue * 100) / 100;
    } else if (typeof rawValue === 'boolean') {
      value = rawValue;
    } else if (rawValue === null || rawValue === undefined) {
      value = null;
    } else {
      value = String(rawValue).trim();
    }

    normalized[key.toLowerCase()] = value;
  });

  return normalized;
}

function normalizeResults(rows: QueryResultRow[], isOrderStrict: boolean): QueryResultRow[] {
  const normalized = rows.map((r) => normalizeRow(r));

  if (isOrderStrict) {
    return normalized;
  }

  return [...normalized].sort((a, b) => {
    const strA = JSON.stringify(a);
    const strB = JSON.stringify(b);
    return strA.localeCompare(strB);
  });
}

export function compareResults(
  userSql: string,
  expectedSql: string,
): {
  isCorrect: boolean;
  error: string | null;
  expectedData: QueryResultRow[] | null;
  userData: QueryResultRow[] | null;
} {
  const userResult = executeQuery(userSql);
  const expectedResult = executeQuery(expectedSql);

  if (userResult.error) {
    return {
      isCorrect: false,
      error: userResult.error,
      expectedData: expectedResult.data,
      userData: null,
    };
  }

  const uData = userResult.data || [];
  const eData = expectedResult.data || [];

  if (uData.length !== eData.length) {
    return {
      isCorrect: false,
      error: `Quantidade de linhas incorreta. Esperado: ${eData.length}, Seu resultado: ${uData.length}`,
      expectedData: eData,
      userData: uData,
    };
  }

  const isOrderStrict = /order\s+by/i.test(expectedSql);

  const normUser = normalizeResults(uData, isOrderStrict);
  const normExpected = normalizeResults(eData, isOrderStrict);

  for (let i = 0; i < normExpected.length; i++) {
    const userRow = normUser[i];
    const expectedRow = normExpected[i];

    if (!userRow) {
      return {
        isCorrect: false,
        error: 'As colunas não coincidem.',
        expectedData: eData,
        userData: uData,
      };
    }

    const expectedKeys = Object.keys(expectedRow);
    const userKeys = Object.keys(userRow);

    if (expectedKeys.length !== userKeys.length) {
      return {
        isCorrect: false,
        error: `Número de colunas diferente. Esperado: ${expectedKeys.length} (${expectedKeys.join(', ')}), Seu resultado: ${userKeys.length} (${userKeys.join(', ')})`,
        expectedData: eData,
        userData: uData,
      };
    }

    for (const key of expectedKeys) {
      if (!(key in userRow)) {
        return {
          isCorrect: false,
          error: `Coluna "${key}" ausente no seu resultado.`,
          expectedData: eData,
          userData: uData,
        };
      }

      if (userRow[key] !== expectedRow[key]) {
        return {
          isCorrect: false,
          error: isOrderStrict
            ? `Valores não coincidem na linha ${i + 1}. Esperado: "${expectedRow[key]}", Seu resultado: "${userRow[key]}" na coluna "${key}".`
            : `Os dados do resultado diferem do esperado. Verifique se os filtros (WHERE/JOIN) foram aplicados corretamente.`,
          expectedData: eData,
          userData: uData,
        };
      }
    }
  }

  return {
    isCorrect: true,
    error: null,
    expectedData: eData,
    userData: uData,
  };
}
