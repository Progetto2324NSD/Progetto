import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Alert, Modal } from "react-bootstrap";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Navbar from "../components/NavbarLogo";
import { deleteWorkout, showWorkout } from "../service/workoutService";
import './stile/style.css';
import toast, { Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import BnvCard from '../components/cards/BnvCard';
import run from '../utils/images/run.png';
import CardMemo from '../components/cards/CardMemo';
import workoutImage from '../utils/images/cardWorkImg.jpg';

function Workout() {
    const [workouts, setWorkouts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

    const handleDelete = async () => {
        if (!selectedWorkoutId) return;
        
        const loadingToast = toast.loading("Eliminazione in corso...");

        try {
            await deleteWorkout(selectedWorkoutId);
            setWorkouts(workouts.filter(workout => workout._id !== selectedWorkoutId));
            toast.success('Workout eliminato con successo!');
        } catch (error) {
            toast.error("Errore durante l'eliminazione del workout.");
        } finally {
            toast.dismiss(loadingToast);
            setShowModal(false);
        }
    };

    const handleShowModal = (id) => {
        setSelectedWorkoutId(id);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const fetchWorkouts = async () => {
            if (!selectedDate) return;

            const loadingToast = toast.loading("Caricamento degli allenamenti...");

            try {
                const data = await showWorkout(selectedDate);
                setTimeout(() => {
                    setWorkouts(data);
                    toast.dismiss(loadingToast);
                }, 1000);
            } catch (error) {
                toast.error("Errore durante il recupero degli allenamenti.");
                toast.dismiss(loadingToast);
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
                    <Col md={8} xs={12}>
                        <BnvCard para={'Seleziona una data per visualizzare e/o eliminare un workout!'} img={run} />
                    </Col>
                    <Col md={4} xs={12}>
                        <CardMemo />
                    </Col>
                </Row>
                <Row>
                    <Col md={4} xs={12}>
                        <div className="calendar-container spaced-card">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    value={selectedDate ? dayjs(selectedDate) : null}
                                    onChange={(newDate) => setSelectedDate(newDate ? newDate.format('YYYY-MM-DD') : null)}
                                />
                            </LocalizationProvider>
                        </div>
                    </Col>
                    <Col md={8} xs={12}>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {selectedDate && workouts.length > 0 ? (
                            <Row>
                                {workouts.map((workout, index) => (
                                    <Col md={6} key={workout._id} className="mb-4">
                                        <Card sx={{ 
                                            minWidth: 275, 
                                            boxShadow: 3, 
                                            borderRadius: 2, 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center'
                                        }}>
                                            <CardContent>
                                                <Row>
                                                    <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                                        Allenamento #{index + 1}
                                                    </Typography>
                                                    <Col>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                                            Tipo: {workout.type}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                                            Distanza: {workout.distance} km
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                                            Tempo: {workout.time} min
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                                            Data: {new Date(workout.date).toLocaleDateString()}
                                                        </Typography>
                                                    </Col>
                                                    <Col>
                                                        <img src={workoutImage} alt="Workout" style={{ width: '100px', height: 'auto', alignItems: 'center' }} />
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                            <Box sx={{ mb: 2 }}>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleShowModal(workout._id)}
                                                >
                                                    Elimina
                                                </Button>
                                            </Box>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            selectedDate ? (
                                <Typography variant="h6" color="text.secondary">
                                    Nessun allenamento trovato per la data selezionata.
                                </Typography>
                            ) : (
                                <Typography variant="h6" color="text.secondary">
                                    Seleziona una data per visualizzare gli allenamenti.
                                </Typography>
                            )
                        )}
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Conferma Eliminazione</Modal.Title>
                </Modal.Header>
                <Modal.Body>Sei sicuro di voler eliminare questo allenamento?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annulla
                    </Button>
                    <Button variant="primary" onClick={handleDelete}>
                        Elimina
                    </Button>
                </Modal.Footer>
            </Modal>

            <Toaster />
        </>
    );
}

export default Workout;
