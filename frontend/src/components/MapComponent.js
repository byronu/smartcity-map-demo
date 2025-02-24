import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactMapGL, {
  Popup,
  Source,
  Layer,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
} from 'react-map-gl';
import axios from 'axios';
import ArrivalList from './ArrivalList';
import { Paper, Typography, Box } from '@mui/material';

// Load the Mapbox token and API base URL from environment variables
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
if (!MAPBOX_TOKEN) {
  console.error("Mapbox token is not defined in the environment!");
}

// Use the API base URL from the environment variable or default to the droplet's URL.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://104.236.13.4:8000';

const trafficLayerStyle = {
  id: 'trafficLayer',
  type: 'circle',
  paint: {
    'circle-radius': 8,
    'circle-color': [
      'match',
      ['get', 'congestion_level'],
      'low', '#4CAF50',
      'moderate', '#FFC107',
      'high', '#F44336',
      '#9E9E9E',
    ],
    'circle-stroke-color': 'black',
    'circle-stroke-width': 2,
  },
};

const transportLayerStyle = {
  id: 'transportLayer',
  type: 'symbol',
  layout: {
    'icon-image': 'bus-icon',
    'icon-size': 0.7,
    'icon-allow-overlap': true,
  },
};

const stopsLayerStyle = {
  id: 'stopsLayer',
  type: 'symbol',
  layout: {
    'icon-image': 'stop-icon',
    'icon-size': 0.7,
    'icon-allow-overlap': true,
  },
};

