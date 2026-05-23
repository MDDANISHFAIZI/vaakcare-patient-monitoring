const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'inr' },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
