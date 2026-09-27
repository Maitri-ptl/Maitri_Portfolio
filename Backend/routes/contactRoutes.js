const express = require('express');
const { submitContactForm } = require('../controllers/contactController');
const validateContact = require('../middleware/validateContact');

const router = express.Router();

// POST /api/contact → validate then save a contact message
router.post('/', validateContact, submitContactForm);

module.exports = router;
