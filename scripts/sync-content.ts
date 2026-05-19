import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const QuestionSchema = z.object({
  id: z.number().int().positive('O ID deve ser um número positivo'),
  title: z.string().min(1, 'O título não pode ser vazio'),
  description: z.string().min(1, 'A descrição não pode ser vazia'),
  difficulty: z.enum(['Fácil', 'Médio', 'Difícil']),
  expectedQuery: z.string().min(1, 'A consulta esperada não pode ser vazia'),
  placeholderSql: z.string().min(1, 'O placeholder SQL não pode ser vazio'),
  hints: z
    .array(z.string().min(1, 'A dica não pode ser vazia'))
    .min(1, 'Deve fornecer ao menos uma dica'),
});

const ColumnSchema = z.object({
  name: z
    .string()
    .regex(
      /^[a-z0-9_]+$/,
      'O nome da coluna deve ser minúsculo, apenas letras, números e underlines',
    ),
  type: z.string().min(1, 'O tipo da coluna é obrigatório'),
  description: z.string().min(1, 'A descrição da coluna é obrigatória'),
});

const TableSchema = z.object({
  name: z
    .string()
    .regex(
      /^[a-z0-9_]+$/,
      'O nome da tabela deve ser minúsculo, apenas letras, números e underlines',
    ),
  columns: z.array(ColumnSchema).min(1, 'A tabela deve possuir pelo menos uma coluna'),
  data: z
    .array(z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])))
    .min(1, 'A tabela deve possuir pelo menos uma linha de dados simulados'),
});

const QUESTIONS_DIR = path.resolve(process.cwd(), 'content/questions');
const TABLES_DIR = path.resolve(process.cwd(), 'content/tables');

const errors: { file: string; path: string; message: string }[] = [];

const questionFiles = fs.readdirSync(QUESTIONS_DIR).filter((f) => f.endsWith('.json'));
const questions: any[] = [];

questionFiles.forEach((file) => {
  const filePath = path.join(QUESTIONS_DIR, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    const result = QuestionSchema.safeParse(parsed);
    if (!result.success) {
      result.error.issues.forEach((err) => {
        errors.push({
          file: `content/questions/${file}`,
          path: err.path.join('.'),
          message: err.message,
        });
      });
    } else {
      questions.push(result.data);
    }
  } catch (err: any) {
    errors.push({
      file: `content/questions/${file}`,
      path: '',
      message: err?.message || 'Arquivo JSON inválido ou corrompido',
    });
  }
});

const tableFiles = fs.readdirSync(TABLES_DIR).filter((f) => f.endsWith('.json'));
const dbSchema: any[] = [];
const dbMockData: Record<string, any[]> = {};

tableFiles.forEach((file) => {
  const filePath = path.join(TABLES_DIR, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    const result = TableSchema.safeParse(parsed);
    if (!result.success) {
      result.error.issues.forEach((err) => {
        errors.push({
          file: `content/tables/${file}`,
          path: err.path.join('.'),
          message: err.message,
        });
      });
    } else {
      const data = result.data;
      dbSchema.push({
        name: data.name,
        columns: data.columns,
      });
      dbMockData[data.name] = data.data;
    }
  } catch (err: any) {
    errors.push({
      file: `content/tables/${file}`,
      path: '',
      message: err?.message || 'Arquivo JSON inválido ou corrompido',
    });
  }
});

if (errors.length > 0) {
  console.error('\n❌ Erros de validação Zod encontrados:\n');
  errors.forEach((err) => {
    console.error(`- Arquivo: \x1b[33m${err.file}\x1b[0m`);
    if (err.path) console.error(`  Caminho: \x1b[36m${err.path}\x1b[0m`);
    console.error(`  Mensagem: \x1b[31m${err.message}\x1b[0m\n`);
  });

  fs.writeFileSync(
    path.resolve(process.cwd(), 'src/data/validation-errors.ts'),
    `export const validationErrors: { file: string; path: string; message: string }[] = ${JSON.stringify(errors, null, 2)};\n`,
    'utf-8',
  );
  process.exit(1);
} else {
  fs.writeFileSync(
    path.resolve(process.cwd(), 'src/data/validation-errors.ts'),
    'export const validationErrors: { file: string; path: string; message: string }[] = [];\n',
    'utf-8',
  );

  console.log('\n🟢 Validação com Zod passou com sucesso!');

  const sortedQuestions = questions.sort((a, b) => a.id - b.id);
  const questionsContent = `export interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  expectedQuery: string;
  placeholderSql: string;
  hints: string[];
}

export const QUESTIONS: Question[] = ${JSON.stringify(sortedQuestions, null, 2)};
`;

  fs.writeFileSync(path.resolve(process.cwd(), 'src/data/questions.ts'), questionsContent, 'utf-8');
  console.log('📝 src/data/questions.ts gerado com sucesso.');

  const tablesContent = `export interface TableSchema {
  name: string;
  columns: { name: string; type: string; description: string }[];
}

export type QueryResultRow = Record<string, string | number | boolean | null>;

export const DB_SCHEMA: TableSchema[] = ${JSON.stringify(dbSchema, null, 2)};

export const DB_MOCK_DATA: Record<string, QueryResultRow[]> = ${JSON.stringify(dbMockData, null, 2)};
`;

  fs.writeFileSync(path.resolve(process.cwd(), 'src/data/tables.ts'), tablesContent, 'utf-8');
  console.log('📝 src/data/tables.ts gerado com sucesso.');
  console.log('\n🎉 Sincronização concluída com sucesso no SQL Arena!\n');
  process.exit(0);
}
