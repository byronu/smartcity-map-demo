// src/components/ArrivalList.js
import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const ArrivalList = ({ arrivals }) => {
  console.log('ArrivalList received:', arrivals); // Debug: Check what is being passed

  // If arrivals is not an array (unlikely given your API), attempt to parse it.
  let parsedArrivals = arrivals;
  if (!Array.isArray(arrivals)) {
    try {
      parsedArrivals = JSON.parse(arrivals);
    } catch (error) {
      console.error('Error parsing arrivals:', error);
      return <Typography variant="body2">Invalid arrivals data.</Typography>;
    }
  }

  if (!parsedArrivals || parsedArrivals.length === 0) {
    return <Typography variant="body2">No arrivals available.</Typography>;
  }

  return (
    <Box>
      {parsedArrivals.map((arrival, index) => (
        <Box
          key={index}
          sx={{
            mb: 2,
            p: 1,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            backgroundColor: '#f9f9f9',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Arrival {index + 1}
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="body2">
            <strong>Vehicle:</strong> {arrival.vehicleId || 'N/A'}
          </Typography>
          <Typography variant="body2">
            <strong>Line:</strong> {arrival.lineName || 'N/A'}
          </Typography>
          <Typography variant="body2">
            <strong>Platform:</strong> {arrival.platformName || 'N/A'}
          </Typography>
          <Typography variant="body2">
            <strong>Direction:</strong> {arrival.direction || 'N/A'}
          </Typography>
          <Typography variant="body2">
            <strong>Expected Arrival:</strong>{' '}
            {arrival.expectedArrival
              ? new Date(arrival.expectedArrival).toLocaleTimeString()
              : 'N/A'}
          </Typography>
          <Typography variant="body2">
            <strong>Time to Station:</strong>{' '}
            {arrival.timeToStation != null ? `${arrival.timeToStation} sec` : 'N/A'}
          </Typography>
          <Typography variant="body2">
            <strong>Destination:</strong> {arrival.destinationName || 'N/A'}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ArrivalList;