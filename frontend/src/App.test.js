import React, { useState } from 'react';
import { Box } from '@mui/material';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';

function App() {
  // Layer toggles
  const [showTraffic, setShowTraffic] = useState(true);
  const [showTransport, setShowTransport] = useState(true);
  const [showStops, setShowStops] = useState(true);
  
  // Selected feature for attribute table and popups
  const [selectedFeature, setSelectedFeature] = useState(null);
  
  // Basemap style state (default to Mapbox Streets)
  const [basemapStyle, setBasemapStyle] = useState('mapbox://styles/mapbox/streets-v11');
  
  // Filter state
  const [filters, setFilters] = useState({
    congestion: 'all', // 'all', 'low', 'moderate', 'high'
    occupancy: 0       // minimum occupancy (0-100)
  });

  const toggleTraffic = () => setShowTraffic(prev => !prev);
  const toggleTransport = () => setShowTransport(prev => !prev);
  const toggleStops = () => setShowStops(prev => !prev);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar 
        showTraffic={showTraffic}
        showTransport={showTransport}
        showStops={showStops}
        toggleTraffic={toggleTraffic}
        toggleTransport={toggleTransport}
        toggleStops={toggleStops}
        selectedFeature={selectedFeature}
        basemapStyle={basemapStyle}
        setBasemapStyle={setBasemapStyle}
        filters={filters}
        setFilters={setFilters}
      />
      <Box sx={{ flexGrow: 1 }}>
        <MapComponent 
          showTraffic={showTraffic}
          showTransport={showTransport}
          showStops={showStops}
          basemapStyle={basemapStyle}
          setSelectedFeature={setSelectedFeature}
          filters={filters}
        />
      </Box>
    </Box>
  );
}

export default App;