import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';



const Header: React.FC = () => {
  const { user, userProfile, logout } = useAuth();

  return (
    <header className="shopify-section header-section sticky">
      <div className="main-header-container">
        <div className="container">
          <div className="header-container">
            {/* Mobile Menu Icon */}
            <div className="mob-menu d-768-block" style={{ display: 'none' }}>
              <img src="/temp_assets/menu.svg" alt="Menu" width="30" height="30" />
            </div>

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
                <li className="menu-list-item"><Link to="/about">About</Link></li>
                <li className="menu-list-item"><Link to="/catalogue">Book Catalogue</Link></li>
                <li className="menu-list-item"><Link to="/buy">Buy Books</Link></li>
                <li className="menu-list-item"><Link to="/publish">Publish with Us</Link></li>
                <li className="menu-list-item"><Link to="/contact">Contact</Link></li>
              </ul>
            </nav>

            <div className="d-767-none" style={{ flex: 1 }}></div>

            {/* Icons List */}
            <div className="icons-list">
              <div className="icons-list-item profile-dropdown-container">
                {user ? (
                  <>
                    <div className="profile-trigger" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <img 
                        src={userProfile?.imageUrl || "/temp_assets/account.svg"} 
                        alt="Profile" 
                        width="32" height="32" 
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: '500', textTransform: 'capitalize' }}>
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                    </div>
                    <div className="profile-dropdown">
                      <Link to="/profile" className="dropdown-item">View Profile</Link>
                      <button onClick={logout} className="dropdown-item logout-btn">Logout</button>
                    </div>
                  </>
                ) : (
                  <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                    <img src="/temp_assets/account.svg" alt="Login" width="30" height="30" />
                    <span style={{ fontSize: '12px' }}>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};


export default Header;

