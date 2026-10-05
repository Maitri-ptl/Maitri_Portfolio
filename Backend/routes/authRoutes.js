const express = require('express');
const { login } = require('../controllers/authController');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

// POST /api/auth/login → verify admin password, issue a JWT
router.post('/login', login);

// GET /api/auth/verify → 200 if the Bearer token is still valid, 401 if not.
// The admin dashboard calls this on load so an expired session sends you back
// to the login screen right away, instead of failing on the first save.
router.get('/verify', requireAdmin, (req, res) => {
  res.status(200).json({ ok: true });
});

module.exports = router;
