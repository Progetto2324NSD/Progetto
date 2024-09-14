import React, { useEffect, useState } from "react";

//Libreria
import toast from 'react-hot-toast';

//Icone MUI
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMediaQuery, useTheme } from '@mui/material';

// Importa la funzione di servizio
import { graficoAllenamenti, graficoDistanza, graficoTempo, graficoVelocita } from "../service/workoutService";

const StatChart = ({ selectedButton }) => {
  // Stati per i dati e il tipo di allenamento
  const [dataG, setDataG] = useState([]);
  const [dataT, setDataT] = useState([]);
  const [dataD, setDataD] = useState([]);
  const [dataV, setDataV] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // True if screen size is small

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
        const datiGrafico2 = [
          { id: 0, value: responseTempo.data.corsaSemplice, label: 'Semplice', color: '#0d6efd' },
          { id: 1, value: responseTempo.data.fartlek, label: 'Fartlek', color: '#1a7dff' },
          { id: 2, value: responseTempo.data.lungo, label: 'Lungo', color: '#3389ff' },
          { id: 3, value: responseTempo.data.progressivo, label: 'Progressivo', color: '#66a3ff' },
          { id: 4, value: responseTempo.data.tempoRun, label: 'Tempo Run', color: '#99b3ff' },
          { id: 5, value: responseTempo.data.ripetute, label: 'Ripetute', color: '#c2dfff' }
        ]        
        setDataT(datiGrafico2);
      }catch(error){
        toast.error("Errore nel caricamento dei dati");
      }
    };
    fetchDataTempo();
  }, []);

  useEffect(() => {
    const fetchDataDistanza = async() => {
      try{
        const responseDistanza = await graficoDistanza();
        setDataD(responseDistanza.data);
      }catch(error){
        toast.error("Errore nel caricamento dei dati");
      }
    }
    fetchDataDistanza();
  },[]);

  useEffect(() => {
    const fetchDataVelocita = async() => {
      try{
        const responseVelocita = await graficoVelocita();
        setDataV(responseVelocita.data);
      }catch(error){
        toast.error("Errore nel caricamento dei dati");
      }
    }
    fetchDataVelocita();
  },[]);

  const mesiAbbreviazioni = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  const ordineEse = ["Lungo", "Tempo Run", "Fartlek", "Ripetute", "Semplice", "Progress"];

  // Funzione che restituisce il grafico da visualizzare
  const renderChart = () => {
    const chartDimensions = isMobile ? { width: 300, height: 200 } : { width: 500, height: 300 };
    const containerStyles = isMobile ? { margin: '0 auto', padding: '0 20px' } : { margin: '0 auto' };

    return (
      <div style={containerStyles}>
        {selectedButton === 'tempo' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart
              series={[{ data: dataT }]}
              width={chartDimensions.width}
              height={chartDimensions.height}
            />
          </div>
        )}
        {selectedButton === 'distanza' && (
          <BarChart
            series={[{ data: dataD }]}
            xAxis={[{ scaleType: 'band', data: mesiAbbreviazioni }]}
            width={chartDimensions.width}
            height={chartDimensions.height}
          />
        )}
        {selectedButton === 'allenamenti' && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart
              series={[{ data: dataG }]}
              width={chartDimensions.width}
              height={chartDimensions.height}
            />
          </div>
        )}
        {selectedButton === 'velocita' && (
          <BarChart
            series={[{ data: dataV }]}
            xAxis={[{ scaleType: 'band', data: ordineEse }]}
            width={chartDimensions.width}
            height={chartDimensions.height}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      {renderChart()}
    </div>
  );
};

export default StatChart;