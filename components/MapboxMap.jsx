'use client';

import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { FaMapMarkerAlt } from 'react-icons/fa';

const MapboxMap = (props) => {
  const { initialViewState, mapboxAccessToken, mapStyle, style, onMove } = props;
  const mapContainer = React.useRef(null);
  const map = React.useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Initialize map with better error handling
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    try {
      mapboxgl.accessToken = mapboxAccessToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        bearing: initialViewState.bearing || 0,
        pitch: initialViewState.pitch || 0,
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

      // Check for map load errors
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError(true);
      });

      map.current.on('load', () => {
        setMapReady(true);
      });
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setMapError(true);
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialViewState, mapboxAccessToken, mapStyle, onMove]);

  // Render error state with styled fallback
  if (mapError) {
    return (
      <div 
        style={{
          ...style,
          background: 'rgba(10, 10, 20, 0.3)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <FaMapMarkerAlt style={{ fontSize: '2rem', color: '#E94E1A', marginBottom: '10px' }} />
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
          Paris, France
        </p>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem', textAlign: 'center', marginTop: '10px' }}>
          Visit us at our office location
        </p>
      </div>
    );
  }

  return (
    <div ref={mapContainer} style={{ ...style }} />
  );
};

export default MapboxMap; 