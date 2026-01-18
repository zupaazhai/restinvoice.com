-- Drop the old table
DROP TABLE IF EXISTS api_keys;

-- Create the new table
CREATE TABLE api_keys (
  id TEXT PRIMARY KEY,
  ref TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
