import { useState, useEffect} from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import '../../pages/stile/style.css';

function CardMemo(){

    const tips = [
        "Ricorda di fare stretching prima e dopo ogni allenamento per evitare infortuni.",
        "Prova un allenamento di recupero attivo dopo una corsa intensa, come una camminata o un giro in bici.",
        "Bevi almeno 2 litri d'acqua al giorno per mantenere un buon livello di idratazione durante i tuoi allenamenti.",
        "Alterna corsa lunga e progressiva per migliorare la resistenza e la velocità.",
        "Assicurati di riposare adeguatamente tra le sessioni di allenamento intense.",
        "Imposta obiettivi settimanali per la distanza o il tempo di allenamento.",
        "Usa la respirazione diaframmatica per migliorare la tua performance durante la corsa.",
        "Ascolta il tuo corpo e riduci l'intensità se ti senti troppo affaticato.",
      ];

    const [randomTip, setRandomTip] = useState('');

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * tips.length);
        setRandomTip(tips[randomIndex]);
    }, []);

    return(
        <Card className="memo-card">
            <CardContent>
                <Typography variant="h5" component="div">
                Consiglio del giorno
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                {randomTip}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default CardMemo;