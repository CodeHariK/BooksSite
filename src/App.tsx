import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CataloguePage from './pages/CataloguePage';
import PublishPage from './pages/PublishPage';
import ContactPage from './pages/ContactPage';
import BuyBookPage from './pages/BuyBookPage';
import AuthorPage from './pages/AuthorPage';
import BookPage from './pages/BookPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import SubmitBookPage from './pages/SubmitBookPage';
import MigrationPage from './pages/MigrationPage';
import { AuthProvider } from './context/AuthContext';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main role="main" className="wizzy-main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/catalogue" element={<CataloguePage />} />
              <Route path="/publish" element={<PublishPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/buy" element={<BuyBookPage />} />
              
              <Route path="/author/:authorId" element={<AuthorPage />} />
              <Route path="/book/:bookId" element={<BookPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/migrate-data" element={<MigrationPage />} />
              <Route path="/submit-book" element={<SubmitBookPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
