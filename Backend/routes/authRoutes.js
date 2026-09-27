const express = require('express');
const { login } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/login → verify admin password, issue a JWT
router.post('/login', login);

module.exports = router;
