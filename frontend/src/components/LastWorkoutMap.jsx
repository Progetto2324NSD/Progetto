import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from '../api_vespe/axiosConfig';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibmljYWEiLCJhIjoiY20wbDdpNGFpMDJmeDJqczN0c3dycDJuMiJ9.Pu-Yepy-zww4R7_wiPiNBQ';

const LastWorkoutMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [styleLoaded, setStyleLoaded] = useState(false);

  useEffect(() => {
    // Configura l'access token di Mapbox
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    // Inizializza la mappa
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0], // Posizione iniziale neutra
      zoom: 14,
    });

    // Aggiungi il controllo di navigazione (zoom, rotazione)
    mapRef.current.addControl(new mapboxgl.NavigationControl());

    // Aggiungi un listener per l'evento style.load
    mapRef.current.on('style.load', () => {
      console.log('Stile della mappa caricato.');
      setStyleLoaded(true);
    });

    // Funzione per ottenere i dati dell'ultimo workout
    const fetchLastWorkout = async () => {
      try {
        const response = await axios.get('/workout/last-workout', {
          withCredentials: true,
        });

        const { startCoords, endCoords } = response.data;
        setStartCoords(startCoords);
        setEndCoords(endCoords);
      } catch (err) {
        console.error("Errore durante il recupero dell'ultimo workout:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Recupera le coordinate dell'ultimo workout
    fetchLastWorkout();

    // Pulizia della mappa quando il componente viene smontato
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    // Controlla che sia lo stile che le coordinate siano disponibili
    if (styleLoaded && startCoords && endCoords) {
      console.log('Stile e coordinate pronte, calcolo del percorso...');

      // Funzione per fare la chiamata all'API Directions e ottenere il percorso
      const getRoute = async (start, end) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

        try {
          const response = await axios.get(url);
          const route = response.data.routes[0]?.geometry?.coordinates;

          if (route) {
            console.log('Percorso ottenuto:', route);

            // Aggiungi la sorgente per il percorso evidenziato
            if (mapRef.current.getSource('highlight-route')) {
              mapRef.current.getSource('highlight-route').setData({
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: route,
                },
              });
            } else {
              mapRef.current.addSource('highlight-route', {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: route,
                  },
                },
              });

              mapRef.current.addLayer({
                id: 'highlight-route',
                type: 'line',
                source: 'highlight-route',
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round',
                },
                paint: {
                  'line-color': '#0d6efd',
                  'line-width': 4,
                },
              });
            }

            // Usa fitBounds per centrare e adattare la mappa ai confini del percorso
            const bounds = new mapboxgl.LngLatBounds();
            route.forEach(coord => bounds.extend(coord));
            mapRef.current.fitBounds(bounds, {
              padding: 50,  // Aggiungi del padding per evitare che il percorso tocchi i bordi della mappa
            });
          } else {
            console.error("Nessun percorso trovato nella risposta dell'API.");
          }
        } catch (err) {
          console.error('Errore durante il calcolo del percorso:', err);
          setError(err.message);
        }
      };

      // Chiama la funzione per ottenere il percorso tra Punto A e Punto B
      getRoute(startCoords, endCoords);
    }
  }, [styleLoaded, startCoords, endCoords]);

  return (
    <div
      style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}
      ref={mapContainerRef}
    >
      {loading && <p>Loading map...</p>}
      {error && <p style={{ color: 'red' }}>Errore: {error}</p>}
    </div>
  );
};

export default LastWorkoutMap;
