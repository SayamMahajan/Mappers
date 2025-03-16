import twilio from "twilio";
import 'dotenv/config';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOTP = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    throw new Error("Failed to send OTP via Twilio");
  }
};
