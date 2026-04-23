import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Registration successful');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="card space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
        <label className="block text-sm font-medium text-slate-700">
          Full Name
          <input type="text" name="name" value={form.name} onChange={handleChange} className="input" required />
        </label>
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
        <label className="block text-sm font-medium text-slate-700">
          Role
          <select name="role" value={form.role} onChange={handleChange} className="input">
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
          </select>
        </label>
        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default RegisterPage;
