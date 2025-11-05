import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
// Node.js v20+ requires this to get __dirname in ES Modules (type: "module")
import { fileURLToPath } from 'url'; 
import { logger, correlationIdMiddleware } from './middleware/logMiddleware.js';
import { apiLimiter, authLimiter } from './middleware/rateLimitMiddleware.js';
import connectDB from './config/db.js'; 

dotenv.config();
connectDB(); 

const app = express();
// --- FIX: Tell Express to trust the proxy headers for accurate IP identification (CRITICAL for Render) ---
app.set('trust proxy', 1); 

const PORT = process.env.PORT || 5001; 

// --- Define __dirname for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Dynamic CORS Origin for Production ---
const allowedOrigins = [
    'http://localhost:5173', // Local Dev
    // Note: You must replace the below with your actual deployed Vercel and Render domains
    'https://[your-render-api-domain].onrender.com', 
    'https://[your-vercel-domain].vercel.app', 
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or local requests)
    if (!origin) return callback(null, true);
    // Allow requests from the defined list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Rate Limiting and Logging
// NOTE: Rate limiters are now stable because 'trust proxy' is set above.
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

// --- STATIC FILE SERVING (CRITICAL for images) ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Assuming connectDB is imported correctly
import connectDB from './config/db.js';