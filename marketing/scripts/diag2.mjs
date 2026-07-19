import Database from 'better-sqlite3';
const db = new Database('./db/lifeguard.sqlite');
// exact same SQL as db_medications.listForCareReceiver
const rows = db.prepare(`
  SELECT m.* FROM medications m
  JOIN care_receivers cr ON cr.id = m.care_receiver_id
  WHERE m.care_receiver_id = ? AND cr.tenant_id IS NOT NULL
  ORDER BY m.active DESC, m.name
`).all('marlene');
console.log('rows:', rows.length);
console.log('first:', JSON.stringify(rows[0]));
