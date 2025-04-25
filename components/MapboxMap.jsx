'use client';

import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const MapboxMap = (props) => {
  const { initialViewState, mapboxAccessToken, mapStyle, style, onMove } = props;
  const mapContainer = React.useRef(null);
  const map = React.useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = mapboxAccessToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      bearing: initialViewState.bearing || 0,
      pitch: initialViewState.pitch || 0,
      ...style
    });

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add marker
    new mapboxgl.Marker({
      color: '#E94E1A'
    })
      .setLngLat([initialViewState.longitude, initialViewState.latitude])
      .addTo(map.current);

    // Handle moveend event similar to onMove
    if (onMove) {
      map.current.on('moveend', () => {
        const center = map.current.getCenter();
        const zoom = map.current.getZoom();
        const bearing = map.current.getBearing();
        const pitch = map.current.getPitch();
        
        onMove({
          viewState: {
            longitude: center.lng,
            latitude: center.lat,
            zoom,
            bearing,
            pitch
          }
        });
      });
    }

    setMapReady(true);

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialViewState, mapboxAccessToken, mapStyle]);

  return (
    <div ref={mapContainer} style={{ ...style }} />
  );
};

export default MapboxMap; 