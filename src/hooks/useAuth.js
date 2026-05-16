import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, isAuthEnabled } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const loadingRef = React.useRef(true);

  const resolveLoading = () => {
    if (loadingRef.current) {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthEnabled) {
      const savedUser = localStorage.getItem('printease_user');
      if (savedUser) setUser(JSON.parse(savedUser));
      resolveLoading();
      return;
    }

    const timeoutId = setTimeout(() => {
      console.warn("Auth state check timed out.");
      resolveLoading();
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      clearTimeout(timeoutId);
      setUser(currentUser);
      resolveLoading();
    });
    
    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const login = async (email, password) => {
    if (!isAuthEnabled) {
      if (email === 'admin@printease.com' && password === 'admin123') {
        const mockUser = { email, uid: 'mock-uid-123' };
        setUser(mockUser);
        localStorage.setItem('printease_user', JSON.stringify(mockUser));
        return { user: mockUser };
      }
      throw new Error("Invalid credentials for Demo Mode (Use admin@printease.com / admin123)");
    }
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!isAuthEnabled) {
      setUser(null);
      localStorage.removeItem('printease_user');
      return;
    }
    return await firebaseSignOut(auth);
  };

  return { user, loading, login, logout };
}
