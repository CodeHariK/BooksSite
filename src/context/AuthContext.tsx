import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  updateProfile
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

interface UserProfile {
  displayName: string;
  email: string;
  phoneNumber?: string;
  uid: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: { displayName?: string, phoneNumber?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (currentUser: User) => {
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || data.displayName || '',
          phoneNumber: data.phoneNumber || '',
        });
      } else {
        // Create initial profile if it doesn't exist
        const initialProfile = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || '',
          phoneNumber: '',
        };
        await setDoc(userDocRef, initialProfile);
        setUserProfile(initialProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  };

  const updateUserProfile = async (data: { displayName?: string, phoneNumber?: string }) => {
    if (!user) throw new Error("No authenticated user found");

    try {
      // 1. Update Firebase Auth (displayName)
      if (data.displayName) {
        await updateProfile(user, { displayName: data.displayName });
      }

      // 2. Update/Create Firestore Profile
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        displayName: data.displayName || user.displayName || '',
        email: user.email,
        phoneNumber: data.phoneNumber || userProfile?.phoneNumber || '',
        uid: user.uid,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 3. Refresh local state
      await fetchUserProfile(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, loginWithGoogle, logout, updateUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
