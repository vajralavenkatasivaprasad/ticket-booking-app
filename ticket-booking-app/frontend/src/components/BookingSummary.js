import React from 'react';
import './BookingSummary.css';

function BookingSummary({ booking, event, onReset }) {
  const totalAmount = booking.numberOfTickets * event.ticketPrice;

  const handleDownload = () => {
    const content = `
EVENTPASS — BOOKING CONFIRMATION
=================================
Booking ID  : ${booking.bookingId || 'EVNT' + Date.now().toString().slice(-6)}
Event       : ${event.eventName}
Department  : ${event.departmentName}
Date & Time : ${event.eventDate} at ${event.eventTime}
Venue       : ${event.venue}

ATTENDEE DETAILS
=================================
Name        : ${booking.name}
Email       : ${booking.email}
Department  : ${booking.department}
Tickets     : ${booking.numberOfTickets}
Total Paid  : ${event.ticketPrice === 0 ? 'FREE' : '₹' + totalAmount}

Thank you for registering!
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'booking-confirmation.txt'; a.click();
  };

  return (
    <div className="summary-card card">
      <div className="success-header">
        <div className="success-icon">✅</div>
        <h2 className="success-title">Booking Confirmed!</h2>
        <p className="success-msg">Your tickets have been booked successfully.</p>
      </div>

      <div className="booking-id">
        Booking ID: <strong>{booking.bookingId || 'EVNT' + Date.now().toString().slice(-6)}</strong>
      </div>

      <div className="summary-section">
        <h3 className="summary-label">Event Details</h3>
        <div className="summary-grid">
          <div className="summary-row">
            <span>Event</span><span>{event.eventName}</span>
          </div>
          <div className="summary-row">
            <span>Department</span><span>{event.departmentName}</span>
          </div>
          <div className="summary-row">
            <span>Date</span><span>{event.eventDate}</span>
          </div>
          <div className="summary-row">
            <span>Venue</span><span>{event.venue}</span>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h3 className="summary-label">Attendee Summary</h3>
        <div className="summary-grid">
          <div className="summary-row">
            <span>Name</span><span>{booking.name}</span>
          </div>
          <div className="summary-row">
            <span>Email</span><span>{booking.email}</span>
          </div>
          <div className="summary-row">
            <span>Department</span><span>{booking.department}</span>
          </div>
          <div className="summary-row">
            <span>Tickets Booked</span>
            <span className="highlight">{booking.numberOfTickets}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total Amount</span>
            <span className="total-val">
              {event.ticketPrice === 0 ? 'FREE' : `₹${totalAmount.toLocaleString('en-IN')}`}
            </span>
          </div>
        </div>
      </div>

      <p className="email-note">📧 A confirmation has been sent to <strong>{booking.email}</strong></p>

      <div className="summary-actions">
        <button className="btn-primary" onClick={handleDownload}>
          📄 Download Confirmation
        </button>
        <button className="btn-secondary" onClick={onReset}>
          Book Another Ticket
        </button>
      </div>
    </div>
  );
}

export default BookingSummary;
