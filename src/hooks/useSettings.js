import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import { db, isFirestoreEnabled } from '../firebase';

const MOCK_SETTINGS = {
  priceSingleBW: 1.50,
  priceDoubleBW: 0.85,
  priceSingleColor: 10.0,
  priceDoubleColor: 5.0,
  shopName: 'PrintEase (Demo)',
  shopPhone: '9876543210',
  acceptingOrders: true
};

export function useSettings() {
  const [settings, setSettings] = useState(MOCK_SETTINGS);
  const [loading, setLoading] = useState(true);
  const loadingRef = React.useRef(true);

  const resolveLoading = () => {
    if (loadingRef.current) {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFirestoreEnabled) {
      // Use mock settings
      const saved = localStorage.getItem('printease_settings');
      if (saved) setSettings(JSON.parse(saved));
      resolveLoading();
      return;
    }

    const timeoutId = setTimeout(() => {
      console.warn("Settings fetch timed out, using defaults/mock.");
      resolveLoading();
    }, 5000);

    const docRef = doc(db, 'settings', 'config');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      clearTimeout(timeoutId);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
      resolveLoading();
    }, (error) => {
      clearTimeout(timeoutId);
      console.error("Error fetching settings:", error);
      resolveLoading();
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const updateSettings = async (newSettings) => {
    // Optimistic update — merge into current settings and persist locally immediately
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    localStorage.setItem('printease_settings', JSON.stringify(merged));

    if (!isFirestoreEnabled) return;
    try {
      const docRef = doc(db, 'settings', 'config');
      await setDoc(docRef, newSettings, { merge: true });
    } catch (err) {
      console.warn('[PrintEase] Firestore settings update failed, kept local change:', err.message);
    }
  };

  return { settings, loading, updateSettings };
}
