import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';

// --- PS: Middleware ensures users only access their tenant resources ---
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    const tenant = await Tenant.findById(user.tenantId);

    if (!user || !tenant) {
      return res.status(401).json({ message: 'User or Tenant not found' });
    }
    
    // Attach user and tenant to every secure request
    req.user = user;
    req.tenant = tenant;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export default authMiddleware;