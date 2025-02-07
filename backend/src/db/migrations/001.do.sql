CREATE TABLE IF NOT EXISTS files (
  relativePath TEXT PRIMARY KEY,
  hash TEXT,
  name TEXT,
  instrument TEXT,
  status TEXT,
  lastModified INTEGER,
  lastChecked INTEGER,
  size INTEGER
);

CREATE INDEX IF NOT EXISTS files_hash ON files (hash);

CREATE TABLE IF NOT EXISTS metas (
  key TEXT PRIMARY KEY,
  value TEXT
);