'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { User as AppUser } from '@/types';
import { doc, getDoc, getDocFromCache, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  userData: AppUser | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, userType: 'contractor' | 'customer') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<AppUser>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  reauthenticate: (password: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  const fetchUserData = async (user: User) => {
    if (typeof window === 'undefined' || !db) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      // Try to get document with offline fallback
      let userDoc = null;
      try {
        // Try cache first when offline
        userDoc = await getDocFromCache(userDocRef);
      } catch (cacheError: any) {
        // If not in cache, try server
        try {
          userDoc = await getDoc(userDocRef);
        } catch (serverError: any) {
          // If offline and not in cache, use auth user data
          if (serverError.code === 'unavailable' || serverError.message?.includes('offline')) {
            console.warn('User data not available offline, using auth data');
            setUserData({
              id: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              userType: 'customer',
              emailVerified: user.emailVerified,
              createdAt: new Date(),
              updatedAt: new Date(),
              walletBalance: 0,
            });
            return;
          }
          throw serverError;
        }
      }
      
      if (userDoc && userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || data.displayName,
          photoURL: user.photoURL || data.photoURL,
          userType: data.userType || 'customer',
          phoneNumber: data.phoneNumber,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          bio: data.bio,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          emailVerified: user.emailVerified,
          walletBalance: data.walletBalance || 0,
          subscriptionStatus: data.subscriptionStatus,
          subscriptionPlan: data.subscriptionPlan,
        });
      } else {
        // Create user document if it doesn't exist (only if online)
        try {
          const newUserData: Partial<AppUser> = {
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            userType: 'customer',
            emailVerified: user.emailVerified,
            createdAt: new Date(),
            updatedAt: new Date(),
            walletBalance: 0,
          };
          
          await setDoc(userDocRef, {
            ...newUserData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          
          setUserData(newUserData as AppUser);
        } catch (writeError: any) {
          // If offline, just use auth data
          if (writeError.code === 'unavailable' || writeError.message?.includes('offline')) {
            setUserData({
              id: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              userType: 'customer',
              emailVerified: user.emailVerified,
              createdAt: new Date(),
              updatedAt: new Date(),
              walletBalance: 0,
            });
          } else {
            throw writeError;
          }
        }
      }
    } catch (error: any) {
      // For offline errors, use auth data as fallback
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.warn('Using auth data as fallback (offline mode)');
        setUserData({
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          userType: 'customer',
          emailVerified: user.emailVerified,
          createdAt: new Date(),
          updatedAt: new Date(),
          walletBalance: 0,
        });
      } else {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    userType: 'contractor' | 'customer'
  ) => {
    if (!auth || typeof window === 'undefined' || !db) throw new Error('Firebase not initialized');
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update Firebase Auth profile
    await updateProfile(userCredential.user, { displayName });
    
    // Create user document in Firestore
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDocRef, {
      email,
      displayName,
      userType,
      emailVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      walletBalance: 0,
    });
    
    // Don't fetch user data here - user will sign in separately
    // This speeds up the signup process
  };

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Fetch user data in background - don't wait for it to complete
    // The onAuthStateChanged listener will handle it
    fetchUserData(userCredential.user).catch(console.error);
  };

  const signOutUser = async () => {
    if (!auth) throw new Error('Firebase not initialized');
    await signOut(auth);
    setUserData(null);
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (data: Partial<AppUser>) => {
    if (!auth || typeof window === 'undefined' || !db || !currentUser) throw new Error('Not authenticated');
    
    // Update Firebase Auth profile if needed
    if (data.displayName || data.photoURL) {
      await updateProfile(currentUser, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });
    }
    
    // Update Firestore user document
    const userDocRef = doc(db, 'users', currentUser.uid);
    await setDoc(
      userDocRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    
    await fetchUserData(currentUser);
  };

  const signInWithGoogle = async () => {
    if (!auth || typeof window === 'undefined' || !db) throw new Error('Firebase not initialized');
    
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Create or update user document
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        userType: 'customer',
        emailVerified: userCredential.user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        walletBalance: 0,
      });
    }
    
    await fetchUserData(userCredential.user);
  };

  const signInWithFacebook = async () => {
    if (!auth || typeof window === 'undefined' || !db) throw new Error('Firebase not initialized');
    
    const provider = new FacebookAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Create or update user document
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        userType: 'customer',
        emailVerified: userCredential.user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        walletBalance: 0,
      });
    }
    
    await fetchUserData(userCredential.user);
  };

  const reauthenticate = async (password: string) => {
    if (!auth || !currentUser || !currentUser.email) throw new Error('Not authenticated');
    
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
  };

  const changePassword = async (newPassword: string) => {
    if (!currentUser) throw new Error('Not authenticated');
    await updatePassword(currentUser, newPassword);
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    signUp,
    signIn,
    signOut: signOutUser,
    resetPassword,
    updateUserProfile,
    signInWithGoogle,
    signInWithFacebook,
    reauthenticate,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