const MapComponent = ({
  showTraffic,
  showTransport,
  showStops,
  basemapStyle,
  setSelectedFeature,
  filters,
}) => {
  const [viewport, setViewport] = useState({
    latitude: 51.5074,
    longitude: -0.1278,
    zoom: 9,
    bearing: 0,
    pitch: 0,
  });
  const [trafficData, setTrafficData] = useState(null);
  const [transportData, setTransportData] = useState(null);
  const [multiStopsData, setMultiStopsData] = useState(null);
  const [clickPopup, setClickPopup] = useState(null);
  const [hoverPopup, setHoverPopup] = useState(null);
  const mapRef = useRef();

  // Load custom icons for bus and stop markers
  const loadCustomIcons = useCallback(() => {
    const map = mapRef.current.getMap();
    map.loadImage(
      'https://img.icons8.com/ios-filled/50/000080/bus.png',
      (error, image) => {
        if (!error && !map.hasImage('bus-icon')) {
          map.addImage('bus-icon', image);
        }
      }
    );
    map.loadImage(
      'https://img.icons8.com/ios-filled/50/ff0000/marker.png',
      (error, image) => {
        if (!error && !map.hasImage('stop-icon')) {
          map.addImage('stop-icon', image);
        }
      }
    );
  }, []);

  const onMapLoad = useCallback(() => {
    loadCustomIcons();
    const map = mapRef.current.getMap();
    if (map.scrollZoom && typeof map.scrollZoom.setWheelZoomRate === 'function') {
      map.scrollZoom.enable();
      map.scrollZoom.setWheelZoomRate(1);
    }
  }, [loadCustomIcons]);

  // Re-load icons when the basemap style changes
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const handleStyleData = () => loadCustomIcons();
      map.on('styledata', handleStyleData);
      return () => map.off('styledata', handleStyleData);
    }
  }, [basemapStyle, loadCustomIcons]);

  // Data fetching functions using API_BASE_URL
  const fetchTrafficData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/traffic/`);
      let data = response.data;
      if (filters.congestion && filters.congestion !== 'all') {
        data.features = data.features.filter(
          (f) => f.properties.congestion_level === filters.congestion
        );
      }
      setTrafficData(data);
    } catch (error) {
      console.error('Error fetching traffic data:', error);
    }
  }, [filters]);

  const fetchTransportData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/transport/`);
      let data = response.data;
      if (filters.occupancy > 0) {
        data.features = data.features.filter(
          (f) => f.properties.occupancy >= filters.occupancy
        );
      }
      setTransportData(data);
    } catch (error) {
      console.error('Error fetching transport data:', error);
    }
  }, [filters]);

  const fetchMultiStopsData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/multi-live-vehicles/`);
      setMultiStopsData(response.data);
    } catch (error) {
      console.error('Error fetching TfL stops data:', error);
    }
  }, []);

console.log("API_BASE_URL:", API_BASE_URL);

  useEffect(() => {
    fetchTrafficData();
    fetchTransportData();
    fetchMultiStopsData();
    const interval = setInterval(() => {
      fetchTrafficData();
      fetchTransportData();
      fetchMultiStopsData();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchTrafficData, fetchTransportData, fetchMultiStopsData]);

  const handleFeatureClick = (feature) => {
    setClickPopup({
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
      properties: feature.properties,
    });
    setSelectedFeature(feature.properties);
  };

  const handleMapClick = useCallback((event) => {
    const feature = event.features && event.features[0];
    if (feature) {
      handleFeatureClick(feature);
    }
  }, []);

  const onMapHover = useCallback((event) => {
    const { features, point } = event;
    if (features && features.length > 0) {
      setHoverPopup({
        longitude: features[0].geometry.coordinates[0],
        latitude: features[0].geometry.coordinates[1],
        properties: features[0].properties,
        x: point.x,
        y: point.y,
      });
    } else {
      setHoverPopup(null);
    }
  }, []);

  return (
    <ReactMapGL
      ref={mapRef}
      {...viewport}
      width="100%"
      height="100vh"
      mapStyle={basemapStyle}
      interactiveLayerIds={['trafficLayer', 'transportLayer', 'stopsLayer']}
      onViewportChange={setViewport}
      onLoad={onMapLoad}
      onClick={handleMapClick}
      onHover={onMapHover}
      scrollZoom={{ speed: 5, smooth: true }}
      dragPan={true}
      dragRotate={true}
      doubleClickZoom={true}
      touchZoomRotate={true}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      <NavigationControl style={{ position: 'absolute', right: 10, top: 10 }} />
      <FullscreenControl style={{ position: 'absolute', right: 10, top: 70 }} />
      <ScaleControl style={{ position: 'absolute', right: 10, bottom: 10 }} maxWidth={100} unit="metric" />

      {showTraffic && trafficData && (
        <Source id="traffic" type="geojson" data={trafficData}>
          <Layer {...trafficLayerStyle} />
        </Source>
      )}
      {showTransport && transportData && (
        <Source id="transport" type="geojson" data={transportData}>
          <Layer {...transportLayerStyle} />
        </Source>
      )}
      {showStops && multiStopsData && (
        <Source id="stops" type="geojson" data={multiStopsData}>
          <Layer {...stopsLayerStyle} />
        </Source>
      )}

      {clickPopup && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={clickPopup.longitude}
          latitude={clickPopup.latitude}
          onClose={() => {
            setClickPopup(null);
            setSelectedFeature(null);
          }}
          autoPan={true}
          autoPanPadding={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {clickPopup.properties.stop_name ? (
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: 'secondary.main',
                color: 'white',
                maxWidth: '90vw',
                minWidth: 300,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {clickPopup.properties.stop_name}
              </Typography>
              {clickPopup.properties.arrivals && (
                <Box sx={{ color: 'black' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Arrivals:
                  </Typography>
                  <ArrivalList arrivals={clickPopup.properties.arrivals} />
                </Box>
              )}
            </Paper>
          ) : (
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: 'white',
                color: 'black',
                maxWidth: '90vw',
                minWidth: 300,
              }}
            >
              {Object.entries(clickPopup.properties).map(([key, value]) => (
                <Typography variant="body2" key={key}>
                  <strong>{key}:</strong> {value !== undefined ? value.toString() : 'N/A'}
                </Typography>
              ))}
            </Paper>
          )}
        </Popup>
      )}

      {hoverPopup && (
        <Popup
          longitude={hoverPopup.longitude}
          latitude={hoverPopup.latitude}
          offsetTop={-10}
          closeButton={false}
          closeOnClick={false}
        >
          <Box
            sx={{
              fontSize: '12px',
              bgcolor: 'primary.main',
              color: 'white',
              p: 0.5,
              borderRadius: 1,
            }}
          >
            {hoverPopup.properties.sensor_id
              ? `Sensor ${hoverPopup.properties.sensor_id}`
              : hoverPopup.properties.vehicle_id
              ? `Vehicle ${hoverPopup.properties.vehicle_id}`
              : hoverPopup.properties.stop_name
              ? `Stop ${hoverPopup.properties.stop_name}`
              : ''}
          </Box>
        </Popup>
      )}
    </ReactMapGL>
  );
};

export default MapComponent;