import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

const statusClassMap = {
  available: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  booked: 'border border-rose-200 bg-rose-50 text-rose-700',
  cleaning: 'border border-amber-200 bg-amber-50 text-amber-700',
};

const RoomCard = ({ room }) => {
  const image = room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80';

  return (
    <div className="card group flex flex-col overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.14)]">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={room.type}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-transparent to-transparent" />
        <p className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
          Signature Stay
        </p>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <h3 className="display-font text-2xl font-semibold text-ink-900">Room {room.roomNumber}</h3>
          <span className={`badge ${statusClassMap[room.status] || 'bg-slate-100 text-slate-700'}`}>
            {room.status}
          </span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{room.type} room</p>
        <p className="text-xl font-bold text-brand-700">{formatCurrency(room.price)} / night</p>
        <Link to={`/book/${room._id}`} className="btn-primary w-full text-center">
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
