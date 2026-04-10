import React from 'react';
import { Link } from 'react-router-dom';
import { BestSellers, ComingSoon } from '../components/ProductSections';

const HomePage: React.FC = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section" style={{
                padding: '100px 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: '800' }}>
                        Where Every Book <br /> <span style={{ color: '#ffaecaff' }}>Begins With An Idea</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 40px', color: '#666' }}>
                        Discover thoughtful, engaging, and meaningful books from new and experienced writers.
                        We transform manuscripts into beautifully produced works of art.
                    </p>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <Link to="/catalogue" className="explore-cta" style={{ padding: '15px 30px' }}>
                            <span>Explore Catalogue</span>
                            <img width="18" height="18" src="/temp_assets/arrow-up-right.svg" alt="arrow" />
                        </Link>
                        <Link to="/about" className="explore-cta" style={{ padding: '15px 30px' }}>
                            <span>Learn About Us</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Sections */}
            <BestSellers />
            <ComingSoon />

            {/* CTA Section */}
            <section style={{ padding: '80px 0', textAlign: 'center', backgroundColor: '#fff' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '20px' }}>Have a story worth sharing?</h2>
                    <p style={{ marginBottom: '30px', color: '#666' }}>We are always looking for fresh perspectives and compelling stories.</p>
                    <Link to="/publish" className="explore-cta" style={{ margin: '0 auto' }}>
                        <span>Publish With Us</span>
                        <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
