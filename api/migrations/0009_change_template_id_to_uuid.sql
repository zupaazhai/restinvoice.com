-- Create new table with UUID id
CREATE TABLE templates_new (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK(length(name) <= 150),
  description TEXT CHECK(description IS NULL OR length(description) <= 300),
  user_id TEXT NOT NULL,
  html_content TEXT NOT NULL,
  variables TEXT, -- JSON content stored as TEXT
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Copy data with generated UUIDs
-- Note: hex(randomblob(16)) generates a pseudo-random identifier.
-- For a proper UUID v4, more complex SQL or application-level migration is needed,
-- but for this migration in SQLite, we'll use a random hex string which is sufficient for uniqueness.
-- Alternatively, since we are in dev/test, we can just drop and recreate if preserving data isn't critical.
-- BUT, the user prompt implies "change id", so let's try to migrate.
-- SQLite doesn't have built-in UUID function standardly available in all environments without extensions.
-- utilizing simple concatenation to simulate a unique string roughly.
INSERT INTO templates_new (id, name, description, user_id, html_content, variables, created_at, updated_at)
SELECT
  lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || '4' || substr(hex(randomblob(2)), 2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))),
  name, description, user_id, html_content, variables, created_at, updated_at
FROM templates;

-- Drop old table
DROP TABLE templates;

-- Rename new table
ALTER TABLE templates_new RENAME TO templates;

-- Recreate indexes
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_created_at ON templates(created_at);
