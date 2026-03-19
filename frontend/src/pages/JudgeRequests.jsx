import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { ShieldCheck, XCircle, CheckCircle, Users, Trophy, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const JudgeRequests = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await API.get('hackathons');
        const hackathonsWithRequests = await Promise.all(
          res.data.data.map(async (h) => {
            const reqs = await API.get(`hackathons/${h._id}/judge-requests`);
            return { ...h, judgeRequests: reqs.data.data };
          })
        );
        setHackathons(hackathonsWithRequests);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  const handleStatusChange = async (hackathonId, requestId, status) => {
    try {
      await API.put(`hackathons/${hackathonId}/judge-requests/${requestId}`, { status });
      // Refresh data instead of page reload for better UX
      setHackathons(prev => prev.map(h => {
        if (h._id === hackathonId) {
          return {
            ...h,
            judgeRequests: h.judgeRequests.map(r => r._id === requestId ? { ...r, status } : r)
          };
        }
        return h;
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #1A1A1A', borderTopColor: '#A3FF12', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', position: 'relative' }}>
      <div className="mesh-glow" />
      <Navbar />
      <main className="responsive-main" style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 40px' }}>
        <header style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
             <div style={{ width: '40px', height: '40px', backgroundColor: '#A3FF12', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <ShieldCheck style={{ width: '20px', height: '20px', color: 'black' }} />
             </div>
             <h1 className="responsive-heading" style={{ fontSize: '32px', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>Judge Authorizations</h1>
          </div>
          <p style={{ color: '#666', fontWeight: 500, fontSize: '16px' }}>Review and authenticate specialized access requests for domain track evaluation.</p>
        </header>

        {hackathons.map((h) => {
          const pendingRequests = h.judgeRequests.filter(r => r.status === 'pending');
          if (pendingRequests.length === 0) return null;

          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={h._id} 
              className="athiva-card" 
              style={{ marginBottom: '40px', padding: '0', overflow: 'hidden' }}
            >
              <div style={{ padding: '24px 32px', borderBottom: '1px solid #1F1F1F', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <Trophy size={18} color="#A3FF12" />
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'white' }}>{h.title}</h2>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1F1F1F', color: '#444', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      <th style={{ padding: '20px 32px' }}>Applicant</th>
                      <th style={{ padding: '20px 32px' }}>Registry Email</th>
                      <th style={{ padding: '20px 32px', textAlign: 'right' }}>Authorization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((r) => (
                      <tr key={r._id} style={{ borderBottom: '1px solid #141414', transition: 'background 0.2s' }} className="hover:bg-white/[0.02]">
                        <td style={{ padding: '24px 32px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', backgroundColor: '#000', border: '1px solid #222', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, color: '#666' }}>
                              {r.user.name.charAt(0)}
                            </div>
                            <span style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>{r.user.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '24px 32px', color: '#666', fontSize: '13px', fontWeight: 500 }}>{r.user.email}</td>
                        <td style={{ padding: '24px 32px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleStatusChange(h._id, r._id, 'rejected')}
                              className="athiva-button-secondary"
                              style={{ padding: '8px 16px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444' }}
                            >
                              <XCircle size={14} /> Deny
                            </button>
                            <button
                              onClick={() => handleStatusChange(h._id, r._id, 'approved')}
                              className="athiva-button"
                              style={{ padding: '8px 16px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <CheckCircle size={14} /> Authorize Access
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          );
        })}

        {hackathons.filter(h => h.judgeRequests.some(r => r.status === 'pending')).length === 0 && (
          <div style={{ padding: '100px 40px', textAlign: 'center' }}>
             <Users size={48} color="#1F1F1F" style={{ margin: '0 auto 24px' }} />
             <p style={{ color: '#444', fontSize: '16px', fontWeight: 600 }}>No authorization requests pending identification.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default JudgeRequests;
