import { formatCurrency } from '../utils/format';

const DashboardStats = ({ bookings = [], userRole }) => {
  const activeBookings = bookings.filter((booking) => booking.status === 'confirmed').length;
  const totalSpent = bookings.reduce((sum, booking) => sum + (booking.paymentStatus === 'paid' ? booking.totalPrice : 0), 0);

  return (
    <div className="stagger-up grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article className="card relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-24px] h-20 w-20 rounded-full bg-brand-100" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">Active Bookings</p>
        <p className="mt-2 text-3xl font-bold text-brand-700 sm:text-4xl">{activeBookings}</p>
      </article>
      <article className="card relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-24px] h-20 w-20 rounded-full bg-slate-100" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">Total Bookings</p>
        <p className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{bookings.length}</p>
      </article>
      <article className="card relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-24px] h-20 w-20 rounded-full bg-accent-100" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
          {userRole === 'customer' ? 'Total Spent' : 'Paid Volume'}
        </p>
        <p className="mt-2 text-3xl font-bold text-emerald-700 sm:text-4xl">{formatCurrency(totalSpent)}</p>
      </article>
    </div>
  );
};

export default DashboardStats;
