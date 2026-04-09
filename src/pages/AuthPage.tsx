import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await signUp(email, password, name);
      }
      navigate('/');
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "An error occurred during authentication");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shopify-section collection-product-listing-sec auth-page-container">
      <div className="auth-card-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="sec-title auth-title">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="sec-desc">
              {isLogin ? 'Login to access your bookmarks and orders.' : 'Join the community of book lovers.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="auth-form-group">
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                  required
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div className="auth-form-group">
              <label className="auth-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
                placeholder="name@example.com"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
                placeholder="********"
              />
            </div>

            {error && <p className="auth-error-message">{error}</p>}

            <button
              type="submit"
              className="explore-cta auth-submit-btn"
              disabled={isSubmitting}
              style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              <span>{isSubmitting ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}</span>
              {!isSubmitting && <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow" />}
            </button>
          </form>

          <p className="auth-footer">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="auth-switch-btn"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
