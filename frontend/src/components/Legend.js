// src/components/Legend.js
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

const Legend = () => {
  return (
    <Card sx={{ maxWidth: 280 }}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          Legend
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#4CAF50', width: 16, height: 16, mr: 1 }} variant="rounded" />
            <Typography variant="body2">Low Congestion</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#FFC107', width: 16, height: 16, mr: 1 }} variant="rounded" />
            <Typography variant="body2">Moderate Congestion</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#F44336', width: 16, height: 16, mr: 1 }} variant="rounded" />
            <Typography variant="body2">High Congestion</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src="https://img.icons8.com/ios-filled/50/000080/bus.png" sx={{ width: 16, height: 16, mr: 1 }} />
            <Typography variant="body2">Public Transport</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src="https://img.icons8.com/ios-filled/50/ff0000/marker.png" sx={{ width: 16, height: 16, mr: 1 }} />
            <Typography variant="body2">TfL Stop Arrivals</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Legend;