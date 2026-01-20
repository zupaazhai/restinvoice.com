-- Clean slate migration: Drop and recreate templates table with slug required
-- This replaces the previous migration approach

-- Drop existing templates table
DROP TABLE IF EXISTS templates;

-- Create templates table with slug as required field from the start
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE CHECK(length(slug) > 0 AND length(slug) <= 100),
  name TEXT NOT NULL CHECK(length(name) <= 150),
  description TEXT CHECK(description IS NULL OR length(description) <= 300),
  user_id TEXT NOT NULL,
  html_content TEXT NOT NULL,
  variables TEXT, -- JSON content stored as TEXT
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Create indexes
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_created_at ON templates(created_at);
CREATE UNIQUE INDEX idx_templates_slug ON templates(slug);
