const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all messages for a specific patient
router.get('/:patientId', protect, async (req, res) => {
  try {
    const { patientId } = req.params;
    const messages = await Message.find({ patientId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Upload file endpoint
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      fileUrl, 
      fileName: req.file.originalname,
      fileType: req.file.mimetype 
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
