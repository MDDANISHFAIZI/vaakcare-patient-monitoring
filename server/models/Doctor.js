const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hospital: { type: String, required: true },
  specialization: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['clinic', 'online', 'offline'], default: 'offline' },
  availability: {
    monday: { start: { type: String, default: '10:00' }, end: { type: String, default: '18:00' }, isOff: { type: Boolean, default: false } },
    tuesday: { start: { type: String, default: '10:00' }, end: { type: String, default: '18:00' }, isOff: { type: Boolean, default: false } },
    wednesday: { start: { type: String, default: '10:00' }, end: { type: String, default: '18:00' }, isOff: { type: Boolean, default: false } },
    thursday: { start: { type: String, default: '10:00' }, end: { type: String, default: '18:00' }, isOff: { type: Boolean, default: false } },
    friday: { start: { type: String, default: '10:00' }, end: { type: String, default: '18:00' }, isOff: { type: Boolean, default: false } },
    saturday: { start: { type: String, default: '10:00' }, end: { type: String, default: '14:00' }, isOff: { type: Boolean, default: true } },
    sunday: { start: { type: String, default: '10:00' }, end: { type: String, default: '14:00' }, isOff: { type: Boolean, default: true } },
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
