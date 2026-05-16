export function calculateTotal(files, copies, colorMode, sides, prices = {}) {
  if (!files || files.length === 0) return 0;
  
  const totalPages = files.reduce((sum, file) => sum + (Number(file.pageCount) || 1), 0);
  
  // Pricing logic based on color mode and sides
  let pricePerPage = 0;
  if (colorMode === 'color') {
    pricePerPage = sides === 'double' ? (prices.priceDoubleColor || 5.0) : (prices.priceSingleColor || 10.0);
  } else {
    pricePerPage = sides === 'double' ? (prices.priceDoubleBW || 0.85) : (prices.priceSingleBW || 1.50);
  }

  const total = totalPages * Number(copies) * Number(pricePerPage);
  
  // Debug log as requested by user
  console.log("pages:", totalPages, "copies:", copies, "price:", pricePerPage, "sides:", sides, "total:", total);
  
  return total;
}

