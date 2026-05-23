const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userModel: { type: String, enum: ['Doctor', 'Patient'], required: true },
  type: { type: String, enum: ['Appointment', 'Message', 'Record', 'Payment'], required: true },
  content: { type: String, required: true },
  senderName: { type: String },
  link: { type: String },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
