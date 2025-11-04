import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
// Node.js v20+ requires this to get __dirname in ES Modules (type: "module")
import { fileURLToPath } from 'url'; 
import { logger, correlationIdMiddleware } from './middleware/logMiddleware.js';
import { apiLimiter, authLimiter } from './middleware/rateLimitMiddleware.js';

// Import all routes
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import tenantRoutes from './routes/tenantRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'; 

dotenv.config();
connectDB(); // Assuming connectDB is imported correctly

const app = express();
const PORT = process.env.PORT || 5001;

// --- FIX: Define __dirname for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // __dirname is now the backend directory

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Rate Limiting and Logging
app.use(apiLimiter);
app.use(correlationIdMiddleware);
app.use(logger);

// Body & Cookie Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- API ROUTES ---
app.use('/api/auth', authLimiter, authRoutes); 
app.use('/api/books', bookRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/upload', uploadRoutes);

// --- CRITICAL FIX: STATIC FILE SERVING ---
// We use the new, reliable __dirname variable which points to the 'backend' folder.
// This guarantees the path 'bookstore-saas/backend/uploads' is found.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Assuming connectDB is imported correctly
import connectDB from './config/db.js';