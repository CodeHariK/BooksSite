import React from 'react';
import { useParams } from 'react-router-dom';
import { allBooks } from '../data/books';
import { ProductCard } from '../components/ProductSections';

const AuthorPage: React.FC = () => {
  const { authorName } = useParams<{ authorName: string }>();
  
  const decodedAuthorName = decodeURIComponent(authorName || "");
  const authorBooks = allBooks.filter(book => 
    book.author.toLowerCase() === decodedAuthorName.toLowerCase()
  );

  return (
    <div className="shopify-section collection-product-listing-sec" style={{ minHeight: '60vh', padding: '40px 0' }}>
      <section className="collection-product-listing-container">
        <div className="collection-product-listing">
          <div className="container">
            <div className="collection-product-listing-title" style={{ marginBottom: '40px' }}>
              <div className="collection-product-listing-title-container">
                <h2 className="sec-title">Books by {decodedAuthorName}</h2>
                <p className="sec-desc">Explore the collection from your favorite author.</p>
              </div>
            </div>

            {authorBooks.length > 0 ? (
              <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {authorBooks.map((book) => (
                  <ProductCard key={book.title} {...book} />
                ))}
              </div>
            ) : (
              <div className="no-books-found" style={{ textAlign: 'center', padding: '40px' }}>
                <h3>No books found for this author.</h3>
                <p>We are constantly updating our collection. Please check back later!</p>
                <a href="/" className="explore-cta" style={{ margin: '20px auto' }}>
                  <span>Back to Home</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthorPage;
