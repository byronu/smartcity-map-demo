// src/components/Sidebar.js
import React from 'react';
import { Drawer, Box, Typography, Divider, Accordion, AccordionSummary, AccordionDetails, FormControlLabel, Switch } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterPanel from './FilterPanel.js';
import Legend from './Legend';
import AttributeTable from './AttributeTable';

const Sidebar = ({
  open,
  onClose,
  showTraffic,
  showTransport,
  showStops,
  toggleTraffic,
  toggleTransport,
  toggleStops,
  selectedFeature,
  filters,
  setFilters,
}) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      disableScrollLock
    >
      <Box sx={{ width: 300, padding: 2, height: '100vh', overflow: 'hidden' }}>
        <Typography variant="h6" gutterBottom>
          Controls
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Layers</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={<Switch checked={showTraffic} onChange={toggleTraffic} color="primary" />}
              label="Traffic"
            />
            <FormControlLabel
              control={<Switch checked={showTransport} onChange={toggleTransport} color="primary" />}
              label="Transport"
            />
            <FormControlLabel
              control={<Switch checked={showStops} onChange={toggleStops} color="primary" />}
              label="Stops"
            />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Filters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FilterPanel filters={filters} setFilters={setFilters} />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Legend</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Legend />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Attributes</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AttributeTable attributes={selectedFeature} />
          </AccordionDetails>
        </Accordion>
      </Box>
    </Drawer>
  );
};

export default Sidebar;