import { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { Users, Trash2, ShieldCheck, AlertCircle, CheckCircle, ArrowRight, Key, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import ConfirmationModal from '../components/ConfirmationModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [resetRequests, setResetRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
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
      setMessage({ type: 'error', text: 'Failed to access registry' });
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
      alert('Security Protocol: The root administrator cannot be modified.');
      return;
    }
    setModal({ isOpen: true, userId, userEmail, newRole });
  };

  const confirmRoleChange = async () => {
    const { userId, userEmail, newRole } = modal;
    setModal({ ...modal, isOpen: false });

    try {
      await API.put(`users/${userId}/role`, { role: newRole });
      setMessage({ type: 'success', text: `Access level escalated for ${userEmail}` });
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Authorization rejected' });
      fetchUsers();
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete user from organizational registry?')) return;
    try {
      await API.delete(`users/${userId}`);
      setMessage({ type: 'success', text: 'User purged from system' });
      fetchUsers();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Purge failed' });
    }
  };

  const handleApproveReset = async (requestId) => {
    try {
      const res = await API.post(`users/reset-requests/${requestId}/approve`);
      setMessage({ type: 'success', text: res.data.message });
      fetchResetRequests();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Approval failed' });
    }
  };

  const handleRejectReset = async (requestId) => {
    try {
      await API.post(`users/reset-requests/${requestId}/reject`);
      setMessage({ type: 'success', text: 'Recovery request denied' });
      fetchResetRequests();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Rejection failed' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000' }}>
      <div className="mesh-glow" />
      <Navbar />
      <main className="responsive-main" style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 40px' }}>
        <header style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
             <div style={{ width: '40px', height: '40px', backgroundColor: '#A3FF12', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Users style={{ width: '20px', height: '20px', color: 'black' }} />
             </div>
             <h1 className="responsive-heading" style={{ fontSize: '32px', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>Organizational Registry</h1>
          </div>
          <p style={{ color: '#666', fontWeight: 500, fontSize: '16px' }}>Manage access levels and monitor active users within the ecosystem.</p>
        </header>

        {message.text && (
          <div style={{ padding: '16px 20px', borderRadius: '16px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 600, transition: 'all 0.3s', ...(message.type === 'success' ? { backgroundColor: 'rgba(163,255,18,0.1)', border: '1px solid rgba(163,255,18,0.2)', color: '#A3FF12' } : { backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }) }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        <div className="athiva-card" style={{ border: '1px solid #1F1F1F', overflowX: 'auto' }}>
          {/* Header */}
          <div className="modern-grid-header" style={{ gridTemplateColumns: 'minmax(250px, 1.5fr) 180px 180px 100px', minWidth: '700px' }}>
            <div>Identity</div>
            <div>Privileges</div>
            <div>Registry Date</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {/* Body */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: '700px' }}>
            {loading ? (
              <div style={{ padding: '80px', textAlign: 'center', color: '#444', fontWeight: 600 }}>Syncing registry data...</div>
            ) : users.length === 0 ? (
              <div style={{ padding: '80px', textAlign: 'center', color: '#444', fontWeight: 600 }}>Registry is currently vacant.</div>
            ) : (
              users.map((u) => (
                <div key={u._id} className="modern-grid-row" style={{ gridTemplateColumns: 'minmax(250px, 1.5fr) 180px 180px 100px' }}>
                  {/* Identity */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '44px', height: '44px', backgroundColor: '#000', border: '1px solid #333', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#B3B3B3', fontSize: '14px' }}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>{u.name} {u.email === 'adminhackathon@gmail.com' && <ShieldCheck size={14} style={{ display: 'inline', marginLeft: '6px', color: '#A3FF12' }} />}</div>
                        <div style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>{u.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Privileges */}
                  <div>
                    <div style={{ position: 'relative', width: 'fit-content' }}>
                      <select 
                        disabled={u.email === 'adminhackathon@gmail.com'}
                        value={u.role} 
                        onChange={(e) => handleRoleChangeRequest(u._id, u.email, e.target.value)}
                        className="athiva-input"
                        style={{ padding: '8px 32px 8px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: u.email === 'adminhackathon@gmail.com' ? 'not-allowed' : 'pointer', backgroundColor: '#000', width: '100%', maxWidth: '140px' }}
                      >
                        <option value="participant">Participant</option>
                        <option value="judge">Judge</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: '14px', color: '#666', fontWeight: 600 }}>
                    <span className="mobile-only-label" style={{ display: 'none' }}>Registered: </span>
                    {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>

                  {/* Actions */}
                  <div style={{ textAlign: 'right' }}>
                    <button 
                      disabled={u.email === 'adminhackathon@gmail.com'}
                      onClick={() => handleDeleteUser(u._id)}
                      style={{ width: '40px', height: '40px', backgroundColor: u.email === 'adminhackathon@gmail.com' ? 'transparent' : 'rgba(239,68,68,0.05)', color: u.email === 'adminhackathon@gmail.com' ? '#141414' : '#EF4444', border: u.email === 'adminhackathon@gmail.com' ? 'none' : '1px solid rgba(239,68,68,0.1)', borderRadius: '12px', cursor: u.email === 'adminhackathon@gmail.com' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', float: 'right' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <section style={{ marginTop: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
             <div style={{ width: '36px', height: '36px', backgroundColor: 'rgba(163,255,18,0.1)', border: '1px solid rgba(163,255,18,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Key style={{ width: '18px', height: '18px', color: '#A3FF12' }} />
             </div>
             <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Pending Recovery Approvals</h2>
          </div>

          <div className="athiva-card" style={{ border: '1px solid #1F1F1F', overflow: 'hidden' }}>
            {/* Header */}
            <div className="modern-grid-header" style={{ gridTemplateColumns: '1.5fr 1fr 120px 240px' }}>
              <div>User Identity</div>
              <div>Timestamp</div>
              <div>Status</div>
              <div style={{ textAlign: 'right' }}>Authorization</div>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {requestsLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#444', fontSize: '13px' }}>Syncing recovery queue...</div>
              ) : resetRequests.filter(r => r.status === 'pending').length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#444', fontSize: '13px' }}>No pending recovery signals at this time.</div>
              ) : (
                resetRequests.filter(r => r.status === 'pending').map((r) => (
                  <div key={r._id} className="modern-grid-row" style={{ gridTemplateColumns: '1.5fr 1fr 120px 240px' }}>
                    {/* User Identity */}
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{r.user?.name}</div>
                      <div style={{ fontSize: '11px', color: '#666', fontWeight: 500 }}>{r.user?.email}</div>
                    </div>

                    {/* Timestamp */}
                    <div style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>
                      {new Date(r.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {/* Status */}
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 10px', backgroundColor: 'rgba(163,255,18,0.05)', color: '#A3FF12', borderRadius: '8px', border: '1px solid rgba(163,255,18,0.1)' }}>
                        {r.status}
                      </span>
                    </div>

                    {/* Authorization Actions */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleRejectReset(r._id)}
                          style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <XCircle size={14} /> Deny
                        </button>
                        <button 
                          onClick={() => handleApproveReset(r._id)}
                          style={{ padding: '8px 16px', backgroundColor: '#A3FF12', color: 'black', border: 'none', borderRadius: '10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <ShieldCheck size={14} /> Approve Access
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

      </main>

      <ConfirmationModal 
        isOpen={modal.isOpen}
        onClose={() => { setModal({ ...modal, isOpen: false }); fetchUsers(); }}
        onConfirm={confirmRoleChange}
        title="Escalate Privileges?"
        message={`Confirming access level transition for ${modal.userEmail} to ${modal.newRole.toUpperCase()}. This action will grant specialized organizational permissions.`}
      />
    </div>
  );
};

export default UserManagement;
