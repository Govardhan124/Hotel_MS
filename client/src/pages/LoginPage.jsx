import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || '/dashboard';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      toast.success('Login successful');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid w-full max-w-5xl gap-4 sm:gap-6 lg:grid-cols-[1.05fr_1fr]">
      <aside className="card hidden p-8 lg:block">
        <p className="surface-subtitle">Hotel MS</p>
        <h1 className="surface-title">A refined stay management experience for modern hospitality teams.</h1>
        <p className="mt-3 text-sm text-slate-600">
          Track reservations, optimize occupancy, and deliver premium guest service from one elegant dashboard.
        </p>
      </aside>
      <form onSubmit={handleSubmit} className="card space-y-5 p-5 sm:p-8">
        <div>
          <p className="surface-subtitle">Welcome Back</p>
          <h2 className="display-font text-3xl font-semibold text-ink-900 sm:text-4xl">Login</h2>
        </div>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} className="input" required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input"
            minLength={6}
            required
          />
        </label>
        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Login'}
        </button>
        <p className="text-sm text-slate-600">
          No account?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
};

export default LoginPage;
