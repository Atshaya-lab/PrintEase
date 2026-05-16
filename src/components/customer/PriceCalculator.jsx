import React from 'react';

export function PriceCalculator({ totalPages, pricePerPage, totalAmount }) {
  return (
    <div className="bg-surface-container-low rounded-lg p-lg border-l-4 border-primary mt-lg">
      <div className="flex justify-between items-center text-on-surface-variant font-body-sm mb-xs">
        <span>Detected Pages</span>
        <span>{totalPages} Pages</span>
      </div>
      <div className="flex justify-between items-center text-on-surface-variant font-body-sm mb-sm">
        <span>Price per Page</span>
        <span>₹{pricePerPage.toFixed(2)}</span>
      </div>
      <hr className="border-outline-variant my-sm" />
      <div className="flex justify-between items-center">
        <span className="font-label-md text-label-md text-on-surface">Total Amount</span>
        <span className="font-h3 text-h3 text-primary font-bold">₹{totalAmount.toFixed(2)}</span>
      </div>
    </div>
  );
}
