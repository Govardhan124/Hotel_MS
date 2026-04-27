import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/40 bg-white/60 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 lg:px-8">
        <Link to="/dashboard" className="display-font text-xl font-semibold tracking-wide text-ink-900 sm:text-3xl">
          Hotel MS
        </Link>

        {isAuthenticated ? (
          <nav className="flex w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/70 p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:w-auto sm:justify-start sm:rounded-full sm:p-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-pill ${isActive ? 'nav-pill-active' : 'nav-pill-idle'}`}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/rooms"
              className={({ isActive }) => `nav-pill ${isActive ? 'nav-pill-active' : 'nav-pill-idle'}`}
            >
              Rooms
            </NavLink>
            {(user?.role === 'admin' || user?.role === 'staff') && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `nav-pill ${isActive ? 'nav-pill-active' : 'nav-pill-idle'}`}
              >
                Admin
              </NavLink>
            )}
            <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 lg:inline-block">
              {user?.name} ({user?.role})
            </span>
            <button type="button" onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </nav>
        ) : (
          <nav className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/70 p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:w-auto sm:rounded-full sm:p-1">
            <NavLink to="/login" className={({ isActive }) => `nav-pill ${isActive ? 'nav-pill-active' : 'nav-pill-idle'}`}>
              Login
            </NavLink>
            <NavLink to="/register" className="btn-primary">
              Register
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
