const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  time: { type: String, required: true }, // Format HH:MM
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  type: { type: String, enum: ['In-person', 'Video Consult'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
