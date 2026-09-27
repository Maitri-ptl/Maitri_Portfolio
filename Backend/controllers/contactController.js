const { validationResult } = require('express-validator');
const Message = require('../models/Message');

// POST /api/contact
// Saves a contact-form submission. Validation rules run first (see
// middleware/validateContact.js); this controller just checks whether
// they passed and, if not, returns the collected error messages.
const submitContactForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.details = errors.array().map((err) => err.msg);
      throw error;
    }

    const { name, email, message } = req.body;
    const savedMessage = await Message.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: "Thanks for reaching out — I'll get back to you soon!",
      data: savedMessage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContactForm };
