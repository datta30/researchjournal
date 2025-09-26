import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navLinks = [
  { to: '/', label: 'Home', public: true },
  { to: '/published', label: 'Published Papers', public: true },
  { to: '/dashboard/author', label: 'Author', role: 'AUTHOR' },
  { to: '/dashboard/editor', label: 'Editor', role: 'EDITOR' },
  { to: '/dashboard/reviewer', label: 'Reviewer', role: 'REVIEWER' },
  { to: '/dashboard/admin', label: 'Admin', role: 'ADMIN' }
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-semibold text-primary">
          Research Journal
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          {navLinks
            .filter((link) => link.public || (isAuthenticated && (!link.role || user?.role === link.role || user?.role === 'ADMIN')))
            .map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 transition-colors ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-slate-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
        </nav>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-500 sm:inline">{user?.name}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
