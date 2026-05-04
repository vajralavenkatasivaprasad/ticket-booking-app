import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authService';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Email and password are required');
    try {
      setLoading(true);
      const data = await loginUser(form);
      login(data);
      navigate(data.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.displayMessage || 'Login failed');
    } finally { setLoading(false); }
  };

  return <div className="auth-page"><form className="auth-card" onSubmit={submit}>
    <h1>Welcome Back</h1><p>Login to book and manage event tickets.</p>
    {error && <div className="auth-error">{error}</div>}
    <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
    <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
    <button disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
    <span>New user? <Link to="/register">Create account</Link></span>
  </form></div>;
}
export default Login;
