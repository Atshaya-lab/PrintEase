import { doc, runTransaction } from 'firebase/firestore';
import { db, isFirestoreEnabled } from '../firebase';

export async function generateOrderId() {
  if (!isFirestoreEnabled) {
    const currentCount = parseInt(localStorage.getItem('printease_order_count') || '100');
    const newCount = currentCount + 1;
    localStorage.setItem('printease_order_count', newCount.toString());
    return `ORD-${String(newCount).padStart(4, '0')}`;
  }

  const counterRef = doc(db, 'settings', 'counter');
  
  try {
    const transactionPromise = runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      let currentCount = 0;
      
      if (counterDoc.exists()) {
        currentCount = counterDoc.data().orderCount || 0;
      }
      
      const newCount = currentCount + 1;
      transaction.set(counterRef, { orderCount: newCount }, { merge: true });
      
      return `ORD-${String(newCount).padStart(4, '0')}`;
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Order ID generation timed out')), 8000)
    );

    return await Promise.race([transactionPromise, timeoutPromise]);
  } catch (error) {
    console.warn("Error generating order ID, using fallback:", error.message);
    // Fallback: use localStorage counter so IDs stay sequential
    const currentCount = parseInt(localStorage.getItem('printease_order_count') || '100');
    const newCount = currentCount + 1;
    localStorage.setItem('printease_order_count', newCount.toString());
    return `ORD-${String(newCount).padStart(4, '0')}`;
  }
}
