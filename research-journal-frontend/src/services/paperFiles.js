import api from './api.js';

const sanitizeFileName = (name) => {
  if (!name || typeof name !== 'string') {
    return 'paper';
  }
  return name.replace(/[^a-zA-Z0-9\-_.]/g, '_');
};

export const openPaperPdf = async (paperId, title) => {
  try {
    const response = await api.get(`/papers/download/${paperId}`, {
      responseType: 'blob'
    });
    const contentType = response.headers['content-type'] || 'application/pdf';
    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const fileName = `${sanitizeFileName(title)}.pdf`;
    const newWindow = window.open(url, '_blank', 'noopener');

    if (!newWindow) {
      // Fallback: trigger download if browser blocked pop-up
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 60_000);
  } catch (error) {
    throw error;
  }
};
