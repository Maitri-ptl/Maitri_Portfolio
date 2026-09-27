const mongoose = require('mongoose');

// Schema for a contact-form submission. Every message that comes through
// the "Let's Build Something" form on the frontend gets saved as one of these.
const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    read: {
      // Lets you (the site owner) mark messages as read later, e.g. from
      // an admin panel you might build in the future.
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
