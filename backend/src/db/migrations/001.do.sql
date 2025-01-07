CREATE TABLE IF NOT EXISTS files (
  md5 TEXT PRIMARY KEY,
  relativePath TEXT,
  name TEXT,
  instrument TEXT,
  status TEXT,
  lastModified INTEGER,
  size INTEGER
);

CREATE TABLE IF NOT EXISTS metas (
  key TEXT PRIMARY KEY,
  value TEXT
);