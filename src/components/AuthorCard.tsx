import React from 'react';
import { Link } from 'react-router-dom';
import type { UserProfile } from '../types';

export const AuthorCard: React.FC<UserProfile> = ({ displayName, imageUrl, uid }) => {
  return (
    <div className="product-item author-card">
      <div className="product-item-container">
        <Link to={`/author/${uid}`}>
          <div className="product-item-img-container cust-produt" style={{ borderRadius: '50%', overflow: 'hidden', padding: '10px' }}>
            <img
              className="product-card-first-img"
              loading="lazy"
              width="375"
              height="375"
              src={imageUrl || '/temp_assets/jk.png'}
              alt={displayName}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
        </Link>
        
        <div className="product-item-content-container" style={{ textAlign: 'center' }}>
          <div className="product-item-content">
            <p className="product-item-title" style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{displayName}</p>
            <div className="author-min-space">
              <p className="product-item-author">
                View Published Books
              </p>
            </div>
          </div>
          
          <Link to={`/author/${uid}`} className="cart-icon addToCart" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffdd2e' }}>
            <img
              src="/temp_assets/arrow-up-right.svg"
              height="20"
              width="20"
              alt="Explore"
              loading="lazy"
              style={{ marginRight: '8px' }}
            />
            Explore Books
          </Link>
        </div>
      </div>
    </div>
  );
};

