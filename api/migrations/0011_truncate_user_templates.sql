-- Migration: Truncate user templates for variable type feature
-- This script removes all user-created templates to ensure consistency with the new variable structure
-- System templates are preserved

DELETE FROM templates WHERE user_id != 'system';
