import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  ChevronRight,
  Eye,
  Github,
  Globe,
  MessageSquare,
  Calendar,
  Filter,
  Layout
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CircularLoading } from '../components/Skeleton';

const ProjectBrowser = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [hackathonFilter, setHackathonFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('submissions');
        setSubmissions(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get unique hackathon names for filter
  const hackathonNames = [...new Set(submissions.map(s => s.hackathonId?.title).filter(Boolean))];

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = !search ||
      sub.projectTitle?.toLowerCase().includes(search.toLowerCase()) ||
      sub.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      sub.hackathonId?.title?.toLowerCase().includes(search.toLowerCase());
    
    const matchesHackathon = hackathonFilter === 'all' || sub.hackathonId?.title === hackathonFilter;
    
    return matchesSearch && matchesHackathon;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <CircularLoading size="lg" label="Synchronizing Technical Registry..." />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-brand-border/60">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link to="/dashboard" className="text-[10px] font-black text-brand-muted hover:text-brand-primary uppercase tracking-[0.2em] transition-colors">Dashboard</Link>
            <ChevronRight size={10} className="text-brand-muted" />
            <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Project Registry</span>
          </div>
          <h1 className="text-3xl font-black text-brand-dark tracking-tighter">Browse Projects</h1>
          <p className="text-xs font-bold text-brand-muted mt-1 uppercase tracking-widest">
            {filteredSubmissions.length} project{filteredSubmissions.length !== 1 ? 's' : ''} in registry
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Hackathon Filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <select
              value={hackathonFilter}
              onChange={(e) => setHackathonFilter(e.target.value)}
              className="bg-white border border-brand-border rounded-2xl py-3.5 pl-11 pr-8 text-xs font-bold focus:border-brand-primary transition-all outline-none appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="all">All Hackathons</option>
              {hackathonNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Search by project, participant, or hackathon..."
              className="w-full bg-white border border-brand-border rounded-2xl py-3.5 pl-12 pr-6 text-xs font-bold focus:border-brand-primary transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Results */}
      {filteredSubmissions.length === 0 ? (
        <div className="p-24 text-center bg-white border-2 border-dashed border-brand-border rounded-[2.5rem]">
          <Layout size={48} className="mx-auto text-brand-muted mb-4 opacity-30" />
          <p className="text-sm font-bold text-brand-dark uppercase tracking-widest">No projects found.</p>
          <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-2">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubmissions.map((sub, i) => (
            <motion.div
              key={sub._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-brand-border rounded-[2.5rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150" />

              <div className="space-y-4 relative">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="w-12 h-12 bg-white border border-brand-border rounded-2xl flex items-center justify-center text-brand-primary font-black shadow-inner">
                    {sub.projectTitle?.charAt(0)}
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    sub.status === 'reviewed' ? 'bg-green-50 text-green-600 border border-green-100' :
                    'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {sub.status === 'reviewed' ? 'Evaluated' : 'Pending Review'}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-black text-brand-dark tracking-tight mb-2 group-hover:text-brand-primary transition-colors">{sub.projectTitle}</h3>
                  <div className="bg-slate-50 border border-brand-border rounded-2xl p-4 min-h-[80px]">
                    <p className="text-[11px] font-bold text-brand-muted leading-relaxed line-clamp-3">
                      {sub.description}
                    </p>
                  </div>
                </div>

                {/* Hackathon Badge */}
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-brand-primary" />
                  <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest">{sub.hackathonId?.title || 'Unknown Track'}</span>
                </div>

                {/* Links */}
                <div className="grid grid-cols-2 gap-4">
                  {sub.githubLink && (
                    <a href={sub.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-black text-brand-dark hover:bg-white hover:border-brand-primary/40 transition-all">
                      <Github size={14} className="text-brand-primary" /> CODE
                    </a>
                  )}
                  {sub.demoLink && (
                    <a href={sub.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 bg-brand-bg border border-brand-border rounded-xl text-[10px] font-black text-brand-dark hover:bg-white hover:border-brand-primary/40 transition-all">
                      <Globe size={14} className="text-brand-primary" /> DEMO
                    </a>
                  )}
                </div>

                {/* Comments count */}
                {sub.comments?.length > 0 && (
                  <div className="flex items-center gap-2 text-brand-muted">
                    <MessageSquare size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{sub.comments.length} comment{sub.comments.length !== 1 ? 's' : ''}</span>
                  </div>
                )}

                {/* Participant */}
                <div className="flex items-center gap-4 pt-6 border-t border-brand-border/60">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/5 flex items-center justify-center text-[10px] font-black text-brand-primary border border-brand-primary/10">
                    {sub.userId?.name?.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-brand-dark truncate">{sub.userId?.name}</p>
                    <p className="text-[9px] font-bold text-brand-muted uppercase tracking-tight">Participant</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-8">
                <Link
                  to={`/evaluate/${sub._id}`}
                  className="w-full btn-primary !py-4 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 group/btn"
                >
                  <Eye size={14} />
                  <span>View Details</span>
                  <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectBrowser;
