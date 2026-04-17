import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const BuyBookPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        location: '',
        bookName: '',
        copies: '1'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                to: 'sajjayak@gmail.com',
                message: {
                    subject: `New Book Purchase Request: ${formData.bookName}`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #ffa100;">Order Inquiry Received</h2>
                            <p><strong>Book:</strong> ${formData.bookName}</p>
                            <p><strong>Copies:</strong> ${formData.copies}</p>
                            <hr />
                            <p><strong>Customer:</strong> ${formData.name}</p>
                            <p><strong>WhatsApp:</strong> ${formData.whatsapp}</p>
                            <p><strong>Location:</strong> ${formData.location}</p>
                            <hr />
                            <p style="font-size: 12px; color: #666;">This is an inquiry. Please contact the customer for payment and shipping details.</p>
                        </div>
                    `
                }
            });

            setIsSuccess(true);
            setFormData({ name: '', whatsapp: '', location: '', bookName: '', copies: '1' });
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
                <div className="collection-product-listing-title-container" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 className="sec-title">Buy Books</h2>
                    <p className="sec-desc">Tell us what you're looking for, and we'll handle the rest.</p>
                </div>

                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '50px' }}>

                    {/* Information Column */}
                    <div className="buy-info" style={{ lineHeight: '1.6' }}>
                        <p style={{ marginBottom: '30px', fontWeight: '500', fontSize: '1.1rem' }}>We operate as a boutique initiative. Instead of a standard checkout, we provide personalized service for every order.</p>

                        <div style={{ marginBottom: '30px' }}>
                            <h4 style={{ color: '#ffa100', marginBottom: '10px' }}>Step 1 — Submit Inquiry 📝</h4>
                            <p style={{ fontSize: '0.95rem' }}>Fill in the form with your details and the number of copies you need.</p>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <h4 style={{ color: '#ffa100', marginBottom: '10px' }}>Step 2 — Personal Contact</h4>
                            <p style={{ fontSize: '0.95rem' }}>Our team will contact you on your WhatsApp number to confirm availability and provide the best shipping quote.</p>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <h4 style={{ color: '#ffa100', marginBottom: '10px' }}>Step 3 — Secure Payment</h4>
                            <p style={{ fontSize: '0.95rem' }}>Once you approve the details, we will provide payment instructions for a secure transaction.</p>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <h4 style={{ color: '#ffa100', marginBottom: '10px' }}>Step 4 — Shipping & Delivery</h4>
                            <p style={{ fontSize: '0.95rem' }}>Your books will be carefully packed and shipped. We will share the tracking details with you immediately.</p>
                        </div>

                        <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ffa100', marginTop: '40px' }}>✨ Thank you for supporting thoughtful literature.</p>
                    </div>

                    {/* Form Column */}
                    <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 25px rgba(0,0,0,0.07)' }}>
                        {isSuccess ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <div style={{ padding: '20px', backgroundColor: '#e6fffa', color: '#2c7a7b', borderRadius: '8px', marginBottom: '20px', border: '1px solid #81e6d9' }}>
                                    <h3 style={{ margin: 0 }}>Request Received!</h3>
                                    <p style={{ marginTop: '10px' }}>Our executive will contact you with payment, shipping and other details.</p>
                                </div>
                                <button
                                    onClick={() => navigate('/catalogue')}
                                    className="explore-cta"
                                    style={{ margin: '0 auto', cursor: 'pointer' }}
                                >
                                    <span>Browse More Books</span>
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h3 style={{ marginBottom: '25px' }}>Purchase Inquiry</h3>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Name of the Book</label>
                                    <input
                                        type="text"
                                        name="bookName"
                                        value={formData.bookName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter the title of the book"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>No of Copies Required</label>
                                    <input
                                        type="number"
                                        name="copies"
                                        min="1"
                                        value={formData.copies}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Full Name"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Your Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        placeholder="City / District"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Your WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        required
                                        placeholder="Mobile number for WhatsApp"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                                    />
                                </div>

                                {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

                                <button
                                    type="submit"
                                    className="explore-cta"
                                    disabled={isSubmitting}
                                    style={{ width: '100%', justifyContent: 'center', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                                >
                                    <span>{isSubmitting ? 'Sending Request...' : 'Submit Inquiry'}</span>
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

export default BuyBookPage;
