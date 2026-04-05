import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const { user, loginWithGoogle } = useAuth();
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

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || "Failed to login with Google");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
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

          <div className="auth-divider">
            <span className="auth-divider-text">OR</span>
            <div className="auth-divider-line"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="google-auth-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" className="google-icon">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Continue with Google
          </button>

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
