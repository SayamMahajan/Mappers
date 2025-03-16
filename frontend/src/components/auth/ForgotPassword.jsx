import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.forgotPassword(email);
      if (response.success) {
        setIsSubmitted(true);
        setMessage('Password reset link has been sent to your email');
      } else {
        setMessage(response.message || 'Something went wrong');
      }
    } catch (error) {
      setMessage('Failed to process your request. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Reset Password</h2>
      
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="auth-form">
          <p style={{ textAlign: 'center', marginBottom: '10px' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
          <button type="submit" className="auth-button">
            Send Reset Link
          </button>
          {message && <p className="error-message">{message}</p>}
          
          <div className="auth-links" style={{ justifyContent: 'center' }}>
            <Link to="/">Back to Login</Link>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p className="success-message">{message}</p>
          <Link to="/" className="auth-button" style={{ display: 'block', marginTop: '20px', textAlign: 'center' }}>
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
}