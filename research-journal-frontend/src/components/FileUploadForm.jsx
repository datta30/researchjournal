import { useState } from 'react';

const FileUploadForm = ({ onSubmit, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [abstractText, setAbstractText] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('abstractText', abstractText);
    formData.append('file', file);
    onSubmit(formData, () => {
      setTitle('');
      setAbstractText('');
      setFile(null);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-dashed border-slate-300 bg-white p-6">
      <div>
        <label className="block text-sm font-semibold text-slate-600">Title</label>
        <input
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter paper title"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-600">Abstract</label>
        <textarea
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
          rows="4"
          value={abstractText}
          onChange={(e) => setAbstractText(e.target.value)}
          placeholder="Summarize your paper"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-600">Upload PDF</label>
        <input
          className="mt-1 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0] ?? null)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isLoading ? 'Uploading…' : 'Submit Paper'}
      </button>
    </form>
  );
};

export default FileUploadForm;
