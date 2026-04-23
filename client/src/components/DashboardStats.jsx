import { formatCurrency } from '../utils/format';

const DashboardStats = ({ bookings = [], userRole }) => {
  const activeBookings = bookings.filter((booking) => booking.status === 'confirmed').length;
  const totalSpent = bookings.reduce((sum, booking) => sum + (booking.paymentStatus === 'paid' ? booking.totalPrice : 0), 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article className="card">
        <p className="text-sm text-slate-500">Active Bookings</p>
        <p className="mt-2 text-3xl font-bold text-brand-700">{activeBookings}</p>
      </article>
      <article className="card">
        <p className="text-sm text-slate-500">Total Bookings</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{bookings.length}</p>
      </article>
      <article className="card">
        <p className="text-sm text-slate-500">{userRole === 'customer' ? 'Total Spent' : 'Paid Volume'}</p>
        <p className="mt-2 text-3xl font-bold text-emerald-700">{formatCurrency(totalSpent)}</p>
      </article>
    </div>
  );
};

export default DashboardStats;
