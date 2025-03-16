import React from 'react';

export default function Navbar({ userName, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Mappers</h1>
      </div>
      <div className="navbar-user">
        <span>Welcome, {userName}!</span>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
