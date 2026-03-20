import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Trophy, 
  Users, 
  ClipboardCheck, 
  Layout, 
  X, 
  UserPlus,
  Search,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  Edit,
  Trash2,
  Star,
  FileCheck,
  Zap,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';

const InviteJudgeModal = ({ isOpen, onClose, hackathon, onInvite }) => {
  const [availableJudges, setAvailableJudges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchJudges = async () => {
        try {
          const res = await API.get('users/judges');
          const currentJudgeIds = hackathon.judges?.map(j => (j._id || j).toString()) || [];
          const filtered = res.data.data.filter(j => !currentJudgeIds.includes(j._id.toString()));
          setAvailableJudges(filtered);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchJudges();
    }
  }, [isOpen, hackathon]);

  const filteredJudges = availableJudges.filter(j => 
    j.name.toLowerCase().includes(search.toLowerCase()) || 
    j.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-dark/20 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-brand-border"
        >
          <div className="p-6 border-b border-brand-border flex items-center justify-between bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-brand-dark">Invite Judge</h2>
              <p className="text-xs font-medium text-brand-secondary mt-1 uppercase tracking-wider">{hackathon.title}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors text-brand-secondary">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary/40" size={16} />
              <input 
                type="text" 
                placeholder="Search judges by name or email..." 
                className="input-enterprise pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="max-h-[350px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center py-10 text-brand-secondary">
                  <div className="w-8 h-8 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-3" />
                  <p className="text-sm font-medium">Syncing judge directory...</p>
                </div>
              ) : filteredJudges.length === 0 ? (
                <div className="text-center py-10 px-4 bg-gray-50 rounded-xl border border-dashed border-brand-border">
                  <p className="text-sm text-brand-muted font-medium">No available judges found matching your search.</p>
                </div>
              ) : (
                filteredJudges.map(judge => (
                  <div key={judge._id} className="flex items-center justify-between p-4 bg-white border border-brand-border rounded-xl hover:border-brand-primary/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-primary font-bold text-sm">
                        {judge.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-brand-dark">{judge.name}</div>
                        <div className="text-[11px] font-medium text-brand-secondary">{judge.email}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onInvite(judge._id)}
                      className="btn-primary py-1.5 px-4 text-xs flex items-center gap-2"
                    >
                      <UserPlus size={14} /> Invite
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-brand-border flex justify-end">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [hackathons, setHackathons] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  const [stats, setStats] = useState({ totalParticipants: 0, totalSubmissions: 0, activeTracks: 0, pendingReviews: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hackRes, subRes, activityRes] = await Promise.all([
          API.get('hackathons'),
          user?.role === 'participant' ? API.get('submissions/my') : Promise.resolve({ data: { data: [] } }),
          user?.role === 'admin' ? API.get('submissions') : Promise.resolve({ data: { data: [] } })
        ]);

        let statsData = {};
        if (user?.role === 'admin') {
          const res = await API.get('hackathons/stats/overview');
          statsData = res.data.data;
        } else if (user?.role === 'judge') {
          const res = await API.get('hackathons/stats/judge');
          statsData = res.data.data;
        } else if (user?.role === 'participant') {
          // For participant, we derive stats from their subRes and fetch evaluation for latest
          const mySubs = subRes.data.data;
          const latestSub = mySubs[0];
          let score = 0;
          if (latestSub) {
            try {
              const evalRes = await API.get(`evaluations/my/${latestSub._id}`);
              const evals = evalRes.data.data;
              if (evals.length > 0) {
                score = evals.reduce((acc, curr) => acc + curr.totalScore, 0) / evals.length;
              }
            } catch (e) {
              console.log('No evaluation yet');
            }
          }
          
          const activeHackathons = hackRes.data.data.filter(h => h.isActive).length;
          
          statsData = {
            submissionCount: mySubs.length,
            activeHackathons,
            myScore: score.toFixed(1),
            hasSubmissions: mySubs.length > 0
          };
        }

        setHackathons(hackRes.data.data);
        setMySubmissions(subRes.data.data);
        setActivity(user?.role === 'admin' ? activityRes.data.data : subRes.data.data);
        setStats(statsData);
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
    return mySubmissions.find(s => (s.hackathonId?._id || s.hackathonId)?.toString() === hackathonId?.toString());
  };

  const handleDeleteHackathon = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"? This will remove all associated submissions and evaluations.`)) {
      try {
        await API.delete(`hackathons/${id}`);
        setHackathons(hackathons.filter(h => h._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Deletion failed.');
      }
    }
  };

  const getStatsConfig = () => {
    if (user?.role === 'admin') {
      return [
        { label: 'Total Participants', value: stats.totalParticipants || 0, icon: <Users size={20} />, color: 'text-blue-600' },
        { label: 'Total Submissions', value: stats.totalSubmissions || 0, icon: <ClipboardCheck size={20} />, color: 'text-green-600' },
        { label: 'Active Hackathons', value: stats.activeTracks || 0, icon: <Trophy size={20} />, color: 'text-brand-primary' },
        { label: 'Pending Reviews', value: stats.pendingReviews || 0, icon: <Layout size={20} />, color: 'text-warning' }
      ];
    } else if (user?.role === 'judge') {
      return [
        { label: 'Assigned Projects', value: stats.assignedSubmissions || 0, icon: <Layout size={20} />, color: 'text-indigo-600' },
        { label: 'Completed Reviews', value: stats.reviewedCount || 0, icon: <CheckCircle2 size={20} />, color: 'text-emerald-600' },
        { label: 'Pending Reviews', value: stats.pendingReviews || 0, icon: <Clock size={20} />, color: 'text-amber-600' }
      ];
    } else {
      // Participant View
      return [
        { label: 'My Submissions', value: stats.submissionCount || 0, icon: <FileCheck size={20} />, color: 'text-sky-600' },
        { label: 'Active Hackathons', value: stats.activeHackathons || 0, icon: <Zap size={20} />, color: 'text-brand-primary' },
        { label: 'My Latest Score', value: stats.myScore || '0.0', icon: <Award size={20} />, color: 'text-rose-600' }
      ];
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatsConfig().map((stat, i) => (
          <div key={i} className="bg-white border border-brand-border rounded-xl p-5 shadow-sm flex items-center gap-4 hover:border-brand-primary transition-colors">
            <div className={`w-12 h-12 rounded-xl bg-gray-50 ${stat.color} flex items-center justify-center shrink-0 border border-brand-border/50`}>
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.1em] mb-0.5">{stat.label}</span>
              <span className="text-2xl font-black text-brand-text-primary leading-tight">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {/* Main Section */}
        <div className="space-y-8">
          {/* Active Tracks */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-brand-text-primary">Live Hackathons</h2>
              {user?.role === 'admin' && (
                <Link to="/admin/create-hackathon" className="btn-primary flex items-center gap-2">
                  <Plus size={16} /> Host Hackathon
                </Link>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="h-40 bg-white border border-brand-border rounded-lg animate-pulse" />
              ) : hackathons.length === 0 ? (
                <div className="p-12 text-center bg-white border border-brand-border rounded-lg border-dashed">
                  <p className="text-sm text-brand-text-secondary">No live hackathons found in the registry.</p>
                </div>
              ) : (
                hackathons.map((hackathon) => (
                  <div key={hackathon._id} className="card-enterprise !p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-brand-primary rounded-md flex items-center justify-center font-bold">
                        {hackathon.title.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-brand-text-primary">{hackathon.title}</h3>
                        <p className="text-xs text-brand-text-secondary mt-0.5 line-clamp-1">{hackathon.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="hidden sm:block text-right">
                        <p className="text-[11px] font-bold text-brand-text-secondary uppercase">Deadline</p>
                        <p className="text-xs font-semibold text-brand-text-primary mt-0.5">
                          {new Date(hackathon.submissionDeadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {user?.role === 'participant' && (
                          <Link to={`/submit-project/${hackathon._id}`} className="btn-primary">
                            Participate
                          </Link>
                        )}
                        {(user?.role === 'judge' && isJudgedByMe(hackathon)) && (
                          <Link to={`/admin/submissions/${hackathon._id}`} className="btn-primary">
                            Review Submissions
                          </Link>
                        )}
                        {user?.role === 'admin' && (
                          <div className="flex items-center gap-1">
                            <Link to={`/admin/submissions/${hackathon._id}`} title="View Submissions" className="p-2 text-brand-text-secondary hover:text-brand-primary">
                              <ClipboardCheck size={18} />
                            </Link>
                            <Link to={`/admin/edit-hackathon/${hackathon._id}`} title="Edit" className="p-2 text-brand-text-secondary hover:text-brand-primary">
                              <Edit size={18} />
                            </Link>
                            <button 
                              onClick={() => handleDeleteHackathon(hackathon._id, hackathon.title)}
                              className="p-2 text-brand-text-secondary hover:text-brand-danger transition-colors"
                              title="Delete Hackathon"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedHackathon(hackathon);
                                setInviteModalOpen(true);
                              }}
                              className="p-2 text-brand-text-secondary hover:text-brand-primary"
                              title="Invite Judge"
                            >
                              <UserPlus size={18} />
                            </button>
                          </div>
                        )}
                        <Link to={`/leaderboard/${hackathon._id}`} className="p-2 text-brand-text-secondary hover:text-brand-primary" title="Leaderboard">
                          <Trophy size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recent Activity (Flex Rows) */}
          <section>
            <h2 className="text-base font-bold text-brand-text-primary mb-5">{user?.role === 'admin' ? 'Recent Global Activity' : 'Your Latest Submissions'}</h2>
            <div className="bg-white border border-brand-border rounded-lg overflow-hidden shadow-sm">
              {activity.length === 0 ? (
                <div className="p-12 text-center text-sm text-brand-text-secondary italic">
                  No recent activity logged in the registry.
                </div>
              ) : (
                activity.slice(0, 5).map((item) => (
                  <div key={item._id} className="list-row hover:bg-gray-50/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-brand-primary" />
                      <div>
                        <p className="text-sm font-semibold text-brand-text-primary">{item.projectTitle}</p>
                        <p className="text-xs text-brand-text-secondary">
                          {user?.role === 'admin' && `${item.userId?.name} for `} {item.hackathonId?.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-brand-text-secondary uppercase">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      {user?.role === 'admin' && (
                        <Link to={`/admin/submissions/${item.hackathonId?._id}`} className="text-brand-primary text-xs font-bold hover:underline">
                          Review
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

      </div>

      {selectedHackathon && (
        <InviteJudgeModal 
          isOpen={inviteModalOpen} 
          onClose={() => setInviteModalOpen(false)} 
          hackathon={selectedHackathon}
          onInvite={async (judgeId) => {
            try {
              await API.post(`hackathons/${selectedHackathon._id}/invite-judge`, { userId: judgeId });
              setInviteModalOpen(false);
              window.location.reload();
            } catch (err) {
              alert(err.response?.data?.message || 'Dispatch failed.');
            }
          }}
        />
      )}

    </div>
  );
};

export default Dashboard;
