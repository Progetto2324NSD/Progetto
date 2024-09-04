import React from "react";
import { Card, CardContent, Typography } from '@mui/material';

function GraphCards({ title, para, children }) {
    return (
        <Card sx={{ 
            minWidth: 275, 
            maxWidth: 400,  // Imposta una larghezza massima per la card
            height: '100%', // Altezza al 100% del contenitore
            boxShadow: 3, 
            borderRadius: 2, 
            overflow: 'hidden'  // Nascondi contenuti che escono dai bordi
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
