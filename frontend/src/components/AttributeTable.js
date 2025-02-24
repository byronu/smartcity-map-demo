// src/components/AttributeTable.js
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import ArrivalList from './ArrivalList';

const AttributeTable = ({ attributes }) => {
  const entries = Object.entries(attributes || {});
  if (entries.length === 0) {
    return <Typography variant="body2">No attributes available.</Typography>;
  }
  return (
    <Card sx={{ maxHeight: 300, overflow: 'auto' }}>
      <CardContent sx={{ p: 1 }}>
        <TableContainer component={Paper} sx={{ backgroundColor: '#e3f2fd' }}>
          <Table size="small" stickyHeader aria-label="attributes table">
            <TableBody>
              {entries.map(([key, value]) => {
                if (key === 'arrivals') {
                  return (
                    <TableRow key={key}>
                      <TableCell>
                        <Typography variant="body2" color="primary">
                          Arrivals
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <ArrivalList arrivals={value} />
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow key={key}>
                      <TableCell>
                        <Typography variant="body2" color="primary">
                          {key}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {value !== undefined ? value.toString() : 'N/A'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default AttributeTable;