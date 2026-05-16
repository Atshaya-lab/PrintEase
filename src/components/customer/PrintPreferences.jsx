import React from 'react';

export function PrintPreferences({ 
  colorMode, setColorMode, 
  sides, setSides, 
  paperSize, setPaperSize, 
  copies, setCopies,
  bindingType, setBindingType
}) {
  return (
    <div className="space-y-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
        {/* Color Mode */}
        <div className="space-y-sm">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Color Mode</span>
          <div className="flex p-xs bg-surface-container-low rounded-lg w-max">
            <button 
              type="button"
              onClick={() => setColorMode('bw')}
              className={`px-lg py-sm rounded-md font-label-md transition-colors ${colorMode === 'bw' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              B&W
            </button>
            <button 
              type="button"
              onClick={() => setColorMode('color')}
              className={`px-lg py-sm rounded-md font-label-md transition-colors ${colorMode === 'color' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              Color
            </button>
          </div>
        </div>

        {/* Sides */}
        <div className="space-y-sm">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Printing Sides</span>
          <div className="flex p-xs bg-surface-container-low rounded-lg w-max">
            <button 
              type="button"
              onClick={() => setSides('single')}
              className={`px-lg py-sm rounded-md font-label-md transition-colors ${sides === 'single' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              Single-sided
            </button>
            <button 
              type="button"
              onClick={() => setSides('double')}
              className={`px-lg py-sm rounded-md font-label-md transition-colors ${sides === 'double' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              Double-sided
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-xl items-end">
        {/* Paper Size */}
        <div className="space-y-sm">
          <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Paper Size</label>
          <select 
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value)}
            className="w-full border-outline-variant rounded-lg px-md py-sm focus:ring-primary focus:border-primary font-body-sm bg-surface-container-lowest"
          >
            <option value="A4">A4 (Standard)</option>
            <option value="A3">A3 (Poster)</option>
            <option value="Letter">Letter (Formal)</option>
          </select>
        </div>

        {/* Binding Type */}
        <div className="space-y-sm">
          <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Binding Type</label>
          <select 
            value={bindingType}
            onChange={(e) => setBindingType(e.target.value)}
            className="w-full border-outline-variant rounded-lg px-md py-sm focus:ring-primary focus:border-primary font-body-sm bg-surface-container-lowest"
          >
            <option value="none">None</option>
            <option value="spiral">Spiral Binding</option>
            <option value="staple">Staple</option>
            <option value="hard">Hard Cover</option>
          </select>
        </div>

        {/* Copies Stepper */}
        <div className="space-y-sm">
          <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Number of Copies</label>
          <div className="flex items-center border border-outline-variant rounded-lg w-max overflow-hidden">
            <button 
              type="button"
              onClick={() => setCopies(Math.max(1, copies - 1))}
              className="px-md py-sm bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <input 
              type="number" 
              value={copies} 
              min="1"
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) setCopies(Math.max(1, val));
                else if (e.target.value === '') setCopies('');
              }}
              onBlur={() => {
                if (copies === '' || copies < 1) setCopies(1);
              }}
              className="w-16 border-none text-center font-bold text-on-surface focus:ring-0 appearance-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
            />
            <button 
              type="button"
              onClick={() => setCopies(copies + 1)}
              className="px-md py-sm bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
