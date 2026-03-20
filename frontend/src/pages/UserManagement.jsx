import { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import { 
  Users, 
  Trash2, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  Key, 
  XCircle, 
  Clock,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Calendar,
  ShieldAlert,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import ConfirmationModal from '../components/ConfirmationModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [resetRequests, setResetRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [search, setSearch] = useState('');
  
  // Modal State
  const [modal, setModal] = useState({ 
    isOpen: false, 
    userId: null, 
    userEmail: '', 
    newRole: '' 
  });

  const fetchUsers = async () => {
    try {
      const res = await API.get('users');
      setUsers(res.data.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Cloud registry sync failed.' });
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

  const handleRoleChangeRequest = (userId, userEmail, newRole) => {
    if (userEmail === 'adminhackathon@gmail.com') {
      alert('Security override: System administrator privileges are immutable.');
      return;
    }
    setModal({ isOpen: true, userId, userEmail, newRole });
  };

  const confirmRoleChange = async () => {
    const { userId, userEmail, newRole } = modal;
    setModal({ ...modal, isOpen: false });

    try {
      await API.put(`users/${userId}/role`, { role: newRole });
      setMessage({ type: 'success', text: `Access permissions updated for ${userEmail}.` });
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Permission escalation denied.' });
      fetchUsers();
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Deprovision this user from the main directory?')) return;
    try {
      await API.delete(`users/${userId}`);
      setMessage({ type: 'success', text: 'User deprovisioned successfully.' });
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Deprovisioning failed.' });
    }
  };

  const handleApproveReset = async (requestId) => {
    try {
      await API.post(`users/reset-requests/${requestId}/approve`);
      setMessage({ type: 'success', text: 'Authentication override authorized.' });
      fetchResetRequests();
    } catch (err) {
      setMessage({ type: 'error', text: 'Authorization protocol failed.' });
    }
  };

  const handleRejectReset = async (requestId) => {
    try {
      await API.post(`users/reset-requests/${requestId}/reject`);
      setMessage({ type: 'success', text: 'Authentication override rejected.' });
      fetchResetRequests();
    } catch (err) {
      setMessage({ type: 'error', text: 'Rejection protocol failed.' });
    }
  };


  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-primary font-black text-[10px] uppercase tracking-[0.2em] mb-3">
            <div className="w-6 h-1 bg-brand-primary rounded-full" /> Management Registry
          </div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Identity Directory</h1>
          <p className="text-brand-muted mt-2 font-medium max-w-xl">
             Supervise corporate accounts, manage role-based access protocols, and ensure secure ecosystem participation.
          </p>
        </div>
        
      </header>

      {message.text && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl mb-10 flex items-center gap-3 text-sm font-bold border ${
            message.type === 'success' 
            ? 'bg-brand-success/5 border-brand-success/20 text-brand-success' 
            : 'bg-brand-danger/5 border-brand-danger/20 text-brand-danger'
          } shadow-sm`}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </motion.div>
      )}

      {/* Main Directory List */}
      <div className="bg-white border border-brand-border rounded-lg shadow-sm overflow-hidden">
        <div className="bg-brand-section px-6 py-4 border-b border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-brand-text-primary uppercase tracking-wider">Identity Registry</h2>
            <span className="px-2 py-0.5 bg-blue-50 text-brand-primary text-[10px] font-bold rounded border border-blue-100">
               {filteredUsers.length} Entries
            </span>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" size={14} />
            <input 
              type="text" 
              placeholder="Search by identity or email..." 
              className="w-full bg-white border border-brand-border rounded-md py-1.5 pl-9 pr-4 text-xs focus:border-brand-primary outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y divide-brand-border">
          {loading ? (
             <div className="p-12 text-center text-sm text-brand-text-secondary animate-pulse">Synchronizing organizational data...</div>
          ) : filteredUsers.length === 0 ? (
             <div className="p-12 text-center text-sm text-brand-text-secondary italic">No matches found in the active directory.</div>
          ) : (
            filteredUsers.map((u) => (
              <div key={u._id} className="list-row group !px-6 !py-4">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded bg-brand-section flex items-center justify-center text-brand-primary font-bold text-sm border border-brand-border">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="text-sm font-bold text-brand-text-primary">{u.name}</p>
                       {u.email === 'adminhackathon@gmail.com' && <ShieldCheck size={14} className="text-brand-success" />}
                    </div>
                    <p className="text-xs text-brand-text-secondary">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden lg:block text-right">
                    <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-tight">Access Authorization</p>
                    <select 
                      disabled={u.email === 'adminhackathon@gmail.com'}
                      value={u.role} 
                      onChange={(e) => handleRoleChangeRequest(u._id, u.email, e.target.value)}
                      className="bg-transparent text-xs font-semibold text-brand-primary border-0 p-0 focus:ring-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="participant">Participant</option>
                      <option value="judge">Judge</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  
                  <div className="hidden md:block w-32">
                     <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-tight">Registry Date</p>
                     <p className="text-xs font-medium text-brand-text-primary mt-0.5">
                        {new Date(u.createdAt).toLocaleDateString()}
                     </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button className="p-2 text-brand-text-secondary hover:text-brand-primary transition-colors hover:bg-brand-bg rounded-md">
                      <Search size={14} />
                    </button>
                    <button 
                      disabled={u.email === 'adminhackathon@gmail.com'}
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-2 text-brand-text-secondary hover:text-brand-danger transition-colors hover:bg-red-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Deactivate Account"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Security Overrides Section */}
      <section className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-50 text-brand-danger rounded-lg flex items-center justify-center border border-red-100">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-brand-text-primary">Security Override Queue</h2>
            <p className="text-xs text-brand-text-secondary">Action required for identity recovery protocols.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requestsLoading ? (
             <div className="col-span-full h-32 bg-white border border-brand-border rounded-lg animate-pulse" />
          ) : resetRequests.filter(r => r.status === 'pending').length === 0 ? (
             <div className="col-span-full p-8 text-center bg-white border border-brand-border rounded-lg border-dashed">
                <p className="text-sm text-brand-text-secondary">No pending authentication overrides in the queue.</p>
             </div>
          ) : (
            resetRequests.filter(r => r.status === 'pending').map((r) => (
              <div key={r._id} className="card-enterprise !p-5 border-l-4 border-l-brand-warning">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-bold text-brand-text-primary">{r.userId?.name}</p>
                    <p className="text-xs text-brand-text-secondary mt-0.5">{r.userId?.email}</p>
                  </div>
                  <span className="badge-enterprise badge-warning">Pending</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4 text-[11px] font-medium text-brand-text-secondary">
                  <Clock size={12} />
                  Requested {new Date(r.createdAt).toLocaleString()}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApproveReset(r._id)}
                    className="flex-1 btn-primary !bg-brand-warning hover:!bg-yellow-600"
                  >
                    Authorize
                  </button>
                  <button 
                    onClick={() => handleRejectReset(r._id)}
                    className="btn-secondary text-brand-danger hover:text-brand-danger"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <ConfirmationModal 
        isOpen={modal.isOpen}
        onClose={() => { setModal({ ...modal, isOpen: false }); fetchUsers(); }}
        onConfirm={confirmRoleChange}
        title="Escalate Privilege Logic"
        message={`Confirming identity translation for ${modal.userEmail}. Escalating access level to system-wide "${modal.newRole.toUpperCase()}" privileges.`}
      />
    </div>
  );
};

export default UserManagement;
