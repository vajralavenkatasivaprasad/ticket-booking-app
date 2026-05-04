import React from 'react';
import './VenueMap.css';

// Leaflet map for venue location (innovation module)
function VenueMap({ venue, lat, lng }) {
  const defaultLat = lat || 9.9252;   // Madurai default
  const defaultLng = lng || 78.1198;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${defaultLng - 0.005}%2C${defaultLat - 0.004}%2C${defaultLng + 0.005}%2C${defaultLat + 0.004}&layer=mapnik&marker=${defaultLat}%2C${defaultLng}`;

  return (
    <div className="venue-map-section">
      <div className="map-header">
        <span className="map-icon">🗺️</span>
        <span>Venue Location</span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${defaultLat},${defaultLng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="map-link"
        >
          Open in Maps ↗
        </a>
      </div>
      <div className="map-container">
        <iframe
          title="Venue Map"
          src={mapUrl}
          className="map-iframe"
          allowFullScreen=""
          loading="lazy"
        />
        <div className="map-label">{venue}</div>
      </div>
    </div>
  );
}

export default VenueMap;
