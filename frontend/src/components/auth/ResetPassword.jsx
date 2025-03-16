import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

export default function ResetPassword() {
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [isReset, setIsReset] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.password !== passwords.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    try {
      const response = await authAPI.resetPassword(token, passwords.password);
      if (response.success) {
        setIsReset(true);
        setMessage('Password has been reset successfully');
        setTimeout(() => navigate('/'), 3000);
      } else {
        setMessage(response.message || 'Something went wrong');
      }
    } catch (error) {
      setMessage('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create New Password</h2>
      
      {!isReset ? (
        <form onSubmit={handleSubmit} className="auth-form">
          <p style={{ textAlign: 'center', marginBottom: '10px' }}>
            Enter your new password below.
          </p>
          <input
            type="password"
            placeholder="New Password"
            value={passwords.password}
            onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
            className="form-input"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            className="form-input"
            required
          />
          <button type="submit" className="auth-button">
            Reset Password
          </button>
          {message && <p className="error-message">{message}</p>}
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p className="success-message">{message}</p>
          <p>Redirecting to login page...</p>
        </div>
      )}
    </div>
  );
}