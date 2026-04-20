import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, userProfile, logout } = useAuth();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="shopify-section header-section sticky">
      <div className="main-header-container">
        <div className="container">
          <div className="header-container">
            {/* Logo */}
            <div className="header-logo-container">
              <Link to="/">
                <img src="/aghorin_logo.png" alt="Aghorin Logo" width="171" height="59" className="header-logo" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="menu-list-container">
              <ul className="menu-list">
                <li className="menu-list-item"><Link to="/">Home</Link></li>
                <li className="menu-list-item"><Link to="/catalogue">Book Catalogue</Link></li>
                <li className="menu-list-item"><Link to="/buy">Buy Books</Link></li>
                <li className="menu-list-item"><Link to="/publish">Publish with Us</Link></li>
                <li className="menu-list-item"><Link to="/contact">Contact</Link></li>
                <li className="menu-list-item"><Link to="/about">About</Link></li>
              </ul>
            </nav>

            <div className="spacer" style={{ flex: 1 }}></div>

            {/* Icons List */}
            <div className="icons-list">
              <div className="icons-list-item profile-dropdown-container">
                <div className="profile-trigger" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <img
                    src={userProfile?.imageUrl || "/temp_assets/account.svg"}
                    alt="Profile"
                    width="32" height="32"
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span className="user-name-header">
                    {user ? (user.displayName || user.email?.split('@')[0]) : 'Menu'}
                  </span>
                </div>
                
                <div className="profile-dropdown">
                  {/* Show Nav Links in Dropdown on Mobile */}
                  {windowWidth <= 1000 && (
                    <>
                      <Link to="/" className="dropdown-item">Home</Link>
                      <Link to="/catalogue" className="dropdown-item">Book Catalogue</Link>
                      <Link to="/buy" className="dropdown-item">Buy Books</Link>
                      <Link to="/publish" className="dropdown-item">Publish with Us</Link>
                      <Link to="/contact" className="dropdown-item">Contact</Link>
                      <Link to="/about" className="dropdown-item">About</Link>
                      <div style={{ height: '1px', background: '#eee', margin: '5px 0' }} />
                    </>
                  )}
                  
                  {user ? (
                    <>
                      <Link to="/profile" className="dropdown-item">View Profile</Link>
                      <button onClick={logout} className="dropdown-item logout-btn">Logout</button>
                    </>
                  ) : (
                    <Link to="/login" className="dropdown-item">Login / Register</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

