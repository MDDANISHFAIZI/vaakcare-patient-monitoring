const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/authMiddleware');

// Initialize Razorpay with dummy keys if not present in env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// Create Razorpay Order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { doctorId, amount, currency = 'INR' } = req.body;
    const patientId = req.user._id;

    // Create a Payment record as pending
    const payment = new Payment({
      patientId,
      doctorId,
      amount,
      currency,
      status: 'Pending',
    });
    
    const savedPayment = await payment.save();

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency: currency,
      receipt: savedPayment._id.toString(),
    };

    const order = await razorpay.orders.create(options);

    // Update payment with razorpay order id
    savedPayment.razorpayOrderId = order.id;
    await savedPayment.save();

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, paymentId: savedPayment._id });
  } catch (err) {
    console.error('Error creating razorpay order:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Verify Payment Signature
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payment_id } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
      .update(sign.toString())
      .digest("hex");

    const payment = await Payment.findById(payment_id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    if (razorpay_signature === expectedSign) {
      // Payment is successful
      payment.status = 'Completed';
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      await payment.save();
      return res.status(200).json({ message: "Payment verified successfully", payment });
    } else {
      // Payment verification failed
      payment.status = 'Failed';
      await payment.save();
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
