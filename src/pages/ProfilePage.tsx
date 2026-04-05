import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const { user, userProfile, updateUserProfile, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setPhoneNumber(userProfile.phoneNumber || '');
    }
  }, [userProfile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      await updateUserProfile({ displayName, phoneNumber });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="profile-page-container">
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <h3>Loading Profile...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="shopify-section profile-page-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">Account Settings</h2>
          <p className="profile-subtitle">Update your personal information below.</p>
        </div>

        <form onSubmit={handleUpdate} className="profile-form">
          <div className="profile-field-group">
            <label className="profile-label">Full Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="profile-input"
              placeholder="Your Full Name"
              required
            />
          </div>

          <div className="profile-field-group">
            <label className="profile-label">Email Address (Read-only)</label>
            <input
              type="email"
              value={user.email || ''}
              className="profile-input"
              disabled
              title="Email updates require re-authentication for security."
            />
          </div>

          <div className="profile-field-group">
            <label className="profile-label">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="profile-input"
              placeholder="+91-0000000000"
            />
          </div>

          {message && (
            <div className={`profile-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="profile-actions">
            <button
              type="submit"
              className="explore-cta save-btn"
              disabled={isUpdating}
              style={{ cursor: isUpdating ? 'not-allowed' : 'pointer' }}
            >
              <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
              {!isUpdating && <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow" />}
            </button>
            
            <button
              type="button"
              className="profile-input"
              onClick={() => logout()}
              style={{ padding: '12px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #ddd' }}
            >
              Log Out
            </button>
          </div>
        </form>

        <div className="author-section">
          <div className="collection-product-listing-title-container" style={{ width: '100%' }}>
            <h3 style={{ marginBottom: '10px' }}>Are you an Author?</h3>
            <p className="author-promo-text">Share your stories with the world and join our exclusive community.</p>
          </div>
          <Link to="/author-submission" className="explore-cta submit-manuscript-btn">
            <span>Submit Your Manuscript</span>
            <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
