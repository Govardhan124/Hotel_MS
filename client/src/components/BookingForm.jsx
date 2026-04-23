import { useMemo, useState } from 'react';
import { nightsBetween } from '../utils/format';

const BookingForm = ({ room, onSubmit, loading }) => {
  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
  });

  const nights = useMemo(() => nightsBetween(form.checkIn, form.checkOut), [form.checkIn, form.checkOut]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, room: room._id });
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Book Room {room.roomNumber}</h2>
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
      <p className="text-sm text-slate-600">Stay length: {nights} night(s)</p>
      <button type="submit" className="btn-primary w-full" disabled={loading || nights <= 0}>
        {loading ? 'Processing...' : 'Confirm Booking'}
      </button>
    </form>
  );
};

export default BookingForm;
