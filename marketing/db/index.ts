import path from 'node:path';
import fs, { readFileSync } from 'node:fs';

/**
 * Database handle. On Vercel (or any serverless runtime where the
 * native better-sqlite3 binding can't load), we export a stub that
 * throws a clear 'NO_DB_ON_VERCEL' error from every method. The
 * routes that use the DB catch this and degrade gracefully (e.g.
 * auth falls back to a built-in demo account).
 */

const DB_PATH = path.join(process.cwd(), 'db', 'lifeguard.sqlite');

function makeStubDb() {
  const e = () => {
    throw new Error(
      'NO_DB_ON_VERCEL: better-sqlite3 is not available in this runtime. ' +
        'Local development has SQLite; serverless needs a hosted DB.',
    );
  };
  return {
    prepare: () => ({ get: e, all: e, run: e, bind: e }),
    exec: e,
    pragma: e,
    function: () => {},
    transaction: (fn: (...a: unknown[]) => unknown) => fn,
  };
}

let _db: ReturnType<typeof makeStubDb>;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require('better-sqlite3');
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    const inst = new Database(DB_PATH);
    inst.pragma('journal_mode = WAL');
    inst.pragma('foreign_keys = ON');
    const schema = readFileSync(path.join(process.cwd(), 'db', 'schema.sql'), 'utf-8');
    inst.exec(schema);
    _db = inst;
  } catch (innerErr) {
    console.warn(
      '[db] better-sqlite3 initialised but DB file path failed; using stub. Error:',
      innerErr instanceof Error ? innerErr.message : String(innerErr),
    );
    _db = makeStubDb();
  }
} catch (outerErr) {
  console.warn(
    '[db] better-sqlite3 not available in this runtime (likely Vercel serverless); using stub. Error:',
    outerErr instanceof Error ? outerErr.message : String(outerErr),
  );
  _db = makeStubDb();
}

export const db = _db as unknown as import('better-sqlite3').Database;

export function isDbAvailable(): boolean {
  try {
    // The stub's prepare() throws. The real DB's prepare() returns an object.
    (_db as { prepare: (s: string) => unknown }).prepare('SELECT 1');
    return true;
  } catch {
    return false;
  }
}