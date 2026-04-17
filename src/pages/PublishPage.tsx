import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PublishPage: React.FC = () => {
  const { user, userProfile, updateUserProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    authorName: '',
    email: '',
    phone: '',
    synopsis: '',
    genre: '',
    audience: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Record the submission in author_submissions
      await addDoc(collection(db, 'author_submissions'), {
        ...formData,
        userId: user?.uid || 'anonymous',
        status: 'Unread',
        createdAt: serverTimestamp()
      });

      // 2. Send email via 'mail' collection
      await addDoc(collection(db, 'mail'), {
        to: 'sajjayak@gmail.com', // Placeholder
        message: {
          subject: `New Manuscript Submission: ${formData.authorName}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #ffaecaff;">New Manuscript Proposal Received</h2>
              <p><strong>Author:</strong> ${formData.authorName}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Phone:</strong> ${formData.phone}</p>
              <p><strong>Genre:</strong> ${formData.genre}</p>
              <p><strong>Audience:</strong> ${formData.audience}</p>
              <hr />
              <p style="white-space: pre-wrap;"><strong>Synopsis:</strong>\n${formData.synopsis}</p>
              <hr />
              <p style="font-size: 12px; color: #666;">This submission was made by: ${user ? user.email : 'Public Visitor'}</p>
            </div>
          `
        }
      });

      // 3. Update user status if logged in and not already an author
      if (user && userProfile?.authorStatus !== 'Ok') {
        await updateUserProfile({ authorStatus: 'pending' });
      }

      setIsSuccess(true);
      setFormData({ authorName: '', email: '', phone: '', synopsis: '', genre: '', audience: '' });
    } catch (err: any) {
      console.error('Error adding document: ', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="shopify-section collection-product-listing-sec" style={{ minHeight: '80vh', padding: '60px 0' }}>
      <div className="container">
        <div className="collection-product-listing-title-container" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 className="sec-title">Publish With Us</h2>
          <p className="sec-desc">Every book begins with an idea. If you have written one worth sharing, we would love to read it.</p>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '50px' }}>

          {/* Instructions Column */}
          <div className="publish-info" style={{ lineHeight: '1.6' }}>
            <p style={{ marginBottom: '30px', fontWeight: '500' }}>We welcome submissions from new and experienced writers who wish to publish thoughtful, engaging, and meaningful books.</p>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#ffaecaff', marginBottom: '10px' }}>Step 1 — Prepare Your Proposal 📝</h4>
              <p style={{ fontSize: '0.95rem' }}>Before submitting, please prepare a brief synopsis (300–500 words), sample chapters, and a short author biography.</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#ffaecaff', marginBottom: '10px' }}>Step 2 — Submit Your Manuscript</h4>
              <p style={{ fontSize: '0.95rem' }}>Fill out the form or email your submission in Word or PDF format to: <strong>sajjayak@gmail.com</strong></p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#ffaecaff', marginBottom: '10px' }}>Step 3 — Editorial Review</h4>
              <p style={{ fontSize: '0.95rem' }}>Our editorial team carefully reviews every submission. The process may take 6–8 weeks.</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#ffaecaff', marginBottom: '10px' }}>Step 4 — Our Response</h4>
              <p style={{ fontSize: '0.95rem' }}>If selected, we will contact you to discuss the next steps. While we value every submission, we may not be able to respond to all proposals.</p>
            </div>

            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ffaecaff', marginTop: '40px' }}>✨ We look forward to discovering new voices!</p>
          </div>

          {/* Form Column */}
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 25px rgba(0,0,0,0.07)' }}>
            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ padding: '20px', backgroundColor: '#e6fffa', color: '#2c7a7b', borderRadius: '8px', marginBottom: '20px', border: '1px solid #81e6d9' }}>
                  <h3 style={{ margin: 0 }}>Submission Successful!</h3>
                  <p>Thank you for sharing your work. Our editorial team will review your proposal soon.</p>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="explore-cta"
                  style={{ margin: '0 auto', cursor: 'pointer' }}
                >
                  <span>Go to My Profile</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: '25px' }}>Submit Your Proposal</h3>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Full Name</label>
                  <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email Address"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Phone Number"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Genre</label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      placeholder="e.g. Fiction, Non-fiction"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Intended Audience</label>
                    <input
                      type="text"
                      name="audience"
                      value={formData.audience}
                      onChange={handleChange}
                      placeholder="e.g. General, Students"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Manuscript Synopsis (300-500 words)</label>
                  <textarea
                    name="synopsis"
                    value={formData.synopsis}
                    onChange={handleChange}
                    required
                    placeholder="Paste your synopsis here..."
                    rows={8}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
                  />
                </div>

                {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

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
    </div>
  );
};

export default PublishPage;
