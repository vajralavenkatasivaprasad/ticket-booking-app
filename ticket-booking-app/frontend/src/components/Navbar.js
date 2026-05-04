import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/login'); };
  return <nav className="navbar">
    <Link className="brand" to="/">🎟 EventPass</Link>
    <div className="nav-links">
      <Link to="/book">Book</Link>
      {isAuthenticated && <Link to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}>Dashboard</Link>}
      {!isAuthenticated ? <><Link to="/login">Login</Link><Link className="nav-cta" to="/register">Register</Link></> : <button onClick={signOut}>Logout</button>}
    </div>
  </nav>;
}
export default Navbar;
