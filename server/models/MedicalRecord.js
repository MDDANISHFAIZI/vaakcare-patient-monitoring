const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  type: { type: String, enum: ['Consultation', 'Prescription', 'Report', 'Diagnosis'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
