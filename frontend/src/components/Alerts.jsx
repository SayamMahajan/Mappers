import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/Alerts.css';

export default function Alerts() {
  // Add mock user data (similar to Dashboard)
  const [user, setUser] = useState({
    firstName: 'Test User',
    country: 'India',
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed');
    }
  };
  
  return (
    <div className="dashboard">
      <Navbar userName={user?.firstName} onLogout={handleLogout} toggleSidebar={toggleSidebar} />
      <div className="dashboard-content">
        <Sidebar isOpen={sidebarOpen} />
        <div className={`main-content ${!sidebarOpen ? 'expanded' : ''}`}>
          <div className="content-section">
            <h2 className="section-title">Alerts Dashboard</h2>
            <div className="alert-content">
              <h3>Welcome to Alerts</h3>
              <p>This is where you can view and manage all your alerts and notifications.</p>
              
              <div className="alert-boxes">
                <div className="alert-box high-alert">
                  <h4>High Alert</h4>
                  <div className="alert-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p>Critical issues requiring immediate attention</p>
                  <div className="alert-count">0</div>
                </div>
                
                <div className="alert-box medium-alert">
                  <h4>Medium Alert</h4>
                  <div className="alert-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p>Issues that need attention soon</p>
                  <div className="alert-count">0</div>
                </div>
                
                <div className="alert-box low-alert">
                  <h4>Low Alert</h4>
                  <div className="alert-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p>Minor issues for your awareness</p>
                  <div className="alert-count">0</div>
                </div>
              </div>
              
              <div className="alert-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p>No new alerts at the moment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
