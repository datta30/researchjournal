const statusStyles = {
  SUBMITTED: 'bg-slate-100 text-slate-700',
  UNDER_REVIEW: 'bg-amber-100 text-amber-700',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-rose-100 text-rose-700'
};

const PaperCard = ({ paper, onView, onDownload }) => (
  <article className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{paper.title}</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[paper.status] ?? 'bg-slate-200'}`}>
          {paper.status?.replace('_', ' ')}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">{paper.abstractText}</p>
    </div>
    <div className="flex gap-3 text-sm">
      <button
        type="button"
        onClick={() => onView?.(paper)}
        className="rounded-md border border-slate-200 px-3 py-2 font-semibold text-slate-600 transition hover:bg-slate-100"
      >
        View Details
      </button>
      <button
        type="button"
        onClick={() => onDownload?.(paper)}
        className="rounded-md bg-primary px-3 py-2 font-semibold text-white transition hover:bg-primary/90"
      >
        Download PDF
      </button>
    </div>
  </article>
);

export default PaperCard;
