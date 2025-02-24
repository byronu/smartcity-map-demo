// src/App.js
import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Fab, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import BasemapSelector from './components/BasemapSelector';

// Mapping from active basemap key to actual style
const basemapStyles = {
  custom: 'mapbox://styles/bman86/cm728luni000n01qqf8xrb9k2',
  google: {
    version: 8,
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: ['http://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}'],
        tileSize: 256,
        attribution: 'Map data © Google',
      },
    },
    layers: [
      {
        id: 'simple-tiles',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  },
  osm: {
    version: 8,
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: 'simple-tiles',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  },
};

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showTransport, setShowTransport] = useState(true);
  const [showStops, setShowStops] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(null);
  // Use an active basemap key; default to "custom"
  const [activeBasemap, setActiveBasemap] = useState('custom');
  const [filters, setFilters] = useState({
    congestion: 'all',
    occupancy: 0,
  });

  const resetFilters = () => setFilters({ congestion: 'all', occupancy: 0 });
  const toggleTraffic = () => setShowTraffic((prev) => !prev);
  const toggleTransport = () => setShowTransport((prev) => !prev);
  const toggleStops = () => setShowStops((prev) => !prev);
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <AppBar
        position="static"
        sx={{ background: 'linear-gradient(45deg, #1976d2, #0d47a1)' }}
      >
        <Toolbar>
          <IconButton color="inherit" onClick={handleDrawerToggle} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SmartCity Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          height: 'calc(100vh - 64px)', // subtract AppBar height
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar: temporary Drawer */}
        <Sidebar
          open={drawerOpen}
          onClose={handleDrawerToggle}
          showTraffic={showTraffic}
          showTransport={showTransport}
          showStops={showStops}
          toggleTraffic={toggleTraffic}
          toggleTransport={toggleTransport}
          toggleStops={toggleStops}
          selectedFeature={selectedFeature}
          filters={filters}
          setFilters={setFilters}
        />

        {/* Map and Overlays */}
        <Box sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
          <MapComponent
            showTraffic={showTraffic}
            showTransport={showTransport}
            showStops={showStops}
            basemapStyle={basemapStyles[activeBasemap]}
            setSelectedFeature={setSelectedFeature}
            filters={filters}
          />
          <Fab
            size="small"
            color="secondary"
            onClick={resetFilters}
            sx={{ position: 'absolute', bottom: 16, left: 16 }}
          >
            <RefreshIcon />
          </Fab>
          {/* Basemap Selector Overlay */}
          <Box sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1 }}>
            <BasemapSelector
              activeBasemap={activeBasemap}
              setActiveBasemap={setActiveBasemap}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;