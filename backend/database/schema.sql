-- Create users table
-- SECURITY: Role is explicitly set to 'admin' only - no default allows manipulation
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- SECURITY: Constraint ensures only 'admin' role can be set
  CONSTRAINT check_role CHECK (role = 'admin')
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- Constraint ensures only valid languages (en, ru, uz)
  CONSTRAINT check_language CHECK (language IN ('en', 'ru', 'uz'))
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- Create index on language for faster filtering
CREATE INDEX IF NOT EXISTS idx_news_language ON news(language);

-- Create composite index for language and category filtering
CREATE INDEX IF NOT EXISTS idx_news_language_category ON news(language, category);
