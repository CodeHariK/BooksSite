import React from 'react';

const AnnouncementBar: React.FC = () => {
  return (
    <section id="shopify-section-announcement-bar" className="shopify-section announcement-bar-design">
      <div className="announcement-bar" style={{ display: 'block', backgroundColor: '#ffffff', color: '#000000' }}>
        <div className="announcement-bar-slider">
          <div className="announcement-bar-slide active" style={{ color: '#000000' }}>
            <p><strong>Payday Sale! Get ₹100 Off</strong> on orders above ₹1099. Use code: <strong>PD100</strong>.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Header: React.FC = () => {
  return (
    <header className="header-sticky">
      <AnnouncementBar />
      <div id="shopify-section-main-header" className="shopify-section">
        <div className="main-header-container">
          <div className="container">
            <div className="header-container">
              {/* LOGO */}
              <a href="/" className="header-logo-container">
                <img
                  width="171"
                  height="59"
                  className="logo-main"
                  src="/temp_assets/logo(1).svg"
                  alt="Crossword.in"
                />
              </a>

              {/* MOBILE ICONS */}
              <div className="mob-menu">
                <img
                  width="36"
                  height="36"
                  src="/temp_assets/mob-search.svg"
                  alt="search"
                  className="wz-search-icon"
                  style={{ cursor: 'pointer' }}
                />
                <a href="/account" className="add-mob-menu show-account-btn" id="rzp-account-icon">
                  <img width="18" height="18" src="/temp_assets/user.svg" alt="User" />
                </a>
              </div>

              {/* MAIN MENU */}
              <div className="menu-list-container">
                <ul className="menu-list" role="menubar">
                  <li className="menu-item" role="menuitem">
                    <a href="#">Books</a>
                  </li>
                  <li className="menu-item" role="menuitem">
                    <a href="#">Stationery</a>
                  </li>
                  <li className="menu-item" role="menuitem">
                    <a href="#">Toys</a>
                  </li>
                  <li className="menu-item" role="menuitem">
                    <a href="#">Gifts</a>
                  </li>
                </ul>
              </div>

              {/* SEARCH */}
              <div className="search-container">
                <form className="wz-search-form">
                  <div className="search-bar">
                    <img
                      className="search-submit"
                      aria-hidden="true"
                      width="20"
                      height="20"
                      src="/temp_assets/search.svg"
                      alt="search"
                      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    />
                    <input
                      type="text"
                      name="search"
                      id="search"
                      placeholder="Search For ISB"
                      className="wizzy-search-input"
                    />
                  </div>
                </form>
              </div>

              {/* ICONS */}
              <div className="icons-list">
                <div className="icons-list-item">
                  <a href="#">
                    <img width="30" height="30" src="/temp_assets/gift.svg" alt="gift" />
                  </a>
                </div>
                <div className="icons-list-item">
                  <a href="/account" className="show-account-btn">
                    <img width="30" height="30" src="/temp_assets/account.svg" alt="account" />
                  </a>
                </div>
                <div className="icons-list-item icons-list-item-block cartopen">
                  <img
                    id="cartIcon"
                    width="30"
                    height="30"
                    src="/temp_assets/empty_cart.svg"
                    alt="Cart Empty"
                  />
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
