/**
 * Downloads a file from a URL or base64 data URI.
 * Handles Firebase Storage URLs, blob URLs, and base64 data URIs.
 */
export async function downloadFile(downloadURL, fileName) {
  if (!downloadURL) {
    alert('File is not available for download.');
    return;
  }

  try {
    // base64 data URI — decode and download directly
    if (downloadURL.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = downloadURL;
      a.download = fileName;
      a.click();
      return;
    }

    // blob: URL — may still be alive in the same session
    if (downloadURL.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = downloadURL;
      a.download = fileName;
      a.click();
      return;
    }

    // Remote URL (Firebase Storage or http) — fetch and trigger download
    const response = await fetch(downloadURL);
    if (!response.ok) throw new Error(`Failed to fetch file: ${response.status}`);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch (err) {
    console.error('Download failed:', err);
    alert(`Could not download "${fileName}". The file may no longer be available.`);
  }
}
