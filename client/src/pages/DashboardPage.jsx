import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DashboardStats from '../components/DashboardStats';
import useAuth from '../hooks/useAuth';
import { cancelBooking, fetchMyBookings } from '../services/bookingService';
import { formatCurrency, formatDate } from '../utils/format';

const DashboardPage = () => {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await fetchMyBookings(token);
      setBookings(response.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId, token);
      toast.success('Booking cancelled');
      loadBookings();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="surface-subtitle">Overview</p>
        <h1 className="surface-title">Welcome, {user?.name || 'User'}</h1>
        <p className="text-sm text-slate-600">Track reservations, cancellations, and payment status in one place.</p>
      </header>

      <DashboardStats bookings={bookings} userRole={user?.role} />

      <section className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="display-font text-2xl font-semibold text-ink-900 sm:text-3xl">Booking History</h2>
        </div>

        {loading ? (
          <p className="text-sm text-slate-600">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-slate-600">No bookings found yet.</p>
        ) : (
          <div className="table-shell overflow-x-auto rounded-xl border border-slate-200 bg-white/70 p-2">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.room?.roomNumber || '-'}</td>
                    <td>
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </td>
                    <td className="capitalize">{booking.status}</td>
                    <td className="capitalize">{booking.paymentStatus}</td>
                    <td>{formatCurrency(booking.totalPrice)}</td>
                    <td>
                      {booking.status === 'confirmed' ? (
                        <button type="button" className="btn-secondary" onClick={() => handleCancel(booking._id)}>
                          Cancel
                        </button>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
};

export default DashboardPage;
