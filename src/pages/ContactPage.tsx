import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const mailRef = collection(db, 'mail');
      await addDoc(mailRef, {
        to: 'sajjayak@gmail.com',
        message: {
          subject: `New Contact Message: ${formData.subject}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #ffa100;">New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Subject:</strong> ${formData.subject}</p>
              <hr />
              <p style="white-space: pre-wrap;">${formData.message}</p>
            </div>
          `
        }
      });

      setMessage({ type: 'success', text: 'Thank you! Your message has been sent successfully.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error sending contact message:", error);
      setMessage({ type: 'error', text: 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shopify-section collection-product-listing-sec" style={{ minHeight: '80vh', padding: '60px 0' }}>
      <div className="container">
        <div className="collection-product-listing-title-container" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="sec-title">Contact Us</h2>
          <p className="sec-desc">Have questions? We'd love to hear from you.</p>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="How can we help?"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Write your message here..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
              />
            </div>

            {message && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                backgroundColor: message.type === 'success' ? '#e6fffa' : '#fff5f5',
                color: message.type === 'success' ? '#2c7a7b' : '#c53030',
                border: `1px solid ${message.type === 'success' ? '#81e6d9' : '#feb2b2'}`
              }}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              className="explore-cta"
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              {!isSubmitting && <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
