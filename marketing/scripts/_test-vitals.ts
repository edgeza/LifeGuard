import { db_vitals } from '../src/lib/db';

const v = db_vitals.create({
  careReceiverId: 'marlene',
  metric: 'hr',
  value: 88,
  recordedAt: Math.floor(Date.now() / 1000),
});
console.log('SUCCESS:', v);
