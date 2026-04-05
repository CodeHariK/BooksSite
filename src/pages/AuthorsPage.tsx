import React from 'react';
import { allAuthors } from '../data/authors';
import { AuthorCard } from '../components/AuthorCard';

const AuthorsPage: React.FC = () => {
  return (
    <div className="shopify-section collection-product-listing-sec" style={{ minHeight: '80vh', padding: '60px 0' }}>
      <section className="collection-product-listing-container">
        <div className="collection-product-listing">
          <div className="container">
            <div className="collection-product-listing-title" style={{ marginBottom: '50px', textAlign: 'center' }}>
              <div className="collection-product-listing-title-container" style={{ width: '100%' }}>
                <h2 className="sec-title" style={{ fontSize: '3rem', marginBottom: '15px' }}>Meet Our Authors</h2>
                <p className="sec-desc" style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                  Discover the minds behind your favorite stories and deep-dives. 
                  From legendary novelists to modern-day entrepreneurs.
                </p>
              </div>
            </div>

            <div className="products-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '40px',
              justifyContent: 'center'
            }}>
              {allAuthors.map((author) => (
                <AuthorCard key={author.name} {...author} />
              ))}
            </div>
            
            {allAuthors.length === 0 && (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>No authors listed yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthorsPage;
