-- Add expired_at column to api_keys table
ALTER TABLE api_keys ADD COLUMN expired_at INTEGER;
