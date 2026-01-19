-- Reorder columns to place variables after html_content
CREATE TABLE templates_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK(length(name) <= 150),
  description TEXT CHECK(description IS NULL OR length(description) <= 300),
  user_id TEXT NOT NULL,
  html_content TEXT NOT NULL,
  variables TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Copy data
INSERT INTO templates_new (id, name, description, user_id, html_content, variables, created_at, updated_at)
SELECT id, name, description, user_id, html_content, variables, created_at, updated_at FROM templates;

-- Drop old table
DROP TABLE templates;

-- Rename new table
ALTER TABLE templates_new RENAME TO templates;

-- Recreate indexes
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_created_at ON templates(created_at);
