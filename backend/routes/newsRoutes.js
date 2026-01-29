import express from 'express';
import { body } from 'express-validator';
import {
  getAllNews,
  getNewsBySlug,
  getNewsByCategory,
  createNews,
  updateNews,
  deleteNews,
} from '../controllers/newsController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Validation rules for create
const createNewsValidation = [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('short_description').notEmpty().trim().withMessage('Short description is required'),
  body('content').notEmpty().trim().withMessage('Content is required'),
  body('category').notEmpty().trim().withMessage('Category is required'),
  body('language').optional().isIn(['en', 'ru', 'uz']).withMessage('Language must be en, ru, or uz'),
];

// Validation rules for update (all fields optional, but if provided must be valid)
const updateNewsValidation = [
  body('title').optional().notEmpty().trim().withMessage('Title cannot be empty'),
  body('short_description').optional().notEmpty().trim().withMessage('Short description cannot be empty'),
  body('content').optional().notEmpty().trim().withMessage('Content cannot be empty'),
  body('category').optional().notEmpty().trim().withMessage('Category cannot be empty'),
  body('language').optional().isIn(['en', 'ru', 'uz']).withMessage('Language must be en, ru, or uz'),
];

// Public routes
router.get('/', getAllNews);
router.get('/:slug', getNewsBySlug);
router.get('/category/:category', getNewsByCategory);

// Protected admin routes
// Note: multer must come before validation to parse multipart/form-data
router.post('/', authenticateToken, requireAdmin, upload.single('image'), createNewsValidation, createNews);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), updateNewsValidation, updateNews);
router.delete('/:id', authenticateToken, requireAdmin, deleteNews);

export default router;
