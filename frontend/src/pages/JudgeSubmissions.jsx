import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import { 
  ExternalLink, 
  ArrowLeft, 
  Layout, 
  Search, 
  Mail, 
  ChevronRight, 
  Zap, 
  Github, 
  Globe,
  FileText,
  Star,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

const JudgeSubmissions = () => {
  const { hackathonId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, hackRes] = await Promise.all([
          API.get(`submissions/hackathon/${hackathonId}`),
          API.get(`hackathons/${hackathonId}`)
        ]);
        setSubmissions(subRes.data.data);
        setHackathon(hackRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hackathonId]);

  const filteredSubmissions = submissions.filter(sub => 
    sub.projectTitle.toLowerCase().includes(search.toLowerCase()) || 
    sub.userId?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-brand-primary">
      <div className="w-10 h-10 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin mb-4" />
      <p className="font-bold text-[10px] tracking-widest uppercase">Syncing Submissions...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-4 px-4">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-brand-border/60">
        <div>
           <div className="flex items-center gap-4 mb-2">
              <Link to="/dashboard" className="text-[10px] font-black text-brand-muted hover:text-brand-primary uppercase tracking-[0.2em] transition-colors">Dashboard</Link>
              <ChevronRight size={10} className="text-brand-muted" />
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Judging Board</span>
           </div>
           <h1 className="text-3xl font-black text-brand-dark tracking-tighter">Technical Registry</h1>
           <p className="text-xs font-bold text-brand-muted mt-1 uppercase tracking-widest">
              Reviewing Track: {hackathon?.title}
           </p>
        </div>
        
        <div className="relative w-full md:w-80">
           <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
           <input 
             type="text" 
             placeholder="Search by project or participant..." 
             className="w-full bg-white border border-brand-border rounded-2xl py-3.5 pl-12 pr-6 text-xs font-bold focus:border-brand-primary transition-all outline-none" 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </header>

      {filteredSubmissions.length === 0 ? (
        <div className="p-24 text-center bg-white border-2 border-dashed border-brand-border rounded-[2.5rem]">
          <p className="text-sm font-bold text-brand-dark uppercase tracking-widest">No projects submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubmissions.map((sub) => (
            <div key={sub._id} className="bg-white border border-brand-border rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150" />
              
              <div className="space-y-4 relative">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="w-12 h-12 bg-white border border-brand-border rounded-2xl flex items-center justify-center text-brand-primary font-black shadow-inner">
                    {sub.projectTitle.charAt(0)}
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    sub.status === 'reviewed' ? 'bg-green-50 text-green-600 border border-green-100' : 
                    'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {sub.status === 'reviewed' ? 'Evaluation Complete' : 'Pending Detail Review'}
                  </div>
                </div>
                
                <div>
                   <h3 className="text-lg font-black text-brand-dark tracking-tight mb-2 group-hover:text-brand-primary transition-colors">{sub.projectTitle}</h3>
                   <div className="bg-slate-50 border border-brand-border rounded-2xl p-4 min-h-[80px]">
                      <p className="text-[11px] font-bold text-brand-muted leading-relaxed line-clamp-3">
                        {sub.description || sub.projectDescription}
                      </p>
                   </div>
                </div>

                <div className="space-y-4 pt-4">
                  <p className="text-[9px] font-black text-brand-muted uppercase tracking-widest">Evaluation Assets</p>
                  <div className="grid grid-cols-2 gap-4">
                     <a href={sub.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4 p-3 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-black text-brand-dark hover:bg-white hover:border-brand-primary/40 transition-all">
                        <Github size={14} className="text-brand-primary" /> CODE
                     </a>
                     {sub.demoLink && (
                       <a href={sub.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4 p-3 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-black text-brand-dark hover:bg-white hover:border-brand-primary/40 transition-all">
                          <Globe size={14} className="text-brand-primary" /> DEMO
                       </a>
                     )}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-brand-border/60">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/5 flex items-center justify-center text-[10px] font-black text-brand-primary border border-brand-primary/10">
                     {sub.userId?.name?.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-brand-dark truncate">{sub.userId?.name}</p>
                    <p className="text-[9px] font-bold text-brand-muted uppercase tracking-tight">Verified Participant</p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Link 
                  to={`/evaluate/${sub._id}`} 
                  className="w-full btn-primary !py-4 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 group/btn"
                >
                  <Eye size={14} /> 
                  <span>View Project Details</span> 
                  <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JudgeSubmissions;
