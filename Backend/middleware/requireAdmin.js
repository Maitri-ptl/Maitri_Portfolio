const jwt = require('jsonwebtoken');

// Protects the admin project-management routes (create/update/delete).
// Expects `Authorization: Bearer <token>` from a prior successful
// POST /api/auth/login; rejects anything missing or invalid before the
// request ever reaches a controller.
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    const error = new Error('Authentication required');
    error.statusCode = 401;
    return next(error);
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    const error = new Error('Invalid or expired session — please log in again');
    error.statusCode = 401;
    next(error);
  }
};

module.exports = requireAdmin;
