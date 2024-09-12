import React from 'react';
import { Modal, Box, Typography, IconButton, Fade } from '@mui/material';
import 'boxicons';
import MapComponent from './MapComponent';
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
                        width: isMobile ? '90vw' : '80vw', // Adattato per dispositivi mobili e desktop
                        height: isMobile ? '70vh' : '80vh', // Adattato per dispositivi mobili e desktop
                        maxWidth: '1200px', // Limita la larghezza massima
                        maxHeight: '800px', // Limita l'altezza massima
                        bgcolor: 'background.paper',
                        borderRadius: '16px',
                        boxShadow: 24,
                        p: 2, // Ridotto padding per una migliore gestione dello spazio
                        outline: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden', // Assicura che nulla esca fuori
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
