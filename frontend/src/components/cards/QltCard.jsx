import React from "react";
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

function QltCard({ title, para }) {
    return (
        <Card sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            minWidth: 200,
            height: 115,
            boxShadow: 3, 
            borderRadius: 2 
        }}>
            <CardContent sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%' 
            }}>

                {/* Box per il Gauge */}
                <Box 
                    sx={{ 
                        flexShrink: 0, 
                        marginRight: 0,
                    }}
                >
                    <Gauge
                        value={75}
                        cornerRadius="50%"
                        sx={(theme) => ({
                            width: 100, 
                            height: 100,
                            [`& .${gaugeClasses.valueText}`]: {
                              fontSize: 15, 
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                              fill: '#52b202',
                            },
                            [`& .${gaugeClasses.referenceArc}`]: {
                              fill: theme.palette.text.disabled,
                            },
                          })}
                        text={({ value, valueMax }) => `${value} / ${valueMax}`}
                    />
                </Box>

                {/* Box per il titolo e il paragrafo */}
                <Box sx={{ marginLeft: 2 }}>
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {para}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

export default QltCard;
