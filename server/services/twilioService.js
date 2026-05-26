require("dotenv").config();

const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// REUSABLE SMS FUNCTION
const sendSMS = async (to, message) => {
  try {

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log("\n========== SMS SENT ==========");
    console.log("TO:", to);
    console.log("MESSAGE:", message);
    console.log("SID:", response.sid);
    console.log("STATUS:", response.status);
    console.log("==============================\n");

    return {
      success: true,
      sid: response.sid,
      status: response.status,
    };

  } catch (error) {

    console.log("\n========== TWILIO ERROR ==========");
    console.log(error.message);
    console.log("==================================\n");

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { sendSMS };