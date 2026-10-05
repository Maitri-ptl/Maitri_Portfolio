const express = require('express');
const {
  getMessages,
  setMessageRead,
  deleteMessage,
} = require('../controllers/messageController');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

// Every message route is admin-only — contact messages are private.
router.use(requireAdmin);

router.get('/', getMessages); // GET    /api/messages
router.patch('/:id', setMessageRead); // PATCH  /api/messages/:id  { read }
router.delete('/:id', deleteMessage); // DELETE /api/messages/:id

module.exports = router;
