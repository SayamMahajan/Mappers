import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import '../styles/Dashboard.css';
import 'leaflet/dist/leaflet.css';

// Component to handle map view changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function Dashboard() {
  // Add mock user data
  const [user, setUser] = useState({
    firstName: 'Test User',
    country: 'India', // Default country for demo
    // Add any other user fields your UI needs
  });
  const [loading, setLoading] = useState(false); // Set to false initially to skip loading state
  const [mapView, setMapView] = useState('world'); // 'world' or 'country'
  const [sidebarOpen, setSidebarOpen] = useState(true); // New state for sidebar visibility
  const navigate = useNavigate();

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Map centers for different views
  const mapCenters = {
    world: [20, 0], // World view
    India: [20.5937, 78.9629], // India's center (example country)
    // Add more countries as needed
  };

  // Map zoom levels for different views
  const mapZooms = {
    world: 2,
    country: 5
  };

  // Get current map settings based on view
  const getCurrentMapSettings = () => {
    if (mapView === 'country' && user?.country && mapCenters[user.country]) {
      return {
        center: mapCenters[user.country],
        zoom: mapZooms.country
      };
    }
    return {
      center: mapCenters.world,
      zoom: mapZooms.world
    };
  };

  const { center, zoom } = getCurrentMapSettings();

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
      <Navbar userName={user?.firstName} onLogout={handleLogout} toggleSidebar={toggleSidebar} />
      <div className="dashboard-content">
        <Sidebar isOpen={sidebarOpen} />
        <div className={`main-content ${!sidebarOpen ? 'expanded' : ''}`}>
          <div className="content-section">
            <h2 className="section-title">Interactive Map Dashboard</h2>
            
            {/* Enhanced Map view selection tabs */}
            <div className={`map-view-tabs ${mapView === 'country' ? 'country-active' : ''}`}>
              <button 
                className={`view-tab ${mapView === 'world' ? 'active' : ''}`}
                onClick={() => setMapView('world')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                Overall World
              </button>
              <button 
                className={`view-tab ${mapView === 'country' ? 'active' : ''}`}
                onClick={() => setMapView('country')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Your Country
              </button>
            </div>
            
            <div className="map-container" key={mapView}>
              <MapContainer 
                center={center}
                zoom={zoom} 
                zoomControl={false}
                style={{ height: '600px', width: '100%', borderRadius: '8px' }}
              >
                <ChangeView center={center} zoom={zoom} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright" />
              </MapContainer>
            </div>
          </div>
          {/* <div className="dashboard-cards">
            // ...existing code...
          </div> */}
        </div>
      </div>
    </div>
  );
}