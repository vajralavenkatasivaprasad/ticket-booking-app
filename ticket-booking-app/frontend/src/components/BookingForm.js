import React, { useState } from 'react';
import { sendOtp } from '../services/api';
import './BookingForm.css';

const DEPARTMENTS = [
  'Computer Science', 'Electronics', 'Mechanical', 'Civil',
  'Information Technology', 'Electrical', 'Chemical', 'Faculty', 'Other'
];

function BookingForm({ event, onSubmit }) {
  const [form, setForm] = useState({
    name: '', email: '', department: '', numberOfTickets: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    else if (form.name.trim().length < 3) errs.name = 'Name must be at least 3 characters';

    if (!form.email.trim()) errs.email = 'Email ID is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Please enter a valid email address';

    if (!form.department) errs.department = 'Department is required';

    if (!form.numberOfTickets) errs.numberOfTickets = 'Number of tickets is required';
    else if (isNaN(form.numberOfTickets) || parseInt(form.numberOfTickets) <= 0)
      errs.numberOfTickets = 'Please enter a positive number';
    else if (parseInt(form.numberOfTickets) > event.availableTickets)
      errs.numberOfTickets = `Only ${event.availableTickets} tickets available`;
    else if (parseInt(form.numberOfTickets) > 10)
      errs.numberOfTickets = 'Maximum 10 tickets per booking';

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await sendOtp(form.email);
      onSubmit({ ...form, numberOfTickets: parseInt(form.numberOfTickets) });
    } catch (err) {
      setServerError('Failed to send OTP. Please check your email and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({ name: '', email: '', department: '', numberOfTickets: '' });
    setErrors({});
    setServerError('');
  };

  const totalAmount = (parseInt(form.numberOfTickets) || 0) * event.ticketPrice;

  return (
    <div className="booking-form card">
      <div className="form-header">
        <h2 className="form-title">Book Your Tickets</h2>
        <p className="form-subtitle">Fill in your details to reserve your spot</p>
      </div>

      {serverError && (
        <div className="server-error">⚠️ {serverError}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Full Name <span className="required">*</span></label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={errors.name ? 'error' : ''}
            autoComplete="name"
          />
          {errors.name && <p className="error-msg">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email ID <span className="required">*</span></label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={errors.email ? 'error' : ''}
            autoComplete="email"
          />
          {errors.email && <p className="error-msg">{errors.email}</p>}
          <p className="field-hint">OTP will be sent to this email for verification</p>
        </div>

        <div className="form-group">
          <label htmlFor="department">Department <span className="required">*</span></label>
          <select
            id="department"
            name="department"
            value={form.department}
            onChange={handleChange}
            className={errors.department ? 'error' : ''}
          >
            <option value="">Select your department</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.department && <p className="error-msg">{errors.department}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="numberOfTickets">
            Number of Tickets <span className="required">*</span>
          </label>
          <input
            id="numberOfTickets"
            name="numberOfTickets"
            type="number"
            value={form.numberOfTickets}
            onChange={handleChange}
            placeholder="Enter quantity (max 10)"
            min="1"
            max={Math.min(event.availableTickets, 10)}
            className={errors.numberOfTickets ? 'error' : ''}
          />
          {errors.numberOfTickets && <p className="error-msg">{errors.numberOfTickets}</p>}
        </div>

        {totalAmount > 0 && (
          <div className="total-preview">
            <span>Total Amount</span>
            <span className="total-amount">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting || event.availableTickets === 0}>
            {submitting ? 'Sending OTP...' : event.availableTickets === 0 ? 'Sold Out' : '🔐 Verify & Book Tickets'}
          </button>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
