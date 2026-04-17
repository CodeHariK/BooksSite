import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import type { Book } from '../types';

const BookPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    phone: '',
    city: ''
  });
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
  const [leadMessage, setLeadMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);



  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;
      try {
        const docRef = doc(db, 'books', bookId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const bookData = { id: docSnap.id, ...docSnap.data() } as Book;

          // Visibility Check: Only show if published, or if user is author/admin
          if (!bookData.isPublished &&
            (!user || (user.uid !== bookData.authorId && !userProfile?.isAdmin))) {
            setError("This book is currently under review and is not yet public.");
            setLoading(false);
            return;
          }

          setBook(bookData);
        } else {
          setError("Book not found.");
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId, user, userProfile]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2>{error}</h2>
        <Link to="/" className="explore-cta" style={{ margin: '20px auto' }}>
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

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

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;
    setIsLeadSubmitting(true);
    setLeadMessage(null);

    try {
      const mailRef = collection(db, 'mail');
      await addDoc(mailRef, {
        to: 'sajjayak@gmail.com',
        message: {
          subject: `NEW BOOK ORDER REQUEST: ${book.title}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #ffa100;">Purchase Request Received</h2>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p><strong>Book:</strong> ${book.title}</p>
                <p><strong>Book ID:</strong> ${book.id}</p>
              </div>
              <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Customer Info</h3>
              <p><strong>Name:</strong> ${leadFormData.name}</p>
              <p><strong>Mobile:</strong> ${leadFormData.phone}</p>
              <p><strong>City:</strong> ${leadFormData.city}</p>
              <hr />
              <p style="font-size: 12px; color: #666;">Contact the customer to fulfill the order.</p>
            </div>
          `
        }
      });

      setLeadMessage({ type: 'success', text: 'Request sent! We will contact you soon.' });
      setTimeout(() => {
        setIsModalOpen(false);
        setLeadMessage(null);
        setLeadFormData({ name: '', phone: '', city: '' });
      }, 3000);
    } catch (error) {
      console.error("Error sending book lead:", error);
      setLeadMessage({ type: 'error', text: 'Failed to send request.' });
    } finally {
      setIsLeadSubmitting(false);
    }
  };

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

            <Link to={`/author/${book.authorId}`} className="pdp-author-name">
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

                <button className="transparent-btn up-buyNow-btn addToCart" onClick={() => setIsModalOpen(true)}>
                  Buy Now
                  <img width="16" height="16" src="https://cdn.shopify.com/s/files/1/0648/3066/9017/files/arrow-up-right_1.svg?v=1762170869" alt="buy now" />
                </button>
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
      {/* Lead Generation Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '450px',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '24px' }}>
              &times;
            </button>
            <h3 style={{ marginBottom: '10px' }}>Request to Buy</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Enter your details and we will contact you for payment and delivery.</p>

            <form onSubmit={handleLeadSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Your Name</label>
                <input
                  type="text"
                  required
                  value={leadFormData.name}
                  onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={leadFormData.phone}
                  onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>City</label>
                <input
                  type="text"
                  required
                  value={leadFormData.city}
                  onChange={(e) => setLeadFormData({ ...leadFormData, city: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              {leadMessage && (
                <p style={{
                  padding: '10px',
                  borderRadius: '6px',
                  marginBottom: '15px',
                  fontSize: '13px',
                  backgroundColor: leadMessage.type === 'success' ? '#e6fffa' : '#fff5f5',
                  color: leadMessage.type === 'success' ? '#2c7a7b' : '#c53030'
                }}>
                  {leadMessage.text}
                </p>
              )}

              <button
                type="submit"
                disabled={isLeadSubmitting}
                className="explore-cta"
                style={{ width: '100%', justifyContent: 'center', backgroundColor: '#ffa100' }}
              >
                <span>{isLeadSubmitting ? 'Sending...' : 'Confirm Request'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookPage;
