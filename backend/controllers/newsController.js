import pool from '../config/database.js';
import { validationResult } from 'express-validator';
import { sanitizeHTML } from '../utils/sanitize.js';

// Helper function to create slug from title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Get all news with pagination and language filtering
export const getAllNews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const language = req.query.language || 'en'; // Default to English

    // Validate language
    const validLanguages = ['en', 'ru', 'uz'];
    const lang = validLanguages.includes(language) ? language : 'en';

    // Check if language column exists
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'news' AND column_name = 'language'
    `);

    const hasLanguageColumn = columnCheck.rows.length > 0;

    let result, countResult;

    if (hasLanguageColumn) {
      // Use language filtering
      result = await pool.query(
        `SELECT id, title, slug, short_description, category, language, image_url, created_at 
         FROM news 
         WHERE language = $1
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
        [lang, limit, offset]
      );

      countResult = await pool.query('SELECT COUNT(*) FROM news WHERE language = $1', [lang]);
    } else {
      // Fallback: return all news without language filtering
      console.warn('⚠️  Language column not found. Returning all news. Run migration: npm run migrate-language');
      result = await pool.query(
        `SELECT id, title, slug, short_description, category, image_url, created_at 
         FROM news 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      countResult = await pool.query('SELECT COUNT(*) FROM news');
    }

    const total = parseInt(countResult.rows[0].count);

    res.json({
      news: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      language: hasLanguageColumn ? lang : 'en',
    });
  } catch (error) {
    console.error('Error in getAllNews:', error);
    next(error);
  }
};

// Get news by slug
export const getNewsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const result = await pool.query('SELECT * FROM news WHERE slug = $1', [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Get news by category with language filtering
export const getNewsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const language = req.query.language || 'en'; // Default to English

    // Validate language
    const validLanguages = ['en', 'ru', 'uz'];
    const lang = validLanguages.includes(language) ? language : 'en';

    // Check if language column exists
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'news' AND column_name = 'language'
    `);

    const hasLanguageColumn = columnCheck.rows.length > 0;

    let result, countResult;

    if (hasLanguageColumn) {
      // Use language filtering
      result = await pool.query(
        `SELECT id, title, slug, short_description, category, language, image_url, created_at 
         FROM news 
         WHERE category = $1 AND language = $2
         ORDER BY created_at DESC 
         LIMIT $3 OFFSET $4`,
        [category, lang, limit, offset]
      );

      countResult = await pool.query(
        'SELECT COUNT(*) FROM news WHERE category = $1 AND language = $2', 
        [category, lang]
      );
    } else {
      // Fallback: return category news without language filtering
      console.warn('⚠️  Language column not found. Returning category news. Run migration: npm run migrate-language');
      result = await pool.query(
        `SELECT id, title, slug, short_description, category, image_url, created_at 
         FROM news 
         WHERE category = $1
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
        [category, limit, offset]
      );

      countResult = await pool.query(
        'SELECT COUNT(*) FROM news WHERE category = $1', 
        [category]
      );
    }

    const total = parseInt(countResult.rows[0].count);

    res.json({
      news: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      language: hasLanguageColumn ? lang : 'en',
    });
  } catch (error) {
    console.error('Error in getNewsByCategory:', error);
    next(error);
  }
};

// Create news (admin only)
export const createNews = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, short_description, content, category, language } = req.body;
    
    // Validate language
    const validLanguages = ['en', 'ru', 'uz'];
    const lang = validLanguages.includes(language) ? language : 'en';
    
    // Check if language column exists
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'news' AND column_name = 'language'
    `);

    const hasLanguageColumn = columnCheck.rows.length > 0;

    if (!hasLanguageColumn) {
      return res.status(500).json({ 
        error: 'Database migration required',
        message: 'Language column does not exist. Please run: npm run migrate-language',
        details: 'The database needs to be updated to support multi-language features.'
      });
    }
    
    // Debug: Log received data (remove in production)
    console.log('Received form data:', {
      title,
      short_description: short_description?.substring(0, 50),
      content: content ? `${content.substring(0, 50)}...` : 'EMPTY',
      contentLength: content?.length || 0,
      category,
      language: lang,
      hasFile: !!req.file,
      bodyKeys: Object.keys(req.body)
    });
    
    // Validate content is present and not just empty HTML
    if (!content || content.trim() === '' || content.trim() === '<p><br></p>' || content.trim() === '<p></p>') {
      return res.status(400).json({ error: 'Content is required and cannot be empty' });
    }
    
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const slug = createSlug(title);
    
    // SECURITY: Sanitize HTML content to prevent XSS attacks
    const sanitizedContent = sanitizeHTML(content);
    const sanitizedShortDescription = sanitizeHTML(short_description);

    // Check if slug already exists (same language)
    const existingNews = await pool.query(
      'SELECT id FROM news WHERE slug = $1 AND language = $2', 
      [slug, lang]
    );
    if (existingNews.rows.length > 0) {
      const uniqueSlug = `${slug}-${Date.now()}`;
      const result = await pool.query(
        `INSERT INTO news (title, slug, short_description, content, category, language, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [title, uniqueSlug, sanitizedShortDescription, sanitizedContent, category, lang, image_url]
      );
      return res.status(201).json(result.rows[0]);
    }

    const result = await pool.query(
      `INSERT INTO news (title, slug, short_description, content, category, language, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, slug, sanitizedShortDescription, sanitizedContent, category, lang, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Update news (admin only)
export const updateNews = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, short_description, content, category, language } = req.body;

    // Check if news exists
    const existingNews = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
    
    // Validate language if provided
    const validLanguages = ['en', 'ru', 'uz'];
    let lang = existingNews.rows[0]?.language || 'en';
    if (language && validLanguages.includes(language)) {
      lang = language;
    }

    // Debug: Log received data (remove in production)
    console.log('Update form data:', {
      id,
      title,
      short_description: short_description?.substring(0, 50),
      content: content ? `${content.substring(0, 50)}...` : 'EMPTY',
      category,
      language: lang,
      hasFile: !!req.file
    });
    if (existingNews.rows.length === 0) {
      return res.status(404).json({ error: 'News not found' });
    }

    // Validate content if provided (don't allow empty content)
    if (content !== undefined && (content.trim() === '' || content === '<p><br></p>')) {
      return res.status(400).json({ error: 'Content cannot be empty' });
    }

    // SECURITY: Sanitize HTML content to prevent XSS attacks
    const sanitizedContent = content !== undefined ? sanitizeHTML(content) : existingNews.rows[0].content;
    const sanitizedShortDescription = short_description !== undefined
      ? sanitizeHTML(short_description) 
      : existingNews.rows[0].short_description;

    let slug = existingNews.rows[0].slug;
    let image_url = existingNews.rows[0].image_url;

    // Update slug if title changed
    if (title && title !== existingNews.rows[0].title) {
      slug = createSlug(title);
      // Check if new slug exists (same language)
      const slugCheck = await pool.query(
        'SELECT id FROM news WHERE slug = $1 AND language = $2 AND id != $3', 
        [slug, lang, id]
      );
      if (slugCheck.rows.length > 0) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Update image if new file uploaded
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      `UPDATE news 
       SET title = COALESCE($1, title), 
           slug = $2, 
           short_description = COALESCE($3, short_description), 
           content = COALESCE($4, content), 
           category = COALESCE($5, category), 
           language = $6,
           image_url = COALESCE($7, image_url)
       WHERE id = $8 
       RETURNING *`,
      [title, slug, sanitizedShortDescription, sanitizedContent, category, lang, image_url, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Delete news (admin only)
export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM news WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    next(error);
  }
};
