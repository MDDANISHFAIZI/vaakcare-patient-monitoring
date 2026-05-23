const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// Create new appointment
router.post('/', protect, async (req, res) => {
  try {
    const { doctorId, date, time, type } = req.body;
    const patientId = req.user._id;

    // Check doctor availability and status
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    if (doctor.status === 'offline') {
      return res.status(400).json({ message: 'Doctor is currently offline and not accepting appointments.' });
    }

    if (type === 'In-person' && doctor.status !== 'clinic') {
      return res.status(400).json({ message: 'Doctor is not in clinic for physical appointments.' });
    }

    if (type === 'Video Consult' && doctor.status !== 'online') {
      return res.status(400).json({ message: 'Doctor is not available for online consultations right now.' });
    }

    // Optional: check exact timing against weekly schedule here
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySchedule = doctor.availability && doctor.availability[dayOfWeek];
    if (daySchedule && daySchedule.isOff) {
      return res.status(400).json({ message: 'Doctor is off on this day.' });
    }

    // Check for existing appointment
    const existing = await Appointment.findOne({ doctorId, date, time, status: { $ne: 'Cancelled' } });
    if (existing) {
      return res.status(400).json({ message: 'This time slot is already booked.' });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      type
    });

    await appointment.save();

    // Create Notification for Doctor
    const patient = await Patient.findById(patientId);
    const notification = new Notification({
      userId: doctorId,
      userModel: 'Doctor',
      type: 'Appointment',
      content: `New appointment booked by ${patient.name} for ${date} at ${time}.`
    });
    await notification.save();

    // Emit notification event via socket
    const io = req.app.get('io');
    if (io) {
      io.to(doctorId.toString()).emit('new-notification', notification);
    }

    res.status(201).json(appointment);
  } catch (err) {
    console.error('Create appointment error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get appointments for user (Patient or Doctor)
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    // Find where user is either patient or doctor
    const appointments = await Appointment.find({
      $or: [{ patientId: userId }, { doctorId: userId }]
    }).populate('doctorId', 'name specialization hospital').populate('patientId', 'name guardianPhoneNumber').sort({ date: 1, time: 1 });
    
    res.json(appointments);
  } catch (err) {
    console.error('Fetch appointments error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update appointment status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
