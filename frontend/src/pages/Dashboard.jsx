import React from 'react';
import Navbar from "../components/NavbarLogo";
import { Container, Row, Col } from "react-bootstrap";

import GraphCards from '../components/cards/GraphCards';
import { PieChart } from '@mui/x-charts/PieChart';
import "./stile/style.css";
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

//Componenti
import MapComponent from '../components/cards/MapCard';
import QltCard from '../components/cards/QltCard';
import Workout from '../components/cards/WorkoutCard';

function Dashboard() {
    const data = [
        { name: 'Category 1', value: 40 },
        { name: 'Category 2', value: 30 },
        { name: 'Category 3', value: 20 },
        { name: 'Category 4', value: 10 },
    ];

    return (
        <>
            <Navbar />
            <Container>
            <h2>Dashboard</h2>
            <hr />
                <Row className='row'>
                    <Col md={8} xs={12}>
                        <MapComponent title="Rivedi il tuo ultimo wokout" para="Qui puoi rivedere il tuo ultimo percorso di allenamento" />
                    </Col>
                    <Col md={4} xs={12}>
                        <QltCard title="Qualità workout" para="Continua così.." /><br></br>
                        <Workout title="Workout"/>
                    </Col>
                </Row>

                <Row>
                    <Col md={4} xs={12}>
                        {/* Categorie di Allenamento*/}
                        <GraphCards title="Card 1" para="Testo Card 1">
                        <PieChart
                            series={[
                                {
                                data: [
                                    { id: 0, value: 10, label: 'series A' },
                                    { id: 1, value: 15, label: 'series B' },
                                    { id: 2, value: 20, label: 'series C' },
                                ],
                                innerRadius: 30,
                                outerRadius: 100,
                                paddingAngle: 5,
                                cornerRadius: 5,
                                startAngle: -90,
                                endAngle: 180,
                                },
                            ]}
                            width={400}
                            height={250}
                        />
                        </GraphCards>
                    </Col>
                    <Col md={4} xs={12}>
                        <GraphCards title="Card 2" para="Para card 2">
                        <BarChart
                            xAxis={[{ scaleType: 'band', data: ['group A', 'group B'] }]}
                            series={[{ data: [4, 3] }, { data: [1, 6] }, { data: [1, 6] }]}
                            width={400}
                            height={250}
                        />
                        </GraphCards>
                    </Col>
                    <Col md={4} xs={12}>
                        <GraphCards title="Graph Card 3">
                        <LineChart
                            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                            series={[
                                {
                                data: [2, 5.5, 2, 8.5, 1.5, 5],
                                },
                            ]}
                            width={400}
                            height={250}
                        />
                        </GraphCards>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Dashboard;
