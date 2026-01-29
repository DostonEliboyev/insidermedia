# Multi-Language Support Setup Guide

## Overview

The news website now supports **three languages**:
- 🇬🇧 **English** (en)
- 🇷🇺 **Russian** (ru)
- 🇺🇿 **Uzbek** (uz)

## Backend Changes

### Database Schema

**New Field Added:**
- `language` VARCHAR(10) - Stores language code (en, ru, uz)
- Default value: 'en'
- Constraint: Only allows 'en', 'ru', 'uz'

**New Indexes:**
- `idx_news_language` - For faster language filtering
- `idx_news_language_category` - Composite index for language + category queries

### API Endpoints Updated

All endpoints now support language filtering via query parameter:

**GET /api/news**
- Query param: `?language=en` (default: en)
- Returns news filtered by language

**GET /api/news/category/:category**
- Query param: `?language=ru`
- Returns category news filtered by language

**POST /api/news** (Admin)
- Body: `{ ..., "language": "uz" }`
- Creates news in specified language

**PUT /api/news/:id** (Admin)
- Body: `{ ..., "language": "ru" }`
- Updates news language

### Migration for Existing Databases

If you have an existing database, run:

```bash
cd backend
npm run migrate-language
```

Or manually:
```bash
psql -U postgres -d news_db -f database/migration_add_language.sql
```

## Frontend Changes

### Language Context

Created `LanguageContext` that provides:
- `language` - Current selected language
- `changeLanguage(lang)` - Function to change language
- `t(key)` - Translation function
- Translations stored in localStorage

### Language Switcher Component

Added `LanguageSwitcher` component in header:
- Shows flag icons (🇬🇧 🇷🇺 🇺🇿)
- Click to switch languages
- Active language highlighted in blue

### Updated Components

**Layout:**
- Language switcher in header
- Translated navigation labels
- Translated category names

**HomePage:**
- Filters news by selected language
- Translated UI elements

**CategoryPage:**
- Filters category news by language
- Translated category titles

**AdminDashboard:**
- Language selector in news form
- Can create/edit news in any language
- Shows news filtered by current language

**AdminLoginPage:**
- Translated form labels

### Translation Keys

All UI text is translatable. Key translations include:
- Navigation (home, categories, dashboard, logout)
- Categories (uzbekistan, education, finance, auto, world)
- Admin actions (create, edit, delete, save, cancel)
- Common (loading, no news, read more, etc.)

## Usage

### For Users

1. **Switch Language:**
   - Click language buttons in header (🇬🇧 🇷🇺 🇺🇿)
   - Language preference saved in browser
   - News automatically filters by selected language

2. **View News:**
   - Only see news in selected language
   - Each language has separate news articles
   - Categories filter by language too

### For Admins

1. **Create News in Different Languages:**
   - Go to Admin Dashboard
   - Click "Create New News"
   - Select language from dropdown (English, Русский, O'zbek)
   - Fill in title, description, content in that language
   - Save

2. **Edit News:**
   - Click "Edit" on any news item
   - Can change language if needed
   - Update content in selected language

3. **View News by Language:**
   - Switch language using header switcher
   - Dashboard shows only news in selected language
   - Create separate articles for each language

## Technical Details

### Language Codes
- `en` - English
- `ru` - Russian  
- `uz` - Uzbek

### Database Queries
- All news queries filter by `language` column
- Slugs are unique per language (same slug can exist in different languages)
- Indexes optimize language-based queries

### Frontend State
- Language stored in `localStorage` (persists across sessions)
- Redux thunks include language parameter
- Context provides translations to all components

## Example: Creating Multi-Language News

**Scenario:** Create same news article in 3 languages

1. **English Version:**
   - Language: English
   - Title: "New Education Policy Announced"
   - Content: [English content]

2. **Russian Version:**
   - Language: Русский
   - Title: "Объявлена новая образовательная политика"
   - Content: [Russian content]

3. **Uzbek Version:**
   - Language: O'zbek
   - Title: "Yangi ta'lim siyosati e'lon qilindi"
   - Content: [Uzbek content]

Each version is stored separately and shown based on user's language selection.

## Files Modified

### Backend
- `backend/database/schema.sql` - Added language column
- `backend/database/migration_add_language.sql` - Migration script
- `backend/controllers/newsController.js` - Language filtering
- `backend/routes/newsRoutes.js` - Language validation

### Frontend
- `frontend/src/contexts/LanguageContext.jsx` - Language provider
- `frontend/src/components/LanguageSwitcher.jsx` - Language selector
- `frontend/src/components/Layout.jsx` - Added switcher, translations
- `frontend/src/pages/HomePage.jsx` - Language filtering
- `frontend/src/pages/CategoryPage.jsx` - Language filtering
- `frontend/src/pages/AdminDashboard.jsx` - Language selection in form
- `frontend/src/pages/AdminLoginPage.jsx` - Translations
- `frontend/src/store/slices/newsSlice.js` - Language parameter in API calls
- `frontend/src/main.jsx` - Added LanguageProvider

## Testing

1. **Test Language Switching:**
   - Switch languages using header buttons
   - Verify news list updates
   - Check localStorage for language preference

2. **Test News Creation:**
   - Create news in English
   - Switch to Russian, create same news in Russian
   - Verify both appear in respective language views

3. **Test Category Filtering:**
   - Select a category
   - Switch languages
   - Verify category news filters by language

## Notes

- Language preference persists across page reloads
- Each language maintains separate news articles
- Same news can exist in multiple languages (different database records)
- Admin can create/edit news in any language
- Users only see news in their selected language
