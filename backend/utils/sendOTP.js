import axios from "axios";
import 'dotenv/config';

export const sendOTP = async (phoneNumber, otp) => {
  const apiKey = process.env.FAST2SMS_API_KEY;

  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",
        variables_values: otp,
        numbers: phoneNumber,
      },
      {
        headers: {
          authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw new Error("Failed to send OTP");
  }
};
