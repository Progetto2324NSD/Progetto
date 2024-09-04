import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

// Assicurati di avere un token di Mapbox in una variabile d'ambiente
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibmljYWEiLCJhIjoiY20wbTY5NzR1MGJ0OTJpcjcxNndocXJoNyJ9.NI9wTx2IIx2qJ_vNaBhNmg';

function MapComponent({ onDistanceChange }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      console.error('Mapbox access token is missing!');
      return;
    }

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    // Inizializzazione della mappa
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [12.4964, 41.9028], // Coordinate di Roma
      zoom: 10,
    });

    // Inizializzazione del controllo delle direzioni
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/walking', // Imposta la modalità camminata
    });

    map.addControl(directions, 'top-left');

    // Calcola e imposta la distanza
    directions.on('route', (e) => {
      const route = e.route[0];
      const distanceInKm = route.distance / 1000; // Distanza in chilometri
      onDistanceChange(distanceInKm);
    });

    // Pulizia della mappa quando il componente viene smontato
    return () => map.remove();
  }, [onDistanceChange]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: '100%',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
}

export default MapComponent;
