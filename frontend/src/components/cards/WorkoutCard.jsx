import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, MenuItem, Box } from '@mui/material';
import MapPopup from '../MapPopup';

function WorkoutCard({ title }) {
    const [trainingData, setTrainingData] = useState({
        distance: '',
        time: '',
        type: '',
        date: '',
    });
    const [openMapPopup, setOpenMapPopup] = useState(false);

    const trainingTypes = [
        { value: 'easy', label: 'Easy Run' },
        { value: 'interval', label: 'Interval Run' },
        { value: 'long', label: 'Long Run' },
        { value: 'tempo', label: 'Tempo Run' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTrainingData({
            ...trainingData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(trainingData);
        // Add logic to handle form submission, such as sending to a server.
    };

    const handleOpenMapPopup = () => setOpenMapPopup(true);
    const handleCloseMapPopup = () => setOpenMapPopup(false);
    const handleDistanceChange = (distance) => {
        setTrainingData({
            ...trainingData,
            distance: distance.toFixed(2), // Set distance with two decimal places
        });
        handleCloseMapPopup();
    };

    return (
        <Card sx={{ 
            minWidth: 275, 
            maxWidth: 400, 
            height: 'auto', 
            boxShadow: 3, 
            borderRadius: 2, 
            overflow: 'hidden',
            padding: 2
        }}>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                    {title}
                </Typography>

                {/* Workout Registration Form */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        marginTop: 3,
                    }}
                >
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleOpenMapPopup}
                    >
                        Distance (km): {trainingData.distance || 'Click to set'}
                    </Button>

                    <TextField
                        label="Time (min)"
                        variant="outlined"
                        name="time"
                        value={trainingData.time}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        required
                    />

                    <TextField
                        select
                        label="Training Type"
                        variant="outlined"
                        name="type"
                        value={trainingData.type}
                        onChange={handleChange}
                        fullWidth
                        required
                    >
                        {trainingTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Date"
                        variant="outlined"
                        name="date"
                        value={trainingData.date}
                        onChange={handleChange}
                        type="date"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                    />

                    <Button type="submit" variant="contained" color="primary">
                        Save Workout
                    </Button>
                </Box>
            </CardContent>

            <MapPopup
                open={openMapPopup}
                onClose={handleCloseMapPopup}
                onDistanceChange={handleDistanceChange}
            />
        </Card>
    );
}

export default WorkoutCard;
