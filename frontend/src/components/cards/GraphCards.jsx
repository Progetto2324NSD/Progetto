import React from "react";
import { Card, CardContent, Typography } from '@mui/material';

function GraphCards({ title, para, children }) {
    return (
        <Card sx={{ 
            minWidth: 275, 
            height: '100%', 
            boxShadow: 3, 
            borderRadius: 2, 
            overflow: 'hidden' 
        }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                    {para}
                </Typography>
                <div>
                    {children}
                </div>
            </CardContent>
        </Card>
    );
}

export default GraphCards;
