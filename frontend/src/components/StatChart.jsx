import React from "react";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { graficoDistanza, graficoAllenamenti, graficoTempo, graficoVelocita } from "../service/workoutService";

const StatChart = ({ selectedButton, data }) => {

  const [dataG, setDataG] = useState([]);
  const [dataD, setDataD] = useState([]);
  const [dataT, setDataT] = useState([]);
  const [dataV, setDataV] = useState([]);

  useEffect(() => {

    const fetchData1 = async () => {

      try{
        const response = await graficoAllenamenti();
        const datiGrafico1 = [
          {id: 0, value: response.data.corsaSemplice, label: 'Semplice', color: '#0d6efd'},
          {id: 1, value: response.data.fartlek, label: 'Fartlek', color: '#1a7dff'},
          {id: 2, value: response.data.lungo, label: 'Lungo', color: '#3389ff'},
          {id: 3, value: response.data.progressivo, label: 'Progressivo', color: '#66a3ff'},
          {id: 4, value: response.data.tempoRun, label: 'Tempo Run', color: '#99b3ff'},
          {id: 5, value: response.data.ripetute, label: 'Ripetute', color: '#c2dfff'},
        ];

        setDataG(datiGrafico1);

      }catch(error){
        toast.error("Errore nel caricamento dei dati");
      }
    };

      fetchData1();

  }, []);

  useEffect(() => {

      const fetchData2 = async () => {
  
        try{
          const response = await graficoDistanza();
  
        const datiGrafico = {
          labels: response.data.map(item => item.month), // Mesi come etichette
          values: response.data.map(item => item.totalDistance), // Distanze come valori
        };

        setDataD(datiGrafico);

      } catch (error) {
        toast.error("Errore nel caricamento dei dati");
      }
    };

    fetchData2();
  }, []);

  useEffect(() => {

    const fetchData3 = async () => {

      try{
        const response = await graficoTempo();

      const datiGrafico = {
        labels: response.data.map(item => item.month), // Mesi come etichette
        values: response.data.map(item => item.totalTime), // Distanze come valori
      };

      setDataT(datiGrafico);

    } catch (error) {
      toast.error("Errore nel caricamento dei dati");
    }
  };

    fetchData3();
  }, []);

  useEffect(() => {
    const fetchData4 = async () => {
      try {
        const response = await graficoVelocita();

        const datiGrafico4 = {
          dataset: [
            {
              type: response.data.map(item => item.type),
              averageSpeed: response.data.map(item => item.averageSpeed)
            }
          ]
        };

        setDataV(datiGrafico4);  // Dati per il grafico della velocità

      } catch (error) {
        toast.error("Errore nel caricamento dei dati");
      }
    };

    fetchData4();
  }, [])


    // Scegli il tipo di grafico in base al pulsante selezionato
    const renderChart = () => {
      switch (selectedButton) {
        case 'tempo':
          return (                      
            <BarChart
            zAxis={[{ data: dataT.labels }]}
            series={[
              {
                data: dataT.values,
                label: 'Tempo totale (min)'
              }
            ]}
            width={500}
            height={300}
            />
          );
        case 'distanza':
          return (
            <BarChart
              zAxis={[{ data: dataD.labels}]}
              series={[
                {
                  data: dataD.values,
                  label: 'Distanza totale (km)'
                }
              ]}
              width={400}
              height={200}
            />
          );
        case 'allenamenti':
          return (
            <div className='centroGrafici'>
              <PieChart
                series={[
                  {
                    data: dataG,
                  }
                ]}
                width={500}
                height={300}
              />
            </div>
          );
        case 'velocita':
          return (
            <BarChart
            dataset={dataV.dataset}
            yAxis={[{ scaleType: 'band', dataKey: 'type' }]}
            series={[{ dataKey: 'averageSpeed', label: 'Velocità Media (km/h)' }]}
            layout="horizontal"
            grid={{ vertical: true }}
            width={400}
            height={200}
          />
          );
        default:
          return <p>Seleziona un pulsante per visualizzare il grafico.</p>;
      }
    };
  
    return (
      <div>
        {renderChart()}
      </div>
    );
  };
  
  export default StatChart;
