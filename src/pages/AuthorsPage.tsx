import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthorCard } from '../components/AuthorCard';
import SearchBar from '../components/SearchBar';
import type { UserProfile } from '../types';

const AuthorsPage: React.FC = () => {
  const [authors, setAuthors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAuthors = async (search = '') => {
    setLoading(true);
    try {
      let q;
      if (search) {
        const searchLower = search.toLowerCase();
        q = query(
          collection(db, 'users'), 
          where('authorStatus', '==', 'Ok'),
          where('displayName', '>=', searchLower),
          where('displayName', '<=', searchLower + '\uf8ff')
        );
      } else {
        q = query(collection(db, 'users'), where('authorStatus', '==', 'Ok'));
      }
      
      const querySnapshot = await getDocs(q);
      const authorsData = querySnapshot.docs.map(doc => doc.data() as UserProfile);
      setAuthors(authorsData);
    } catch (error) {
      console.error("Error fetching authors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors(searchTerm);
  }, [searchTerm]);

  return (
    <div className="shopify-section collection-product-listing-sec" style={{ minHeight: '80vh', padding: '60px 0' }}>
      <section className="collection-product-listing-container">
        <div className="collection-product-listing">
          <div className="container">
            <div className="collection-product-listing-title" style={{ marginBottom: '50px', textAlign: 'center' }}>
              <div className="collection-product-listing-title-container" style={{ width: '100%' }}>
                <h2 className="sec-title" style={{ fontSize: '3rem', marginBottom: '15px' }}>Meet Our Authors</h2>
                <p className="sec-desc" style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', marginBottom: '40px' }}>
                  Discover the minds behind your favorite stories and deep-dives. 
                  From legendary novelists to modern-day entrepreneurs.
                </p>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <SearchBar 
                    mode="authors" 
                    placeholder="Search for authors by name..." 
                    onSearch={(term) => setSearchTerm(term)}
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center' }}>
                <p>Loading authors...</p>
              </div>
            ) : (
              <>
                <div className="products-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '40px',
                  justifyContent: 'center'
                }}>
                  {authors.map((author) => (
                    <AuthorCard key={author.uid} {...author} />
                  ))}
                </div>
                
                {authors.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <p style={{ fontSize: '1.2rem', color: '#666' }}>
                      {searchTerm ? `No authors found matching "${searchTerm}"` : 'No authors listed yet. Check back soon!'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};


export default AuthorsPage;
