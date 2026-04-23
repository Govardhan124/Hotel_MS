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
    <section className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="card space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Login</h1>
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
