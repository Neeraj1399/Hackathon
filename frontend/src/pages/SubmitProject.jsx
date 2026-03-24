import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axiosInstance';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Github, 
  Globe, 
  Info, 
  Trophy,
  Zap,
  Layout,
  Layers,
  FileCheck,
  ChevronRight,
  Sparkles,
  Edit,
  User,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CircularLoading } from '../components/Skeleton';

const SubmitProject = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [formData, setFormData] = useState({ 
    projectTitle: '', 
    description: '', 
    githubLink: '', 
    demoLink: '' 
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, expired: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hackRes, mySubsRes] = await Promise.all([
          API.get(`hackathons/${hackathonId}`),
          API.get('submissions/my')
        ]);
        
        const hackData = hackRes.data.data;
        setHackathon(hackData);
        
        const sub = mySubsRes.data.data.find(s => s.hackathonId?._id === hackathonId || s.hackathonId === hackathonId);
        if (sub) {
          setExistingSubmission(sub);
          setFormData({
            projectTitle: sub.projectTitle,
            description: sub.description || sub.projectDescription,
            githubLink: sub.githubLink,
            demoLink: sub.demoLink || ''
          });
        }

        const deadline = new Date(hackData.submissionDeadline).getTime();
        const interval = setInterval(() => {
          const now = Date.now();
          const distance = deadline - now;
          if (distance < 0) { 
            clearInterval(interval); 
            setTimeLeft({ d: 0, h: 0, m: 0, expired: true }); 
          } else {
            const d = Math.floor(distance / 86400000);
            const h = Math.floor((distance % 86400000) / 3600000);
            const m = Math.floor((distance % 3600000) / 60000);
            setTimeLeft({ d, h, m, expired: false });
          }
        }, 1000);
        return () => clearInterval(interval);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchData();
  }, [hackathonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (existingSubmission) {
        await API.put(`submissions/${existingSubmission._id}`, { ...formData });
        toast.success('Project successfully updated.', { icon: '✨' });
      } else {
        await API.post('submissions', { ...formData, hackathonId });
        toast.success('Project successfully submitted.', { icon: '🚀' });
      }
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transmission failed.');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <CircularLoading size="lg" label="Synchronizing Registry..." />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24">
      {/* Universal Navigation */}
      <nav className="py-6">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="group flex items-center gap-4 text-[10px] font-black text-brand-muted hover:text-brand-primary uppercase tracking-[0.2em] transition-all"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Participant Dashboard
        </button>
      </nav>

      {/* Unified Submission Workspace */}
      <div className="bg-white border border-brand-border rounded-xl shadow-sm overflow-hidden relative">
         {/* Top Integrity Header */}
         <div className="p-6 sm:p-10 border-b border-brand-border bg-slate-50/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex flex-col gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
                     {existingSubmission ? 'Update Submission' : 'Project Submission'}
                  </h1>
                  <p className="text-sm font-bold text-brand-primary uppercase tracking-widest">{hackathon?.title}</p>
               </div>
               
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                  <div className="text-left md:text-right">
                     <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Deadline </p>
                     <p className="text-sm font-black text-brand-dark leading-none">
                        {new Date(hackathon?.submissionDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(hackathon?.submissionDeadline).toLocaleDateString('en-GB')}
                     </p>
                  </div>
                  <div className={`py-3 px-4 rounded-xl border flex items-center gap-3 ${timeLeft.expired ? 'bg-red-50 text-red-600 border-red-100' : 'bg-brand-primary/5 text-brand-primary border-brand-primary/10'}`}>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">Time Remaining</span>
                        <span className="text-sm font-black tabular-nums leading-none tracking-tight">
                           {timeLeft.d}D {timeLeft.h}H {timeLeft.m}M
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8 min-h-[400px]">
            <div className="space-y-6">
               <div className="space-y-4 group">
                  <label className="text-[11px] font-black text-brand-dark uppercase tracking-widest group-focus-within:text-brand-primary transition-colors">
                     Project Title
                  </label>
                  <input 
                    type="text" 
                    required 
                    disabled={timeLeft.expired}
                    className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl py-5 px-6 text-sm font-black text-brand-dark transition-all outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 shadow-inner" 
                    placeholder="Project Title (e.g. Smart App)" 
                    value={formData.projectTitle} 
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })} 
                  />
               </div>

               <div className="space-y-4 group">
                  <label className="text-[11px] font-black text-brand-dark uppercase tracking-widest group-focus-within:text-brand-primary transition-colors">
                     Description
                  </label>
                  <textarea 
                    required 
                    disabled={timeLeft.expired}
                    rows={6}
                    className="w-full bg-brand-bg/50 border border-brand-border rounded-3xl py-5 px-6 text-sm font-black text-brand-dark transition-all outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 resize-none shadow-inner" 
                    placeholder="Define the problem landscape and technical solution..." 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 group">
                     <label className="text-[10px] font-black text-brand-muted group-focus-within:text-brand-primary uppercase tracking-widest transition-colors">
                        Github Link
                     </label>
                     <input 
                       type="url" 
                       disabled={timeLeft.expired}
                       className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl py-4 px-5 text-[11px] font-black text-brand-dark transition-all outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 shadow-inner" 
                       placeholder="https://github.com/org/repo (optional)" 
                       value={formData.githubLink} 
                       onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })} 
                     />
                  </div>
                  
                  <div className="space-y-4 group">
                     <label className="text-[10px] font-black text-brand-muted group-focus-within:text-brand-primary uppercase tracking-widest transition-colors">
                        Live Link
                     </label>
                     <input 
                       type="url" 
                       disabled={timeLeft.expired}
                       className="w-full bg-brand-bg/50 border border-brand-border rounded-2xl py-4 px-5 text-[11px] font-black text-brand-dark transition-all outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 shadow-inner" 
                       placeholder="https://nexus-demo.app" 
                       value={formData.demoLink} 
                       onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })} 
                     />
                  </div>
               </div>
            </div>

            <div className="pt-10 flex justify-center">
               <button 
                type="submit"
                disabled={submitting || timeLeft.expired} 
                className={`h-14 px-12 rounded-xl flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 w-full sm:w-auto min-w-[200px] justify-center ${
                  (submitting || timeLeft.expired) 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-brand-primary text-white hover:bg-brand-primary/95 shadow-lg shadow-brand-primary/20'
                }`}
              >
                {submitting ? (
                   <CircularLoading size="sm" label="" />
                ) : timeLeft.expired ? (
                   <span>Registry Locked</span>
                ) : (
                   <span>{existingSubmission ? 'Save Changes' : 'Submit Project'}</span>
                )}
              </button>
            </div>
         </form>
      </div>
    </div>
  );
};

export default SubmitProject;
