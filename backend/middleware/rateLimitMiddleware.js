import rateLimit from 'express-rate-limit';

// --- ADD THIS HELPER FUNCTION ---
// Render requires you to trust proxy headers
const renderKeyGenerator = (req) => {
    // This safely extracts the client IP when running behind a proxy like Render
    return req.ip; 
};

// 1. General API Limit (e.g., 100 requests per 15 minutes)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: JSON.stringify({
    message: 'Too many requests, please try again after 15 minutes.',
  }),
  statusCode: 429,
  headers: true,
  // --- ADD THIS ---
  keyGenerator: renderKeyGenerator,
  trustProxy: 1, 
});

// 2. Auth/Login Specific Limit (e.g., 5 requests per 5 minutes to prevent brute force)
export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: JSON.stringify({
    message: 'Too many login attempts. Please try again in 5 minutes.',
  }),
  statusCode: 429,
  headers: true,
  // --- ADD THIS ---
  keyGenerator: renderKeyGenerator,
  trustProxy: 1, 
});