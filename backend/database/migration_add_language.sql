-- Migration: Add language support to news table
-- Run this to add language column to existing database

-- Add language column with default value 'en' (English)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'news' AND column_name = 'language'
  ) THEN
    ALTER TABLE news ADD COLUMN language VARCHAR(10) DEFAULT 'en' NOT NULL;
  END IF;
END $$;

-- Drop constraint if exists, then add it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_language'
  ) THEN
    ALTER TABLE news DROP CONSTRAINT check_language;
  END IF;
END $$;

ALTER TABLE news ADD CONSTRAINT check_language 
  CHECK (language IN ('en', 'ru', 'uz'));

-- Create index on language for faster filtering
CREATE INDEX IF NOT EXISTS idx_news_language ON news(language);

-- Create composite index for language and category filtering
CREATE INDEX IF NOT EXISTS idx_news_language_category ON news(language, category);

-- Update existing records to have default language
UPDATE news SET language = 'en' WHERE language IS NULL;
