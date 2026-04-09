import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { ProductCard, type ProductProps } from '../components/ProductSections';

const AuthorPage: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const [authorBooks, setAuthorBooks] = useState<ProductProps[]>([]);
  const [authorName, setAuthorName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!authorId) return;
      try {
        // 1. Fetch Author Profile to get the name
        const authorDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', authorId)));
        if (!authorDoc.empty) {
          setAuthorName(authorDoc.docs[0].data().displayName || "Unknown Author");
        } else {
          setAuthorName("Unknown Author");
        }

        // 2. Query books by authorId
        const q = query(
          collection(db, 'books'), 
          where('authorId', '==', authorId),
          where('isPublished', '==', true)
        );
        const querySnapshot = await getDocs(q);
        const booksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductProps));
        setAuthorBooks(booksData);
      } catch (error) {
        console.error("Error fetching author data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authorId]);

  if (loading) {
    return (
      <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading books...</p>
      </div>
    );
  }


  return (
    <div className="shopify-section collection-product-listing-sec" style={{ minHeight: '60vh', padding: '40px 0' }}>
      <section className="collection-product-listing-container">
        <div className="collection-product-listing">
          <div className="container">
            <div className="collection-product-listing-title" style={{ marginBottom: '40px' }}>
              <div className="collection-product-listing-title-container">
                <h2 className="sec-title">Books by <span style={{ textTransform: 'capitalize' }}>{authorName}</span></h2>
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
