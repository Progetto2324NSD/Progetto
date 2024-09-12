import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import Form from 'react-bootstrap/Form';

import { graficoAllenamenti, graficoTempo } from "../service/workoutService";

const StatChart = ({ selectedButton }) => {
  // Stati per i dati e il tipo di allenamento
  const [dataG, setDataG] = useState([]);
  const [dataT, setDataT] = useState([]);

  useEffect(() => {
    const fetchDataTipo = async () => {
      try {
        const responseTipo = await graficoAllenamenti();
        const datiGrafico1 = [
          { id: 0, value: responseTipo.data.corsaSemplice, label: 'Semplice', color: '#0d6efd' },
          { id: 1, value: responseTipo.data.fartlek, label: 'Fartlek', color: '#1a7dff' },
          { id: 2, value: responseTipo.data.lungo, label: 'Lungo', color: '#3389ff' },
          { id: 3, value: responseTipo.data.progressivo, label: 'Progressivo', color: '#66a3ff' },
          { id: 4, value: responseTipo.data.tempoRun, label: 'Tempo Run', color: '#99b3ff' },
          { id: 5, value: responseTipo.data.ripetute, label: 'Ripetute', color: '#c2dfff' },
        ];
        setDataG(datiGrafico1);
      } catch (error) {
        toast.error("Errore nel caricamento dei dati");
      }
    };

    fetchDataTipo();
  }, []);

  useEffect(() => {
    const fetchDataTempo = async() => {
      try{
        const responseTempo = await graficoTempo();
        setDataT(responseTempo.data);
      }catch(error){
        toast.error("Errore nel caricamento dei dati");
      }
    };
    fetchDataTempo();
  }, []);

  const renderChart = () => {
    switch (selectedButton) {
      case 'tempo':
        return (
          <div>
            <PieChart
              series={[{ data: dataT }]}
              width={500}
              height={300}
            />
          </div>
        );
      case 'distanza':
        return <p>Testo per grafico distanza</p>;
      case 'allenamenti':
        return (
          <div className='centroGrafici'>
            <PieChart
              series={[{ data: dataG }]}
              width={500}
              height={300}
            />
          </div>
        );
      case 'velocita':
        return <p>CIAO</p>;
      default:
        return <p>Selona un pulsante per visualizzare il grafico.ezi</p>;
    }
  };

  return (
    <div>
      {renderChart()}
    </div>
  );
};

export default StatChart;
