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
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="text-lg font-bold text-brand-700">
          HotelMS
        </Link>

        {isAuthenticated ? (
          <nav className="flex items-center gap-3">
            <NavLink to="/dashboard" className="text-sm font-medium text-slate-700 hover:text-brand-700">
              Dashboard
            </NavLink>
            <NavLink to="/rooms" className="text-sm font-medium text-slate-700 hover:text-brand-700">
              Rooms
            </NavLink>
            {(user?.role === 'admin' || user?.role === 'staff') && (
              <NavLink to="/admin" className="text-sm font-medium text-slate-700 hover:text-brand-700">
                Admin
              </NavLink>
            )}
            <span className="hidden rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 sm:inline-block">
              {user?.name} ({user?.role})
            </span>
            <button type="button" onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-2">
            <NavLink to="/login" className="btn-secondary">
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
