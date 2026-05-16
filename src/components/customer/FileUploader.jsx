import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { detectPageCount } from '../../utils/detectPageCount';

export function FileUploader({ onFilesAdded }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsProcessing(true);
    
    const processedFiles = [];
    
    for (const file of acceptedFiles) {
      try {
        const pageCount = await detectPageCount(file);
        processedFiles.push({
          file,
          fileName: file.name,
          pageCount,
          fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        });
      } catch (err) {
        console.error(`Error processing ${file.name}:`, err);
        // Add anyway with 1 page fallback
        processedFiles.push({
          file,
          fileName: file.name,
          pageCount: 1,
          fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        });
      }
    }
    
    onFilesAdded(processedFiles);
    setIsProcessing(false);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  return (
    <div className="space-y-sm">
      <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Upload Documents</label>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-xl flex flex-col items-center justify-center transition-colors cursor-pointer group
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isProcessing ? (
          <div className="flex flex-col items-center">
             <span className="material-symbols-outlined text-primary text-4xl mb-md animate-spin">autorenew</span>
             <p className="font-label-md text-label-md text-primary mb-xs">Processing files...</p>
          </div>
        ) : (
          <>
            <span className="material-symbols-outlined text-primary text-4xl mb-md group-hover:scale-110 transition-transform">cloud_upload</span>
            <p className="font-label-md text-label-md text-primary mb-xs">
              {isDragActive ? 'Drop the files here...' : 'Click to browse or drag & drop'}
            </p>
            <p className="font-caption text-caption text-on-surface-variant">PDF, DOCX, JPG, PNG (Max 50MB)</p>
            <div className="flex gap-sm mt-md">
              <span className="material-symbols-outlined text-on-surface-variant" style={{fontSize: '20px'}}>description</span>
              <span className="material-symbols-outlined text-on-surface-variant" style={{fontSize: '20px'}}>image</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
