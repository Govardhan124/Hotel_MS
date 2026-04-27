import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import { fetchAllBookings, fetchRevenue } from '../services/bookingService';
import { createRoom, deleteRoom, fetchRooms } from '../services/roomService';
import { deleteUser, fetchUsers, updateUserRole } from '../services/userService';
import { formatCurrency } from '../utils/format';

const AdminPanelPage = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [revenue, setRevenue] = useState({ revenue: 0, totalBookings: 0 });
  const [newRoom, setNewRoom] = useState({ roomNumber: '', type: 'single', price: '', status: 'available' });

  const canManageUsers = user?.role === 'admin';

  const loadData = async () => {
    try {
      const [usersRes, roomsRes, bookingsRes, revenueRes] = await Promise.all([
        canManageUsers ? fetchUsers(token) : Promise.resolve({ data: [] }),
        fetchRooms('page=1&limit=100'),
        fetchAllBookings(token),
        user?.role === 'admin' ? fetchRevenue(token) : Promise.resolve({ data: { revenue: 0, totalBookings: 0 } }),
      ]);

      setUsers(usersRes.data || []);
      setRooms(roomsRes.data || []);
      setBookings(bookingsRes.data || []);
      setRevenue(revenueRes.data || { revenue: 0, totalBookings: 0 });
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleUpdate = async (userId, role) => {
    try {
      await updateUserRole(userId, role, token);
      toast.success('Role updated');
      loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId, token);
      toast.success('User deleted');
      loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    try {
      await createRoom({ ...newRoom, price: Number(newRoom.price) }, token);
      toast.success('Room created');
      setNewRoom({ roomNumber: '', type: 'single', price: '', status: 'available' });
      loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await deleteRoom(roomId, token);
      toast.success('Room deleted');
      loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <p className="surface-subtitle">Operations Console</p>
        <h1 className="surface-title">Admin Panel</h1>
        <p className="text-sm text-slate-600">Manage users, inventory, booking flow, and revenue from one command center.</p>
      </header>

      <div className="stagger-up grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <p className="text-sm text-slate-500">Users</p>
          <p className="text-2xl font-bold text-slate-900 sm:text-3xl">{users.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Rooms</p>
          <p className="text-2xl font-bold text-slate-900 sm:text-3xl">{rooms.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Bookings</p>
          <p className="text-2xl font-bold text-slate-900 sm:text-3xl">{bookings.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="text-2xl font-bold text-emerald-700 sm:text-3xl">{formatCurrency(revenue.revenue)}</p>
        </div>
      </div>

      <section className="card">
        <h2 className="display-font mb-4 text-2xl font-semibold text-ink-900 sm:text-3xl">Create Room</h2>
        <form onSubmit={handleCreateRoom} className="grid gap-3 sm:grid-cols-4">
          <input
            className="input"
            placeholder="Room Number"
            value={newRoom.roomNumber}
            onChange={(event) => setNewRoom((prev) => ({ ...prev, roomNumber: event.target.value }))}
            required
          />
          <select className="input" value={newRoom.type} onChange={(event) => setNewRoom((prev) => ({ ...prev, type: event.target.value }))}>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
            <option value="deluxe">Deluxe</option>
          </select>
          <input
            className="input"
            placeholder="Price"
            type="number"
            min="0"
            value={newRoom.price}
            onChange={(event) => setNewRoom((prev) => ({ ...prev, price: event.target.value }))}
            required
          />
          <button type="submit" className="btn-primary">
            Create
          </button>
        </form>
      </section>

      <section className="card">
        <h2 className="display-font mb-4 text-2xl font-semibold text-ink-900 sm:text-3xl">Room Inventory</h2>
        <div className="table-shell overflow-x-auto rounded-xl border border-slate-200 bg-white/70 p-2">
          <table className="min-w-full">
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.roomNumber}</td>
                  <td className="capitalize">{room.type}</td>
                  <td>{formatCurrency(room.price)}</td>
                  <td className="capitalize">{room.status}</td>
                  <td>
                    <button type="button" className="btn-secondary" onClick={() => handleDeleteRoom(room._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {canManageUsers && (
        <section className="card">
          <h2 className="display-font mb-4 text-2xl font-semibold text-ink-900 sm:text-3xl">User Management</h2>
          <div className="table-shell overflow-x-auto rounded-xl border border-slate-200 bg-white/70 p-2">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((managedUser) => (
                  <tr key={managedUser._id}>
                    <td>{managedUser.name}</td>
                    <td>{managedUser.email}</td>
                    <td>
                      <select
                        className="input max-w-36"
                        value={managedUser.role}
                        onChange={(event) => handleRoleUpdate(managedUser._id, event.target.value)}
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button type="button" className="btn-secondary" onClick={() => handleDeleteUser(managedUser._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
};

export default AdminPanelPage;
