import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';

// Set up the worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function detectPageCount(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  
  if (extension === 'pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages;
    } catch (error) {
      console.error("Error reading PDF:", error);
      return 1; // Fallback
    }
  } else if (extension === 'docx' || extension === 'doc') {
    // Estimate: 1 page ≈ 3000 bytes
    const estimatedPages = Math.max(1, Math.ceil(file.size / 3000));
    return estimatedPages;
  } else if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
    // Images are counted as 1 page
    return 1;
  }
  
  // Default fallback
  return 1;
}
