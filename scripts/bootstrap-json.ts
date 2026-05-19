import fs from 'fs';
import path from 'path';
import { QUESTIONS } from '../src/data/questions';
import { DB_SCHEMA, DB_MOCK_DATA } from '../src/data/tables';

const QUESTIONS_DIR = path.resolve(process.cwd(), 'content/questions');
const TABLES_DIR = path.resolve(process.cwd(), 'content/tables');

fs.mkdirSync(QUESTIONS_DIR, { recursive: true });
fs.mkdirSync(TABLES_DIR, { recursive: true });

console.log('Bootstrapping questions...');
QUESTIONS.forEach((q) => {
  const filePath = path.join(QUESTIONS_DIR, `q${q.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(q, null, 2), 'utf-8');
  console.log(`Saved question: ${q.title} -> ${filePath}`);
});

console.log('Bootstrapping tables...');
DB_SCHEMA.forEach((schema) => {
  const mockData = DB_MOCK_DATA[schema.name] || [];
  const tableContent = {
    name: schema.name,
    columns: schema.columns,
    data: mockData,
  };
  const filePath = path.join(TABLES_DIR, `${schema.name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(tableContent, null, 2), 'utf-8');
  console.log(`Saved table: ${schema.name} -> ${filePath}`);
});

console.log('Bootstrap completed successfully! 🎉');
