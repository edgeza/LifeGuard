import Database from 'better-sqlite3';
const db = new Database('./db/lifeguard.sqlite');
const q1 = db.prepare('SELECT m.* FROM medications m JOIN care_receivers cr ON cr.id = m.care_receiver_id WHERE m.care_receiver_id = ? AND cr.tenant_id IS NOT NULL');
console.log('q1 marlene meds:', q1.all('marlene').length);
const q2 = db.prepare('SELECT m.* FROM medications m WHERE m.care_receiver_id = ?');
console.log('q2 marlene meds:', q2.all('marlene').length);
const crs = db.prepare('SELECT * FROM care_receivers').all();
console.log('all care_receivers:', JSON.stringify(crs));
