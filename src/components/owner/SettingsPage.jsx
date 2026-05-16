import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';

export function SettingsPage() {
  const { settings, loading, updateSettings } = useSettings();
  
  const [formData, setFormData] = useState({
    shopName: '',
    shopPhone: '',
    priceSingleBW: '',
    priceDoubleBW: '',
    priceSingleColor: '',
    priceDoubleColor: '',
    acceptingOrders: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        shopName: settings.shopName || '',
        shopPhone: settings.shopPhone || '',
        priceSingleBW: settings.priceSingleBW || 0,
        priceDoubleBW: settings.priceDoubleBW || 0,
        priceSingleColor: settings.priceSingleColor || 0,
        priceDoubleColor: settings.priceDoubleColor || 0,
        acceptingOrders: settings.acceptingOrders !== false
      });
    }
  }, [settings]);

  if (loading) return <div className="p-xl">Loading settings...</div>;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings({ shopName: formData.shopName, shopPhone: formData.shopPhone });
    alert('Shop info updated');
    setIsSaving(false);
  };

  const handleSavePricing = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings({
      priceSingleBW: parseFloat(formData.priceSingleBW),
      priceDoubleBW: parseFloat(formData.priceDoubleBW),
      priceSingleColor: parseFloat(formData.priceSingleColor),
      priceDoubleColor: parseFloat(formData.priceDoubleColor)
    });
    alert('Pricing updated');
    setIsSaving(false);
  };

  const toggleAcceptingOrders = async () => {
    const newVal = !formData.acceptingOrders;
    setFormData(prev => ({ ...prev, acceptingOrders: newVal }));
    await updateSettings({ acceptingOrders: newVal });
  };

  return (
    <div className="max-w-container-max mx-auto">
      <div className="mb-lg">
        <h3 className="font-h2 text-h2 text-on-surface">Account Configuration</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">Manage your print shop operational parameters and security settings.</p>
      </div>

      <div className="grid grid-cols-12 gap-xl">
        {/* Shop Info Card */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <div className="flex items-center gap-sm mb-lg">
            <span className="material-symbols-outlined text-primary">store</span>
            <h4 className="font-h3 text-h3">Shop Information</h4>
          </div>
          <form onSubmit={handleSaveInfo}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-xs">
                <label className="block font-label-md text-label-md text-on-surface-variant">Shop Name</label>
                <input 
                  type="text" 
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  className="w-full px-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md text-body-md" 
                />
              </div>
              <div className="space-y-xs">
                <label className="block font-label-md text-label-md text-on-surface-variant">Contact Number</label>
                <input 
                  type="tel" 
                  name="shopPhone"
                  value={formData.shopPhone}
                  onChange={handleChange}
                  className="w-full px-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md text-body-md" 
                />
              </div>
            </div>
            <div className="mt-lg flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                Update Shop Info
              </button>
            </div>
          </form>
        </div>

        {/* Availability Card */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-secondary">event_available</span>
              <h4 className="font-h3 text-h3">Availability</h4>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">Control if your shop is currently visible to new customer requests.</p>
          </div>
          <div className="flex items-center justify-between p-md bg-surface-container-low rounded-lg">
            <span className="font-label-md text-label-md text-on-surface">Accept new orders</span>
            <button
              type="button"
              onClick={toggleAcceptingOrders}
              className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${formData.acceptingOrders ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${formData.acceptingOrders ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="col-span-12 lg:col-span-12 bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant/30">
          <div className="flex items-center gap-sm mb-lg">
            <span className="material-symbols-outlined text-primary">payments</span>
            <h4 className="font-h3 text-h3">Global Pricing</h4>
          </div>
          <form onSubmit={handleSavePricing} className="space-y-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-xs">
                <label className="block font-label-md text-label-md text-on-surface-variant">B&W Single Sided</label>
                <div className="relative">
                  <span className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">₹</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="priceSingleBW"
                    value={formData.priceSingleBW}
                    onChange={handleChange}
                    className="w-full pl-xl pr-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-md text-body-md" 
                  />
                </div>
              </div>
              <div className="space-y-xs">
                <label className="block font-label-md text-label-md text-on-surface-variant">B&W Double Sided</label>
                <div className="relative">
                  <span className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">₹</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="priceDoubleBW"
                    value={formData.priceDoubleBW}
                    onChange={handleChange}
                    className="w-full pl-xl pr-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-md text-body-md" 
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-xs">
                <label className="block font-label-md text-label-md text-on-surface-variant">Color Single Sided</label>
                <div className="relative">
                  <span className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">₹</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="priceSingleColor"
                    value={formData.priceSingleColor}
                    onChange={handleChange}
                    className="w-full pl-xl pr-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-md text-body-md" 
                  />
                </div>
              </div>
              <div className="space-y-xs">
                <label className="block font-label-md text-label-md text-on-surface-variant">Color Double Sided</label>
                <div className="relative">
                  <span className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">₹</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="priceDoubleColor"
                    value={formData.priceDoubleColor}
                    onChange={handleChange}
                    className="w-full pl-xl pr-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-md text-body-md" 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                Update Pricing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
