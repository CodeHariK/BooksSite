import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { AuthorSubmission } from '../types';

const AuthorSubmissionPage: React.FC = () => {
  const { user, userProfile, updateUserProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<AuthorSubmission, 'manuscriptUrl' | 'status' | 'createdAt' | 'userId'>>({
    authorName: '',
    email: '',
    phone: '',
    synopsis: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
    if (userProfile?.authorStatus === 'Ok') {
      navigate('/profile'); // Already an author
    }
  }, [user, userProfile, authLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Record the submission
      await addDoc(collection(db, 'author_submissions'), {
        ...formData,
        userId: user.uid,
        manuscriptUrl: '',
        status: 'Unread',
        createdAt: serverTimestamp()
      });

      // 2. Update user status to pending
      await updateUserProfile({ authorStatus: 'pending' });

      setIsSuccess(true);
      setFormData({ authorName: '', email: '', phone: '', synopsis: '' });
    } catch (err: any) {
      console.error('Error adding document: ', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="shopify-section collection-product-listing-sec" style={{ minHeight: '60vh', padding: '60px 0' }}>
      <div className="container">
        <div className="collection-product-listing-title-container" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="sec-title">Join as an Author</h2>
          <p className="sec-desc">Submit your manuscript synopsis and join the community of great authors.</p>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {isSuccess ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ padding: '20px', backgroundColor: '#dff0d8', color: '#3c763d', borderRadius: '8px', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Submission Successful!</h3>
                <p>Thank you for your interest. Your status is now "Pending Review". Our editorial team will review your synopsis soon.</p>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="explore-cta" 
                style={{ margin: '0 auto', cursor: 'pointer' }}
              >
                <span>Back to Profile</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Full Name</label>
                <input
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              {/* ... other fields remain same but with formData prefix ... */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91-0000000000"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Manuscript Synopsis</label>
                <textarea
                  name="synopsis"
                  value={formData.synopsis}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your story..."
                  rows={6}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
                />
              </div>

              {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

              <button
                type="submit"
                className="explore-cta"
                disabled={isSubmitting}
                style={{ width: '100%', justifyContent: 'center', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit Manuscript'}</span>
                {!isSubmitting && <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorSubmissionPage;

