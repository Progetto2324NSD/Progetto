import React, { useEffect, useState } from "react";

//Icone MUI
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

// Importa la funzione di servizio
import { calcolaPunteggio } from "../../service/workoutService";

function QltCard({ title }) {

    const [punteggio, setPunteggio ] = useState(0);
    const [desc, setDesc ] = useState('');

    useEffect(() => {
        const fetchPunteggio = async () => {
            try{
                
                const response = await calcolaPunteggio();

                if (response.status === 200) {
                    const { punteggio, desc } = response.data;

                    setPunteggio(punteggio);
                    setDesc(desc);
                } else {
                    console.error("Errore durante il recupero del punteggio");
                }
            }catch(error){
                console.error("Errore durante il recupero del punteggio");
            }
        };

        fetchPunteggio();

    }, []);

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

                <Box 
                    sx={{ 
                        flexShrink: 0, 
                        marginRight: 0,
                    }}
                >
                    <Gauge
                        value={punteggio}
                        cornerRadius="50%"
                        sx={(theme) => ({
                            width: 100, 
                            height: 100,
                            [`& .${gaugeClasses.valueText}`]: {
                              fontSize: 15, 
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                              fill: '#0d6efd',
                            },
                            [`& .${gaugeClasses.referenceArc}`]: {
                              fill: theme.palette.text.disabled,
                            },
                          })}
                        text={({ value, valueMax }) => `${value} / ${valueMax}`}
                    />
                </Box>

                <Box sx={{ marginLeft: 2 }}>
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {desc}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

export default QltCard;
