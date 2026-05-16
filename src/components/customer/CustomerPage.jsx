import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useSettings } from '../../hooks/useSettings';
import { calculateTotal } from '../../utils/calculatePrice';
import { FileUploader } from './FileUploader';
import { PrintPreferences } from './PrintPreferences';
import { PriceCalculator } from './PriceCalculator';
import { generateOrderId } from '../../utils/generateOrderId';

// Convert a File to a base64 data URI so it persists in localStorage
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function CustomerPage() {
  const navigate = useNavigate();
  const { createOrder } = useOrders();
  const { settings, loading: settingsLoading } = useSettings();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [files, setFiles] = useState([]);
  const [colorMode, setColorMode] = useState('bw'); // 'bw' | 'color'
  const [sides, setSides] = useState('single'); // 'single' | 'double'
  const [paperSize, setPaperSize] = useState('A4');
  const [copies, setCopies] = useState(1);
  const [bindingType, setBindingType] = useState('none'); // 'none' | 'spiral' | 'staple' | 'hard'
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pricePerPage = colorMode === 'color' 
    ? (sides === 'double' ? settings.priceDoubleColor : settings.priceSingleColor)
    : (sides === 'double' ? settings.priceDoubleBW : settings.priceSingleBW);
    
  const totalPages = files.reduce((sum, file) => sum + (file.pageCount || 1), 0);
  const totalAmount = calculateTotal(files, copies, colorMode, sides, settings);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please upload at least one document.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const orderId = await generateOrderId();
      const uploadedFiles = [];

      for (const item of files) {
        const base64 = await fileToBase64(item.file);
        uploadedFiles.push({
          fileName: item.fileName,
          downloadURL: base64,
          pageCount: item.pageCount,
          fileSize: item.fileSize
        });
      }

      const orderData = {
        orderId,
        customerName,
        customerPhone,
        files: uploadedFiles,
        totalPages,
        copies,
        bindingType,
        colorMode,
        sides,
        paperSize,
        specialInstructions,
        pricePerPage,
        totalAmount,
        status: 'pending',
        isPaid: false
      };

      // Try Firestore, fall back to localStorage
      try {
        await createOrder(orderData);
      } catch (firestoreErr) {
        console.warn('[PrintEase] Firestore save failed, order saved locally:', firestoreErr.message);
        // Order was already saved to localStorage inside createOrder — just navigate
      }
      
      navigate('/success', { state: { orderId, totalAmount, customerName } });
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to create order. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (settingsLoading) {
      return (
        <div className="lg:col-span-12 flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-md"></div>
          <p className="text-on-surface-variant font-body-md">Initializing shop parameters...</p>
        </div>
      );
    }

    if (!settings.acceptingOrders) {
      return (
        <div className="lg:col-span-12 flex items-center justify-center p-xl">
          <div className="bg-surface-container-lowest p-xl rounded-xl shadow-md border border-outline-variant text-center max-w-md">
            <span className="material-symbols-outlined text-[48px] text-error mb-md">store_closed</span>
            <h2 className="font-h3 text-h3 mb-sm">Shop is currently closed</h2>
            <p className="font-body-md text-on-surface-variant">We are currently not accepting new orders. Please check back later.</p>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Left Section: Welcome & Steps */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h1 className="font-h1 text-h1 text-on-surface mb-md">Quick Prints, <br/><span className="text-primary">Zero Hassle.</span></h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl leading-relaxed">
            Experience operational excellence with PrintEase. Professional-grade printing delivered with industrial precision.
          </p>
          
          <div className="space-y-lg">
            <div className="flex items-start gap-md group">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-primary font-bold">1</div>
              <div>
                <h4 className="font-label-md text-label-md text-on-surface">Upload Files</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Securely upload your PDFs, DOCX, or images.</p>
              </div>
            </div>
            <div className="flex items-start gap-md group">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-primary font-bold">2</div>
              <div>
                <h4 className="font-label-md text-label-md text-on-surface">Select Preferences</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Customize size, color, and binding options.</p>
              </div>
            </div>
            <div className="flex items-start gap-md group">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-primary font-bold">3</div>
              <div>
                <h4 className="font-label-md text-label-md text-on-surface">Collect & Pay</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Pick up from your nearest center and pay on-site.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Order Form Card */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_10px_40px_rgba(30,64,175,0.08)] p-xl border border-surface-variant">
            <div className="flex justify-between items-center mb-xl">
              <h3 className="font-h3 text-h3 text-on-surface">New Print Job</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full border-outline-variant rounded-lg px-md py-sm focus:ring-primary focus:border-primary" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant">Phone Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full border-outline-variant rounded-lg px-md py-sm focus:ring-primary focus:border-primary" 
                    placeholder="9876543210" 
                  />
                </div>
              </div>

              <PrintPreferences 
                colorMode={colorMode} setColorMode={setColorMode}
                sides={sides} setSides={setSides}
                paperSize={paperSize} setPaperSize={setPaperSize}
                copies={copies} setCopies={setCopies}
                bindingType={bindingType} setBindingType={setBindingType}
              />

              <FileUploader onFilesAdded={(newFiles) => setFiles(prev => [...prev, ...newFiles])} />

              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface-variant">Special Instructions (Optional)</label>
                <textarea 
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  className="w-full border-outline-variant rounded-lg px-md py-sm focus:ring-primary focus:border-primary min-h-[80px]" 
                  placeholder="e.g. Spiral binding, Color cover only, etc." 
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-sm">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Attached Files:</span>
                  <ul className="space-y-xs">
                    {files.map((f, i) => (
                      <li key={i} className="flex justify-between text-body-sm bg-surface-container p-sm rounded">
                        <span className="truncate max-w-[60%]">{f.fileName}</span>
                        <span>{f.pageCount} pages ({f.fileSize})</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    type="button" 
                    onClick={() => setFiles([])} 
                    className="text-error font-label-sm hover:underline"
                  >
                    Clear Files
                  </button>
                </div>
              )}

              <PriceCalculator 
                totalPages={totalPages} 
                pricePerPage={pricePerPage} 
                totalAmount={totalAmount} 
              />

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-label-md py-md rounded-lg shadow-md hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
                {!isSubmitting && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="bg-surface shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-lg py-md max-w-container-max mx-auto">
          <div className="flex flex-col">
            <span className="font-h2 text-h2 font-bold text-primary">{settings.shopName || 'PrintEase'}</span>
            <span className="font-caption text-caption text-on-surface-variant tracking-wider">Upload. Print. Collect.</span>
          </div>
          <nav className="flex items-center gap-md">
            <button 
              onClick={() => navigate('/owner')} 
              className="bg-primary text-white px-md py-sm rounded-lg font-label-md transition-transform active:scale-95 flex items-center gap-xs shadow-sm hover:brightness-110"
            >
              <span className="material-symbols-outlined !text-[20px]">admin_panel_settings</span>
              <span className="hidden sm:inline">Owner Login</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-container-max mx-auto w-full px-lg py-xl grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {renderContent()}
      </main>
      
      <footer className="bg-surface py-xl border-t border-outline-variant/30 mt-auto">
        <div className="max-w-container-max mx-auto px-lg flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex items-center gap-sm">
            <span className="font-h3 text-h3 font-bold text-primary">{settings.shopName || 'PrintEase'}</span>
            <span className="text-on-surface-variant text-body-sm">© 2024 Industrial Print Solutions</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
