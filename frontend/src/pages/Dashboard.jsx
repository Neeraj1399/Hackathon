import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { Plus, Calendar, Clock, ArrowUpRight, Trophy, Zap, Edit, Trash2, Users, ClipboardCheck, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';
import Announcements from '../components/Announcements';

const Dashboard = () => {
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hackRes, subRes] = await Promise.all([
          API.get('hackathons'),
          user?.role === 'participant' ? API.get('submissions/my') : Promise.resolve({ data: { data: [] } })
        ]);
        setHackathons(hackRes.data.data);
        setMySubmissions(subRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const isJudgedByMe = (hackathon) => {
    const userId = user?.id || user?._id;
    return hackathon.judges?.some(j => (j._id || j).toString() === userId?.toString());
  };

  const getSubmissionStatus = (hackathonId) => {
    const userId = user?.id || user?._id;
    return mySubmissions.find(s => (s.hackathonId?._id || s.hackathonId)?.toString() === hackathonId?.toString());
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', position: 'relative' }}>
      <div className="mesh-glow" />
      <Navbar />
      
      <main className="responsive-main" style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 40px' }}>
        {/* Header Section */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '40px', marginBottom: '80px' }}>
          <div className="flex-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(163,255,18,0.1)', border: '1px solid rgba(163,255,18,0.2)', borderRadius: '999px', fontSize: '12px', fontWeight: 800, color: '#A3FF12', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>
                <Zap size={14} /> {user?.role} Workspace
              </div>
            </motion.div>
            <h1 className="responsive-heading" style={{ fontSize: '56px', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: '16px', color: 'white', lineHeight: 1 }}>
              Welcome back, <span className="neon-text">{user?.name}.</span>
            </h1>
            <p style={{ fontSize: '18px', color: '#666', maxWidth: '580px', lineHeight: 1.6, fontWeight: 500 }}>
              {user?.role === 'admin' ? 'Manage your ecosystem events and track participant performance.' : 
               user?.role === 'judge' ? 'Review groundbreaking projects and score innovation.' :
               'Submit your vision and compete for the top spot on the leaderboard.'}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {user?.role === 'admin' && (
              <>
                <Link to="/admin/create-hackathon" className="athiva-button" style={{ padding: '16px 32px' }}>
                  Host Hackathon <Plus size={18} />
                </Link>
                <div className="flex gap-2">
                  <Link to="/admin/users" className="bg-gray-900 text-gray-400 p-3 rounded-xl border border-gray-800 hover:text-white transition group" title="User Management">
                    <Users size={20} className="group-hover:scale-110 transition" />
                  </Link>
                  {/* Judge Requests Icon removed from here - moved to cards */}
                </div>
              </>
            )}
            {user?.role === 'judge' && (
              <Link to="/judge/join" className="athiva-button" style={{ padding: '16px 24px' }}>
                Find Hackathons <ArrowUpRight size={18} />
              </Link>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Announcements user={user} />

            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', paddingBottom: '24px', borderBottom: '1px solid #1A1A1A' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                  {user?.role === 'judge' ? 'Assigned Tracks' : 'Active tracks'}
                </h2>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#666' }}>{hackathons.length} Total</div>
              </div>

              {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
                  {[1, 2].map(i => (
                    <div key={i} style={{ height: '360px', backgroundColor: '#0F0F0F', border: '1px solid #1A1A1A', borderRadius: '32px' }} className="animate-pulse" />
                  ))}
                </div>
              ) : hackathons.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 40px', backgroundColor: '#0F0F0F', border: '2px dashed #1A1A1A', borderRadius: '32px' }}>
                  <Trophy style={{ width: '40px', height: '40px', color: '#1A1A1A', margin: '0 auto 16px' }} />
                  <p style={{ color: '#666' }}>No tracks currently available.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {hackathons.map((hackathon, idx) => {
                    const submission = getSubmissionStatus(hackathon._id);
                    const pendingRequests = hackathon.judgeRequests?.filter(r => r.status === 'pending') || [];
                    
                    return (
                      <motion.div
                        key={hackathon._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="athiva-card"
                        style={{ padding: '40px', display: 'flex', flexDirection: 'column', border: '1px solid #1F1F1F' }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ width: '48px', height: '48px', backgroundColor: '#000', border: '1px solid #333', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900, color: '#A3FF12' }}>
                              {hackathon.title.charAt(0)}
                            </div>
                            <div className="flex gap-3 items-center">
                               {user?.role === 'admin' && pendingRequests.length > 0 && (
                                 <Link 
                                   to="/admin/judge-requests" 
                                   className="bg-gray-900 text-gray-400 p-2.5 rounded-xl border border-gray-800 hover:text-white transition group relative"
                                   title={`Judge Requests (${pendingRequests.length})`}
                                 >
                                   <Users size={18} className="group-hover:scale-110 transition" />
                                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-black text-[9px] font-black rounded-full flex items-center justify-center">
                                     {pendingRequests.length}
                                   </span>
                                 </Link>
                               )}
                               <div style={{ padding: '6px 14px', backgroundColor: '#1A1A1A', color: 'white', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '999px', border: '1px solid #333' }}>
                                 Open
                               </div>
                             </div>
                           </div>
                           
                           <h3 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '24px', color: 'white', letterSpacing: '-0.03em' }}>{hackathon.title}</h3>

                           <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#000', border: '1px solid #1A1A1A', borderRadius: '20px' }}>
                             <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#444', letterSpacing: '0.1em', marginBottom: '12px' }}>Ends in:</div>
                             <CountdownTimer deadline={hackathon.submissionDeadline} />
                           </div>

                          <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px', fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {hackathon.description}
                          </p>
                        </div>
                        
                        <div>
                          <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', color: '#B3B3B3' }}>
                            <div>
                              <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', color: '#444' }}>Begins</div>
                              <div style={{ fontSize: '14px', fontWeight: 700 }}>{new Date(hackathon.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                            </div>
                            <div style={{ width: '1px', backgroundColor: '#1F1F1F' }} />
                            <div>
                              <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', color: '#444' }}>Deadline</div>
                              <div style={{ fontSize: '14px', fontWeight: 700 }}>{new Date(hackathon.submissionDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                            </div>
                            <div style={{ width: '1px', backgroundColor: '#1F1F1F' }} />
                            <Link to={`/leaderboard/${hackathon._id}`} title="View Leaderboard" className="flex flex-col items-center justify-center text-gray-600 hover:text-yellow-500 transition">
                              <Trophy size={18} />
                              <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px' }}>Rank</span>
                            </Link>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 items-center">
                            {user?.role === 'participant' && (
                              <Link 
                                to={submission ? `/submit-project/${hackathon._id}` : `/submit-project/${hackathon._id}`} // Simplified for now as edit logic might be same page
                                className="athiva-button"
                                style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
                              >
                                {submission ? 'Update Submission' : 'Explore Track'} <ArrowUpRight size={18} />
                              </Link>
                            )}

                            {user?.role === 'judge' && (
                              isJudgedByMe(hackathon) ? (
                                <Link 
                                  to={`/judge/evaluations/${hackathon._id}`}
                                  className="athiva-button"
                                  style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
                                >
                                  Review Projects <ClipboardCheck size={18} />
                                </Link>
                              ) : (
                                <button 
                                  onClick={async () => {
                                    try {
                                      await API.post(`hackathons/${hackathon._id}/judge-request`);
                                      alert('Request sent successfully!');
                                      window.location.reload();
                                    } catch (err) {
                                      alert(err.response?.data?.message || 'Error sending request');
                                    }
                                  }}
                                  className="athiva-button"
                                  style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
                                  disabled={hackathon.judgeRequests?.some(r => {
                                    const userId = user?.id || user?._id;
                                    return (r.user?._id || r.user)?.toString() === userId?.toString() && r.status === 'pending';
                                  })}
                                >
                                  {hackathon.judgeRequests?.some(r => {
                                    const userId = user?.id || user?._id;
                                    return (r.user?._id || r.user)?.toString() === userId?.toString() && r.status === 'pending';
                                  }) ? 'Request Pending' : 'Request to Judge'} <Plus size={18} />
                                </button>
                              )
                            )}

                            {user?.role === 'admin' && (
                              <div className="flex gap-2 w-full">
                                <Link to={`/admin/edit-hackathon/${hackathon._id}`} className="athiva-button" style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
                                  Edit Track <Edit size={18} />
                                </Link>
                                <button 
                                  onClick={async () => {
                                    if (window.confirm('Delete permenantly?')) {
                                      await API.delete(`hackathons/${hackathon._id}`);
                                      window.location.reload();
                                    }
                                  }}
                                  style={{ width: '48px', height: '48px', backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Layout size={18} className="text-indigo-400" /> Platform Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Active Hackathons</span>
                  <span className="text-white font-bold">{hackathons.length}</span>
                </div>
                {user?.role === 'participant' && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">My Submissions</span>
                    <span className="text-white font-bold">{mySubmissions.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
