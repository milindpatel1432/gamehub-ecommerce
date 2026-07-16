import { useState, useMemo, useEffect } from 'react';
import { Users, Search, ShieldAlert, Trash2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { successToast, errorToast } from '../../utils/toast';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getUsers();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(u => ({
          id: u._id,
          fullName: u.fullName,
          username: u.username,
          email: u.email,
          phone: u.phone || 'N/A',
          role: u.role === 'admin' ? 'Admin' : 'Customer',
          status: u.isBlocked ? 'Blocked' : 'Active',
        }));
        setUsers(mapped);
      }
    } catch (err) {
      console.error(err);
      errorToast('Failed to load registered users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleToggleBlock = async (id) => {
    try {
      const res = await adminService.toggleBlockUser(id);
      if (res.success && res.data) {
        const nextStatus = res.data.isBlocked ? 'Blocked' : 'Active';
        successToast(`User is now ${nextStatus}!`);
        setUsers(users.map(u => u.id === id ? { ...u, status: nextStatus } : u));
      } else {
        errorToast(res.message || 'Failed to toggle user block status.');
      }
    } catch (err) {
      console.error(err);
      errorToast(err.response?.data?.message || 'Error occurred while changing user block status.');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user ${name}?`)) {
      try {
        const res = await adminService.deleteUser(id);
        if (res.success) {
          successToast(`User ${name} deleted successfully!`);
          setUsers(users.filter((u) => u.id !== id));
        } else {
          errorToast(res.message || 'Failed to delete user.');
        }
      } catch (err) {
        console.error(err);
        errorToast('Error occurred while deleting user.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[40vh] w-full items-center justify-center bg-gaming-card/45 rounded-2xl border border-gaming-border">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gaming-border bg-gaming-card/45 p-6 space-y-6 text-left">
      
      {/* Header title */}
      <div className="flex items-center gap-2 pb-2 border-b border-gaming-border/60 justify-between">
        <h3 className="font-gaming text-base font-bold text-white tracking-wider flex items-center gap-2">
          <Users className="h-4.5 w-4.5 text-gaming-cyan" />
          Registered Users
        </h3>
      </div>

      {/* Filter toolbar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Search className="h-4 w-4 text-slate-500" />
        </span>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-gaming-black/60 border border-gaming-border text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gaming-cyan"
        />
      </div>

      {/* Users table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left text-slate-300">
          <thead>
            <tr className="text-slate-500 font-bold uppercase tracking-wider border-b border-gaming-border/40">
              <th className="py-3 px-2">User Details</th>
              <th className="py-3 px-2">Username</th>
              <th className="py-3 px-2">Phone</th>
              <th className="py-3 px-2">Role</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gaming-border/30">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gaming-black/20 transition-colors">
                <td className="py-3 px-2">
                  <div className="font-bold text-white">{user.fullName}</div>
                  <div className="text-[10px] text-slate-500">{user.email}</div>
                </td>
                <td className="py-3 px-2 text-slate-400">@{user.username}</td>
                <td className="py-3 px-2 text-slate-400">{user.phone}</td>
                <td className="py-3 px-2">
                  <span className={`text-[9px] uppercase font-bold tracking-wider rounded px-2 py-0.5 border ${
                    user.role === 'Admin'
                      ? 'bg-gaming-cyan/10 text-gaming-cyan border-gaming-cyan/25'
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/25'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span className={`text-[9px] uppercase font-bold tracking-wider rounded px-2 py-0.5 border ${
                    user.status === 'Active'
                      ? 'bg-green-500/10 text-green-400 border-green-500/25'
                      : 'bg-red-500/10 text-red-500 border-red-500/25 animate-pulse'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-right space-x-2">
                  <button
                    onClick={() => handleToggleBlock(user.id)}
                    title={user.status === 'Active' ? 'Block User' : 'Unblock User'}
                    className={`p-2 rounded bg-gaming-black border border-gaming-border hover:border-orange-400 cursor-pointer inline-block ${
                      user.status === 'Blocked' ? 'text-orange-400 border-orange-400/40 bg-orange-400/5' : 'text-slate-400 hover:text-orange-400'
                    }`}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, user.fullName)}
                    title="Delete User"
                    className="p-2 rounded bg-gaming-black border border-gaming-border hover:border-red-500 text-slate-400 hover:text-red-500 cursor-pointer inline-block"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
