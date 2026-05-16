import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, totalAmount, customerName } = location.state || {};

  return (
    <div className="flex-grow flex items-center justify-center p-gutter min-h-screen">
      <div className="max-w-xl w-full">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_rgb(30,64,175,0.08)] border border-outline-variant overflow-hidden">
          <div className="p-2xl flex flex-col items-center text-center">
            <div className="mb-lg">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined !text-[48px]" style={{fontVariationSettings: "'wght' 600"}}>check_circle</span>
              </div>
            </div>
            <h1 className="font-h2 text-h2 text-on-surface mb-sm">Order Placed Successfully!</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-xl">Hi {customerName || 'Customer'}, your high-precision print job has been queued.</p>

            <div className="w-full bg-surface-container rounded-lg p-lg mb-xl text-left border border-outline-variant/30">
              <div className="flex justify-between items-center mb-md pb-md border-b border-outline-variant/50">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider mb-xs">Order ID</span>
                  <span className="font-h3 text-h3 font-bold text-primary">{orderId || 'ORD-0000'}</span>
                </div>
                <div className="text-right">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase tracking-wider mb-xs">Amount</span>
                  <span className="font-h3 text-h3 font-bold text-on-surface">₹{totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
              <div className="space-y-md">
                <div className="flex gap-md items-start">
                  <span className="material-symbols-outlined text-primary mt-0.5">schedule</span>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">Estimated wait time</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">Ready in 15-20 minutes</p>
                  </div>
                </div>
                <div className="flex gap-md items-start">
                  <span className="material-symbols-outlined text-primary mt-0.5">qr_code_2</span>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">Pickup Instruction</p>
                    <p className="font-body-md text-body-md text-on-surface-variant">Please provide your name or order details at the pickup counter.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-sm">
              <button 
                onClick={() => navigate('/')}
                className="w-full bg-primary text-white font-label-md text-label-md py-md rounded-lg shadow-md hover:opacity-90 transition-all active:scale-95"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>

        <div className="mt-xl grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex items-center gap-md">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">location_on</span>
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface">Store Location</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Downtown Tech Plaza, Suite 402</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm flex items-center gap-md">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">mail</span>
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface">Email Receipt</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Check your inbox</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
