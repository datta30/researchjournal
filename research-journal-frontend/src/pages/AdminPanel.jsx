import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from '../components/DataTable.jsx';
import api from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [papers, setPapers] = useState([]);
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [userRes, paperRes] = await Promise.all([api.get('/users'), api.get('/papers/all')]);
      setUsers(userRes.data);
      setPapers(paperRes.data);
    } catch (error) {
      showToast({ title: 'Failed to load admin data', description: error.response?.data?.message, type: 'error' });
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const deleteUser = async (id) => {
    const confirmed = window.confirm('Remove this user?');
    if (!confirmed) return;
    try {
      await api.delete(`/users/${id}`);
      showToast({ title: 'User removed', type: 'success' });
      await loadData();
    } catch (error) {
      showToast({ title: 'Delete failed', description: error.response?.data?.message, type: 'error' });
    }
  };

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const byRole = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] ?? 0) + 1;
        return acc;
      },
      {
        AUTHOR: 0,
        EDITOR: 0,
        REVIEWER: 0,
        ADMIN: 0
      }
    );
    const published = papers.filter((paper) => paper.status === 'ACCEPTED').length;
    return {
      totalUsers,
      totalPapers: papers.length,
      published,
      ...byRole
    };
  }, [users, papers]);

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: (row) => row.name },
      { Header: 'Email', accessor: (row) => row.email },
      { Header: 'Role', accessor: (row) => row.role },
      {
        Header: 'Actions',
        accessor: (row) => (
          <button
            type="button"
            className="rounded-md border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
            onClick={() => deleteUser(row.id)}
          >
            Remove
          </button>
        )
      }
    ],
    []
  );

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Admin panel</h1>
        <p className="text-sm text-slate-500">Monitor platform health, manage user access, and audit publishing activity.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total users</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.totalUsers}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Authors</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.AUTHOR}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Reviewers</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.REVIEWER}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Published papers</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.published}</p>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">User directory</h2>
        <DataTable columns={columns} data={users} emptyLabel="No users found." />
      </div>
    </section>
  );
};

export default AdminPanel;
