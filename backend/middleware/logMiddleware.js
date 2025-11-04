import morgan from 'morgan';
import morganJson from 'morgan-json';
import { v4 as uuidv4 } from 'uuid';

// 1. Define the JSON log format
const jsonFormat = morganJson({
  method: ':method',
  url: ':url',
  status: ':status',
  'content-length': ':res[content-length]',
  'response-time': ':response-time ms',
  'correlation-id': ':correlation-id', // <-- Custom token for Correlation ID
  'tenant-id': ':tenant-id',       // <-- Custom token for Tenant ID
});

// 2. Create middleware to add Correlation ID
export const correlationIdMiddleware = (req, res, next) => {
  // Use existing ID from header, or create a new one
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  next();
};

// 3. Define the custom tokens for morgan
morgan.token('correlation-id', (req) => req.correlationId);

morgan.token('tenant-id', (req) => {
  // 'req.user' is attached by our authMiddleware
  // This will be 'undefined' for public routes (like login), which is fine.
  return req.user ? req.user.tenantId.toString() : 'public';
});

// 4. Create the logger
export const logger = morgan(jsonFormat);