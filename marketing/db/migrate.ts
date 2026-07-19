import path from 'node:path';
import { readFileSync } from 'node:fs';
import { db } from './index';

export function migrate(): void {
  const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
  db.exec(readFileSync(schemaPath, 'utf-8'));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  migrate();
  console.log('LifeGuard database migration complete.');
}
