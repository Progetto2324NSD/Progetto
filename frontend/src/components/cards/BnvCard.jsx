import React from "react";

//Import React
import { useState, useEffect } from 'react';

//Icone MUI
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

//Stile
import '../../pages/stile/style.css';
import 'boxicons/css/boxicons.min.css';

// Importa la funzione di servizio
import { getData } from "../../service/userService";


function BnvCard({ para, img }) {

    const [name, setName] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getData();

                if (response.status === 200) {
                    setName(response.data.name);
                } else {
                    console.error("Errore durante il recupero dei dati dell'utente");
                }
            } catch (error) {
                console.error("Errore durante il recupero dei dati dell'utente");
            }
        };
        fetchUserData();
    }, []);


    return (
        <Card className={`styled-card spaced-card`}>
            <Avatar className="styled-avatar">
                <i className='bx bx-dumbbell'></i>
            </Avatar>
            <CardContent className="card-content">
                <Typography variant="h5" component="div">
                    Ciao, {name}!
                </Typography>
                <Typography variant="body2">
                    {para}
                </Typography>
            </CardContent>
            <img src={img} className="welcome-image" />
        </Card>
    );
}

export default BnvCard;
