-- Drop table
DROP TABLE IF EXISTS api_keys;

-- Recreate table with auto-inc ID and public Ref
CREATE TABLE api_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  expired_at INTEGER
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_ref ON api_keys(ref);
