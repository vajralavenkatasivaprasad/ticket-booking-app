import React, { useEffect, useState } from 'react';
import { getAdminDashboard } from '../services/authService';
import './Dashboard.css';

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(()=>{ getAdminDashboard().then(setData).catch(e=>setError(e.displayMessage)); }, []);
  if (error) return <div className="dash-page"><div className="dash-error">{error}</div></div>;
  if (!data) return <div className="dash-page">Loading admin dashboard...</div>;
  return <div className="dash-page">
    <div className="dash-hero admin"><h1>Admin Dashboard</h1><p>Monitor event performance and bookings</p></div>
    <div className="stats"><div><b>{data.totalEvents}</b><span>Events</span></div><div><b>{data.totalBookings}</b><span>Bookings</span></div><div><b>{data.ticketsBooked}</b><span>Tickets Sold</span></div><div><b>₹{data.revenue}</b><span>Revenue</span></div></div>
    <h2>All Bookings</h2>
    <div className="booking-grid">{(data.bookings || []).map(b=><div className="booking-card" key={b.id}><h3>{b.name}</h3><p>{b.email}</p><p>{b.numberOfTickets} tickets • ₹{b.totalAmount}</p><p>Booking ID: {b.bookingId}</p></div>)}</div>
  </div>;
}
export default AdminDashboard;
