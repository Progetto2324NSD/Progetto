import React from 'react';
import { Modal, Box, Typography, IconButton, Fade } from '@mui/material';
import 'boxicons';
import MapComponent from './MapComponent';

function MapPopup({ open, onClose, onDistanceChange }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropProps={{
                timeout: 500, // Durata dell'animazione della transizione
            }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '1000px',
                        height: '800px',
                        bgcolor: 'background.paper',
                        borderRadius: '16px',
                        boxShadow: 24,
                        p: 4,
                        outline: 'none',
                    }}
                >
                    {/* Close button */}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'grey.500',
                        }}
                    >
                        <box-icon name="x" color="grey"></box-icon>
                    </IconButton>
                    
                    {/* Title */}
                    <Typography variant="h6" component="h2" gutterBottom>
                        Calcola il tuo percorso:
                    </Typography>
        
                    {/* Map Component */}
                    <MapComponent onDistanceChange={onDistanceChange} />

                </Box>
            </Fade>
        </Modal>
    );
}

export default MapPopup;
