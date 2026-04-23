import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import RoomCard from '../components/RoomCard';
import { fetchRooms } from '../services/roomService';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    limit: 8,
  });

  const loadRooms = async (nextFilters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(nextFilters).forEach(([key, value]) => {
        if (value !== '') {
          params.append(key, value);
        }
      });

      const response = await fetchRooms(params.toString());
      setRooms(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadRooms(filters);
  };

  const goToPage = (page) => {
    const nextFilters = { ...filters, page };
    setFilters(nextFilters);
    loadRooms(nextFilters);
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Rooms</h1>
        <p className="text-sm text-slate-600">Search and filter available rooms.</p>
      </header>

      <form onSubmit={handleSearch} className="card grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <input
          className="input lg:col-span-2"
          placeholder="Search by room number"
          name="search"
          value={filters.search}
          onChange={handleChange}
        />
        <select className="input" name="type" value={filters.type} onChange={handleChange}>
          <option value="">All types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
          <option value="deluxe">Deluxe</option>
        </select>
        <select className="input" name="status" value={filters.status} onChange={handleChange}>
          <option value="">Any status</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="cleaning">Cleaning</option>
        </select>
        <input className="input" type="number" name="minPrice" placeholder="Min price" value={filters.minPrice} onChange={handleChange} />
        <input className="input" type="number" name="maxPrice" placeholder="Max price" value={filters.maxPrice} onChange={handleChange} />
        <button className="btn-primary lg:col-span-6" type="submit">
          Apply Filters
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-slate-600">Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <div className="card">No rooms found for selected filters.</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => goToPage(Math.max(1, pagination.page - 1))}
              disabled={pagination.page <= 1}
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => goToPage(Math.min(pagination.totalPages, pagination.page + 1))}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default RoomsPage;
