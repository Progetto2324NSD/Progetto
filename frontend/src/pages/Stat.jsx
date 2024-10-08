import React, { useEffect, useState } from "react";

//Import React
import { Container, Row, Col } from "react-bootstrap";

//Componenti
import StatButton from "../components/StatButton";
import Navbar from "../components/NavbarLogo";
import BnvCard from '../components/cards/BnvCard';
import ChartCard from "../components/cards/ChartCard";

//Immagini
import stat from '../utils/images/stat.png';

//Stile
import './stile/style.css';

//Icone MUI
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';


// Importa la funzione di servizio
import { distanceDayWorkout, numDayWorkout, timeDayWorkout } from "../service/workoutService";


function Stat() {

    const [selectedButton, setSelectedButton] = useState(null);
    
    const [tempoTot, setTempoTot] = useState(null);
    const [distTot, setDistTot] = useState(null);
    const [numTot, setNumTot] = useState(null);

    const handleButtonClick = (buttonId) => { setSelectedButton(buttonId); };

    const getSelectedData = () => {
        switch (selectedButton) {
          case 'tempo':
            return tempoTot;
          case 'distanza':
            return distTot;
          case 'allenamenti':
            return numTot;
          default:
            return null;
        }
      };

    useEffect(() => {
        const fetchData = async() => {
            try{

              const response = await timeDayWorkout();
                setTempoTot(response.data.tempoTot);

                const response1 = await distanceDayWorkout();
                setDistTot(response1.data.distTot);

                const response2 = await numDayWorkout();
                setNumTot(response2.data.workoutsToday);

            }catch(error){
                console.error("Errore durante il caricamento dei dati");
            }
        }
        fetchData();
    }, []);

  return (
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
              icon={<TimerRoundedIcon fontSize="large" />}
              value={tempoTot !== null ? `${tempoTot} min` : 'Caricamento...'}
              description="Tempo allenamento di oggi"
              isSelected={selectedButton === 'tempo'}
              onClick={() => handleButtonClick('tempo')}
            />
            <StatButton
              title="Distanza Percorsa"
              icon={<LocationOnRoundedIcon fontSize="large" />}
              value={distTot !== null ? `${distTot.toFixed(2)} km` : 'Caricamento...'}
              description="Distanza Percorsa oggi"
              isSelected={selectedButton === 'distanza'}
              onClick={() => handleButtonClick('distanza')}
            />
            <StatButton
              title="Allenamenti Svolti"
              icon={<FitnessCenterRoundedIcon fontSize="large" />}
              value={numTot !== null ? `${numTot} workout` : 'Caricamento...'}
              description="Allenamenti svolti oggi"
              isSelected={selectedButton === 'allenamenti'}
              onClick={() => handleButtonClick('allenamenti')}
            />
          </Col>
          <Col md={8} xs={12}>
            <h4>Fitness Stats</h4>
            <BnvCard para={'Seleziona una card per visualizzare nel dettaglio i dati di allenamento'} img={stat}/> <hr style={{color: "transparent"}}/>
            <ChartCard selectedButton={selectedButton} data={getSelectedData()} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Stat;
