import alasql from 'alasql';
import { DB_MOCK_DATA } from './questions';

let dbInitialized = false;

export function initDb() {
  if (dbInitialized) return;

  try {
    // Suppress AlaSQL console warnings if possible
    if (alasql.options) {
      alasql.options.warnings = false;
    }

    // Drop tables if they exist to avoid duplicate errors
    const tables = ['itens_pedido', 'pedidos', 'produtos', 'usuarios'];
    tables.forEach(table => {
      try {
        alasql(`DROP TABLE IF EXISTS ${table}`);
      } catch (e) {
        // Safe to ignore
      }
    });

    // Create tables and insert mock data
    Object.entries(DB_MOCK_DATA).forEach(([tableName, rows]) => {
      // Define basic tables
      alasql(`CREATE TABLE ${tableName}`);
      
      // AlaSQL allows inserting direct JS objects using the ? parameter
      alasql(`INSERT INTO ${tableName} SELECT * FROM ?`, [rows]);
    });

    dbInitialized = true;
  } catch (err) {
    console.error('Failed to initialize AlaSQL database:', err);
  }
}

export interface QueryExecutionResult {
  data: any[] | null;
  columns: string[];
  error: string | null;
}

export function executeQuery(sql: string): QueryExecutionResult {
  // Ensure DB is initialized before executing
  initDb();

  try {
    // Sanitize the query a bit
    let query = sql.trim();
    if (query.endsWith(';')) {
      query = query.slice(0, -1);
    }

    // Execute query using AlaSQL
    const result = alasql(query);

    if (!result) {
      return { data: [], columns: [], error: null };
    }

    // If it's an array of objects
    if (Array.isArray(result)) {
      if (result.length === 0) {
        return { data: [], columns: [], error: null };
      }

      // Collect all keys from the first row to determine column names
      const columns = Object.keys(result[0] || {});
      return { data: result, columns, error: null };
    }

    // Single value or other non-array response
    return { data: [result], columns: ['resultado'], error: null };
  } catch (err: any) {
    return {
      data: null,
      columns: [],
      error: err?.message || 'Erro de sintaxe no SQL',
    };
  }
}

/**
 * Normalizes a row object:
 * 1. Converts keys to lowercase
 * 2. Formats decimal numbers to prevent rounding discrepancies
 * 3. Trims strings
 */
function normalizeRow(row: any): Record<string, any> {
  if (!row || typeof row !== 'object') return row;
  
  const normalized: Record<string, any> = {};
  Object.keys(row).forEach(key => {
    let value = row[key];
    
    // Normalize decimals/numbers
    if (typeof value === 'number') {
      // Convert to fixed float to handle float precision issues in JS
      value = Math.round(value * 100) / 100;
    } else if (value === null || value === undefined) {
      value = null;
    } else {
      value = String(value).trim();
    }
    
    normalized[key.toLowerCase()] = value;
  });
  
  return normalized;
}

/**
 * Normalizes the whole dataset and optionally sorts it if query does not require sorting.
 */
function normalizeResults(rows: any[], isOrderStrict: boolean): any[] {
  const normalized = rows.map(r => normalizeRow(r));
  
  if (isOrderStrict) {
    return normalized;
  }
  
  // Sort rows deterministically if ordering is not strict
  return [...normalized].sort((a, b) => {
    const strA = JSON.stringify(a);
    const strB = JSON.stringify(b);
    return strA.localeCompare(strB);
  });
}

/**
 * Checks if the user query result matches the expected query result.
 */
export function compareResults(
  userSql: string,
  expectedSql: string
): { isCorrect: boolean; error: string | null; expectedData: any[] | null; userData: any[] | null } {
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

  // Check if expected SQL has ORDER BY
  const isOrderStrict = /order\s+by/i.test(expectedSql);

  const normUser = normalizeResults(uData, isOrderStrict);
  const normExpected = normalizeResults(eData, isOrderStrict);

  // Compare each row
  for (let i = 0; i < normExpected.length; i++) {
    const userRow = normUser[i];
    const expectedRow = normExpected[i];

    if (!userRow) {
      return { isCorrect: false, error: 'As colunas não coincidem.', expectedData: eData, userData: uData };
    }

    // Ensure all expected columns are present with same values
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

    // Check key names and values
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
        // Provide details if values don't match
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
