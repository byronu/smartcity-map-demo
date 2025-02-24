// src/components/BasemapSelector.js
import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';

const basemaps = [
  {
    key: 'custom',
    name: 'Custom MapBox',
    style: 'mapbox://styles/bman86/cm728luni000n01qqf8xrb9k2',
    icon: 'https://www.svgrepo.com/show/513321/map.svg',
  },
  {
    key: 'google',
    name: 'Google',
    style: {
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
    icon: 'https://www.svgrepo.com/show/271154/google-maps.svg',
  },
  {
    key: 'osm',
    name: 'OSM',
    style: {
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
    icon: 'https://images.seeklogo.com/logo-png/48/1/openstreetmap-logo-png_seeklogo-483936.png',
  },
];

const BasemapSelector = ({ activeBasemap, setActiveBasemap }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
      {basemaps.map((bm) => (
        <Tooltip key={bm.key} title={bm.name}>
          <IconButton
            onClick={() => setActiveBasemap(bm.key)}
            sx={{ border: activeBasemap === bm.key ? '2px solid #1976d2' : 'none' }}
          >
            <img
              src={bm.icon}
              alt={bm.name}
              style={{ width: 40, height: 40, borderRadius: '50%' }}
            />
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default BasemapSelector;