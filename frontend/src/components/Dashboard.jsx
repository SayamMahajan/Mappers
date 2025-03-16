import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import '../styles/Dashboard.css';
import 'leaflet/dist/leaflet.css';

export default function Dashboard() {
  // Add mock user data
  const [user, setUser] = useState({
    firstName: 'Test User',
    // Add any other user fields your UI needs
  });
  const [loading, setLoading] = useState(false); // Set to false initially to skip loading state
  const navigate = useNavigate();

  // Comment out the authentication check for now
  /*
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
  */

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
      <Navbar userName={user?.firstName} onLogout={handleLogout} />
      <div className="dashboard-content">
        <Sidebar />
        <div className="main-content">
          <div className="content-section">
            <h2 className="section-title">India Map Dashboard</h2>
            <div className="map-container">
              <MapContainer 
                center={[20.5937, 78.9629]} // India's geographical center
                zoom={5} 
                zoomControl={false}
                style={{ height: '600px', width: '100%', borderRadius: '8px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright" />
              </MapContainer>
            </div>
          </div>
          {/* <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Map Statistics</h3>
              <p>Total States & UTs: 36</p>
              <p>Total Districts: 773</p>
              <p>Population Coverage: 1.4 billion</p>
              <div className="card-footer">
                <button className="card-btn">View Details</button>
              </div>
            </div>
            <div className="dashboard-card">
              <h3>Recent Updates</h3>
              <ul className="update-list">
                <li>New Delhi-Mumbai Expressway (1,350 km) added</li>
                <li>Updated: Ladakh UT boundaries post reorganization</li>
                <li>Added: 100+ new airports under UDAN scheme</li>
                <li>Updated: Census data for major metropolitan areas</li>
              </ul>
              <div className="card-footer">
                <button className="card-btn">All Updates</button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}