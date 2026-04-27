import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="mx-auto max-w-lg">
      <div className="card space-y-4 p-6 text-center sm:p-8">
        <p className="surface-subtitle">Routing Error</p>
        <h1 className="display-font text-5xl font-semibold text-ink-900 sm:text-6xl">404</h1>
        <p className="text-sm text-slate-600">The page you requested is not available or has been moved.</p>
        <Link to="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
