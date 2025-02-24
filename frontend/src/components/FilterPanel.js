// src/components/FilterPanel.js
import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const FilterPanel = ({ filters, setFilters }) => {
  const handleCongestionChange = (event) => {
    setFilters((prev) => ({ ...prev, congestion: event.target.value }));
  };

  return (
    <Box sx={{ p: 1 }}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="congestion-label">Congestion Level</InputLabel>
        <Select
          labelId="congestion-label"
          value={filters.congestion}
          label="Congestion Level"
          onChange={handleCongestionChange}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="moderate">Moderate</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterPanel;