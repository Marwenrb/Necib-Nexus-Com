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

      // Add premium-styled navigation control
      map.current.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          visualizePitch: true
        }), 
        'top-right'
      );
      
      // Custom premium marker
      const markerEl = document.createElement('div');
      markerEl.className = 'premium-marker';
      markerEl.innerHTML = `
        <div class="marker-pin"></div>
        <div class="marker-pulse"></div>
      `;
      
      // Apply styles to the custom marker
      const markerCSS = `
        .premium-marker {
          position: relative;
        }
        .marker-pin {
          width: 24px;
          height: 24px;
          border-radius: 50% 50% 50% 0;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -15px 0 0 -15px;
          box-shadow: 0 0 15px rgba(124, 58, 237, 0.5);
        }
        .marker-pin:after {
          content: '';
          width: 12px;
          height: 12px;
          margin: 6px 0 0 6px;
          background: #2a2a2a;
          position: absolute;
          border-radius: 50%;
        }
        .marker-pulse {
          background: rgba(124, 58, 237, 0.3);
          border-radius: 50%;
          height: 40px;
          width: 40px;
          position: absolute;
          left: 50%;
          top: 50%;
          margin: -20px 0 0 -20px;
          transform: rotateX(55deg);
          z-index: -1;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          70% {
            transform: scale(1.5);
            opacity: 0;
          }
          100% {
            transform: scale(0.8);
            opacity: 0;
          }
        }
      `;
      
      // Add the styles to the document
      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';
      styleSheet.innerText = markerCSS;
      document.head.appendChild(styleSheet);
      
      // Add marker
      new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom',
      })
        .setLngLat([initialViewState.longitude, initialViewState.latitude])
        .addTo(map.current);
        
      // Add popup with location info
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
        className: 'premium-popup',
      })
        .setLngLat([initialViewState.longitude, initialViewState.latitude])
        .setHTML(`
          <div style="
            padding: 0.5rem;
            font-family: 'Inter', sans-serif;
            color: white;
            font-size: 12px;
          ">
            <strong>NeciB Nexus</strong><br>
            Alger, Algeria
          </div>
        `)
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

      // Add premium map interactions
      map.current.on('load', () => {
        // Add a premium 3D building layer if map supports it
        if (map.current.getStyle().layers) {
          try {
            // Add custom atmosphere and light
            map.current.setFog({
              'color': 'rgba(12, 10, 20, 0.8)',
              'high-color': 'rgba(36, 15, 90, 0.8)',
              'horizon-blend': 0.1,
              'space-color': 'rgba(7, 7, 12, 0.95)', 
              'star-intensity': 0.5
            });
          } catch (e) {
            console.log('Advanced map features not supported');
          }
        }
        
        setMapReady(true);
      });

      // Check for map load errors
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError(true);
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
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(124, 58, 237, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '15px'
          }}
        >
          <FaMapMarkerAlt style={{ 
            fontSize: '2rem', 
            color: 'rgba(124, 58, 237, 0.9)',
            filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.5))'
          }} />
        </div>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.9)', 
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '1.1rem',
          marginBottom: '5px'
        }}>
          Alger, Algeria
        </p>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.6)', 
          fontSize: '0.9rem', 
          textAlign: 'center', 
          marginTop: '5px' 
        }}>
          Visit us at our office location
        </p>
      </div>
    );
  }

  return (
    <div ref={mapContainer} style={{ 
      ...style, 
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden'
    }} />
  );
};

export default MapboxMap; 