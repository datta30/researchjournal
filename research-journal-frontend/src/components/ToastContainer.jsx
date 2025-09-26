import { useToast } from '../context/ToastContext.jsx';

const typeClasses = {
  info: 'border-slate-200 bg-white text-slate-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800'
};

const ToastContainer = () => {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-lg transition ${typeClasses[toast.type] ?? typeClasses.info}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description ? <p className="mt-1 text-sm opacity-80">{toast.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded-full p-1 text-sm text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
