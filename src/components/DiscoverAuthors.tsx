import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import type { UserProfile } from '../types';

const DiscoverAuthors: React.FC = () => {
  const [authors, setAuthors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        // Fetch users who are established authors
        const q = query(
          collection(db, 'users'), 
          where('authorStatus', '==', 'Ok'), 
          limit(6)
        );
        const querySnapshot = await getDocs(q);
        const authorsData = querySnapshot.docs.map(doc => doc.data() as UserProfile);
        setAuthors(authorsData);
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading || authors.length === 0) return null;

  return (
    <div id="shopify-section-template--21194970333401__image_box_grid_ALmxwF" className="shopify-section image-box-grid-container">
      <section className="image-box-grid" style={{ backgroundColor: '#f9f9f9' }}>
        <div className="container">
          <h2 className="sec-title">Discover Great Authors</h2>
          <p className="sec-desc">From timeless classics to modern favourites.</p>
          <div className="image-box-grid-items" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
            {authors.map((author) => (
              <div key={author.uid} className="image-box-grid-item">
                <Link to={`/author/${author.uid}`}>
                  <img
                    width="154"
                    height="154"
                    src={author.imageUrl || '/temp_assets/jk.png'}
                    alt={author.displayName}
                    loading="lazy"
                    style={{ borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <p>{author.displayName}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscoverAuthors;

