import React, { useContext, useState, useCallback, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, ChevronDown, Settings, Briefcase } from 'lucide-react';
import { AppContent } from '../../context/AppContext';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { userData, token, logout } = useContext(AppContent);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Check if user is authenticated
  const isAuthenticated = !!token;

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Toggle dropdown menu
  const toggleDropdown = useCallback(() => {
    setShowDropdown(prev => !prev);
  }, []);

  // Handle menu item click
  const handleMenuItemClick = useCallback(() => {
    setShowDropdown(false);
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    logout();
    setShowDropdown(false);
    navigate('/');
  }, [logout, navigate]);

  // Handle navigation
  const handleNavigation = useCallback((path) => {
    navigate(path);
    handleMenuItemClick();
  }, [navigate, handleMenuItemClick]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`merged-header ${isAuthenticated ? 'authenticated' : 'public'}`}>
      <div className="header-content">
        <div className="header-left">
          {isAuthenticated && (
            <button 
              className="menu-button" 
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          
          <div 
            className="logo-container" 
            onClick={() => handleNavigation('/')}
          >
            <div className="logo-circle">
              <svg className="logo" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm2 0v2h2v-2H6zM4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm2 0v2h2V5H6zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm2 0v2h2V5h-2zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4zm2 0v2h2v-2h-2z" />
              </svg>
            </div>
            <h1 className="header-title">InvestTrack</h1>
          </div>
        </div>

        <div className="nav-items">

          {isAuthenticated && (
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              Dashboard
            </NavLink>
          )}
          <NavLink 
            to="/about-us" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            About Us
          </NavLink>
        </div>

        <div className="header-right">
          <div className="date">{currentDate}</div>
          
          {isAuthenticated ? (
            <div className="user-profile" ref={dropdownRef}>
              <div 
                className="profile-trigger"
                onClick={toggleDropdown}
                aria-expanded={showDropdown}
              >
                <div className="user-avatar">
                  {userData?.name ? userData.name[0].toUpperCase() : 'U'}
                </div>
                <span className="user-name">{userData?.name || 'User'}</span>
                <ChevronDown 
                  size={16} 
                  className={`dropdown-chevron ${showDropdown ? 'rotated' : ''}`}
                />
              </div>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {userData?.name ? userData.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="dropdown-user-info">
                      <p className="dropdown-user-name">{userData?.name || 'User'}</p>
                      <p className="dropdown-user-email">{userData?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <NavLink 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={handleMenuItemClick}
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/portfolio" 
                    className="dropdown-item"
                    onClick={handleMenuItemClick}
                  >
                    <Briefcase size={16} />
                    <span>My Portfolio</span>
                  </NavLink>
                  
                  <NavLink 
                    to="/settings" 
                    className="dropdown-item"
                    onClick={handleMenuItemClick}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </NavLink>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="login-button"
                onClick={() => handleNavigation('/login')}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;