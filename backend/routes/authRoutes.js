import express from 'express';
import { login, logout, signup, verifyEmail, verifyPhone, forgetPassword, resetPassword, resendVerificationToken, resendPhoneOTP, checkAuth, } from '../controllers/authController.js';
import { verifyToken } from "../middlewares/authentication.js";

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/verify-email', verifyEmail);

router.post('/verify-phone', verifyPhone);

router.post('/forget-password', forgetPassword);

router.post('/reset-password/:token', resetPassword);

router.post('/resend-email-otp', resendVerificationToken);

router.post('/resend-phone-otp', resendPhoneOTP);

router.get('/check-auth', verifyToken, checkAuth);

export default router;
