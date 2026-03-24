import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../api/axiosInstance';
import { 
  Users, 
  Trash2, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  Key, 
  X,
  Plus,
  Search,
  ChevronDown,
  Monitor,
  Briefcase,
  Layers,
  ChevronRight,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserEditModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    systemRole: user?.systemRole || 'participant'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        systemRole: user.systemRole || 'participant'
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.email === 'adminhackathon@gmail.com' && formData.systemRole !== 'admin') {
      toast.error('Security Error: Core Super Admin access level cannot be demoted.', { icon: '🛡️' });
      return;
    }
    setLoading(true);
    try {
      const res = await API.patch(`users/${user._id}`, formData);
      if (res.data.success) {
        onUpdate(res.data.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-brand-border">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Edit Profile</h2>
              <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mt-0.5">Edit User Details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">


          <div className="space-y-4.5 focus-within:text-brand-primary group">
            <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="w-full bg-brand-bg border border-brand-border rounded-xl py-3 px-4 text-xs font-bold text-brand-dark transition-all outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/5"
            />
          </div>

          <div className="space-y-4.5 focus-within:text-brand-primary group">
            <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="w-full bg-brand-bg border border-brand-border rounded-xl py-3 px-4 text-xs font-bold text-brand-dark transition-all outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/5"
            />
          </div>

          <div className="space-y-4.5 focus-within:text-brand-primary group">
            <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest">System Access Level</label>
            <select 
              value={formData.systemRole}
              onChange={(e) => setFormData({...formData, systemRole: e.target.value})}
              disabled={user?.email === 'adminhackathon@gmail.com'}
              className="w-full bg-brand-bg border border-brand-border rounded-xl py-3 px-4 text-xs font-bold text-brand-dark transition-all outline-none focus:border-brand-primary focus:bg-white ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="participant">Participant</option>
              <option value="judge">Judge</option>
              <option value="admin">Administrator</option>
            </select>
          </div>


          <div className="flex gap-4 pt-6 border-t border-brand-border mt-2">
            <button type="submit" disabled={loading} className="flex-1 btn-primary !py-3.5 font-black uppercase text-xs tracking-widest shadow-lg shadow-brand-primary/20">Commit Changes</button>
            <button type="button" onClick={onClose} className="flex-1 btn-secondary !py-3.5 font-black uppercase text-xs tracking-widest">Discard</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [resetRequests, setResetRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await API.get('users');
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchResetRequests = async () => {
    try {
      const res = await API.get('users/reset-requests');
      setResetRequests(res.data.data);
    } catch (err) {
      console.error('Failed to fetch reset requests');
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchResetRequests();
  }, []);

  const handleUpdate = (updatedUser) => {
    setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
  };

  const handleDeleteUser = async (userId) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-1 text-sm font-bold text-brand-dark">
        <p>Delete this user from the main directory?</p>
        <div className="flex justify-end gap-4 mt-2">
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-black text-brand-muted hover:bg-slate-100 rounded-md transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await API.delete(`users/${userId}`);
                toast.success('User deleted successfully.');
                fetchUsers();
              } catch (err) {
                toast.error(err.response?.data?.message || 'Deletion failed.');
              }
            }} 
            className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-black bg-brand-danger text-white hover:bg-red-700 rounded-md transition-all shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    ), { duration: Infinity, style: { minWidth: '300px' } });
  };

  const handleApproveReset = async (requestId) => {
    try {
      await API.post(`users/reset-requests/${requestId}/approve`);
      toast.success('Authentication override authorized.');
      fetchResetRequests();
    } catch (err) {
      toast.error('Authorization failed.');
    }
  };

  const handleRejectReset = async (requestId) => {
    try {
      await API.post(`users/reset-requests/${requestId}/reject`);
      toast.success('Authentication override rejected.');
      fetchResetRequests();
    } catch (err) {
      toast.error('Rejection failed.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleStyles = {
    admin: 'bg-red-50 text-red-600 border-red-100',
    judge: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    participant: 'bg-slate-50 text-slate-600 border-slate-100'
  };

  return (
    <div className="space-y-4 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 text-brand-primary font-black text-[10px] uppercase tracking-[0.2em] mb-3">
            <div className="w-6 h-1 bg-brand-primary rounded-full" /> Organizational Directory
          </div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Users Registry</h1>
          <p className="text-brand-muted mt-2 font-medium max-w-xl">
             Supervise corporate accounts, manage role-based access, and ensure secure ecosystem participation.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full bg-white border border-brand-border rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold shadow-sm focus:border-brand-primary outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
           {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-white border border-brand-border rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((u) => (
            <motion.div 
              key={u._id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-brand-primary/20 transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary font-black shadow-inner">
                    {u.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-brand-dark truncate flex items-center gap-4">
                       {u.name}
                       {u.email === 'adminhackathon@gmail.com' && <ShieldCheck size={14} className="text-brand-success shrink-0" />}
                    </p>
                    <p className="text-[10px] font-bold text-brand-muted truncate uppercase tracking-tighter">{u.email}</p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${roleStyles[u.systemRole]}`}>
                   {u.systemRole}
                </div>
              </div>


              <div className="flex gap-4">
                <button 
                  onClick={() => { setSelectedUser(u); setIsModalOpen(true); }}
                  className="flex-1 btn-secondary !py-2.5 !text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 group-hover:bg-brand-primary group-hover:text-white transition-colors border-0 ring-1 ring-brand-border group-hover:ring-brand-primary shadow-sm"
                >
                  Edit <ChevronRight size={14} />
                </button>
                <button 
                  onClick={() => handleDeleteUser(u._id)}
                  disabled={u.email === 'adminhackathon@gmail.com'}
                  className="p-2.5 text-brand-muted hover:text-brand-danger hover:bg-red-50 border border-brand-border rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Security Overrides Section */}
      <section className="mt-16 pt-10 border-t border-brand-border">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-red-50 text-brand-danger rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-brand-dark tracking-tight">Security Override Queue</h2>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Password Reset Approvals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requestsLoading ? (
             [...Array(3)].map((_, i) => <div key={i} className="h-40 bg-white border border-brand-border rounded-2xl animate-pulse" />)
          ) : resetRequests.filter(r => r.status === 'pending').length === 0 ? (
             <div className="col-span-full p-12 text-center bg-white border-2 border-dashed border-brand-border rounded-2xl">
                <p className="text-sm font-bold text-brand-muted uppercase tracking-widest italic tracking-widest">No pending authentication overrides in the queue.</p>
             </div>
          ) : (
            resetRequests.filter(r => r.status === 'pending').map((r) => (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} key={r._id} className="bg-white border-l-4 border-l-brand-danger border-y border-r border-brand-border rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-black text-brand-dark">{r.user?.name}</p>
                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-tighter mt-0.5">{r.user?.email}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-red-50 text-brand-danger text-[9px] font-black uppercase tracking-widest rounded border border-red-100">Action Required</span>
                </div>
                
                <div className="flex items-center gap-4 mb-6 text-[10px] font-black text-brand-muted uppercase">
                  <Clock size={12} className="text-brand-danger" />
                  Requested {new Date(r.createdAt).toLocaleString()}
                </div>

                <div className="flex gap-4 pt-4 border-t border-brand-border">
                  <button 
                    onClick={() => handleApproveReset(r._id)}
                    className="flex-1 btn-primary !bg-brand-danger hover:!bg-red-700 !py-2.5 !text-[10px] font-black uppercase tracking-widest"
                  >
                    Authorize
                  </button>
                  <button 
                    onClick={() => handleRejectReset(r._id)}
                    className="flex-1 btn-secondary !py-2.5 !text-[10px] font-black uppercase tracking-widest text-brand-muted"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <UserEditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={selectedUser} 
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default UserManagement;
