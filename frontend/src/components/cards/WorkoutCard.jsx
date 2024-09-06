import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import MapPopup from '../MapPopup';
import toast from "react-hot-toast";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { registerWorkout } from "../../service/workoutService";

function WorkoutCard({ title }) {
    const [distance, setDistance] = useState("");
    const [time, setTime] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");
    
    const [startCoords, setStartCoords] = useState(null);
    const [endCoords, setEndCoords] = useState(null);

    const [openMapPopup, setOpenMapPopup] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!distance || !time || !type || !date || !startCoords || !endCoords) {
            toast.error("Compilare tutti i campi per registrare il workout");
            return;
        }

        const workoutData = { 
            distance, 
            time, 
            type,
            date,
            startCoords,
            endCoords
        };

        try {
            const response = await registerWorkout(workoutData);

            if (response.status === 201) {
                toast.success("Workout registrato con successo!");
            }
        } catch (error) {
            toast.error("Errore durante la registrazione del workout.");
        }
    };

    const handleOpenMapPopup = () => setOpenMapPopup(true);
    const handleCloseMapPopup = () => setOpenMapPopup(false);
    
    const handleDistanceChange = (distance, startCoords, endCoords) => {
        setDistance(distance.toFixed(2)); // Imposta la distanza con due decimali
        setStartCoords(startCoords);
        setEndCoords(endCoords);
        handleCloseMapPopup();
    };

    return (
        <Card sx={{ 
            minWidth: 275, 
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

                <Box
                    component="form"
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
                        Distanza (km): {distance || 'APRI LA MAPPA QUI'}
                    </Button>

                    <input
                        type="number" 
                        className="form-control form-control-lg bg-light fs-6" 
                        placeholder="Tempo (min)"
                        name="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />

                    <Form.Select 
                        aria-label="Default select example"
                        name="type" 
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option>Tipo Allenamento</option>
                        <option value="Corsa Semplice">Corsa Semplice</option>
                        <option value="Lungo">Lungo</option>
                        <option value="Progressivo">Progressivo</option>
                        <option value="Tempo Run">Tempo Run</option>
                        <option value="Fartlek">Fartlek</option>
                        <option value="Ripetute">Ripetute</option>
                    </Form.Select>

                    <input
                        type="date" 
                        className="form-control form-control-lg bg-light fs-6" 
                        placeholder="Data"
                        name="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />

                    <button className="btn btn-lg btn-primary w-100 fs-6" onClick={submitHandler}>
                        Salva Workout
                    </button>
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
