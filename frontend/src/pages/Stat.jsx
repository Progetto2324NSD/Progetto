import React from "react";
import Navbar from "../components/NavbarLogo";
import { Container, Row, Col } from "react-bootstrap";
import StatButton from "../components/StatButton";
import './stile/style.css';

//Icone MUI
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import EditRoadRoundedIcon from '@mui/icons-material/EditRoadRounded';

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
                            title="I tuoi percorsi"
                            icon={<EditRoadRoundedIcon style={{ color: "white" }} fontSize="large" />}
                            value="84 bpm"
                            description=""
                        />
                        <StatButton
                            title="Distanza Percorsa"
                            icon={<DirectionsRunRoundedIcon style={{ color: "white" }} fontSize="large" />}
                            value="9800"
                            description="Distanza Percorsa oggi"
                        />
                        <StatButton
                            title="Water"
                            //icon={<OpacityIcon style={{ color: "white" }} fontSize="large" />}
                            value="1.5 liters"
                            description="Acqua consumata oggi"
                        />
                        <StatButton
                            title="Sleep"
                            //icon={<NightsStayIcon style={{ color: "white" }} fontSize="large" />}
                            value="7 hours"
                            description="Sonno della scorsa notte"
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