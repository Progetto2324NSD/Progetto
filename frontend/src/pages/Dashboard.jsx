import React, { useState } from 'react';
import Navbar from "../components/NavbarLogo";
import { Container, Row, Col } from "react-bootstrap";
import welcome from '../utils/images/welcome.png';

// Stile
import "./stile/style.css";

// Componenti
import MapCard from '../components/cards/MapCard';
import QltCard from '../components/cards/QltCard';
import Workout from '../components/cards/WorkoutCard';
import BnvCard from '../components/cards/BnvCard';
import LastWorkoutMap from '../components/LastWorkoutMap';

function Dashboard() {
    const [distance, setDistance] = useState(null);
    const [type, setType] = useState(null);
    const [time, setTime] = useState(null);
    const [date, setDate] = useState(null);

    const handleDistanceChange = (distance) => setDistance(distance);
    const handleTypeChange = (type) => setType(type);
    const handleTimeChange = (time) => setTime(time);
    const handleDateChange = (date) => setDate(date);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // I mesi sono indicizzati da 0
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <>
            <Navbar />
            <Container>
                <h2>Dashboard</h2>
                <hr />
                <Row className='row'>
                    <Col md={12} xs={12}>
                        <BnvCard para={'Siamo felici di averti con noi. Questo è solo l\'inizio di un viaggio entusiasmante verso i tuoi obiettivi!'} img={welcome} />
                    </Col>
                </Row>
                <Row className='row'>
                    <Col md={8} xs={12}>
                        <MapCard
                            onDistanceChange={handleDistanceChange}
                            onTimeChange={handleTimeChange}
                            onTypeChange={handleTypeChange}
                            onDateChange={handleDateChange}

                            title="Rivedi il tuo ultimo workout"
                            para={
                                distance && time && type && date 
                                ? ( <> <strong>Distanza:</strong> {distance} km, <strong>Tempo:</strong> {time} min, <strong>Tipo:</strong> {type} , <strong>Data:</strong> {formatDate(date)} </> )
                                : 'Caricamento delle informazioni dell\'allenamento...'
                            }
                        />

                    </Col>
                    <Col md={4} xs={12}>
                        <QltCard title="Qualità workout mensile" para="Continua così.." /><br />
                        <Workout title="Workout"/>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Dashboard;
