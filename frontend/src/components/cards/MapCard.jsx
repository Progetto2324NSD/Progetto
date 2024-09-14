import React from 'react';

//Icone MUI
import { Card, CardContent, Typography, Box } from '@mui/material';

// Importa il componente `LastWorkoutMap` dalla directory corrente (`./LastWorkoutMap`).
import LastWorkoutMap from '../LastWorkoutMap'; 

function MapCard({ title, para, onDistanceChange, onTypeChange, onDateChange, onTimeChange }) {
  return (
    <Card className="spaced-card" sx={{ minWidth: 275, maxWidth: 840, boxShadow: 3, borderRadius: 2, height: 535 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {para}
        </Typography>
        <Box sx={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
          <LastWorkoutMap 
            onDistanceChange={onDistanceChange} 
            onTimeChange={onTimeChange}
            onTypeChange={onTypeChange}
            onDateChange={onDateChange}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default MapCard;
