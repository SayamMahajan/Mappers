import React, { useState, useEffect } from 'react';

export default function Navbar({ userName, onLogout, toggleSidebar }) {
  // Get the first letter of the user's name for avatar
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Add scroll effect detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle navigation sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="navbar-brand">
          <h1>Mappers</h1>
        </div>
      </div>
      <div className="navbar-user">
        <div className="user-avatar" title={`Logged in as ${userName}`}>
          {userInitial}
        </div>
        <span>Welcome, {userName}!</span>
        <button 
          className="logout-button" 
          onClick={onLogout}
          aria-label="Log out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
