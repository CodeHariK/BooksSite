import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="shopify-section collection-product-listing-sec" style={{ minHeight: '80vh', padding: '60px 0' }}>
            <div className="container">
                <div className="collection-product-listing-title-container" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 className="sec-title">About Us</h2>
                    <p className="sec-desc">Commitment to quality, clarity, and the enduring power of the written word.</p>
                </div>

                <div style={{ maxWidth: '900px', margin: '0 auto', lineHeight: '1.8' }}>
                    <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
                        <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '24px' }}>
                            We are an independent publishing initiative committed to discovering and sharing books that inform, inspire, and endure.
                        </p>
                        <p style={{ marginBottom: '24px' }}>
                            Our mission is to work with writers who have something meaningful to say and help transform their manuscripts into beautifully produced, thoughtfully edited books. We believe that good publishing is built on collaboration—between authors, editors, designers, and readers.
                        </p>
                        <p style={{ marginBottom: '24px' }}>
                            At the heart of our work is a simple belief: important ideas deserve to be read, remembered, and preserved in books.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ borderBottom: '2px solid #ffa100', paddingBottom: '10px', marginBottom: '20px', display: 'inline-block' }}>What We Do 📖</h3>
                            <p style={{ marginBottom: '15px' }}>From manuscript to finished book, we guide authors through the essential stages of publishing. Our work includes:</p>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#ffa100', marginRight: '10px' }}>•</span> Editorial review and manuscript development
                                </li>
                                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#ffa100', marginRight: '10px' }}>•</span> Professional typesetting and book design
                                </li>
                                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#ffa100', marginRight: '10px' }}>•</span> Cover design and visual identity
                                </li>
                                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#ffa100', marginRight: '10px' }}>•</span> Preparation of print-ready files
                                </li>
                                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: '#ffa100', marginRight: '10px' }}>•</span> Print-on-demand and distribution support
                                </li>
                            </ul>
                            <p style={{ marginTop: '20px', fontSize: '0.95rem', fontStyle: 'italic' }}>Every project is approached with care so that the final book meets high editorial and design standards.</p>
                        </div>

                        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ borderBottom: '2px solid #ffa100', paddingBottom: '10px', marginBottom: '20px', display: 'inline-block' }}>Our Authors ✍️</h3>
                            <p style={{ marginBottom: '20px' }}>
                                We are proud to work with both emerging and experienced writers. Many of the most memorable books begin with new voices, and we are always interested in discovering manuscripts that bring fresh perspectives, knowledge, and stories to readers.
                            </p>

                            <h3 style={{ borderBottom: '2px solid #ffa100', paddingBottom: '10px', marginBottom: '20px', display: 'inline-block' }}>Our Commitment 🌱</h3>
                            <p>
                                We aim to build a publishing space where writers are respected, ideas are valued, and books are produced with integrity. Each title we publish reflects our commitment to quality, clarity, and the enduring power of the written word.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
