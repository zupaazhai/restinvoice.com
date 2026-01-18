-- Drop existing table
DROP TABLE IF EXISTS api_keys;

-- Recreate table without 'ref' column
CREATE TABLE api_keys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  expired_at INTEGER
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
