const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  sender: { type: String, enum: ['Doctor', 'Patient'], required: true },
  text: { type: String, required: false },
  status: { type: String, enum: ['Sent', 'Delivered', 'Seen'], default: 'Sent' },
  fileUrl: { type: String },
  fileType: { type: String },
  fileName: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
