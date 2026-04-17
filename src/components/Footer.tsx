import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <div id="shopify-section-main-footer" className="shopify-section">
      <footer>
        <div className="container footer-sect">
          {/* Footer Logo + Contact */}
          <div className="main-footer-container">
            <div className="footer-logo-container">
              <Link to="/">
                <img
                  src="/aghorin_logo.png"
                  alt="Logo"
                  loading="lazy"
                  width="171"
                  height="59"
                />
              </Link>
              {/* <p>
                <a href="mailto:[EMAIL_ADDRESS]">[EMAIL_ADDRESS]</a>
                </p> */}
              {/* <p>
                <a href="tel:+91 85302 06759">+91 85302 06759</a>
                </p> */}
            </div>
            <p className="footer-description">Aghorin Books draws book lovers of all ages into a community where they can discover great books, engage with booklovers and meet their favourite literary personalities.</p>

            {/* Footer Menus */}
            <div className="footer-menu-container">
              {/* <div className="footer-menu-category">
                <p className="footer-menu-category-title">Category</p>
                <ul className="footer-menu-category-list">
                  <li className="footer-category-list-item"><a href="#">Books</a></li>
                  <li className="footer-category-list-item"><a href="#">Top 50</a></li>
                  <li className="footer-category-list-item"><a href="#">Aghorin Recommends</a></li>
                  <li className="footer-category-list-item"><a href="#">Toys & Games</a></li>
                  <li className="footer-category-list-item"><a href="#">Stationery & Gifts</a></li>
                  <li className="footer-category-list-item"><a href="#">The Write Place</a></li>
                </ul>
              </div> */}

              {/* <div className="footer-menu-category">
                <p className="footer-menu-category-title">Useful links</p>
                <ul className="footer-menu-category-list">
                  <li className="footer-category-list-item"><a href="#">Secure Shopping</a></li>
                  <li className="footer-category-list-item"><a href="#">Privacy Policy</a></li>
                  <li className="footer-category-list-item"><a href="#">Terms of Use</a></li>
                  <li className="footer-category-list-item"><a href="#">Shipping Policy</a></li>
                  <li className="footer-category-list-item"><a href="#">Returns Policy</a></li>
                  <li className="footer-category-list-item"><a href="#">Payment Option</a></li>
                </ul>
              </div> */}

              {/* <div className="footer-menu-category">
                <p className="footer-menu-category-title">About us</p>
                <ul className="footer-menu-category-list">
                  <li className="footer-category-list-item"><a href="#">About Us</a></li>
                  <li className="footer-category-list-item"><a href="#">Store Locator</a></li>
                  <li className="footer-category-list-item"><a href="#">Blogs</a></li>
                </ul>
              </div>

              <div className="footer-menu-category">
                <p className="footer-menu-category-title">Store & Support</p>
                <ul className="footer-menu-category-list">
                  <li className="footer-category-list-item"><a href="#">Careers</a></li>
                  <li className="footer-category-list-item"><a href="#">Become a Franchisee</a></li>
                  <li className="footer-category-list-item"><Link to="/contact">Contact Us</Link></li>
                  <li className="footer-category-list-item"><a href="#">Track your order</a></li>
                </ul>
              </div> */}
            </div>

          </div>

          {/* Bottom Footer */}
          <div className="bottom-footer-container">
            <p className="bottom-footer-content">Aghorin Books, Cochin, Kerala, India</p>
            <div className="bottom-footer-social-links">
              <div className="bottom-footer-social-link">
                <a href="#" target="_blank" rel="noopener">
                  <img src="/temp_assets/facebook.svg" alt="facebook" width="15" height="15" />
                </a>
              </div>
              <div className="bottom-footer-social-link">
                <a href="#" target="_blank" rel="noopener">
                  <img src="/temp_assets/linkedin.svg" alt="linkedin" width="15" height="15" />
                </a>
              </div>
              <div className="bottom-footer-social-link">
                <a href="#" target="_blank" rel="noopener">
                  <img src="/temp_assets/twitter-icon.svg" alt="twitter" width="15" height="15" />
                </a>
              </div>
              <div className="bottom-footer-social-link">
                <a href="#" target="_blank" rel="noopener">
                  <img src="/temp_assets/instagram.svg" alt="instagram" width="15" height="15" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
