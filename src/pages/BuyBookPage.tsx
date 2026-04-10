import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface BookOption {
    id: string;
    title: string;
}

const BuyBookPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const bookIdFromQuery = searchParams.get('bookId');

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        city: '',
        bookName: ''
    });
    const [books, setBooks] = useState<BookOption[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const q = query(
                    collection(db, 'books'),
                    where('isPublished', '==', true),
                    orderBy('title')
                );
                const querySnapshot = await getDocs(q);
                const bookList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title
                }));
                setBooks(bookList);

                // If bookId is in query, find and set the book name
                if (bookIdFromQuery) {
                    const selectedBook = bookList.find(b => b.id === bookIdFromQuery);
                    if (selectedBook) {
                        setFormData(prev => ({ ...prev, bookName: selectedBook.title }));
                    }
                }
            } catch (err) {
                console.error("Error fetching books:", err);
            }
        };
        fetchBooks();
    }, [bookIdFromQuery]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Send email via Firestore 'mail' collection
            await addDoc(collection(db, 'mail'), {
                to: 'dev.shark.run@gmail.com', // Placeholder email
                message: {
                    subject: `New Book Purchase Request: ${formData.bookName}`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #ffa100;">Purchase Request Received</h2>
                            <p><strong>Customer Name:</strong> ${formData.name}</p>
                            <p><strong>Mobile Number:</strong> ${formData.mobile}</p>
                            <p><strong>City:</strong> ${formData.city}</p>
                            <p><strong>Book Requested:</strong> ${formData.bookName}</p>
                            <hr />
                            <p style="font-size: 12px; color: #666;">Please contact the visitor to proceed with the purchase.</p>
                        </div>
                    `
                }
            });

            setIsSuccess(true);
            setFormData({ name: '', mobile: '', city: '', bookName: '' });
        } catch (err) {
            console.error("Error submitting purchase request:", err);
            setError("Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="shopify-section collection-product-listing-sec" style={{ minHeight: '80vh', padding: '60px 0' }}>
            <div className="container">
                <div className="collection-product-listing-title-container" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 className="sec-title">Buy Books</h2>
                    <p className="sec-desc">Fill in your details and we'll contact you to complete your order.</p>
                </div>

                <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {isSuccess ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <div style={{ padding: '20px', backgroundColor: '#e6fffa', color: '#2c7a7b', borderRadius: '8px', marginBottom: '20px', border: '1px solid #81e6d9' }}>
                                <h3 style={{ margin: 0 }}>Request Submitted!</h3>
                                <p>We will contact you shortly to proceed with your booking.</p>
                            </div>
                            <button 
                                onClick={() => navigate('/catalogue')}
                                className="explore-cta" 
                                style={{ margin: '0 auto', cursor: 'pointer' }}
                            >
                                <span>Back to Catalogue</span>
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your full name"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your mobile number"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your city"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Book Name</label>
                                <select
                                    name="bookName"
                                    value={formData.bookName}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fff' }}
                                >
                                    <option value="">Select a book</option>
                                    {books.map(book => (
                                        <option key={book.id} value={book.title}>{book.title}</option>
                                    ))}
                                </select>
                            </div>

                            {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

                            <button
                                type="submit"
                                className="explore-cta"
                                disabled={isSubmitting}
                                style={{ width: '100%', justifyContent: 'center', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                            >
                                <span>{isSubmitting ? 'Processing...' : 'Proceed'}</span>
                                {!isSubmitting && <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow" />}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyBookPage;
