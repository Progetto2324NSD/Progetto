import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from '../api_vespe/axiosConfig';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibmljYWEiLCJhIjoiY20wbDdpNGFpMDJmeDJqczN0c3dycDJuMiJ9.Pu-Yepy-zww4R7_wiPiNBQ';

const LastWorkoutMap = ({ onDistanceChange, onTimeChange, onTypeChange, onDateChange }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [type, setType] = useState(null);
  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);

  const [styleLoaded, setStyleLoaded] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0],
      zoom: 14,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());

    mapRef.current.on('style.load', () => {
      console.log('Stile della mappa caricato.');
      setStyleLoaded(true);
    });

    const fetchLastWorkout = async () => {
      try {
        const response = await axios.get('/workout/last-workout', {
          withCredentials: true,
        });

        const { startCoords, endCoords, distance, type, time, date } = response.data;

        setStartCoords(startCoords);
        setEndCoords(endCoords);
        setDistance(distance);
        setType(type);
        setTime(time);
        setDate(date);
        
        if (onDistanceChange) onDistanceChange(distance);
        if (onTimeChange) onTimeChange(time);
        if (onTypeChange) onTypeChange(type);
        if (onDateChange) onDateChange(date);

      } catch (err) {
        console.error("Errore durante il recupero dell'ultimo workout:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLastWorkout();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [onDistanceChange, onTimeChange, onTypeChange, onDateChange]);

  useEffect(() => {
    if (styleLoaded && startCoords && endCoords) {
      console.log('Stile e coordinate pronte, calcolo del percorso...');

      const getRoute = async (start, end) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

        try {
          const response = await axios.get(url);
          const route = response.data.routes[0]?.geometry?.coordinates;

          if (route) {
            console.log('Percorso ottenuto:', route);

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

            const bounds = new mapboxgl.LngLatBounds();
            route.forEach(coord => bounds.extend(coord));
            mapRef.current.fitBounds(bounds, {
              padding: 50,
            });
          } else {
            console.error("Nessun percorso trovato nella risposta dell'API.");
          }
        } catch (err) {
          console.error('Errore durante il calcolo del percorso:', err);
          setError(err.message);
        }
      };

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
