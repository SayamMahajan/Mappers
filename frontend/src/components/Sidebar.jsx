import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Navigation</h3>
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-item active">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/profile">Profile</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/settings">Settings</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/help">Help</Link>
        </li>
      </ul>
    </div>
  );
}
