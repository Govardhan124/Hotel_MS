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
        <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
        <p className="text-sm text-slate-600">Manage users, rooms, bookings and revenue.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <p className="text-sm text-slate-500">Users</p>
          <p className="text-3xl font-bold text-slate-900">{users.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Rooms</p>
          <p className="text-3xl font-bold text-slate-900">{rooms.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Bookings</p>
          <p className="text-3xl font-bold text-slate-900">{bookings.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="text-3xl font-bold text-emerald-700">{formatCurrency(revenue.revenue)}</p>
        </div>
      </div>

      <section className="card">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Create Room</h2>
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
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Room Inventory</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2">Room</th>
                <th className="py-2">Type</th>
                <th className="py-2">Price</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-b border-slate-100">
                  <td className="py-2">{room.roomNumber}</td>
                  <td className="py-2 capitalize">{room.type}</td>
                  <td className="py-2">{formatCurrency(room.price)}</td>
                  <td className="py-2 capitalize">{room.status}</td>
                  <td className="py-2">
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
          <h2 className="mb-4 text-lg font-semibold text-slate-900">User Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((managedUser) => (
                  <tr key={managedUser._id} className="border-b border-slate-100">
                    <td className="py-2">{managedUser.name}</td>
                    <td className="py-2">{managedUser.email}</td>
                    <td className="py-2">
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
                    <td className="py-2">
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
