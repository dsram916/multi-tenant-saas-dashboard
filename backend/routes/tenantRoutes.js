import express from 'express';
import { updateTenantSettings } from '../controllers/tenantController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// This route lets an admin update their *own* tenant settings
router.route('/settings').put(authMiddleware, updateTenantSettings);

export default router;