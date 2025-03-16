import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.checkAuth();
        if (response.success) {
          setUser(response.user);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Authentication check failed');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="dashboard-title">Welcome {user?.firstName}!</h1>
          <button 
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid #4f6df5',
              color: '#4f6df5',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <main>
        <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ marginBottom: '15px', fontSize: '20px' }}>Dashboard Content</h2>
          <p>This is your dashboard area. Your application content will go here.</p>
        </div>
      </main>
    </div>
  );
}