import React from 'react';
import VenueMap from './VenueMap';
import './EventDetails.css';

function EventDetails({ event }) {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  const availabilityPct = (event.availableTickets / event.totalTickets) * 100;
  const isAlmostFull = availabilityPct < 20;

  return (
    <div className="event-details card">
      <div className="event-badge">
        <span className="badge-dept">{event.departmentName}</span>
        {isAlmostFull && <span className="badge-urgent">Almost Full!</span>}
      </div>

      <h1 className="event-name">{event.eventName}</h1>
      <p className="event-desc">{event.description}</p>

      <div className="info-grid">
        <div className="info-item">
          <span className="info-icon">📅</span>
          <div>
            <span className="info-label">Date</span>
            <span className="info-value">{formatDate(event.eventDate)}</span>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icon">⏰</span>
          <div>
            <span className="info-label">Time</span>
            <span className="info-value">{formatTime(event.eventTime)}</span>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icon">📍</span>
          <div>
            <span className="info-label">Venue</span>
            <span className="info-value">{event.venue}</span>
          </div>
        </div>
        <div className="info-item">
          <span className="info-icon">💰</span>
          <div>
            <span className="info-label">Ticket Price</span>
            <span className="info-value price">
              {event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}
            </span>
          </div>
        </div>
      </div>

      <div className="availability-section">
        <div className="avail-header">
          <span>Ticket Availability</span>
          <span className={`avail-count ${isAlmostFull ? 'urgent' : ''}`}>
            {event.availableTickets} / {event.totalTickets} remaining
          </span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-fill ${isAlmostFull ? 'urgent' : ''}`}
            style={{ width: `${availabilityPct}%` }}
          />
        </div>
      </div>

      <VenueMap venue={event.venue} lat={event.latitude} lng={event.longitude} />
    </div>
  );
}

export default EventDetails;
