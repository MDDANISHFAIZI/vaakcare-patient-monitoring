const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { protect } = require('../middleware/authMiddleware');

// Get all records for a patient
router.get('/:patientId', protect, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create new record
router.post('/', protect, async (req, res) => {
  try {
    const newRecord = new MedicalRecord(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
