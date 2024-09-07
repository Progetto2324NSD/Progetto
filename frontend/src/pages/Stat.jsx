import React from "react";
import Navbar from "../components/NavbarLogo";
import { Container, Row, Col } from "react-bootstrap";
import StatButton from "../components/StatButton";
import './stile/style.css';

//Icone MUI
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';

function Stat(){
    return(
        <>
            <Navbar />
            <Container>
                <h2>Statistiche</h2>
                <hr />
                <Row>
                    <Col md={4} xs={12}>
                        <h4>Output</h4>
                        <StatButton
                            title="Tempo Trascorso"
                            icon={<TimerRoundedIcon  fontSize="large" />}
                            value="24 min"
                            description="Tempo allenamento di oggi"
                            onClick={() => alert("Bottone cliccato")}
                        />
                        <StatButton
                            title="Distanza Percorsa"
                            icon={<LocationOnRoundedIcon fontSize="large" />}
                            value="9800"
                            description="Distanza Percorsa oggi"
                        />
                        <StatButton
                            title="Allenamenti Svolti"
                            icon={<FitnessCenterRoundedIcon  fontSize="large" />}
                            value="4"
                            description="Allenamenti svolti oggi"
                        />
                        <StatButton
                            title="Velocità media"
                            icon={<SpeedRoundedIcon  fontSize="large" />}
                            value="3.14km/h"
                            description="Velocità media oggi"
                        />
                    </Col>
                    <Col md={8} xs={12}>
                        <h4>Fitness Stats</h4>

                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Stat;