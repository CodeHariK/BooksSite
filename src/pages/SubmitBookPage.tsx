import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types';

const SubmitBookPage: React.FC = () => {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    price: 0,
    originalPrice: 0,
    summary: '',
    pages: 0,
    dimensions: '',
    status: 'Available'
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      }
    }
  }, [user, userProfile, authLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' || name === 'originalPrice' || name === 'pages' ? Number(value) : value 
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;
    if (!imageFile) {
      setError("Please upload a book cover image.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload Book Cover
      const storageRef = ref(storage, `book_covers/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // 2. Save Book Doc
      const bookData: Omit<Book, 'id'> = {
        title: (formData.title || '').toLowerCase(),
        author: userProfile.displayName,
        authorId: user.uid,
        price: formData.price || 0,
        originalPrice: formData.originalPrice || 0,
        image: imageUrl,
        summary: formData.summary || '',
        pages: formData.pages || 0,
        dimensions: formData.dimensions || '',
        status: (formData.status as any) || 'Available',
        discount: formData.originalPrice && formData.price ? (formData.originalPrice - formData.price).toString() : '0',
        isPublished: false,
        createdAt: serverTimestamp() as any
      };

      await addDoc(collection(db, 'books'), bookData);
      
      alert("Book submitted successfully!");
      navigate('/profile');
    } catch (err: any) {
      console.error("Error submitting book:", err);
      setError("Failed to submit book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="shopify-section collection-product-listing-sec" style={{ minHeight: '80vh', padding: '60px 0' }}>
      <div className="container">
        <div className="collection-product-listing-title-container" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="sec-title">Submit Your Book</h2>
          <p className="sec-desc">Fill in the details below to publish your masterpiece.</p>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Book Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="The amazing story of..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Selling Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Original Price (₹)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Book Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', backgroundColor: '#fafafa' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Book Summary</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
                placeholder="A brief overview of the book..."
                rows={5}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Number of Pages</label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Dimensions (e.g. 19x13cm)</label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>
            </div>

            {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

            <button
              type="submit"
              className="explore-cta"
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              <span>{isSubmitting ? 'Publishing Book...' : 'Submit Book for Publishing'}</span>
              {!isSubmitting && <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitBookPage;
