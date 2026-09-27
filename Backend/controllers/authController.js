const jwt = require('jsonwebtoken');

// POST /api/auth/login — checks the submitted password against
// ADMIN_PASS (a single shared secret, not per-user accounts — there's only
// one admin, so a full user/login system would be overkill). On success,
// issues a signed JWT the frontend stores and sends back on every admin
// request instead of the password itself.
const login = (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || password !== process.env.ADMIN_PASS) {
      const error = new Error('Incorrect password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
