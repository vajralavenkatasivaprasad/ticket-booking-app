import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/authService';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name:'', email:'', password:'', department:'', role:'STUDENT' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const update = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.department) return setError('All fields are required');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    try {
      setLoading(true);
      const data = await registerUser(form);
      login(data);
      navigate(data.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) { setError(err.displayMessage || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return <div className="auth-page"><form className="auth-card" onSubmit={submit}>
    <h1>Create Account</h1><p>Register as student/faculty or admin.</p>
    {error && <div className="auth-error">{error}</div>}
    <input name="name" placeholder="Full name" value={form.name} onChange={update}/>
    <input name="email" type="email" placeholder="Email" value={form.email} onChange={update}/>
    <input name="password" type="password" placeholder="Password" value={form.password} onChange={update}/>
    <input name="department" placeholder="Department" value={form.department} onChange={update}/>
    <select name="role" value={form.role} onChange={update}><option>STUDENT</option><option>ADMIN</option></select>
    <button disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
    <span>Already have account? <Link to="/login">Login</Link></span>
  </form></div>;
}
export default Register;
