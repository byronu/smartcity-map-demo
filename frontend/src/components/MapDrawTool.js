// src/components/MapDrawTool.js
import React, { useEffect } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const MapDrawTool = ({ map }) => {
  useEffect(() => {
    if (!map) return;
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });
    map.addControl(draw);
    return () => {
      map.removeControl(draw);
    };
  }, [map]);
  return null;
};

export default MapDrawTool;