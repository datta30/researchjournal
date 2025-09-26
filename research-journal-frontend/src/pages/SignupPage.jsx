import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const roles = [
  { value: 'AUTHOR', label: 'Author' },
  { value: 'EDITOR', label: 'Editor' },
  { value: 'REVIEWER', label: 'Reviewer' }
];

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'AUTHOR' });
  const { register, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await register(form);
    if (result.success) {
      showToast({ title: 'Registration successful', description: 'You can now log in.', type: 'success' });
      navigate('/login');
    } else {
      showToast({ title: 'Registration failed', description: result.message, type: 'error' });
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-md flex-col rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Create your account</h2>
      <p className="mt-2 text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-primary">
          Sign in
        </Link>
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-600">Full name</label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
        </div>
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
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-600">Role</label>
          <select
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
    </section>
  );
};

export default SignupPage;
