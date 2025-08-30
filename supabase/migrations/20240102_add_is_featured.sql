-- Supabase SQL migration
-- Add is_featured column to articles table

ALTER TABLE articles 
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;

-- Create index for performance
CREATE INDEX idx_articles_is_featured ON articles(is_featured);

-- Update comment
COMMENT ON COLUMN articles.is_featured IS 'Whether this article should be featured on the homepage';

-- Add RLS policy update (if needed)
-- This assumes existing RLS policies will handle the new column
