-- Supabase SQL migration
-- Add external_sources column to articles table

-- Add external_sources as JSONB array column
ALTER TABLE articles 
ADD COLUMN external_sources JSONB DEFAULT '[]'::jsonb;

-- Create index for performance (GIN index for JSONB)
CREATE INDEX idx_articles_external_sources ON articles USING GIN (external_sources);

-- Update comment
COMMENT ON COLUMN articles.external_sources IS 'Array of external source URLs referenced in the article';

-- Example of how the data will be stored:
-- ["https://example.com/article1", "https://example.com/article2"]

-- Note: JSONB is preferred over TEXT[] because:
-- 1. Better compatibility with JavaScript/TypeScript
-- 2. More flexible for future enhancements (e.g., adding titles, descriptions)
-- 3. Better query performance with GIN indexes