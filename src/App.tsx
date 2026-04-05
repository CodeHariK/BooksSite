import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import { BestSellers, ComingSoon } from './components/ProductSections';
import DiscoverAuthors from './components/DiscoverAuthors';
import Footer from './components/Footer';
import AuthorsPage from './pages/AuthorsPage';
import AuthorPage from './pages/AuthorPage';
import BookPage from './pages/BookPage';
import AuthorSubmissionPage from './pages/AuthorSubmissionPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';

const HomePage: React.FC = () => (
  <>
    <Hero />
    <BestSellers />
    <ComingSoon />
    <DiscoverAuthors />
  </>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main role="main" className="wizzy-main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/authors" element={<AuthorsPage />} />
              <Route path="/author/:authorName" element={<AuthorPage />} />
              <Route path="/book/:bookTitle" element={<BookPage />} />
              <Route path="/author-submission" element={<AuthorSubmissionPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<AuthPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
