-- Migration number: 0001 	 2026-01-17T00:00:00.000Z
-- Description: Create api_keys table

CREATE TABLE IF NOT EXISTS api_keys (
    key TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expired_at INTEGER,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
