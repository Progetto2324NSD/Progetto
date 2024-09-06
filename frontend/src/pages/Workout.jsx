import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Card, CardContent, Typography, Box } from '@mui/material';
import dayjs from 'dayjs';
import Navbar from "../components/NavbarLogo";
import { showWorkout } from "../service/workoutService";
import './stile/style.css'; // Assicurati di avere un file CSS per lo stile

function Workout() {
    const [workouts, setWorkouts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const data = await showWorkout(selectedDate);
                setWorkouts(data);
            } catch (error) {
                console.error("Errore durante il recupero degli allenamenti", error);
            }
        };
        fetchWorkouts();
    }, [selectedDate]);

    return (
        <>
            <Navbar />
            <Container>
                <h2>Workout</h2><hr />
                <Row>
                    <Col md={4} xs={12}>
                        <div className="calendar-container">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    defaultValue={dayjs()}
                                    onChange={(newDate) => setSelectedDate(newDate.format('YYYY-MM-DD'))}
                                />
                            </LocalizationProvider>
                        </div>
                    </Col>
                    <Col md={8} xs={12}>
                        {workouts.length > 0 ? (
                            <Row>
                                {workouts.map((workout) => (
                                    <Col md={6} key={workout._id} className="mb-4">
                                        <Card sx={{ minWidth: 275, boxShadow: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" component="div" gutterBottom>
                                                    Tipo: {workout.type}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Distanza: {workout.distance} km
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Tempo: {workout.time} min
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Data: {new Date(workout.date).toLocaleDateString()}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Typography variant="h6" color="text.secondary">
                                Nessun allenamento trovato per la data selezionata.
                            </Typography>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Workout;
