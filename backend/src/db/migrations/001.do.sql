CREATE TABLE IF NOT EXISTS files (
  relativePath TEXT PRIMARY KEY,
  md5 TEXT,
  name TEXT,
  instrument TEXT,
  status TEXT,
  lastModified INTEGER,
  lastChecked INTEGER,
  size INTEGER
);

CREATE INDEX IF NOT EXISTS files_md5 ON files (md5);

CREATE TABLE IF NOT EXISTS metas (
  key TEXT PRIMARY KEY,
  value TEXT
);