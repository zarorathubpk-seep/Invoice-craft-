import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  deleteUser,
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../services/firebase.ts';
import { saveUserProfile, deleteAllUserData } from '../services/firestoreService.ts';

interface PendingAction {
  route: string;
  payload?: any;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authError: string | null;
  clearError: () => void;
  pendingAction: PendingAction | null;
  setPendingAction: (action: PendingAction | null) => void;
  loginWithGoogle: () => Promise<User | null>;
  loginWithFacebook: () => Promise<User | null>;
  loginWithEmail: (email: string, pass: string) => Promise<User | null>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<User | null>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  updateUserDisplayName: (name: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteUserAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Sync user profile to Firestore
        try {
          await saveUserProfile(user.uid, {
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
          });
        } catch (e) {
          console.warn('Could not sync user profile to Firestore on auth state change:', e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setAuthError(null);

  const formatAuthError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please verify your credentials and try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Please log in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in window was closed before completing. Please try again.';
      case 'auth/popup-blocked':
        return 'The authentication popup was blocked by your browser. Please allow popups for this site.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in credentials. Please sign in using the original provider.';
      case 'auth/operation-not-allowed':
        return 'This sign-in provider is not enabled in your Firebase Console. Please verify Authentication settings.';
      case 'auth/network-request-failed':
        return 'Network connection issue. Please check your internet connection.';
      default:
        return err?.message || 'An unexpected authentication error occurred.';
    }
  };

  const loginWithGoogle = async (): Promise<User | null> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err: any) {
      const msg = formatAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const loginWithFacebook = async (): Promise<User | null> => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      return result.user;
    } catch (err: any) {
      // Clarify Facebook Meta developer requirement if not configured
      if (err?.code === 'auth/operation-not-allowed' || err?.code === 'auth/configuration-not-found') {
        const msg = 'Facebook Login requires setting up a Meta App ID & Secret in Firebase Console (Authentication > Sign-in method > Facebook).';
        setAuthError(msg);
        throw new Error(msg);
      }
      const msg = formatAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<User | null> => {
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      return result.user;
    } catch (err: any) {
      const msg = formatAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string): Promise<User | null> => {
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName) {
        await updateProfile(result.user, { displayName: displayName.trim() });
      }
      // Send verification email
      try {
        await sendEmailVerification(result.user);
      } catch (e) {
        console.warn('Verification email sending delayed:', e);
      }
      return result.user;
    } catch (err: any) {
      const msg = formatAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      const msg = formatAuthError(err);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const resendVerificationEmail = async (): Promise<void> => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const updateUserDisplayName = async (name: string): Promise<void> => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name.trim() });
      setCurrentUser({ ...auth.currentUser, displayName: name.trim() } as User);
      await saveUserProfile(auth.currentUser.uid, {
        email: auth.currentUser.email || '',
        displayName: name.trim(),
      });
    }
  };

  const logout = async (): Promise<void> => {
    setAuthError(null);
    await signOut(auth);
    setCurrentUser(null);
  };

  const deleteUserAccount = async (): Promise<void> => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    // 1. Delete all Firestore business documents first to prevent orphaned records
    await deleteAllUserData(uid);
    // 2. Delete the Firebase Auth record
    await deleteUser(auth.currentUser);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        clearError,
        pendingAction,
        setPendingAction,
        loginWithGoogle,
        loginWithFacebook,
        loginWithEmail,
        signUpWithEmail,
        resetPassword,
        resendVerificationEmail,
        updateUserDisplayName,
        logout,
        deleteUserAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
