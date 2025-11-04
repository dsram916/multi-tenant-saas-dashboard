import jwt from 'jsonwebtoken';

const generateToken = (res, userId, tenantId, role) => {
  // --- PS: JWT includes tenantId ---
  const token = jwt.sign({ userId, tenantId, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;