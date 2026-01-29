# Quick Fix: Language Column Error

## Error Message
```
column "language" does not exist
```

## Problem
Your database doesn't have the `language` column yet. This happens when:
- Database was created before multi-language feature was added
- Migration hasn't been run yet

## Solution

### Option 1: Run Migration Script (Recommended)

**Windows (PowerShell):**
```powershell
cd backend
node scripts/migrate-language.js
```

**Windows (Command Prompt):**
```cmd
cd backend
node scripts\migrate-language.js
```

**Mac/Linux:**
```bash
cd backend
node scripts/migrate-language.js
```

### Option 2: Manual SQL Migration

Connect to your database and run:

```sql
-- Add language column
ALTER TABLE news ADD COLUMN language VARCHAR(10) DEFAULT 'en' NOT NULL;

-- Add constraint
ALTER TABLE news ADD CONSTRAINT check_language 
  CHECK (language IN ('en', 'ru', 'uz'));

-- Create indexes
CREATE INDEX idx_news_language ON news(language);
CREATE INDEX idx_news_language_category ON news(language, category);

-- Update existing records
UPDATE news SET language = 'en';
```

### Option 3: Recreate Database (If you don't have important data)

```bash
cd backend
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS news_db;"
psql -U postgres -c "CREATE DATABASE news_db;"

# Run setup (includes language column)
npm run setup-db
```

## Verify Fix

After running migration, verify it worked:

```sql
-- Check if column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'news' AND column_name = 'language';
```

You should see:
```
column_name | data_type | column_default
language    | varchar   | 'en'::character varying
```

## After Migration

1. Restart your backend server
2. Refresh your frontend
3. Try creating news again - it should work!

## Still Having Issues?

1. Check backend logs for detailed error messages
2. Verify database connection: `npm run check-env`
3. Make sure you're connected to the correct database
