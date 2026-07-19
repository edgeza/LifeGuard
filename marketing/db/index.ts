import Database from 'better-sqlite3';
import path from 'node:path';
import fs, { readFileSync } from 'node:fs';

const DB_PATH = path.join(process.cwd(), 'db', 'lifeguard.sqlite');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Auto-migrate on import so every server entry point sees a usable schema.
const schema = readFileSync(path.join(process.cwd(), 'db', 'schema.sql'), 'utf-8');
db.exec(schema);
