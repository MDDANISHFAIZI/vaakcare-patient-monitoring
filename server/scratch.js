const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vaakcare').then(async () => {
  console.log('Connected to MongoDB.');

  // Test Doctor ID generator
  const generateDoctorId = async () => {
    let doctorId;
    let exists = true;
    while (exists) {
      doctorId = 'DOC' + Math.floor(1000 + Math.random() * 9000);
      const existingDoc = await Doctor.findOne({ doctorId });
      if (!existingDoc) {
        exists = false;
      }
    }
    return doctorId;
  };

  const doctorId = await generateDoctorId();
  console.log('Generated Doctor ID:', doctorId);

  // Password hashing
  const rawPassword = 'testpassword123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(rawPassword, salt);

  // Save Doctor to DB
  const docData = {
    doctorId,
    name: 'Dr. Automated Test',
    hospital: 'Test Hospital',
    specialization: 'Testing Specialist',
    password: hashedPassword
  };

  const createdDoc = await Doctor.create(docData);
  console.log('Created Doctor in DB:', createdDoc.doctorId, createdDoc.name);

  // Verify finding doctor and password matching
  const foundDoc = await Doctor.findOne({ doctorId });
  const isMatch = await bcrypt.compare(rawPassword, foundDoc.password);
  console.log('Verify password match:', isMatch);

  // Clean up
  await Doctor.deleteOne({ doctorId });
  console.log('Cleaned up test doctor.');

  process.exit(0);
}).catch(console.error);
