import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import { BestSellers, ComingSoon } from './components/ProductSections';
import DiscoverAuthors from './components/DiscoverAuthors';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <main role="main" className="wizzy-main-content">
        <Hero />
        <BestSellers />
        <ComingSoon />
        {/* Additional sections like 'New Arrivals' or 'Shop by Category' can go here */}
        <DiscoverAuthors />
      </main>
      <Footer />
    </div>
  );
};

export default App;
