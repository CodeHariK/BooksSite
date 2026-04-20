import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../firebase';
import { collection, query, where, getDocs, orderBy, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import type { Book } from '../types';
import ConfirmModal from '../components/ConfirmModal';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const { user, userProfile, updateUserProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setPhoneNumber(userProfile.phoneNumber || '');
      setBio(userProfile.bio || '');
      setImageUrl(userProfile.imageUrl || '');
      setImagePreview(userProfile.imageUrl || null);
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchMyBooks = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'books'),
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setMyBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book)));
      } catch (error) {
        console.error("Error fetching my books:", error);
      } finally {
        setBooksLoading(false);
      }
    };

    if (user) {
      fetchMyBooks();
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (userId: string): Promise<string | null> => {
    if (!imageFile) return null;
    const storageRef = ref(storage, `user_profiles/${userId}/${imageFile.name}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(snapshot.ref);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      let finalImageUrl = imageUrl;
      if (imageFile && user) {
        const uploadedUrl = await uploadImage(user.uid);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      await updateUserProfile({
        displayName: displayName.toLowerCase(),
        phoneNumber,
        bio,
        imageUrl: finalImageUrl
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUnpublish = async (e: React.MouseEvent, bookId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActionLoading(bookId);
    setMessage(null);
    try {
      const bookRef = doc(db, 'books', bookId);
      await updateDoc(bookRef, { isPublished: false });
      setMyBooks(prev => prev.map(b => b.id === bookId ? { ...b, isPublished: false } : b));
      setMessage({ type: 'success', text: `Book unpublished successfully.` });
    } catch (error) {
      console.error("Error unpublishing book:", error);
      setMessage({ type: 'error', text: 'Failed to unpublish book.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBook = async (e: React.MouseEvent, bookId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingBookId(bookId);
  };

  const confirmDelete = async () => {
    if (!deletingBookId) return;
    const bookId = deletingBookId;
    setDeletingBookId(null);
    setActionLoading(bookId);
    setMessage(null);
    try {
      const bookRef = doc(db, 'books', bookId);
      await deleteDoc(bookRef);
      setMyBooks(prev => prev.filter(b => b.id !== bookId));
      setMessage({ type: 'success', text: 'Book deleted successfully.' });
    } catch (error) {
      console.error("Error deleting book:", error);
      setMessage({ type: 'error', text: 'Failed to delete book.' });
    } finally {
      setActionLoading(null);
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
    <div className="profile-page-container">
      <div className="profile-card">
        {/* Header Section */}
        <div className="profile-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="profile-title">Account Dashboard</h2>
              <p className="profile-subtitle">Manage your personal profile and book submissions.</p>
            </div>
            {userProfile?.isAdmin && (
              <Link to="/admin" className="admin-badge" style={{ backgroundColor: '#fff1f2', color: '#e11d48', padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', textDecoration: 'none', border: '1px solid #fda4af' }}>
                ADMIN DASHBOARD
              </Link>
            )}
          </div>
        </div>

        <div className="profile-layout-grid">
          {/* Sidebar Column: Settings Form */}
          <aside className="profile-sidebar">
            <form onSubmit={handleUpdate} className="profile-form">
              <div className="profile-image-upload" style={{ textAlign: 'center', marginBottom: '10px' }}>
                <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto' }}>
                  <img
                    src={imagePreview || '/temp_assets/jk.png'}
                    alt="Profile Preview"
                    style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f1f5f9' }}
                  />
                  <label htmlFor="imageUpload" style={{ position: 'absolute', bottom: '5px', right: '5px', backgroundColor: '#ffa100', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                    <img src="/temp_assets/icon.svg" width="18" height="18" alt="Upload" />
                    <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

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
                <label className="profile-label">Email Address</label>
                <input
                  type="email"
                  value={user.email || ''}
                  className="profile-input"
                  disabled
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

              <div className="profile-field-group">
                <label className="profile-label">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="profile-input"
                  placeholder="Writer, dreamer, explorer..."
                  rows={4}
                  style={{ resize: 'none' }}
                />
              </div>

              {message && (
                <div className={`profile-message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                className="explore-cta save-btn"
                disabled={isUpdating}
                style={{ cursor: isUpdating ? 'not-allowed' : 'pointer' }}
              >
                <span>{isUpdating ? 'Saving...' : 'Update Profile'}</span>
                {!isUpdating && <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow" />}
              </button>
            </form>
          </aside>

          {/* Main Content Column: Author Tools & Books */}
          <main className="profile-main-content">
            {/* Author Promo Section */}
            <div className="author-section">
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', margin: 0 }}>Are you an Author?</h3>
                <p className="author-promo-text">Submit your latest manuscript and join our growing community of writers.</p>
              </div>
              <Link to="/submit-book" className="explore-cta submit-manuscript-btn">
                <span>Submit Your Book</span>
                <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow" />
              </Link>
            </div>

            {/* My Books Section */}
            <div className="my-books-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>My Published Works</h3>
                <span style={{ fontSize: '14px', color: '#64748b' }}>{myBooks.length} Books found</span>
              </div>

              {booksLoading ? (
                <p>Loading your books library...</p>
              ) : myBooks.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
                  <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>You haven't submitted any books yet. Start your journey today!</p>
                </div>
              ) : (
                <div className="my-books-grid">
                  {myBooks.map(book => (
                    <div key={book.id} className="book-card-mini">
                      <div className="book-card-image-wrapper">
                        <img src={book.image} alt={book.title} className="book-card-image" />
                      </div>

                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>{book.title}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <span className={`status-pill ${book.isPublished ? 'status-published' : 'status-pending'}`}>
                            {book.isPublished ? 'Published' : 'Under Review'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                        {book.isPublished && (
                          <button
                            type="button"
                            onClick={(e) => handleUnpublish(e, book.id!)}
                            disabled={actionLoading === book.id}
                            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '12px', fontWeight: '600', cursor: actionLoading === book.id ? 'not-allowed' : 'pointer' }}
                          >
                            {actionLoading === book.id ? '...' : 'Unpublish'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteBook(e, book.id!)}
                          disabled={actionLoading === book.id}
                          style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#dc2626', fontSize: '12px', fontWeight: '600', cursor: actionLoading === book.id ? 'not-allowed' : 'pointer' }}
                        >
                          {actionLoading === book.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {deletingBookId && (
        <ConfirmModal 
          title="Delete Book?"
          message="Are you sure you want to permanently delete this book? This action cannot be undone."
          confirmLabel="Delete"
          isDanger={true}
          onConfirm={confirmDelete}
          onClose={() => setDeletingBookId(null)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
