import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Card, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Navbar from "../components/NavbarLogo";
import { showWorkout, deleteWorkout} from "../service/workoutService";
import './stile/style.css';

function Workout() {
    const [workouts, setWorkouts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null); // State for handling delete loading
    const [error, setError] = useState(null);

    // Fetch workouts when selectedDate changes
    useEffect(() => {
        const fetchWorkouts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await showWorkout(selectedDate);
                setWorkouts(data);
            } catch (error) {
                console.error("Errore durante il recupero degli allenamenti", error);
                setError("Errore durante il recupero degli allenamenti.");
            } finally {
                setLoading(false);
            }
        };
        fetchWorkouts();
    }, [selectedDate]);

    const handleDeleteWorkout = async (id) => {
        const confirmDelete = window.confirm("Sei sicuro di voler eliminare questo allenamento?");
        if (confirmDelete) {
            setDeleteLoading(id); // Set the id of the workout being deleted
            try {
                await deleteWorkout(id);
                setWorkouts(workouts.filter(workout => workout._id !== id)); // Update state after deleting
            } catch (error) {
                console.error("Errore durante l'eliminazione dell'allenamento", error);
                setError("Errore durante l'eliminazione dell'allenamento."); // Mostra il messaggio di errore
            } finally {
                setDeleteLoading(null); // Reset the delete loading state
            }
        }
    };

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
                        {loading ? (
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Caricamento...</span>
                            </Spinner>
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : workouts.length > 0 ? (
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
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteWorkout(workout._id)}
                                                className="m-3"
                                                disabled={deleteLoading === workout._id} // Disable if currently deleting
                                            >
                                                {deleteLoading === workout._id ? (
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    "Elimina"
                                                )}
                                            </Button>
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

