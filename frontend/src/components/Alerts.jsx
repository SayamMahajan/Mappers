import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/Alerts.css';
// Import the function to get disaster data
import getDisasterData from '../data/combined_disaster_data';

export default function Alerts() {
  // Add mock user data (similar to Dashboard)
  const [user, setUser] = useState({
    firstName: 'Test User',
    country: 'India',
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  // Add state for alerts data
  const [alertCounts, setAlertCounts] = useState({
    high: 0,
    medium: 0, 
    low: 0
  });
  const [alertDetails, setAlertDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const alertsPerPage = 6;

  // Process CSV data when component mounts
  useEffect(() => {
    const loadAlertData = async () => {
      try {
        setLoading(true);
        const disasterData = await getDisasterData();
        
        // Count alerts by severity
        const counts = {
          high: 0,
          medium: 0,
          low: 0
        };
        
        const formattedAlerts = disasterData.map(item => {
          // Categorize severity (defaulting unknown to low)
          if (item.severity === 'High') {
            counts.high++;
          } else if (item.severity === 'Moderate') {
            counts.medium++;
          } else if (item.severity === 'Low' || item.severity === 'Unknown') {
            counts.low++;
          }
          
          // Format date for display
          let formattedDate;
          try {
            formattedDate = new Date(item.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          } catch (e) {
            formattedDate = 'Unknown Date';
          }
          
          return {
            ...item,
            formattedDate
          };
        });
        
        setAlertCounts(counts);
        setAlertDetails(formattedAlerts);
      } catch (error) {
        console.error('Error loading disaster data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAlertData();
  }, []);

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
  
  // Pagination logic
  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = alertDetails.slice(indexOfFirstAlert, indexOfLastAlert);
  const totalPages = Math.ceil(alertDetails.length / alertsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
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
                  <div className="alert-count">{alertCounts.high}</div>
                </div>
                
                <div className="alert-box medium-alert">
                  <h4>Medium Alert</h4>
                  <div className="alert-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p>Issues that need attention soon</p>
                  <div className="alert-count">{alertCounts.medium}</div>
                </div>
                
                <div className="alert-box low-alert">
                  <h4>Low Alert</h4>
                  <div className="alert-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p>Minor issues for your awareness</p>
                  <div className="alert-count">{alertCounts.low}</div>
                </div>
              </div>
              
              {loading ? (
                <div className="alert-placeholder loading">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="spinner">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p>Loading disaster data...</p>
                </div>
              ) : alertDetails.length > 0 ? (
                <div className="disaster-details-section">
                  <h3>Disaster Alerts</h3>
                  <div className="disaster-cards">
                    {currentAlerts.map((alert, index) => (
                      <div 
                        key={index} 
                        className={`disaster-card ${
                          alert.severity === 'High' ? 'high-severity' : 
                          alert.severity === 'Moderate' ? 'medium-severity' : 'low-severity'
                        }`}
                      >
                        <div className="disaster-header">
                          <h4>{alert.title || 'Unnamed Alert'}</h4>
                          <span className="disaster-type">{alert.disaster_type || 'Other'}</span>
                        </div>
                        <div className="disaster-content">
                          <p className="disaster-date">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {alert.formattedDate}
                          </p>
                          <p className="disaster-source">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            Source: {alert.source || 'Unknown'}
                          </p>
                        </div>
                        {alert.url && (
                          <a 
                            href={alert.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="disaster-link"
                          >
                            View Details
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button 
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                      >
                        &laquo;
                      </button>
                      
                      <span className="page-info">Page {currentPage} of {totalPages}</span>
                      
                      <button 
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                      >
                        &raquo;
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="alert-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p>No new alerts at the moment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
