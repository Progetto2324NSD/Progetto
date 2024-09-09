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

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [16.48473, 41.11743],
      zoom: 12,
    });

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/walking',
    });

    map.addControl(directions, 'top-left');

    directions.on('route', (e) => {
      const route = e.route[0];
      const distanceInKm = route.distance / 1000;

      const startCoords = directions.getOrigin().geometry.coordinates;
      const endCoords = directions.getDestination().geometry.coordinates;

      onDistanceChange(distanceInKm, startCoords, endCoords);
    });

    return () => map.remove();
  }, [onDistanceChange]);

  return (
    <div className="map-container-wrapper">
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
}

export default MapComponent;
