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
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name || 'User'}</h1>
        <p className="text-sm text-slate-600">Track your bookings and account activity.</p>
      </header>

      <DashboardStats bookings={bookings} userRole={user?.role} />

      <section className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Booking History</h2>
        </div>

        {loading ? (
          <p className="text-sm text-slate-600">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-slate-600">No bookings found yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-2">Room</th>
                  <th className="py-2">Dates</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Payment</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-slate-100">
                    <td className="py-3">{booking.room?.roomNumber || '-'}</td>
                    <td className="py-3">
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </td>
                    <td className="py-3 capitalize">{booking.status}</td>
                    <td className="py-3 capitalize">{booking.paymentStatus}</td>
                    <td className="py-3">{formatCurrency(booking.totalPrice)}</td>
                    <td className="py-3">
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
