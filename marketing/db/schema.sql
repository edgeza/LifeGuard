PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('caregiver', 'operator', 'admin')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS users_by_email ON users(email);

CREATE TABLE IF NOT EXISTS care_receivers (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  conditions TEXT,
  interests TEXT,
  timezone TEXT NOT NULL DEFAULT 'Africa/Johannesburg',
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  care_receiver_id TEXT NOT NULL REFERENCES care_receivers(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  personality TEXT NOT NULL DEFAULT 'pragmatic',
  system_prompt TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS agents_by_receiver ON agents(care_receiver_id);

CREATE TABLE IF NOT EXISTS caregiver_links (
  user_id TEXT NOT NULL REFERENCES users(id),
  care_receiver_id TEXT NOT NULL REFERENCES care_receivers(id),
  PRIMARY KEY (user_id, care_receiver_id)
);

CREATE TABLE IF NOT EXISTS medications (
  id TEXT PRIMARY KEY,
  care_receiver_id TEXT NOT NULL REFERENCES care_receivers(id),
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  schedule TEXT NOT NULL,
  start_date INTEGER,
  end_date INTEGER,
  refills_remaining INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS meds_by_receiver ON medications(care_receiver_id, active);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  care_receiver_id TEXT NOT NULL REFERENCES care_receivers(id),
  title TEXT NOT NULL,
  scheduled_for INTEGER NOT NULL,
  location TEXT,
  transport TEXT,
  state TEXT NOT NULL DEFAULT 'scheduled' CHECK (state IN ('scheduled','confirmed','completed','missed'))
);
CREATE INDEX IF NOT EXISTS appts_by_receiver ON appointments(care_receiver_id, scheduled_for);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('caregiver','care_receiver','bot')),
  sender_id TEXT,
  content TEXT NOT NULL,
  skill_calls TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS chat_by_agent ON chat_messages(agent_id, created_at DESC);

CREATE TABLE IF NOT EXISTS adherence_events (
  id TEXT PRIMARY KEY,
  medication_id TEXT NOT NULL REFERENCES medications(id),
  scheduled_for INTEGER NOT NULL,
  confirmed_at INTEGER,
  confirmation_source TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending','confirmed','missed','late'))
);
CREATE INDEX IF NOT EXISTS adherence_by_med ON adherence_events(medication_id, scheduled_for DESC);

CREATE TABLE IF NOT EXISTS escalations (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  triggered_at INTEGER NOT NULL DEFAULT (unixepoch()),
  reason TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'open' CHECK (state IN ('open','acknowledged','resolved')),
  acknowledged_by TEXT,
  resolved_at INTEGER
);
CREATE INDEX IF NOT EXISTS escalations_by_agent ON escalations(agent_id, triggered_at DESC);

CREATE TABLE IF NOT EXISTS vitals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  care_receiver_id TEXT NOT NULL REFERENCES care_receivers(id),
  metric TEXT NOT NULL,
  value REAL NOT NULL,
  recorded_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS vitals_by_receiver ON vitals(care_receiver_id, recorded_at DESC);

CREATE TABLE IF NOT EXISTS outbound_messages (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  channel TEXT NOT NULL CHECK (channel IN ('sms','voice','email')),
  to_address TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS outbound_by_agent ON outbound_messages(agent_id, sent_at DESC);

CREATE TABLE IF NOT EXISTS weekly_digests (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  week_start INTEGER NOT NULL,
  body TEXT NOT NULL,
  sent_at INTEGER NOT NULL DEFAULT (unixepoch())
);
