import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(form);
    if (result.success) {
      showToast({ title: 'Welcome back!', type: 'success' });
      const redirectPath = location.state?.from?.pathname || '/';
      navigate(redirectPath, { replace: true });
    } else {
      showToast({ title: 'Login failed', description: result.message, type: 'error' });
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-md flex-col rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Login to your account</h2>
      <p className="mt-2 text-sm text-slate-500">
        New to the platform?{' '}
        <Link to="/signup" className="text-primary">
          Create an account
        </Link>
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-600">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-600">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
