import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="mx-auto max-w-md">
      <div className="card space-y-3 text-center">
        <h1 className="text-3xl font-bold text-slate-900">404</h1>
        <p className="text-sm text-slate-600">Page not found.</p>
        <Link to="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
