import dotenv from 'dotenv';
dotenv.config();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123!';

export const authenticateAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'] || req.headers['authorization'];

  if (!adminKey) {
    return res.status(401).json({
      success: false,
      error: 'Admin authorization header required.'
    });
  }

  // Support both raw password header "x-admin-key" or "Bearer <ADMIN_PASSWORD>"
  const token = adminKey.startsWith('Bearer ') ? adminKey.slice(7).trim() : adminKey.trim();

  if (token !== ADMIN_PASSWORD) {
    return res.status(403).json({
      success: false,
      error: 'Invalid admin credentials.'
    });
  }

  req.isAdmin = true;
  next();
};
