import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signOut,
  updateProfile,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { UserProfile, AuthorStatus } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: { displayName?: string, phoneNumber?: string, bio?: string, imageUrl?: string, authorStatus?: AuthorStatus }) => Promise<void>;
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
          isAdmin: data.isAdmin || false,
          authorStatus: data.authorStatus || 'NO',
          bio: data.bio || '',
          imageUrl: data.imageUrl || '',
        });
      } else {
        // Create initial profile if it doesn't exist
        const initialProfile: UserProfile = {
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || '',
          phoneNumber: '',
          isAdmin: false,
          authorStatus: 'NO',
          bio: '',
          imageUrl: '',
          createdAt: serverTimestamp() as any,
          updatedAt: serverTimestamp() as any
        };
        await setDoc(userDocRef, initialProfile);
        setUserProfile({
          uid: initialProfile.uid,
          email: initialProfile.email,
          displayName: initialProfile.displayName,
          phoneNumber: initialProfile.phoneNumber,
          isAdmin: false,
          authorStatus: 'NO',
          bio: '',
          imageUrl: '',
        });
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



  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName });

      const userDocRef = doc(db, 'users', newUser.uid);
      await setDoc(userDocRef, {
        uid: newUser.uid,
        email: email,
        displayName: displayName,
        phoneNumber: '',
        isAdmin: false,
        authorStatus: 'NO',
        bio: '',
        imageUrl: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setUser(newUser);
      await fetchUserProfile(newUser);
    } catch (error) {
      console.error("Sign-up Error:", error);
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

  const updateUserProfile = async (data: { 
    displayName?: string, 
    phoneNumber?: string, 
    bio?: string, 
    imageUrl?: string,
    authorStatus?: AuthorStatus
  }) => {
    if (!user) throw new Error("No authenticated user found");

    try {
      if (data.displayName) {
        await updateProfile(user, { displayName: data.displayName });
      }

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });

      await fetchUserProfile(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signUp, logout, updateUserProfile }}>
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

