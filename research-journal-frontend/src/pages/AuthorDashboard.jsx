import { useCallback, useEffect, useMemo, useState } from 'react';
import FileUploadForm from '../components/FileUploadForm.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import Sidebar from '../components/Sidebar.jsx';
import api from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

const AuthorDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [revisionModal, setRevisionModal] = useState({ open: false, paper: null, notes: '' });
  const [activeSection, setActiveSection] = useState('submit');
  const { showToast } = useToast();

  const sections = [
    { key: 'submit', label: 'Submit new paper' },
    { key: 'submissions', label: 'Submission history' }
  ];

  const loadSubmissions = useCallback(async () => {
    try {
      const { data } = await api.get('/papers/my-submissions');
      setSubmissions(data);
    } catch (error) {
      showToast({
        title: 'Unable to fetch submissions',
        description: error.response?.data?.message,
        type: 'error'
      });
    }
  }, [showToast]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleUpload = async (formData, onSuccess) => {
    setLoading(true);
    try {
      await api.post('/papers/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast({ title: 'Paper submitted', type: 'success' });
      onSuccess();
      await loadSubmissions();
    } catch (error) {
      showToast({
        title: 'Upload failed',
        description: error.response?.data?.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      { Header: 'Title', accessor: (row) => <span className="font-medium text-slate-700">{row.title}</span> },
      { Header: 'Status', accessor: (row) => row.status?.replace('_', ' ') },
      { Header: 'Reviewer Feedback', accessor: (row) => row.latestFeedback ?? '—' },
      {
        Header: 'Actions',
        accessor: (row) => (
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1 font-semibold text-slate-600 transition hover:bg-slate-100"
              onClick={() =>
                setRevisionModal({
                  open: true,
                  paper: row,
                  notes: row.revisionNotes ?? ''
                })
              }
              disabled={row.status === 'ACCEPTED'}
            >
              Submit Revision
            </button>
          </div>
        )
      }
    ],
    []
  );

  const submitRevision = async () => {
    try {
      await api.put(`/papers/revise/${revisionModal.paper.id}`, {
        revisionNotes: revisionModal.notes
      });
      showToast({ title: 'Revision sent', type: 'success' });
      setRevisionModal({ open: false, paper: null, notes: '' });
      await loadSubmissions();
    } catch (error) {
      showToast({
        title: 'Revision failed',
        description: error.response?.data?.message,
        type: 'error'
      });
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Author workspace</h1>
        <p className="text-sm text-slate-500">Submit new manuscripts, track reviewer feedback, and manage revisions.</p>
      </header>
      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
        <Sidebar sections={sections} active={activeSection} onSelect={setActiveSection} />
        <div className="flex-1 space-y-8">
          {activeSection === 'submit' ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800">Submit new paper</h2>
              <FileUploadForm onSubmit={handleUpload} isLoading={loading} />
            </div>
          ) : null}
          {activeSection === 'submissions' ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800">My submissions</h2>
              <DataTable columns={columns} data={submissions} emptyLabel="No submissions yet. Upload your first paper!" />
            </div>
          ) : null}
        </div>
      </div>
      <Modal
        isOpen={revisionModal.open}
        onClose={() => setRevisionModal({ open: false, paper: null, notes: '' })}
        title={revisionModal.paper ? `Revision for ${revisionModal.paper.title}` : 'Submit revision'}
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              onClick={() => setRevisionModal({ open: false, paper: null, notes: '' })}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
              onClick={submitRevision}
            >
              Submit
            </button>
          </div>
        }
      >
        <label className="block text-sm font-semibold text-slate-600">Revision notes</label>
        <textarea
          rows="6"
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
          value={revisionModal.notes}
          onChange={(event) =>
            setRevisionModal((prev) => ({
              ...prev,
              notes: event.target.value
            }))
          }
          placeholder="Describe your updates and responses to reviewer comments"
        />
      </Modal>
    </section>
  );
};

export default AuthorDashboard;
