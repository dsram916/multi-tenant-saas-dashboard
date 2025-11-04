import express from 'express';
import { getStorefrontBySlug, getAllStores } from '../controllers/publicController.js'; // 1. Import new function

const router = express.Router();

router.route('/store/:slug').get(getStorefrontBySlug);
router.route('/stores').get(getAllStores); // <-- 2. ADD THIS NEW ROUTE

export default router;