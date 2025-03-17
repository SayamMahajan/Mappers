import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import '../../styles/auth.css';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation shortly after component mounts
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(credentials);
      if (response.success) {
        navigate('/dashboard');
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setMessage('Login failed');
    }
  };

  return (
    <div className={`animation-container ${animate ? 'animation-active' : ''}`}>
      <div className="top"></div>
      <div className="bottom"></div>
      <div className="center">
        <div className="auth-container">
          <h2 className="auth-title">Login to Mappers</h2>
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className="form-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="form-input"
              required
            />
            <button type="submit" className="auth-button">
              Login
            </button>
            {message && <p className="error-message">{message}</p>}
            
            <div className="auth-links">
              <Link to="/signup">Create Account</Link>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}