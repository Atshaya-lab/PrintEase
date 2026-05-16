import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useOrders } from '../../hooks/useOrders';
import { downloadFile } from '../../utils/downloadFile';

const STATUS_OPTIONS = [
  { value: 'pending',   label: 'Pending',   color: 'bg-amber-100 text-amber-800' },
  { value: 'printing',  label: 'Printing',  color: 'bg-blue-100 text-blue-800' },
  { value: 'ready',     label: 'Ready',     color: 'bg-green-100 text-green-800' },
  { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' },
];

function StatusDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = React.useRef(null);

  const current = STATUS_OPTIONS.find(o => o.value === value) || STATUS_OPTIONS[0];

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
    setOpen(p => !p);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className={`flex items-center gap-xs px-sm py-xs rounded-lg text-caption font-medium border border-outline-variant/40 cursor-pointer min-w-[100px] justify-between transition-all active:scale-95 ${current.color}`}
      >
        {current.label}
        <span className="material-symbols-outlined !text-[14px]">expand_more</span>
      </button>

      {open && typeof document !== 'undefined' && ReactDOM.createPortal(
        <>
          {/* Backdrop to close on click outside */}
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[9999] bg-white border border-outline-variant rounded-lg shadow-lg overflow-hidden min-w-[120px] animate-in fade-in zoom-in-95 duration-100"
            style={{ top: pos.top, left: pos.left }}
          >
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-md py-sm text-caption font-medium hover:bg-surface-container transition-colors ${opt.value === value ? opt.color : 'text-on-surface'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

function PaidToggle({ isPaid, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${isPaid ? 'bg-primary' : 'bg-outline-variant'}`}
    >
      <span
        className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${isPaid ? 'translate-x-5' : 'translate-x-1'}`}
      />
    </button>
  );
}

export function ActiveOrders() {
  const { orders, loading, updateOrderStatus, markAsPaid } = useOrders();

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-md">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-on-surface-variant font-label-lg">Loading active queue...</p>
    </div>
  );

  // Strictly filter out completed orders
  const activeOrders = orders.filter(o => o.status !== 'completed');

  return (
    <div className="max-w-container-max mx-auto space-y-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
        <div>
          <h2 className="font-h2 text-h2 text-on-surface">Active Production Queue</h2>
          <p className="font-body-md text-on-surface-variant">Real-time status of orders waiting for print or pickup.</p>
        </div>
        <div className="flex gap-md">
          <div className="bg-surface-container px-lg py-sm rounded-xl border border-outline-variant">
            <p className="text-[10px] uppercase font-bold text-on-surface-variant">In Progress</p>
            <p className="font-h3 text-h3 font-bold text-primary">{activeOrders.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant">
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">ID</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Customer</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Specs</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Amount</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Paid</th>
                <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {activeOrders.map(order => (
                <tr key={order.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-lg py-md font-label-md text-primary font-bold">{order.orderId}</td>
                  <td className="px-lg py-md">
                    <div className="flex flex-col">
                      <span className="font-body-md font-semibold text-on-surface">{order.customerName}</span>
                      <span className="text-caption text-on-surface-variant">{order.customerPhone}</span>
                    </div>
                  </td>
                  <td className="px-lg py-md">
                    <div className="flex flex-col gap-1">
                      <span className="font-body-sm text-on-surface">{order.totalPages}p / {order.copies}c</span>
                      <div className="flex gap-xs flex-wrap">
                        <span className="text-[10px] px-sm bg-surface-container-highest rounded-full font-bold uppercase text-on-surface-variant">{order.colorMode}</span>
                        <span className="text-[10px] px-sm bg-surface-container-highest rounded-full font-bold uppercase text-on-surface-variant">{order.sides}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-lg py-md font-body-md font-bold text-on-surface">₹{order.totalAmount?.toFixed(2)}</td>
                  <td className="px-lg py-md">
                    <StatusDropdown
                      value={order.status}
                      onChange={(val) => updateOrderStatus(order.id, val)}
                    />
                  </td>
                  <td className="px-lg py-md text-center">
                    <div className="flex justify-center">
                      <PaidToggle
                        isPaid={!!order.isPaid}
                        onChange={() => markAsPaid(order.id, !order.isPaid)}
                      />
                    </div>
                  </td>
                  <td className="px-lg py-md">
                    <div className="flex gap-sm">
                      {order.files?.map((f, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => downloadFile(f.downloadURL, f.fileName)}
                          className="flex items-center justify-center p-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all"
                          title={`Download ${f.fileName}`}
                        >
                          <span className="material-symbols-outlined !text-[18px]">download</span>
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}

              {activeOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-lg py-2xl text-center">
                    <div className="flex flex-col items-center gap-sm text-on-surface-variant">
                      <span className="material-symbols-outlined !text-4xl opacity-20">inventory</span>
                      <p className="font-body-md">Your active queue is empty. Ready for new orders!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
