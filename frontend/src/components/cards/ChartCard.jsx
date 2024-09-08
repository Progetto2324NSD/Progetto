import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import '../../pages/stile/style.css';
import StatChart from '../StatChart';

const ChartCard = ({ selectedButton, data }) => {

  return (
    <Card className="chart-card">
      <CardContent>
        <div className="header">
          <Typography variant="h6" component="div">
            Visualizza Grafici
          </Typography>
        </div>
        <div className="chart-placeholder">
          <Typography variant="body2" color="text.secondary">
            <StatChart selectedButton={selectedButton} data={data} />
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
