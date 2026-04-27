import { useMemo, useState } from 'react';
import { formatCurrency, nightsBetween } from '../utils/format';

const BookingForm = ({ room, onSubmit, loading }) => {
  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
  });

  const nights = useMemo(() => nightsBetween(form.checkIn, form.checkOut), [form.checkIn, form.checkOut]);
  const estimatedTotal = useMemo(() => nights * Number(room?.price || 0), [nights, room?.price]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, room: room._id });
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 sm:space-y-5">
      <div>
        <p className="surface-subtitle">Reservation</p>
        <h2 className="display-font text-2xl font-semibold text-ink-900 sm:text-3xl">Book Room {room.roomNumber}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Check In
          <input
            name="checkIn"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={form.checkIn}
            onChange={handleChange}
            className="input"
            required
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Check Out
          <input
            name="checkOut"
            type="date"
            min={form.checkIn || new Date().toISOString().split('T')[0]}
            value={form.checkOut}
            onChange={handleChange}
            className="input"
            required
          />
        </label>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white/70 p-3">
        <p className="text-sm font-medium text-slate-600">Stay length: {nights} night(s)</p>
        <p className="mt-1 text-lg font-bold text-brand-700">Estimated Total: {formatCurrency(estimatedTotal)}</p>
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading || nights <= 0}>
        {loading ? 'Processing...' : 'Confirm Booking'}
      </button>
    </form>
  );
};

export default BookingForm;
