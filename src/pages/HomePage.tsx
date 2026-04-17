import React from 'react';
import { Link } from 'react-router-dom';
import { BestSellers, ComingSoon } from '../components/ProductSections';

const HomePage: React.FC = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section" style={{
                position: 'relative',
                padding: '160px 0',
                textAlign: 'center',
                backgroundColor: '#f5f5ec',
                backgroundImage: 'linear-gradient(rgba(245, 245, 236, 0.85), rgba(245, 245, 236, 0.85)), url("/assets/hero-bg.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderBottom: '1px solid #eee'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <h1 style={{ 
                            fontFamily: 'var(--serif)', 
                            fontSize: 'clamp(3rem, 8vw, 5rem)', 
                            lineHeight: '1.1',
                            marginBottom: '15px', 
                            fontWeight: '800',
                            color: '#1a1a1a'
                        }}>
                            Books of Lasting Thought
                        </h1>
                        <h2 style={{ 
                            fontFamily: 'var(--serif)', 
                            fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', 
                            fontStyle: 'italic',
                            fontWeight: '300', 
                            color: '#555', 
                            marginBottom: '40px' 
                        }}>
                            Carefully Brought Into Print
                        </h2>
                        
                        <div style={{ 
                            width: '60px', 
                            height: '2px', 
                            backgroundColor: '#2d2d2d', 
                            margin: '0 auto 40px',
                            opacity: 0.3
                        }}></div>

                        <p style={{ 
                            fontSize: '1.25rem', 
                            lineHeight: '1.7',
                            maxWidth: '750px', 
                            margin: '0 auto 50px', 
                            color: '#333',
                            fontWeight: '400',
                            letterSpacing: '0.01em'
                        }}>
                            Aghorin Books is an independent publishing initiative dedicated to thoughtful, original, and enduring writing. We publish selected works in Malayalam, English and other Indian languages across literature, essays, and academic thought.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <Link to="/catalogue" className="explore-cta" style={{ 
                                padding: '18px 36px',
                                backgroundColor: '#2d2d2d',
                                color: '#fff',
                                borderColor: '#2d2d2d',
                                transition: 'all 0.3s ease'
                            }}>
                                <span>Explore Catalogue</span>
                                <img width="18" height="18" src="/temp_assets/arrow-up-right.svg" alt="arrow" style={{ filter: 'invert(1)' }} />
                            </Link>
                            <Link to="/about" className="explore-cta" style={{ 
                                padding: '18px 36px',
                                backgroundColor: 'transparent',
                                borderColor: '#2d2d2d',
                                color: '#2d2d2d'
                            }}>
                                <span>Our Story</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Sections */}
            <BestSellers />
            <ComingSoon />

            {/* CTA Section */}
            <section style={{ 
                padding: '100px 0', 
                textAlign: 'center', 
                backgroundColor: '#ffffff',
                borderTop: '1px solid #eee'
            }}>
                <div className="container">
                    <h2 style={{ 
                        fontFamily: 'var(--serif)',
                        fontSize: '3rem',
                        marginBottom: '20px',
                        color: '#1a1a1a'
                    }}>Have a story worth sharing?</h2>
                    <p style={{ 
                        fontSize: '1.2rem',
                        marginBottom: '40px', 
                        color: '#555',
                        maxWidth: '600px',
                        margin: '0 auto 40px'
                    }}>We are always looking for fresh perspectives and compelling stories that challenge and inspire.</p>
                    <Link to="/publish" className="explore-cta" style={{ 
                        margin: '0 auto',
                        backgroundColor: '#2d2d2d',
                        color: '#fff',
                        padding: '15px 35px'
                    }}>
                        <span>Publish With Us</span>
                        <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow" style={{ filter: 'invert(1)' }} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
