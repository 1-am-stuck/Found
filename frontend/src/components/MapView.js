import React, { useEffect, useRef } from 'react';
import api from '../api/api';

function MapView() {
  const mapContainerRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        const response = await api.get('/map/generate');
        const mapHtml = response.data;
        
        if (iframeRef.current) {
          const blob = new Blob([mapHtml], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          iframeRef.current.src = url;
        }
      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    loadMap();
  }, []);

  return (
    <div className="map-container">
      <div className="map-header">
        <h2>Campus Map - Found Items</h2>
        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-marker red"></span>
            <span>Stored Items</span>
          </div>
          <div className="legend-item">
            <span className="legend-marker yellow"></span>
            <span>Claimed Items</span>
          </div>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        title="Campus Map"
        className="map-iframe"
        style={{ border: 'none', width: '100%', height: '600px' }}
      />
    </div>
  );
}

export default MapView;

