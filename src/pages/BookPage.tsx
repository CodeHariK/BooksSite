import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { allBooks } from '../data/books';

const BookPage: React.FC = () => {
  const { bookTitle } = useParams<{ bookTitle: string }>();
  const [isExpanded, setIsExpanded] = useState(false);

  const decodedTitle = decodeURIComponent(bookTitle || "");
  const book = allBooks.find(b => b.title.toLowerCase() === decodedTitle.toLowerCase());

  if (!book) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2>Book not found</h2>
        <Link to="/" className="explore-cta" style={{ margin: '20px auto' }}>
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  const toggleSummary = () => setIsExpanded(!isExpanded);

  return (
    <div className="pdp-banner">
      <div className="container">
        <div className="pdp-banner-container">
          <div className="pdp-banner-slider-container">
            <div className="pdp-banner-slider-nav-container">
              <div className="pdp-banner-slider-nav">
                <div className="pdp-banner-slider-slide">
                  <img width="1260" height="750" src={book.image} alt={book.title} />
                </div>
              </div>
            </div>
            <div className="pdp-banner-slider">
              <div className="pdp-banner-slider-slide">
                <img width="1260" height="750" src={book.image} alt={book.title} />
              </div>
            </div>
          </div>

          <div className="pdp-banner-content-container">
            <div className="title-container">
              <h1 className="pdp-title">{book.title}</h1>
              <div className="pdp-icons-container">
                <div className="share-wrapper wishlist-container">
                  <svg className="share-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" fill="white"></rect>
                    <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" stroke="black"></rect>
                    <path d="M29 20.6667C30.3807 20.6667 31.5 19.5474 31.5 18.1667C31.5 16.7859 30.3807 15.6667 29 15.6667C27.6193 15.6667 26.5 16.7859 26.5 18.1667C26.5 19.5474 27.6193 20.6667 29 20.6667Z" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M19 26.5C20.3807 26.5 21.5 25.3807 21.5 24C21.5 22.6193 20.3807 21.5 19 21.5C17.6193 21.5 16.5 22.6193 16.5 24C16.5 25.3807 17.6193 26.5 19 26.5Z" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M29 32.3333C30.3807 32.3333 31.5 31.2141 31.5 29.8333C31.5 28.4526 30.3807 27.3333 29 27.3333C27.6193 27.3333 26.5 28.4526 26.5 29.8333C26.5 31.2141 27.6193 32.3333 29 32.3333Z" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M21.1582 25.2583L26.8499 28.575" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M26.8415 19.425L21.1582 22.7417" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </div>
              </div>
            </div>

            <Link to={`/author/${encodeURIComponent(book.author)}`} className="pdp-author-name">
              {book.author}
            </Link>

            <div className="pdp-price-wrapper">
              <div className="pdp-price-inner-wrapper">
                {book.originalPrice && (
                  <p className="pdp-compare-price">
                    <span>MRP: </span>
                    <span className="compare-line-through">₹ {book.originalPrice}</span>
                  </p>
                )}
                <p className="pdp-price">₹ {book.price}</p>
                {book.discount && (
                  <div className="pdp-discount-tag-container">
                    <div className="discount-tag">
                      <p className="discount-percent">
                        <span>₹ </span>{book.discount} <span>Off</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="inclusive-tax-text">(Incl. of all taxes)</p>
            </div>

            <div className="cta-container">
              <div className="cta-btn-container">
                <button className="primary-btn addToCart">
                  Add to Bag
                  <img width="18" height="18" src="https://cdn.shopify.com/s/files/1/0975/6010/1045/files/shopping-bag.svg?v=1760623297" alt="add to cart" />
                </button>
                <button className="transparent-btn up-buyNow-btn addToCart">
                  Buy Now
                  <img width="16" height="16" src="https://cdn.shopify.com/s/files/1/0648/3066/9017/files/arrow-up-right_1.svg?v=1762170869" alt="buy now" />
                </button>
              </div>
            </div>

            <div className="delivery-options">
              <h3 className="delivery-options__title">Delivery Options</h3>
              <div className="delivery-options__pincode">
                <input type="text" placeholder="Enter Your Pincode" id="pincodeInput" />
              </div>
            </div>

            <div className="pdp-table-info">
              {book.pages && (
                <div className="pdp-table-row">
                  <p className="pdp-table-column-1">Number of Pages</p>
                  <p className="pdp-table-column-2">{book.pages}</p>
                </div>
              )}
            </div>

            <div className="pdp-features">
              <div className="pdp-feature">
                <img width="50" height="50" src="//www.crossword.in/cdn/shop/files/Piracy_Free_6e5bce63-8a09-468b-a5f1-ba48366f3329.svg?v=1766726795" alt="Piracy Free" />
                <p>Piracy Free</p>
              </div>
              <div className="pdp-feature">
                <img width="50" height="50" src="//www.crossword.in/cdn/shop/files/Secure_Transactions_2f568076-104f-4cf1-9fb0-471805e41256.svg?v=1766726741" alt="Secure Transactions" />
                <p>Secure Transactions</p>
              </div>
            </div>

            <div className="book-summary">
              <p className="book-summary-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                  <path d="M13.0518 0.324672C13.1448 -0.108231 13.7625 -0.10823 13.8554 0.324674L14.934 5.34733C15.6468 8.66708 18.2401 11.2603 21.5598 11.9732L26.5825 13.0518C27.0154 13.1447 27.0154 13.7624 26.5825 13.8554L21.5598 14.9339C18.2401 15.6468 15.6468 18.24 14.934 21.5598L13.8554 26.5824C13.7625 27.0153 13.1448 27.0153 13.0518 26.5824L11.9733 21.5598C11.2604 18.24 8.66714 15.6468 5.34738 14.9339L0.324733 13.8554C-0.10817 13.7624 -0.108169 13.1447 0.324735 13.0518L5.34738 11.9732C8.66714 11.2603 11.2604 8.66708 11.9733 5.34732L13.0518 0.324672Z" fill="#CEABEB" />
                </svg>
                Book Summary
              </p>
              <div className="book-summary-desc">
                <div className={`summary-preview ${isExpanded ? 'expanded' : ''}`}>
                  <p>{book.summary}</p>
                  {isExpanded && (
                    <div className="summary-full">
                      <p>Experience the ultimate mission for survival.</p>
                      {/* Placeholder for more summary text if it's longer */}
                    </div>
                  )}
                </div>
                <button className="read-more-btn" onClick={toggleSummary} style={{ cursor: 'pointer', border: 'none', background: 'none' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                    <path d="M7.5 18.75L15 11.25L22.5 18.75" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="pdp-details-accordion">
              <p className="pdp-details-accordion-title">
                Product Details
              </p>
              <div className="pdp-table-info">
                <div className="pdp-table-row">
                  <p className="pdp-table-column-1">Author</p>
                  <p className="pdp-table-column-2">{book.author}</p>
                </div>
                {book.pages && (
                  <div className="pdp-table-row">
                    <p className="pdp-table-column-1">Number of Pages</p>
                    <p className="pdp-table-column-2">{book.pages}</p>
                  </div>
                )}
                {book.dimensions && (
                  <div className="pdp-table-row">
                    <p className="pdp-table-column-1">Dimensions</p>
                    <p className="pdp-table-column-2">{book.dimensions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage;
