import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

const statusClassMap = {
  available: 'bg-emerald-100 text-emerald-700',
  booked: 'bg-rose-100 text-rose-700',
  cleaning: 'bg-amber-100 text-amber-700',
};

const RoomCard = ({ room }) => {
  const image = room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80';

  return (
    <div className="card flex flex-col overflow-hidden p-0">
      <img src={image} alt={room.type} className="h-44 w-full object-cover" />
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Room {room.roomNumber}</h3>
          <span className={`badge ${statusClassMap[room.status] || 'bg-slate-100 text-slate-700'}`}>
            {room.status}
          </span>
        </div>
        <p className="text-sm capitalize text-slate-600">{room.type} room</p>
        <p className="text-xl font-bold text-brand-700">{formatCurrency(room.price)} / night</p>
        <Link to={`/book/${room._id}`} className="btn-primary w-full text-center">
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
