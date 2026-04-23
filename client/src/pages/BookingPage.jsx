import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookingForm from '../components/BookingForm';
import useAuth from '../hooks/useAuth';
import { checkAvailability, createBooking } from '../services/bookingService';
import api from '../services/api';
import { formatCurrency } from '../utils/format';

const BookingPage = () => {
  const { roomId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const loadRoom = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/rooms/${roomId}`);
        setRoom(response.data.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId]);

  const handleBooking = async (payload) => {
    try {
      setBookingLoading(true);
      const availability = await checkAvailability({
        roomId,
        checkIn: payload.checkIn,
        checkOut: payload.checkOut,
      });

      if (!availability.data.available) {
        toast.error('Room is not available for selected dates');
        return;
      }

      await createBooking(payload, token);
      toast.success('Booking created successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="card">Loading room details...</div>;
  }

  if (!room) {
    return <div className="card">Room not found.</div>;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <article className="card">
        <img
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
          alt={room.type}
          className="h-64 w-full rounded-lg object-cover"
        />
        <div className="mt-4 space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Room {room.roomNumber}</h1>
          <p className="text-sm capitalize text-slate-600">{room.type} room</p>
          <p className="text-xl font-bold text-brand-700">{formatCurrency(room.price)} / night</p>
        </div>
      </article>
      <BookingForm room={room} onSubmit={handleBooking} loading={bookingLoading} />
    </section>
  );
};

export default BookingPage;
