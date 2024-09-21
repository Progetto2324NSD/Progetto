import React from 'react';

//Icone MUI
import { Modal, Box, Typography, IconButton, Fade } from '@mui/material';
import 'boxicons';

// Importa il componente `MapComponent` dalla directory corrente (`./MapComponent`).
import MapComponent from './MapComponent';

//Import React
import { useMediaQuery } from 'react-responsive';

function MapPopup({ open, onClose, onDistanceChange }) {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const handleDistanceChange = (distance, startCoords, endCoords) => {
        onDistanceChange(distance, startCoords, endCoords);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: isMobile ? '90vw' : '80vw', 
                        height: isMobile ? '70vh' : '80vh',
                        maxWidth: '1200px',
                        maxHeight: '800px', 
                        bgcolor: 'background.paper',
                        borderRadius: '16px',
                        boxShadow: 24,
                        p: 2, 
                        outline: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: "grey.500",
                        }}
                    >
                        <box-icon name="x" color="grey"></box-icon>
                    </IconButton>
                    
                    <Typography variant="h6" component="h2" gutterBottom>
                        Calcola il tuo percorso:
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            overflow: 'hidden',
                        }}
                    >
                        <MapComponent onDistanceChange={handleDistanceChange} />
                    </Box>
                </Box>  
            </Fade>
        </Modal>
    );
}

export default MapPopup;
