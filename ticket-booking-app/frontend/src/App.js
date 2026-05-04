import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventDetails from './components/EventDetails';
import BookingForm from './components/BookingForm';
import BookingSummary from './components/BookingSummary';
import OtpVerification from './components/OtpVerification';
import Chatbot from './components/Chatbot';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { getEvent } from './services/api';
import './App.css';

function BookingPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [step, setStep] = useState('booking');
  const [pendingBooking, setPendingBooking] = useState(null);

  useEffect(() => { fetchEvent(); }, []);

  const fetchEvent = async () => {
    try { setLoading(true); setEvent(await getEvent(1)); }
    catch (err) { setError('Failed to load event details. Start backend and check database seed.'); }
    finally { setLoading(false); }
  };

  const handleBookingSubmit = (formData) => { setPendingBooking(formData); setStep('otp'); };
  const handleOtpVerified = (confirmedBooking) => {
    setBookingData(confirmedBooking);
    setEvent(prev => ({ ...prev, availableTickets: prev.availableTickets - confirmedBooking.numberOfTickets }));
    setStep('success');
  };
  const handleReset = () => { setPendingBooking(null); setBookingData(null); setStep('booking'); };

  if (loading) return <div className="loading-screen"><div className="spinner"></div><p>Loading event details...</p></div>;
  if (error) return <div className="error-screen"><h2>⚠️ {error}</h2><button onClick={fetchEvent} className="retry-btn">Retry</button></div>;

  return <div className="app"><main className="main-content"><div className="container">
    {event && <EventDetails event={event} />}
    <div className="booking-section">
      {step === 'booking' && <BookingForm event={event} onSubmit={handleBookingSubmit} />}
      {step === 'otp' && <OtpVerification email={pendingBooking?.email} pendingBooking={pendingBooking} onVerified={handleOtpVerified} onBack={() => setStep('booking')} />}
      {step === 'success' && bookingData && <BookingSummary booking={bookingData} event={event} onReset={handleReset} />}
    </div>
  </div></main><Chatbot event={event} /></div>;
}

function Home() { return <Navigate to="/book" replace />; }

function App() {
  return <AuthProvider><BrowserRouter><Navbar /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/book" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
  </Routes></BrowserRouter></AuthProvider>;
}
export default App;
