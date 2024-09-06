import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import MapComponent from '../LastWorkoutMap'; // Assicurati che il percorso sia corretto

function MapCard({ title, para, onDistanceChange }) {
  return (
    <Card sx={{ minWidth: 275, maxWidth: 840, boxShadow: 3, borderRadius: 2, height: 535 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {para}
        </Typography>
        <Box sx={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
          <MapComponent onDistanceChange={onDistanceChange} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default MapCard;
