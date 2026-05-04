import React, { useState, useEffect, useRef } from 'react';
import { verifyOtp, confirmBooking, resendOtp } from '../services/api';
import './OtpVerification.css';

function OtpVerification({ email, pendingBooking, onVerified, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasted.every(c => /\d/.test(c))) {
      setOtp([...pasted, ...Array(6 - pasted.length).fill('')]);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) { setError('Please enter the complete 6-digit OTP'); return; }

    setVerifying(true);
    try {
      await verifyOtp(email, otpStr);
      const confirmed = await confirmBooking(pendingBooking);
      onVerified(confirmed);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOtp(email);
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      setError('');
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="otp-section card">
      <div className="otp-icon">🔐</div>
      <h2 className="otp-title">Verify Your Email</h2>
      <p className="otp-subtitle">
        We've sent a 6-digit OTP to<br />
        <strong>{email}</strong>
      </p>

      <div className="otp-inputs" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`otp-input ${error ? 'error' : ''} ${digit ? 'filled' : ''}`}
            autoFocus={i === 0}
          />
        ))}
      </div>

      {error && <p className="error-msg otp-error">{error}</p>}

      <button
        className="btn-primary"
        onClick={handleVerify}
        disabled={verifying || otp.join('').length !== 6}
      >
        {verifying ? 'Verifying...' : '✅ Confirm Booking'}
      </button>

      <div className="otp-resend">
        {countdown > 0 ? (
          <span>Resend OTP in <strong>{countdown}s</strong></span>
        ) : (
          <button
            className="resend-btn"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? 'Sending...' : '🔄 Resend OTP'}
          </button>
        )}
      </div>

      <button className="btn-secondary back-btn" onClick={onBack}>
        ← Change Details
      </button>
    </div>
  );
}

export default OtpVerification;
