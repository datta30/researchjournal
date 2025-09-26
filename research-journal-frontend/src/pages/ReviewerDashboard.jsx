import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import Sidebar from '../components/Sidebar.jsx';
import api from '../services/api.js';
import { openPaperPdf } from '../services/paperFiles.js';
import { useToast } from '../context/ToastContext.jsx';

const ReviewerDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [reviewModal, setReviewModal] = useState({ open: false, paper: null, comments: '', decision: 'APPROVE' });
  const [activeSection, setActiveSection] = useState('queue');
  const { showToast } = useToast();

  const sections = [
    { key: 'queue', label: 'My assignments' },
    { key: 'guidelines', label: 'Review guidelines' }
  ];

  const loadAssignments = useCallback(async () => {
    try {
      const { data } = await api.get('/reviews/my-assignments');
      setAssignments(data);
    } catch (error) {
      showToast({
        title: 'Could not load assignments',
        description: error.response?.data?.message,
        type: 'error'
      });
    }
  }, [showToast]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const viewPaper = useCallback(
    async (paper) => {
      try {
        await openPaperPdf(paper.id, paper.title);
      } catch (error) {
        showToast({
          title: 'Could not open paper',
          description: error.response?.data?.message ?? 'Please try again later.',
          type: 'error'
        });
      }
    },
    [showToast]
  );

  const submitReview = async () => {
    try {
      await api.post(`/reviews/submit/${reviewModal.paper.id}`, {
        comments: reviewModal.comments,
        decision: reviewModal.decision
      });
      showToast({ title: 'Review submitted', type: 'success' });
      setReviewModal({ open: false, paper: null, comments: '', decision: 'APPROVE' });
      await loadAssignments();
    } catch (error) {
      showToast({
        title: 'Submission failed',
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
      {
        Header: 'Actions',
        accessor: (row) => (
          <button
            type="button"
            className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            onClick={() => setReviewModal({ open: true, paper: row, comments: '', decision: 'APPROVE' })}
          >
            Submit review
          </button>
        )
      },
      {
        Header: 'Manuscript',
        accessor: (row) => (
          <button
            type="button"
            className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            onClick={() => viewPaper(row)}
          >
            View PDF
          </button>
        )
      }
    ],
    [viewPaper]
  );

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Reviewer queue</h1>
        <p className="text-sm text-slate-500">Review assigned submissions and provide structured feedback.</p>
      </header>
      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
        <Sidebar sections={sections} active={activeSection} onSelect={setActiveSection} />
        <div className="flex-1 space-y-8">
          {activeSection === 'queue' ? (
            <DataTable columns={columns} data={assignments} emptyLabel="No assignments available." />
          ) : null}
          {activeSection === 'guidelines' ? (
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">Best practices</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Confirm that the manuscript fits within the journal scope.</li>
                <li>Call out strengths before diving into opportunities for improvement.</li>
                <li>Provide actionable revision steps that the author can tackle.</li>
                <li>Flag any ethical or plagiarism concerns immediately to the editor.</li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
      <Modal
        isOpen={reviewModal.open}
        onClose={() => setReviewModal({ open: false, paper: null, comments: '', decision: 'APPROVE' })}
        title={reviewModal.paper ? `Review for ${reviewModal.paper.title}` : 'Submit Review'}
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              onClick={() => setReviewModal({ open: false, paper: null, comments: '', decision: 'APPROVE' })}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
              onClick={submitReview}
              disabled={!reviewModal.comments}
            >
              Submit
            </button>
          </div>
        }
      >
        {reviewModal.paper ? (
          <button
            type="button"
            className="mb-4 inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            onClick={() => viewPaper(reviewModal.paper)}
          >
            View manuscript PDF
          </button>
        ) : null}
        <label className="block text-sm font-semibold text-slate-600">Decision</label>
        <select
          value={reviewModal.decision}
          onChange={(event) =>
            setReviewModal((prev) => ({
              ...prev,
              decision: event.target.value
            }))
          }
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="APPROVE">Approve</option>
          <option value="REJECT">Reject</option>
        </select>
        <label className="mt-4 block text-sm font-semibold text-slate-600">Comments</label>
        <textarea
          rows="6"
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
          value={reviewModal.comments}
          onChange={(event) =>
            setReviewModal((prev) => ({
              ...prev,
              comments: event.target.value
            }))
          }
          placeholder="Share your detailed feedback and recommendations"
        />
      </Modal>
    </section>
  );
};

export default ReviewerDashboard;
