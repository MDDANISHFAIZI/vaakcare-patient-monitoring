const express = require("express");

const router = express.Router();

const { sendSMS } = require("../services/twilioService");

// SEND SMS
router.post("/send-sms", async (req, res) => {
  try {
    const { to, message } = req.body;

    // VALIDATION
    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: "Phone number and message are required",
      });
    }

    // PHONE FORMAT VALIDATION
    const phoneRegex = /^\+[1-9]\d{7,14}$/;

    if (!phoneRegex.test(to)) {
      return res.status(400).json({
        success: false,
        error: "Invalid phone number format",
      });
    }

    // SEND SMS
    const result = await sendSMS(to, message);

    res.json(result);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;