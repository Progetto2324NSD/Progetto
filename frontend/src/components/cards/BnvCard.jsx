import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import '../../pages/stile/style.css';
import 'boxicons/css/boxicons.min.css';
import welcome from '../../utils/images/welcome.png';

function BnvCard({ name }) {
    return (
        <Card className="styled-card">
            <Avatar className="styled-avatar">
                <i className='bx bx-dumbbell'></i>
            </Avatar>
            <CardContent className="card-content">
                <Typography variant="h5" component="div">
                    Ciao, {name}!
                </Typography>
                <Typography variant="body2">
                    Siamo felici di averti con noi. 
                    Questo è solo l'inizio di un viaggio entusiasmante verso i tuoi obiettivi!
                </Typography>
            </CardContent>
            <img src={welcome} alt="Welcome" className="welcome-image" />
        </Card>
    );
}

export default BnvCard;
