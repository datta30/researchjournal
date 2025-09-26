import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import Sidebar from '../components/Sidebar.jsx';
import api from '../services/api.js';
import { openPaperPdf } from '../services/paperFiles.js';
import { useToast } from '../context/ToastContext.jsx';

const EditorDashboard = () => {
  const [papers, setPapers] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [assignModal, setAssignModal] = useState({ open: false, paper: null, reviewerId: '' });
  const [decisionModal, setDecisionModal] = useState({ open: false, paper: null, status: 'UNDER_REVIEW' });
  const [activeSection, setActiveSection] = useState('pipeline');
  const { showToast } = useToast();

  const sections = [
    { key: 'pipeline', label: 'Review pipeline' },
    { key: 'reviewers', label: 'Reviewer directory' }
  ];

  const loadData = useCallback(async () => {
    try {
      const [paperRes, reviewerRes] = await Promise.all([
        api.get('/papers/all'),
        api.get('/users', { params: { role: 'REVIEWER' } })
      ]);
      setPapers(paperRes.data);
      setReviewers(reviewerRes.data);
    } catch (error) {
      showToast({
        title: 'Failed to load editor data',
        description: error.response?.data?.message,
        type: 'error'
      });
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const viewPaper = useCallback(
    async (paper) => {
      try {
        await openPaperPdf(paper.id, paper.title);
      } catch (error) {
        showToast({
          title: 'Unable to open paper',
          description: error.response?.data?.message ?? 'Please try again later.',
          type: 'error'
        });
      }
    },
    [showToast]
  );

  const assignReviewer = async () => {
    try {
      await api.put(`/papers/assign-reviewer/${assignModal.paper.id}/${assignModal.reviewerId}`);
      showToast({ title: 'Reviewer assigned', type: 'success' });
      setAssignModal({ open: false, paper: null, reviewerId: '' });
      await loadData();
    } catch (error) {
      showToast({
        title: 'Assignment failed',
        description: error.response?.data?.message,
        type: 'error'
      });
    }
  };

  const submitDecision = async () => {
    try {
      await api.put(`/papers/decision/${decisionModal.paper.id}`, {
        status: decisionModal.status
      });
      showToast({ title: 'Decision saved', type: 'success' });
      setDecisionModal({ open: false, paper: null, status: 'UNDER_REVIEW' });
      await loadData();
    } catch (error) {
      showToast({
        title: 'Decision failed',
        description: error.response?.data?.message,
        type: 'error'
      });
    }
  };

  const columns = useMemo(
    () => [
      { Header: 'Title', accessor: (row) => <span className="font-medium text-slate-700">{row.title}</span> },
      { Header: 'Author', accessor: (row) => row.author?.name ?? '—' },
      { Header: 'Status', accessor: (row) => row.status?.replace('_', ' ') },
      { Header: 'Assigned Reviewer', accessor: (row) => row.assignedReviewer?.name ?? 'Unassigned' },
      {
        Header: 'Actions',
        accessor: (row) => (
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1 font-semibold text-slate-600 transition hover:bg-slate-100"
              onClick={() => viewPaper(row)}
            >
              View PDF
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1 font-semibold text-slate-600 transition hover:bg-slate-100"
              onClick={() =>
                setAssignModal({ open: true, paper: row, reviewerId: row.assignedReviewer?.id ?? '' })
              }
            >
              Assign reviewer
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1 font-semibold text-slate-600 transition hover:bg-slate-100"
              onClick={() =>
                setDecisionModal({ open: true, paper: row, status: row.status })
              }
            >
              Set decision
            </button>
          </div>
        )
      }
    ],
    [viewPaper]
  );

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Editor command center</h1>
        <p className="text-sm text-slate-500">
          Assign reviewers, monitor progress, and finalize publication decisions.
        </p>
      </header>
      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
        <Sidebar sections={sections} active={activeSection} onSelect={setActiveSection} />
        <div className="flex-1 space-y-8">
          {activeSection === 'pipeline' ? (
            <DataTable columns={columns} data={papers} emptyLabel="No papers available yet." />
          ) : null}
          {activeSection === 'reviewers' ? (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">Available reviewers</h2>
              <ul className="space-y-2 text-sm text-slate-600">
                {reviewers.length === 0 ? (
                  <li>No reviewers available.</li>
                ) : (
                  reviewers.map((reviewer) => (
                    <li key={reviewer.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                      <span>
                        <span className="font-semibold text-slate-800">{reviewer.name}</span>
                        <span className="ml-2 text-xs text-slate-500">{reviewer.email}</span>
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                        {reviewer.role}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
      <Modal
        isOpen={assignModal.open}
        onClose={() => setAssignModal({ open: false, paper: null, reviewerId: '' })}
        title={assignModal.paper ? `Assign reviewer for ${assignModal.paper.title}` : 'Assign Reviewer'}
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              onClick={() => setAssignModal({ open: false, paper: null, reviewerId: '' })}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              onClick={assignReviewer}
              disabled={!assignModal.reviewerId}
            >
              Assign
            </button>
          </div>
        }
      >
        <label className="block text-sm font-semibold text-slate-600">Select reviewer</label>
        <select
          value={assignModal.reviewerId}
          onChange={(event) =>
            setAssignModal((prev) => ({
              ...prev,
              reviewerId: event.target.value
            }))
          }
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">Choose a reviewer</option>
          {reviewers.map((reviewer) => (
            <option key={reviewer.id} value={reviewer.id}>
              {reviewer.name} ({reviewer.email})
            </option>
          ))}
        </select>
      </Modal>
      <Modal
        isOpen={decisionModal.open}
        onClose={() => setDecisionModal({ open: false, paper: null, status: 'UNDER_REVIEW' })}
        title={decisionModal.paper ? `Decision for ${decisionModal.paper.title}` : 'Set Decision'}
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              onClick={() => setDecisionModal({ open: false, paper: null, status: 'UNDER_REVIEW' })}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
              onClick={submitDecision}
            >
              Save
            </button>
          </div>
        }
      >
        {decisionModal.paper ? (
          <button
            type="button"
            className="mb-4 inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            onClick={() => viewPaper(decisionModal.paper)}
          >
            View manuscript PDF
          </button>
        ) : null}
        <label className="block text-sm font-semibold text-slate-600">Decision</label>
        <select
          value={decisionModal.status}
          onChange={(event) =>
            setDecisionModal((prev) => ({
              ...prev,
              status: event.target.value
            }))
          }
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="UNDER_REVIEW">Under review</option>
          <option value="ACCEPTED">Accept</option>
          <option value="REJECTED">Reject</option>
        </select>
      </Modal>
    </section>
  );
};

export default EditorDashboard;
