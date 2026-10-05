const mongoose = require('mongoose');
const Message = require('../models/Message');

// Admin-only endpoints for the contact-form messages saved by
// POST /api/contact. All routes are protected by requireAdmin
// (see routes/messageRoutes.js).

// Rejects malformed ids with a clean 400 instead of a Mongoose CastError 500.
const assertValidId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error('Invalid message id');
    error.statusCode = 400;
    throw error;
  }
};

// GET /api/messages → every message, newest first.
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/messages/:id → set the read flag ({ read: true | false }).
const setMessageRead = async (req, res, next) => {
  try {
    assertValidId(req.params.id);

    if (typeof req.body.read !== 'boolean') {
      const error = new Error('"read" must be true or false');
      error.statusCode = 400;
      throw error;
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: req.body.read },
      { new: true }
    );

    if (!message) {
      const error = new Error('Message not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/messages/:id
const deleteMessage = async (req, res, next) => {
  try {
    assertValidId(req.params.id);
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      const error = new Error('Message not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages, setMessageRead, deleteMessage };
