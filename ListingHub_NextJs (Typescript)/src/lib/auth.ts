import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

/**
 * Authentication utility functions
 */

export const signUp = async (email: string, password: string, displayName: string) => {
  if (!auth) throw new Error('Firebase Auth not initialized');
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
};

export const signIn = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase Auth not initialized');
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOut = async () => {
  if (!auth) throw new Error('Firebase Auth not initialized');
  await firebaseSignOut(auth);
};

export const resetPassword = async (email: string) => {
  if (!auth) throw new Error('Firebase Auth not initialized');
  await sendPasswordResetEmail(auth, email);
};

export const signInWithGoogle = async () => {
  if (!auth) throw new Error('Firebase Auth not initialized');
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
};

export const signInWithFacebook = async () => {
  if (!auth) throw new Error('Firebase Auth not initialized');
  const provider = new FacebookAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
};

