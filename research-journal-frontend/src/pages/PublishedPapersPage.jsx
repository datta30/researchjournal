import { useEffect, useMemo, useState } from 'react';
import PaperCard from '../components/PaperCard.jsx';
import api from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

const PublishedPapersPage = () => {
  const [papers, setPapers] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/papers/published');
        setPapers(data);
      } catch (error) {
        showToast({
          title: 'Unable to load published papers',
          description: error.response?.data?.message,
          type: 'error'
        });
      }
    };
    load();
  }, [showToast]);

  const filtered = useMemo(() => {
    return papers.filter((paper) => {
      const matchesQuery = `${paper.title} ${paper.abstractText}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'ALL' ? true : paper.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [papers, query, status]);

  const handleView = (paper) => {
    showToast({ title: paper.title, description: paper.abstractText, type: 'info', duration: 6000 });
  };

  const handleDownload = (paper) => {
    if (paper.filePath) {
      window.open(`/api/papers/download/${paper.id}`, '_blank');
    } else {
      showToast({ title: 'File not available', type: 'warning' });
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Published research</h1>
        <p className="text-sm text-slate-500">Search accepted papers and explore the latest publications.</p>
      </header>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title or abstract"
          className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm outline-none focus:border-primary md:max-w-sm"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm outline-none focus:border-primary md:max-w-xs"
        >
          <option value="ALL">All statuses</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="UNDER_REVIEW">Under review</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          No papers match your current filters.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((paper) => (
            <PaperCard key={paper.id} paper={paper} onView={handleView} onDownload={handleDownload} />
          ))}
        </div>
      )}
    </section>
  );
};

export default PublishedPapersPage;
