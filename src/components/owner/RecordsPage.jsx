import React from 'react';
import { useOrders } from '../../hooks/useOrders';

export function RecordsPage() {
  const { orders, loading } = useOrders();

  if (loading) return (
    <div className="flex items-center justify-center p-2xl min-h-[400px]">
      <div className="flex flex-col items-center gap-md">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-label-lg">Loading historical records...</p>
      </div>
    </div>
  );

  // Permanently filter for completed orders from the master orders list
  const completedOrders = orders.filter(o => o.status === 'completed');

  const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalPendingReceivables = completedOrders.filter(o => !o.isPaid).reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const formatDate = (dateObj) => {
    if (!dateObj) return 'N/A';
    // Handle Firestore Timestamps vs JS Date strings
    const date = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-container-max mx-auto space-y-xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="font-h2 text-h2 text-on-surface mb-xs">Order Records</h2>
          <p className="font-body-md text-on-surface-variant max-w-2xl">
            Historical overview of completed print jobs. Records are permanently stored in Firestore for accounting and tracking.
          </p>
        </div>
        <div className="bg-primary-container/20 px-lg py-md rounded-xl border border-primary/10">
          <p className="font-label-sm text-primary uppercase tracking-tighter">Lifetime Revenue</p>
          <p className="font-h3 text-h3 font-bold text-primary">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant">
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Order ID</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Date</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Customer</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Details</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Amount</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {completedOrders.map(order => (
                <tr key={order.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-lg py-md font-label-md text-primary font-bold">{order.orderId}</td>
                  <td className="px-lg py-md font-body-sm text-on-surface-variant">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-lg py-md">
                    <div className="flex flex-col">
                      <span className="font-body-md font-semibold text-on-surface">{order.customerName}</span>
                      <span className="text-caption text-on-surface-variant">{order.customerPhone}</span>
                    </div>
                  </td>
                  <td className="px-lg py-md">
                    <div className="flex flex-col gap-1">
                      <span className="font-body-sm text-on-surface">{order.totalPages} Pages × {order.copies} Copies</span>
                      <div className="flex gap-xs">
                        <span className="text-[10px] px-sm bg-surface-container-highest rounded-full uppercase font-bold text-on-surface-variant">{order.colorMode}</span>
                        <span className="text-[10px] px-sm bg-surface-container-highest rounded-full uppercase font-bold text-on-surface-variant">{order.sides}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-lg py-md font-body-md font-bold text-on-surface">
                    ₹{order.totalAmount?.toFixed(2)}
                  </td>
                  <td className="px-lg py-md">
                    <div className="flex justify-center">
                      {order.isPaid ? (
                        <span className="inline-flex items-center gap-xs px-md py-1 bg-green-100 text-green-800 rounded-full text-[11px] font-bold">
                          <span className="material-symbols-outlined !text-[14px]">check_circle</span>
                          PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-xs px-md py-1 bg-amber-100 text-amber-800 rounded-full text-[11px] font-bold">
                          <span className="material-symbols-outlined !text-[14px]">error</span>
                          UNPAID
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {completedOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-lg py-2xl text-center">
                    <div className="flex flex-col items-center gap-sm text-on-surface-variant">
                      <span className="material-symbols-outlined !text-4xl opacity-20">history_toggle_off</span>
                      <p className="font-body-md">No completed records found in Firestore.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div className="bg-amber-50 p-lg rounded-2xl border border-amber-200 flex items-center gap-lg">
          <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-800">
            <span className="material-symbols-outlined">pending_payments</span>
          </div>
          <div>
            <p className="font-label-sm text-amber-800 uppercase font-bold">Uncollected Payments</p>
            <p className="font-h3 text-h3 text-amber-900 font-bold">₹{totalPendingReceivables.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant flex items-center gap-lg shadow-sm">
          <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div>
            <p className="font-label-sm text-on-surface-variant uppercase font-bold">Total Orders Archived</p>
            <p className="font-h3 text-h3 text-on-surface font-bold">{completedOrders.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
