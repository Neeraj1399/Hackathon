import React, { useEffect, useState, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
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
  Award,
  MessageSquare,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { CircularLoading } from '../components/Skeleton';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const EvaluationFeedbackModal = ({ isOpen, onClose, submission }) => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && submission) {
      const fetchEvals = async () => {
        try {
          const res = await API.get(`evaluations/my/${submission._id}`);
          setEvaluations(res.data.data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchEvals();
    }
  }, [isOpen, submission]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl border border-brand-border relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-brand-primary to-rose-500" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/10">
              <Award size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-brand-dark tracking-tight">Technical Evaluation</h2>
              <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mt-0.5">{submission.projectTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors"><X size={20} /></button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="py-20 text-center space-y-4">
               <div className="w-10 h-10 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin mx-auto" />
               <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Consulting Review Board...</p>
            </div>
          ) : evaluations.length === 0 ? (
            <div className="py-20 text-center bg-brand-bg/50 border-2 border-dashed border-brand-border rounded-3xl group">
               <div className="w-16 h-16 bg-white border border-brand-border rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-muted group-hover:scale-110 transition-transform">
                  <Clock size={32} />
               </div>
               <p className="text-sm font-bold text-brand-dark">Pending Evaluation</p>
               <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mt-1">The review board has not yet deployed scores for this entry.</p>
            </div>
          ) : (
            evaluations.map((ev, i) => (
              <div key={ev._id} className="bg-brand-bg/50 border border-brand-border rounded-3xl p-6 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white border border-brand-border flex items-center justify-center text-brand-primary font-black shadow-inner">
                          {ev.judgeId?.name?.charAt(0)}
                       </div>
                       <div>
                          <p className="text-xs font-black text-brand-dark">Judge Evaluation #{i+1}</p>
                          <p className="text-[9px] font-black text-brand-muted uppercase tracking-widest">Verified Reviewer</p>
                       </div>
                    </div>
                    <div className="px-4 py-2 bg-white border border-brand-border rounded-xl shadow-sm">
                       <p className="text-[9px] font-black text-brand-muted uppercase tracking-widest mb-0.5 text-center">Final Score</p>
                       <p className="text-lg font-black text-brand-primary text-center leading-none">{ev.totalScore.toFixed(1)}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-2xl border border-brand-border text-center shadow-sm">
                       <p className="text-[8px] font-black text-brand-muted uppercase tracking-tighter mb-1">Originality</p>
                       <p className="text-sm font-black text-brand-dark">{ev.innovation}/10</p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-brand-border text-center shadow-sm">
                       <p className="text-[8px] font-black text-brand-muted uppercase tracking-tighter mb-1">Impact</p>
                       <p className="text-sm font-black text-brand-dark">{ev.impact}/10</p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-brand-border text-center shadow-sm">
                       <p className="text-[8px] font-black text-brand-muted uppercase tracking-tighter mb-1">Technical</p>
                       <p className="text-sm font-black text-brand-dark">{ev.technical}/10</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-4">
                       <MessageSquare size={12} className="text-brand-primary" /> Reviewer Feedback
                    </p>
                    <p className="text-xs font-bold text-brand-dark leading-relaxed italic bg-white p-4 rounded-2xl border border-brand-border shadow-inner">
                       "{ev.feedback}"
                    </p>
                 </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-brand-border flex justify-center">
           <button onClick={onClose} className="btn-secondary !px-10 !py-3.5 !text-[10px] font-black uppercase tracking-widest">Dismiss Review</button>
        </div>
      </motion.div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-brand-border">
          <div className="p-6 border-b border-brand-border flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
            <div>
              <h2 className="text-xl font-bold text-brand-dark">Invite Judge</h2>
              <p className="text-xs font-medium text-brand-secondary mt-1 uppercase tracking-wider">{hackathon.title}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors text-brand-secondary">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary/40" size={16} />
              <input 
                type="text" 
                placeholder="Search judges by name or email..." 
                className="w-full bg-slate-50 border border-brand-border rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:bg-white focus:border-brand-primary outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="max-h-[350px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
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
                    <div className="flex items-center gap-4">
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
                      className="btn-primary py-1.5 px-4 text-xs flex items-center gap-4"
                    >
                      <UserPlus size={14} /> Invite
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-brand-border flex justify-end rounded-b-2xl">
            <button onClick={onClose} className="btn-secondary !text-brand-muted">
              Cancel
            </button>
          </div>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [selectedSubmissionForEval, setSelectedSubmissionForEval] = useState(null);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);

  const [stats, setStats] = useState({ totalParticipants: 0, totalSubmissions: 0, activeTracks: 0, pendingReviews: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hackRes, subRes] = await Promise.all([
          API.get('hackathons'),
          API.get('submissions')
        ]);

        let statsData = {};
        const allSubs = subRes.data.data;
        const mySubs = allSubs.filter(s => (s.userId?._id || s.userId) === user?.id);

        if (user?.systemRole === 'admin') {
          const overviewRes = await API.get('hackathons/stats/overview');
          statsData = overviewRes.data.data;
        } else if (user?.systemRole === 'judge') {
          const judgeStatsRes = await API.get('hackathons/stats/judge');
          statsData = judgeStatsRes.data.data;
        } else if (user?.systemRole === 'participant') {
          const subsWithScores = await Promise.all(mySubs.map(async (sub) => {
            try {
              const eRes = await API.get(`evaluations/my/${sub._id}`);
              const evals = eRes.data.data;
              const avg = evals.length > 0 
                ? evals.reduce((a, c) => a + c.totalScore, 0) / evals.length 
                : null;
              return { ...sub, score: avg };
            } catch (e) {
               return { ...sub, score: null };
            }
          }));

          const latestScore = subsWithScores[0]?.score || 0;
          const activeHackathons = hackRes.data.data.filter(h => h.isActive).length;
          
          statsData = {
            submissionCount: mySubs.length,
            activeHackathons,
            myScore: (subsWithScores[0]?.hackathonId?.isCompleted && latestScore && latestScore > 0) ? latestScore.toFixed(1) : '–'
          };
        }

        setHackathons(hackRes.data.data);
        setActivity(allSubs); 
        setStats(statsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const hasSubmitted = useCallback((hackathonId) => {
    return activity.find(sub => sub.hackathonId?._id === hackathonId || sub.hackathonId === hackathonId);
  }, [activity]);

  const isJudgedByMe = useCallback((hackathon) => {
    const userId = user?.id || user?._id;
    return hackathon.judges?.some(j => (j._id || j).toString() === userId?.toString());
  }, [user]);

  const handleDeleteHackathon = useCallback(async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      try {
        await API.delete(`hackathons/${id}`);
        setHackathons(prev => prev.filter(h => h._id !== id));
        toast.success(`Registry entry "${title}" obliterated.`);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Deletion failed.');
      }
    }
  }, []);

  const handleAnnounce = async (hackathonId) => {
    if (window.confirm('Commence final result announcement? This locks evaluations and reveals scores to participants.')) {
      try {
        const res = await API.put(`hackathons/${hackathonId}/complete`);
        
        // Handle unevaluated submissions warning
        if (res.data.warning) {
          const projects = res.data.unevaluatedProjects || [];
          const projectList = projects.map(p => `• ${p}`).join('\n');
          const forceConfirm = window.confirm(
            `⚠️ ${res.data.message}\n\nUnevaluated projects:\n${projectList}\n\nDo you want to proceed anyway?`
          );
          if (forceConfirm) {
            await API.put(`hackathons/${hackathonId}/complete?force=true`);
            toast.success('Results deployed to registry.');
            window.location.reload();
          }
          return;
        }
        
        toast.success('Results deployed to registry.');
        window.location.reload();
      } catch (err) {
        toast.error('Deployment failed.');
      }
    }
  };

  const statsConfig = useMemo(() => {
    if (user?.systemRole === 'admin') {
      return [
        { label: 'Total Participants', value: stats.totalParticipants || 0, icon: <Users size={20} />, color: 'text-blue-600' },
        { label: 'Total Submissions', value: stats.totalSubmissions || 0, icon: <ClipboardCheck size={20} />, color: 'text-green-600' },
        { label: 'Active Hackathons', value: stats.activeTracks || 0, icon: <Trophy size={20} />, color: 'text-brand-primary' },
        { label: 'Pending Reviews', value: stats.pendingReviews || 0, icon: <Layout size={20} />, color: 'text-warning' }
      ];
    } else if (user?.systemRole === 'judge') {
      return [
        { label: 'Assigned Projects', value: stats.assignedSubmissions || 0, icon: <Layout size={20} />, color: 'text-indigo-600' },
        { label: 'Completed Reviews', value: stats.reviewedCount || 0, icon: <CheckCircle2 size={20} />, color: 'text-emerald-600' },
        { label: 'Pending Reviews', value: stats.pendingReviews || 0, icon: <Clock size={20} />, color: 'text-amber-600' }
      ];
    } else {
      return [
        { label: 'My Submissions', value: stats.submissionCount || 0, icon: <FileCheck size={20} />, color: 'text-sky-600' },
        { label: 'Active Hackathons', value: stats.activeHackathons || 0, icon: <Zap size={20} />, color: 'text-brand-primary' },
        { label: 'My Latest Score', value: stats.myScore || '0.0', icon: <Award size={20} />, color: 'text-rose-600' }
      ];
    }
  }, [user?.systemRole, stats]);

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* ── Summary Cards ── */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${user?.systemRole === 'admin' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-3 sm:gap-4 lg:gap-5`}>
        {statsConfig.map((stat, i) => (
          <div key={i} className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-3 sm:gap-4 group hover:border-brand-primary transition-all">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-50 ${stat.color} flex items-center justify-center shrink-0 border border-brand-border/50 shadow-inner group-hover:scale-110 transition-transform`}>
              {React.cloneElement(stat.icon, { className: 'w-5 h-5' })}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] sm:text-[10px] font-black text-brand-muted uppercase tracking-widest mb-0.5 leading-tight truncate">{stat.label}</span>
              <span className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight leading-none">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6 sm:space-y-8 lg:space-y-10">
        {/* ── Hackathons ── */}
        <section>
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <h2 className="text-lg sm:text-xl font-black text-brand-dark tracking-tight">Hackathons</h2>
            {user?.systemRole === 'admin' && (
              <Link to="/admin/create-hackathon" className="btn-primary flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
                <Plus size={14} /> <span className="hidden sm:inline">Host Hackathon</span><span className="sm:hidden">New</span>
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {loading ? (
              <div className="py-10 sm:py-12 bg-white border border-brand-border rounded-2xl sm:rounded-[2.5rem]">
                <CircularLoading label="Retrieving Active Tracks..." />
              </div>
            ) : hackathons.length === 0 ? (
              <div className="p-10 sm:p-16 text-center bg-white border-2 border-dashed border-brand-border rounded-2xl sm:rounded-[2rem]">
                <p className="text-xs sm:text-sm font-bold text-brand-muted uppercase tracking-widest italic">No active hackathons in the registry.</p>
              </div>
            ) : (
              hackathons.map((hackathon) => (
                <div key={hackathon._id} className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all group">
                  {/* Left: Identity */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-brand-primary rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-sm sm:text-base border border-blue-100 shadow-sm shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      {hackathon.title.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-brand-dark leading-tight mb-0.5 truncate">{hackathon.title}</h3>
                      <p className="text-[10px] sm:text-[11px] font-medium text-brand-muted line-clamp-1 uppercase tracking-wider truncate">{hackathon.description}</p>
                    </div>
                  </div>
                  
                  {/* Right: Meta + Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-brand-border/50">
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <p className="text-[9px] font-black text-brand-muted uppercase tracking-widest mb-0.5">Deadline</p>
                      <p className="text-xs font-black text-brand-dark">
                        {new Date(hackathon.submissionDeadline).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
                      {user?.systemRole === 'participant' && (
                        <Link to={`/submit-project/${hackathon._id}`} className={`px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 rounded-xl border w-full sm:w-auto justify-center ${
                          hasSubmitted(hackathon._id) 
                          ? 'bg-white border-brand-primary text-brand-primary hover:bg-brand-primary/5 shadow-none' 
                          : 'bg-brand-primary text-white border-transparent hover:bg-brand-primary/95 shadow-lg shadow-brand-primary/20'
                        }`}>
                           {hasSubmitted(hackathon._id) ? (
                             <><Edit size={14} /> Edit Project</>
                           ) : (
                             'Participate'
                           )}
                        </Link>
                      )}
                      {(user?.systemRole === 'judge' && isJudgedByMe(hackathon)) && (
                        <Link to={`/admin/submissions/${hackathon._id}`} className="btn-primary px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 w-full sm:w-auto text-center justify-center">
                           Review Projects
                        </Link>
                      )}
                      {user?.systemRole === 'admin' && (
                        <div className="flex items-center gap-1 sm:gap-2">
                          {!hackathon.isCompleted && (
                            <button 
                              onClick={() => handleAnnounce(hackathon._id)}
                              title="Announce Results"
                              className="p-2 text-brand-muted hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                            >
                              <Zap size={18} />
                            </button>
                          )}
                          <Link to={`/admin/submissions/${hackathon._id}`} title="View Submissions" className="p-2 text-brand-muted hover:text-brand-primary hover:bg-brand-bg rounded-xl transition-all">
                            <ClipboardCheck size={18} />
                          </Link>
                          <Link to={`/admin/edit-hackathon/${hackathon._id}`} title="Edit" className="p-2 text-brand-muted hover:text-brand-primary hover:bg-brand-bg rounded-xl transition-all">
                            <Edit size={18} />
                          </Link>
                          <button onClick={() => handleDeleteHackathon(hackathon._id, hackathon.title)} className="p-2 text-brand-muted hover:text-brand-danger hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── Projects ── */}
        <section>
          <div className="flex items-center justify-between mb-3 sm:mb-5">
            <h2 className="text-lg sm:text-xl font-black text-brand-dark tracking-tight">Projects</h2>
            <Link to="/projects" className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-1 transition-transform">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {loading ? (
              <div className="col-span-full py-10 sm:py-12 bg-white border border-brand-border rounded-2xl sm:rounded-[2.5rem]">
                <CircularLoading label="Syncing Project Repository..." />
              </div>
            ) : activity.length === 0 ? (
              <div className="col-span-full p-8 sm:p-12 text-center bg-white border-2 border-dashed border-brand-border rounded-2xl sm:rounded-[2rem]">
                <p className="text-xs sm:text-sm font-bold text-brand-muted uppercase tracking-widest italic">The technical registry is currently vacant.</p>
              </div>
            ) : (
              activity.slice(0, 6).map((sub) => (
                <div key={sub._id} className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-brand-primary/5 rounded-full -mr-8 -mt-8" />
                  
                  <div className="space-y-3 sm:space-y-4 relative">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-50 border border-brand-border rounded-xl flex items-center justify-center text-brand-primary font-black text-sm shadow-inner shrink-0">
                        {sub.projectTitle?.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link to={`/evaluate/${sub._id}`} className="block">
                          <h3 className="text-xs sm:text-sm font-black text-brand-dark leading-tight group-hover:text-brand-primary transition-colors truncate">{sub.projectTitle}</h3>
                        </Link>
                        <p className="text-[8px] sm:text-[9px] font-black text-brand-muted uppercase tracking-widest truncate">
                          {sub.userId?.name} • {sub.hackathonId?.title}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-brand-border/50">
                      <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        sub.status === 'reviewed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {sub.status === 'reviewed' ? 'Evaluated' : 'Pending'}
                      </div>
                      <Link to={`/evaluate/${sub._id}`} className="p-1.5 text-brand-muted hover:text-brand-primary transition-colors">
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>


      </div>

      <EvaluationFeedbackModal 
        isOpen={isEvalModalOpen} 
        onClose={() => setIsEvalModalOpen(false)} 
        submission={selectedSubmissionForEval} 
      />

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
            } catch (err) { toast.error('Invite failed.'); }
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
