import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

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
                <img
                  src="/temp_assets/logo_1.svg"
                  alt="Crossword Logo"
                  width="171"
                  height="59"
                  className="header-logo"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="menu-list-container d-767-none">
              <ul className="menu-list">
                <li className="menu-list-item"><Link to="/">Home</Link></li>
                <li className="menu-list-item"><Link to="/authors">Authors</Link></li>
                <li className="menu-list-item"><Link to="/author-submission">Submit Manuscript</Link></li>
              </ul>
            </nav>

            {/* Search Bar Placeholder */}
            <div className="search-container d-767-none">
              <div className="search-bar">
                <input type="text" placeholder="Search for books, authors..." />
                <button className="search-submit">
                  <img src="/temp_assets/search.svg" alt="Search" width="20" height="20" />
                </button>
              </div>
            </div>

            {/* Icons List (Account, Wishlist, Cart) */}
            <div className="icons-list">
              {/* Account Icon */}
              <div className="icons-list-item show-account-btn">
                {user ? (
                  <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                    <img src="/temp_assets/account.svg" alt="Profile" width="30" height="30" />
                    <span className="d-767-none" style={{ fontSize: '12px' }}>Profile</span>
                  </Link>
                ) : (
                  <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                    <img src="/temp_assets/account.svg" alt="Login" width="30" height="30" />
                    <span className="d-767-none" style={{ fontSize: '12px' }}>Login</span>
                  </Link>
                )}
              </div>

              {/* Wishlist Icon */}
              <div className="icons-list-item wishlist d-767-none">
                <Link to="/" className="wishlist-link">
                  <img src="/temp_assets/wishlist.svg" alt="Wishlist" width="30" height="30" />
                  <span className="wishlist-count">0</span>
                </Link>
              </div>

              {/* Cart Icon */}
              <div className="icons-list-item cart-button cartopen">
                <Link to="/" className="cart-link" style={{ display: 'flex', alignItems: 'center' }}>
                  <img src="/temp_assets/shopping-bag.svg" alt="Cart" width="30" height="30" />
                  <span className="d-767-none" style={{ marginLeft: '5px', fontSize: '12px' }}>Bag</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
