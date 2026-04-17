import React, { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import type { Book } from '../types';

interface EditBookModalProps {
  book: Book;
  onClose: () => void;
  onSave: (updatedBook: Book) => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({ book, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Book>>({
    title: book.title,
    author: book.author,
    price: book.price,
    originalPrice: book.originalPrice || 0,
    summary: book.summary || '',
    pages: book.pages || 0,
    dimensions: book.dimensions || '',
    status: book.status || 'Available'
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!book.id) return;
    setIsSaving(true);
    setError(null);

    try {
      let imageUrl = book.image;

      // 1. Upload new image if selected
      if (imageFile) {
        const storageRef = ref(storage, `book_covers/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Prepare update data
      const updateData: Partial<Book> = {
        title: (formData.title || '').toLowerCase(),
        author: formData.author || '',
        price: formData.price || 0,
        originalPrice: formData.originalPrice || 0,
        image: imageUrl,
        summary: formData.summary || '',
        pages: formData.pages || 0,
        dimensions: formData.dimensions || '',
        status: (formData.status as any) || 'Available',
        discount: formData.originalPrice && formData.price ? (formData.originalPrice - formData.price).toString() : '0',
        updatedAt: serverTimestamp() as any
      };

      // 3. Update Firestore
      await updateDoc(doc(db, 'books', book.id), updateData);

      // 4. Notify parent
      onSave({ ...book, ...updateData, updatedAt: new Date().toISOString() });
      onClose();
    } catch (err: any) {
      console.error("Error updating book:", err);
      setError("Failed to update book. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '24px 32px', 
          borderBottom: '1px solid #eee', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: '#fff',
          zIndex: 1
        }}>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Edit Book: {book.title}</h3>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer', 
              color: '#999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Book Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Author Name</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', backgroundColor: '#fff' }}
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Selling Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Original Price (₹)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Update Cover Image (optional)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={book.image} alt="current" style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #eee', backgroundColor: '#fafafa', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Book Summary</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              rows={5}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical', fontSize: '15px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Number of Pages</label>
              <input
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Dimensions (e.g. 19x13cm)</label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
              />
            </div>
          </div>

          {error && <p style={{ color: '#dc3545', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              style={{ 
                padding: '12px 24px', 
                borderRadius: '8px', 
                border: '1px solid #ddd', 
                backgroundColor: '#fff', 
                color: '#666',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{ 
                padding: '12px 32px', 
                borderRadius: '8px', 
                border: 'none', 
                backgroundColor: '#ffa100', 
                color: '#fff',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 10px rgba(255, 161, 0, 0.3)'
              }}
            >
              {isSaving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;
