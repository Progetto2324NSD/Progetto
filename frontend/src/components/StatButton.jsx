import React from "react";
import { Box, Card, CardContent, Typography} from '@mui/material';
import '../pages/stile/style.css';


function StatButton ({ title, icon, value, description }) {
    return (
        <div className="stat-card">
            <div className="icon">
                {icon}
            </div>
        <div>
            <Typography variant="h5">{title}</Typography>
            <Typography className="value">{value}</Typography>
            <Typography className="description">{description}</Typography>
        </div>
            <div className="line-graph"></div> 
        </div>
    );
}

export default StatButton;