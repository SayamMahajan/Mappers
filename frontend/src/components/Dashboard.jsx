import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { MapContainer, TileLayer, ZoomControl, useMap, CircleMarker, Popup } from 'react-leaflet';
import '../styles/Dashboard.css';
import 'leaflet/dist/leaflet.css';
import getDisasterData from '../data/combined_disaster_data'; // Import the disaster data function

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
  const [disasterData, setDisasterData] = useState([]); // State for disaster data
  const navigate = useNavigate();

  // Load disaster data when component mounts
  useEffect(() => {
    const loadDisasterData = async () => {
      const data = await getDisasterData();
      setDisasterData(data);
    };
    
    loadDisasterData();
  }, []);

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

  // Function to determine alert level based on disaster impact
  const getAlertLevel = (disaster) => {
    // You can customize this logic based on your specific data
    // For example, you might use deaths, affected people, or economic impact
    const deaths = parseInt(disaster.deaths) || 0;
    const displacements = parseInt(disaster.displacements) || 0;
    
    if (deaths > 1000 || displacements > 100000) {
      return 'high'; // Red alert
    } else if (deaths > 100 || displacements > 10000) {
      return 'medium'; // Yellow alert
    } else {
      return 'low'; // Green alert
    }
  };

  // Function to get marker color based on alert level
  const getMarkerColor = (disaster) => {
    const alertLevel = getAlertLevel(disaster);
    
    const colorMap = {
      'high': '#e74c3c',    // Red
      'medium': '#f39c12',  // Yellow/Orange
      'low': '#2ecc71',     // Green
    };
    
    return colorMap[alertLevel] || '#7f8c8d'; // Default color if level not found
  };

  // Function to calculate marker size based on zoom level
  const useMarkerSize = (initialSize = 4) => { // Reduced initial size
    const map = useMap();
    const [size, setSize] = useState(initialSize);
    
    useEffect(() => {
      const updateSize = () => {
        const zoom = map.getZoom();
        // Threshold zoom level at which we stop shrinking
        const thresholdZoom = 7;
        // Minimum size the marker should ever get
        const minSize = 2.5;
        
        let newSize;
        if (zoom <= thresholdZoom) {
          // For low zoom levels (zoomed out), scale down gradually
          newSize = Math.max(minSize, initialSize * (8 / Math.max(zoom, 1)));
        } else {
          // For high zoom levels (zoomed in), maintain a constant size
          newSize = minSize;
        }
        
        setSize(newSize);
      };
      
      updateSize();
      map.on('zoom', updateSize);
      
      return () => {
        map.off('zoom', updateSize);
      };
    }, [map, initialSize]);
    
    return size;
  };

  // Marker component with dynamic size based on zoom
  const DynamicSizeMarker = ({ position, color, disaster }) => {
    const size = useMarkerSize(4); // Smaller starting size (was 8)
    
    return (
      <CircleMarker 
        center={position}
        radius={size}
        fillOpacity={0.7} // Slightly reduced opacity
        stroke={true}
        weight={1.5} // Thinner border
        color={color}
        fillColor={color}
      >
        <Popup>
          <div>
            <h3>{disaster.disaster_name || disaster.disaster_type || 'Disaster Event'}</h3>
            <p><strong>Type:</strong> {disaster.disaster_type || 'Unknown'}</p>
            <p><strong>Alert Level:</strong> {getAlertLevel(disaster).toUpperCase()}</p>
            <p><strong>Date:</strong> {disaster.date || 'Unknown'}</p>
            <p><strong>Country:</strong> {disaster.country || 'Unknown'}</p>
            {disaster.deaths && <p><strong>Deaths:</strong> {disaster.deaths}</p>}
            {disaster.displacements && <p><strong>Displacements:</strong> {disaster.displacements}</p>}
          </div>
        </Popup>
      </CircleMarker>
    );
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
                
                {/* Add alert-colored markers for each disaster location */}
                {disasterData.map((disaster, index) => {
                  // Check for valid latitude and longitude
                  const lat = parseFloat(disaster.latitude);
                  const lng = parseFloat(disaster.longitude);
                  
                  if (isNaN(lat) || isNaN(lng)) return null;
                  
                  return (
                    <DynamicSizeMarker
                      key={index}
                      position={[lat, lng]}
                      color={getMarkerColor(disaster)}
                      disaster={disaster}
                    />
                  );
                })}
              </MapContainer>
              
              {/* Add alert level legend */}
              <div className="map-legend">
                <h4>Alert Legend</h4>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#e74c3c' }}></span>
                  <span>High Alert</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#f39c12' }}></span>
                  <span>Medium Alert</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#2ecc71' }}></span>
                  <span>Low Alert</span>
                </div>
              </div>
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