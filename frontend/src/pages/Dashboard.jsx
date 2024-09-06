import React, { useEffect } from 'react';
import Navbar from "../components/NavbarLogo";
import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import axios from "../api_vespe/axiosConfig";

//stile
import "./stile/style.css";

//Componenti
import MapComponent from '../components/cards/MapCard';
import QltCard from '../components/cards/QltCard';
import Workout from '../components/cards/WorkoutCard';
import BnvCard from '../components/cards/BnvCard';

function Dashboard() {

    const [Name, setName] = useState("");

    useEffect(() => {

        const fetchUserData = async () => {
            try{
                const response = await axios.get('/user/data',{
                    withCredentials: true,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if(response.status === 200){
                    setName(response.data.name);
                }else{
                    console.error("Errore durante il recupero dei dati dell'utente");
                }
            }catch(error){
                console.error("Errore durante il recupero dei dati dell'utente");
            }
        }
        fetchUserData();
    }, []);

    return (
        <>
            <Navbar />
            <Container>
            <h2>Dashboard</h2>
            <hr />
            <Row className='row'>
                <Col md={12} xs={12}>
                    <BnvCard name={Name} />
                </Col>
            </Row>
                <Row className='row'>
                    <Col md={8} xs={12}>
                        <MapComponent title="Rivedi il tuo ultimo wokout" para="Qui puoi rivedere il tuo ultimo percorso di allenamento" />
                    </Col>
                    <Col md={4} xs={12}>
                        <QltCard title="Qualità workout" para="Continua così.." /><br></br>
                        <Workout title="Workout"/>
                    </Col>
                </Row>
            </Container>    
        </>
    );
}

export default Dashboard;
