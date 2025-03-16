import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

export default function VerifyEmail() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.verifyEmail(otp);
      setMessage(response.message);
      if (response.success) {
        setIsVerified(true);
      }
    } catch (error) {
      setMessage('Verification failed');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Verify Your Email</h2>
      
      {!isVerified ? (
        <form onSubmit={handleVerify} className="auth-form">
          <p style={{ textAlign: 'center', marginBottom: '10px' }}>
            We've sent a verification code to your email address. Please enter it below.
          </p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-input"
            style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '20px' }}
            required
          />
          <button type="submit" className="auth-button">Verify Email</button>
          {message && <p className="error-message">{message}</p>}
          
          <div className="auth-links" style={{ justifyContent: 'center' }}>
            <Link to="/">Back to Login</Link>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p className="success-message">Your email has been verified successfully!</p>
          <Link to="/" className="auth-button" style={{ display: 'block', marginTop: '20px', textAlign: 'center' }}>
            Proceed to Login
          </Link>
        </div>
      )}
    </div>
  );
}