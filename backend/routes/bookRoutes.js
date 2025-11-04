import express from 'express';
import {
  getTenantBooks,
  createTenantBook,
  updateTenantBook,
  deleteTenantBook,
} from '../controllers/bookController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected by authMiddleware

router.route('/')
  .get(authMiddleware, getTenantBooks) // Get all books
  .post(authMiddleware, createTenantBook); // Create a new book

router.route('/:id')
  .put(authMiddleware, updateTenantBook) // Update a specific book
  .delete(authMiddleware, deleteTenantBook); // Delete a specific book

export default router;