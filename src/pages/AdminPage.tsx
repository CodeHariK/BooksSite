import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import type { UserProfile, AuthorStatus, Book } from '../types';

const AdminPage: React.FC = () => {
  const { userProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'books'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [booksLoading, setBooksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      } as UserProfile));
      setUsers(usersData);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      setBooksLoading(true);
      setError(null);
      const q = query(collection(db, 'books'));
      const querySnapshot = await getDocs(q);
      const booksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Book));
      // Sort: Unpublished first, then by date
      setBooks(booksData.sort((a, b) => {
        if (a.isPublished === b.isPublished) {
          const dateA = a.createdAt ? (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : (a.createdAt as any).seconds * 1000) : 0;
          const dateB = b.createdAt ? (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : (b.createdAt as any).seconds * 1000) : 0;
          return dateB - dateA;
        }
        return a.isPublished ? 1 : -1;
      }));
    } catch (error: any) {
      console.error("Error fetching books:", error);
      setError("Failed to load books.");
    } finally {
      setBooksLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.isAdmin) {
      if (activeTab === 'users') fetchUsers();
      else fetchBooks();
    }
  }, [userProfile, activeTab]);

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        isAdmin: !currentStatus,
        updatedAt: new Date().toISOString()
      });
      setUsers(prev => prev.map(u => u.uid === userId ? { ...u, isAdmin: !currentStatus } : u));
    } catch (error) {
      alert("Error updating admin status");
    } finally {
      setActionLoading(null);
    }
  };

  const updateAuthorStatus = async (userId: string, newStatus: AuthorStatus) => {
    setActionLoading(userId);
    try {
      await updateDoc(doc(db, 'users', userId), {
        authorStatus: newStatus,
        updatedAt: new Date().toISOString()
      });
      setUsers(prev => prev.map(u => u.uid === userId ? { ...u, authorStatus: newStatus } : u));
    } catch (error) {
      alert("Error updating author status");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleBookTag = async (bookId: string, tag: 'isBestSeller' | 'isComingSoon', currentStatus: boolean) => {
    setActionLoading(`${bookId}-${tag}`);
    try {
      await updateDoc(doc(db, 'books', bookId), {
        [tag]: !currentStatus,
        updatedAt: new Date().toISOString()
      });
      setBooks(prev => prev.map(b => b.id === bookId ? { ...b, [tag]: !currentStatus } : b));
    } catch (error) {
      alert(`Error updating ${tag}`);
    } finally {
      setActionLoading(null);
    }
  };

  const publishBook = async (book: Book) => {
    if (!book.id) return;
    setActionLoading(book.id);
    try {
      // 1. Mark book as published
      await updateDoc(doc(db, 'books', book.id), {
        isPublished: true,
        updatedAt: new Date().toISOString()
      });
      
      // 2. Automatically upgrade user to Author if not already
      await updateDoc(doc(db, 'users', book.authorId), {
        authorStatus: 'Ok',
        updatedAt: new Date().toISOString()
      });

      setBooks(prev => prev.map(b => b.id === book.id ? { ...b, isPublished: true } : b));
      alert(`"${book.title}" is now published! Author status updated.`);
    } catch (error) {
      alert("Error publishing book");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteBook = async (bookId: string) => {
    if (!window.confirm("Are you sure you want to delete this book? This cannot be undone.")) return;
    setActionLoading(bookId);
    try {
      await deleteDoc(doc(db, 'books', bookId));
      setBooks(prev => prev.filter(b => b.id !== bookId));
    } catch (error) {
      alert("Error deleting book");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure? This will delete the user document.")) return;
    setActionLoading(userId);
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prev => prev.filter(u => u.uid !== userId));
    } catch (error) {
      alert("Error deleting user");
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading) return <div className="container" style={{ padding: '100px' }}>Loading authentication...</div>;
  if (!userProfile?.isAdmin) return <Navigate to="/" />;

  return (
    <div className="shopify-section collection-product-listing-sec" style={{ minHeight: '80vh', padding: '60px 0' }}>
      <div className="container">
        <div className="collection-product-listing-title-container" style={{ marginBottom: '40px' }}>
          <h2 className="sec-title">Admin Dashboard</h2>
          <p className="sec-desc">Manage platform users and book submissions.</p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #eee' }}>
          <button 
            onClick={() => setActiveTab('users')}
            style={{ 
              padding: '10px 20px', 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer',
              borderBottom: activeTab === 'users' ? '3px solid #ffa100' : '3px solid transparent',
              fontWeight: activeTab === 'users' ? 'bold' : 'normal',
              color: activeTab === 'users' ? '#ffa100' : '#666'
            }}
          >
            User Management
          </button>
          <button 
            onClick={() => setActiveTab('books')}
            style={{ 
              padding: '10px 20px', 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer',
              borderBottom: activeTab === 'books' ? '3px solid #ffa100' : '3px solid transparent',
              fontWeight: activeTab === 'books' ? 'bold' : 'normal',
              color: activeTab === 'books' ? '#ffa100' : '#666'
            }}
          >
            Book Submissions
          </button>
        </div>

        {error && (
          <div style={{ padding: '20px', backgroundColor: '#f8d7da', color: '#842029', borderRadius: '8px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {loading || booksLoading ? (
          <p>Loading {activeTab}...</p>
        ) : activeTab === 'users' ? (
          <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '20px' }}>User</th>
                  <th style={{ padding: '20px' }}>Role</th>
                  <th style={{ padding: '20px' }}>Author Status</th>
                  <th style={{ padding: '20px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.uid} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {u.imageUrl ? (
                          <img src={u.imageUrl} alt={u.displayName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {u.displayName?.charAt(0) || u.email?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <p style={{ fontWeight: 'bold', margin: 0 }}>{u.displayName || 'Unnamed User'}</p>
                          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <button 
                        onClick={() => toggleAdmin(u.uid, !!u.isAdmin)}
                        disabled={actionLoading === u.uid}
                        style={{ 
                          padding: '6px 12px', 
                          borderRadius: '20px', 
                          border: 'none', 
                          cursor: 'pointer',
                          backgroundColor: u.isAdmin ? '#d1e7dd' : '#f8ced1',
                          color: u.isAdmin ? '#0f5132' : '#842029',
                          fontWeight: '500'
                        }}
                      >
                        {u.isAdmin ? 'Admin' : 'User'}
                      </button>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <select 
                        value={u.authorStatus || 'NO'} 
                        onChange={(e) => updateAuthorStatus(u.uid, e.target.value as AuthorStatus)}
                        disabled={actionLoading === u.uid}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
                      >
                        <option value="NO">NO</option>
                        <option value="pending">Pending</option>
                        <option value="Ok">Ok (Live)</option>
                      </select>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <button 
                        onClick={() => deleteUser(u.uid)}
                        disabled={actionLoading === u.uid}
                        style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '20px' }}>Book</th>
                  <th style={{ padding: '20px' }}>Author</th>
                  <th style={{ padding: '20px' }}>Status</th>
                  <th style={{ padding: '20px' }}>Tags</th>
                  <th style={{ padding: '20px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img src={b.image} alt={b.title} style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div>
                          <p style={{ fontWeight: 'bold', margin: 0 }}>{b.title}</p>
                          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>₹{b.price}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '20px' }}>{b.author}</td>
                    <td style={{ padding: '20px' }}>
                      <span style={{ 
                        fontSize: '11px', 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        backgroundColor: b.isPublished ? '#e6fffa' : '#fff5f5', 
                        color: b.isPublished ? '#2c7a7b' : '#c53030',
                        fontWeight: 'bold',
                        border: `1px solid ${b.isPublished ? '#81e6d9' : '#feb2b2'}`
                      }}>
                        {b.isPublished ? 'Published' : 'Pending Review'}
                      </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={!!b.isBestSeller} 
                            onChange={() => toggleBookTag(b.id!, 'isBestSeller', !!b.isBestSeller)}
                            disabled={actionLoading === `${b.id}-isBestSeller`}
                          />
                          Best Seller
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={!!b.isComingSoon} 
                            onChange={() => toggleBookTag(b.id!, 'isComingSoon', !!b.isComingSoon)}
                            disabled={actionLoading === `${b.id}-isComingSoon`}
                          />
                          Coming Soon
                        </label>
                      </div>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        {!b.isPublished && (
                          <button 
                            onClick={() => publishBook(b)}
                            disabled={actionLoading === b.id}
                            style={{ color: '#28a745', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            Publish
                          </button>
                        )}
                        <button 
                          onClick={() => deleteBook(b.id!)}
                          disabled={actionLoading === b.id}
                          style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
