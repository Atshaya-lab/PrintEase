import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirestoreEnabled } from '../firebase';
import { generateOrderId } from '../utils/generateOrderId';

// Shared in-memory store so all useOrders() instances stay in sync (localStorage mode)
let _localOrders = null;
const _listeners = new Set();

function getLocalOrders() {
  if (_localOrders === null) {
    const saved = localStorage.getItem('printease_orders');
    _localOrders = saved ? JSON.parse(saved) : [];
  }
  return _localOrders;
}

function setLocalOrders(orders) {
  _localOrders = orders;
  localStorage.setItem('printease_orders', JSON.stringify(orders));
  _listeners.forEach(fn => fn(orders));
}

function parseLocalOrders(orders) {
  return orders.map(o => ({
    ...o,
    createdAt: o.createdAt ? { toDate: () => new Date(o.createdAt) } : null,
    updatedAt: o.updatedAt ? { toDate: () => new Date(o.updatedAt) } : null
  }));
}

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Shared handler for all UI updates
    const handler = (newOrders) => setOrders(parseLocalOrders(newOrders));
    _listeners.add(handler);

    if (!isFirestoreEnabled) {
      setOrders(parseLocalOrders(getLocalOrders()));
      setLoading(false);

      const handleSimulate = (e) => createOrder(e.detail);
      window.addEventListener('simulate-order', handleSimulate);

      return () => {
        _listeners.delete(handler);
        window.removeEventListener('simulate-order', handleSimulate);
      };
    }

    // Firestore mode
    const timeoutId = setTimeout(() => {
      console.warn('[PrintEase] Firestore timeout, falling back to local cache.');
      setOrders(parseLocalOrders(getLocalOrders()));
      setLoading(false);
    }, 8000);

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      clearTimeout(timeoutId);
      const ordersData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Update shared local store
      _localOrders = ordersData.map(o => ({
        ...o,
        createdAt: o.createdAt?.toDate ? o.createdAt.toDate().toISOString() : (o.createdAt || null),
        updatedAt: o.updatedAt?.toDate ? o.updatedAt.toDate().toISOString() : (o.updatedAt || null),
      }));
      
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      clearTimeout(timeoutId);
      console.error("[PrintEase] Firestore Error:", error);
      setOrders(parseLocalOrders(getLocalOrders()));
      setLoading(false);
    });

    return () => {
      _listeners.delete(handler);
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    const orders = getLocalOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId || o.orderId === orderId);
    if (orderIndex === -1) return;

    const updatedOrder = { ...orders[orderIndex], status, updatedAt: new Date().toISOString() };
    const newOrders = [...orders];
    newOrders[orderIndex] = updatedOrder;
    setLocalOrders(newOrders);

    if (!isFirestoreEnabled) return;

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status, updatedAt: serverTimestamp() });
    } catch (err) {
      console.warn('[PrintEase] updateDoc failed, attempting full sync for persistence:', err.message);
      try {
        const orderRef = doc(db, 'orders', orderId);
        await setDoc(orderRef, {
          ...updatedOrder,
          createdAt: updatedOrder.createdAt ? new Date(updatedOrder.createdAt) : serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err2) {
        console.error('[PrintEase] Permanent save failed:', err2.message);
      }
    }
  };

  const markAsPaid = async (orderId, isPaid) => {
    const orders = getLocalOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId || o.orderId === orderId);
    if (orderIndex === -1) return;

    const updatedOrder = { ...orders[orderIndex], isPaid, updatedAt: new Date().toISOString() };
    const newOrders = [...orders];
    newOrders[orderIndex] = updatedOrder;
    setLocalOrders(newOrders);

    if (!isFirestoreEnabled) return;

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { isPaid, updatedAt: serverTimestamp() });
    } catch (err) {
      console.warn('[PrintEase] markAsPaid updateDoc failed, attempting sync:', err.message);
      try {
        const orderRef = doc(db, 'orders', orderId);
        await setDoc(orderRef, {
          ...updatedOrder,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err2) {
        console.error('[PrintEase] Payment sync failed:', err2.message);
      }
    }
  };

  const createOrder = async (orderData) => {
    const orderId = orderData.orderId || await generateOrderId();

    if (!isFirestoreEnabled) {
      const newOrder = {
        id: orderId,
        ...orderData,
        orderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setLocalOrders([newOrder, ...getLocalOrders()]);
      return orderId;
    }

    const orderRef = doc(db, 'orders', orderId);
    const newOrder = {
      orderId,
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(orderRef, newOrder);
    } catch (err) {
      console.warn('[PrintEase] Firestore write failed, saving locally:', err.message);
      const localOrder = {
        id: orderId,
        ...orderData,
        orderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setLocalOrders([localOrder, ...getLocalOrders()]);
    }
    return orderId;
  };

  return { orders, loading, updateOrderStatus, markAsPaid, createOrder };
}
