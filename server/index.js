require('dotenv').config();
const express = require('express');
const smsRoutes = require('./routes/smsRoutes');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// ====== DYNAMIC CORS CONFIGURATION ======
const allowedOrigins = [
  "https://vaakcare-patient-monitoring.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allows requests with no origin (like mobile apps/Postman), 
    // or matching our main domain, or any Vercel preview URL (.vercel.app)
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Apply CORS to Express
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', smsRoutes);
app.use('/uploads', express.static('uploads'));

// Initialize Socket.io with the same dynamic CORS options
const io = new Server(server, {
  cors: corsOptions
});
// ========================================

// Store io in app to use in controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // A doctor will join a room based on their doctorId
  socket.on('join-doctor-room', (doctorId) => {
    socket.join(doctorId);
    console.log(`Doctor ${doctorId} joined their room`);
  });

  // Chat logic
  socket.on('join-chat', (patientId) => {
    const roomName = `chat_${patientId}`;
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room: ${roomName}`);
  });

  socket.on('send-message', async (data) => {
    try {
      // data: { patientId, doctorId, sender, text }
      const newMsg = new Message(data);
      const savedMsg = await newMsg.save();
      
      const roomName = `chat_${data.patientId}`;
      io.to(roomName).emit('receive-message', savedMsg);
      
      if (data.sender === 'Patient') {
        const notif = new Notification({
          userId: data.doctorId,
          userModel: 'Doctor',
          type: 'Message',
          content: 'You received a new message from a patient.'
        });
        await notif.save();
        io.to(data.doctorId.toString()).emit('new-notification', notif);
      } else if (data.sender === 'Doctor') {
        const notif = new Notification({
          userId: data.patientId,
          userModel: 'Patient',
          type: 'Message',
          content: 'You received a new message from your doctor.'
        });
        await notif.save();
        // Assume patient joins a room with their patientId for personal notifications
        io.to(data.patientId.toString()).emit('new-notification', notif);
      }
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('typing', (data) => {
    const roomName = `chat_${data.patientId}`;
    socket.to(roomName).emit('user-typing', data);
  });

  socket.on('stop-typing', (data) => {
    const roomName = `chat_${data.patientId}`;
    socket.to(roomName).emit('user-stop-typing', data);
  });

  socket.on('message-seen', async (data) => {
    try {
      await Message.findByIdAndUpdate(data.messageId, { status: 'Seen' });
      const roomName = `chat_${data.patientId}`;
      io.to(roomName).emit('message-status-update', { messageId: data.messageId, status: 'Seen' });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Import Routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
const messageRoutes = require('./routes/messages');
const appointmentRoutes = require('./routes/appointments');
const notificationRoutes = require('./routes/notifications');
const paymentRoutes = require('./routes/payments');
const recordRoutes = require('./routes/records');

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/records', recordRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'VaakCare API' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`\n🩺 Server running on http://localhost:${PORT}`);
});