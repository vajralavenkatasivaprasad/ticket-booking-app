import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBookings } from '../services/authService';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  useEffect(()=>{ getMyBookings().then(setBookings).catch(e=>setError(e.displayMessage)); }, []);
  return <div className="dash-page">
    <div className="dash-hero"><h1>Hello, {user?.name}</h1><p>Your ticket booking dashboard</p><Link className="dash-btn" to="/book">Book New Ticket</Link></div>
    {error && <div className="dash-error">{error}</div>}
    <div className="stats"><div><b>{bookings.length}</b><span>Total Bookings</span></div><div><b>{bookings.reduce((s,b)=>s+b.numberOfTickets,0)}</b><span>Tickets</span></div><div><b>₹{bookings.reduce((s,b)=>s+b.totalAmount,0)}</b><span>Spent</span></div></div>
    <h2>My Bookings</h2>
    <div className="booking-grid">{bookings.length===0 ? <p>No bookings yet.</p> : bookings.map(b=><div className="booking-card" key={b.bookingId}><h3>{b.eventName}</h3><p>ID: {b.bookingId}</p><p>{b.numberOfTickets} ticket(s) • ₹{b.totalAmount}</p><p>{b.venue}</p></div>)}</div>
  </div>;
}
export default Dashboard;
