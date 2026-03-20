import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import { 
  ExternalLink, 
  CheckCircle, 
  ArrowLeft, 
  Layout, 
  Trophy, 
  Users, 
  Zap, 
  Github, 
  Globe,
  ClipboardCheck,
  Search,
  Mail
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
    <div className="flex flex-col items-center justify-center min-h-[400px] text-brand-secondary">
      <div className="w-10 h-10 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin mb-4" />
      <p className="font-bold text-sm tracking-tight uppercase">Encrypting Registry Access...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl font-bold text-brand-text-primary">Project Submissions</h1>
          <p className="text-sm text-brand-text-secondary mt-1">Review and assess track entries for {hackathon?.title}.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" />
              <input 
                type="text" 
                placeholder="Filter projects..." 
                className="bg-white border border-brand-border rounded-md py-1.5 pl-9 pr-4 text-xs focus:border-brand-primary outline-none w-64" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white border border-brand-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="p-12 text-center bg-white border border-brand-border rounded-lg border-dashed">
          <p className="text-sm text-brand-text-secondary">No submissions matching the current criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubmissions.map((sub) => (
            <div key={sub._id} className="card-enterprise flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-brand-section text-brand-primary rounded flex items-center justify-center font-bold border border-brand-border">
                    {sub.projectTitle.charAt(0)}
                  </div>
                  <span className={`badge-enterprise ${
                    sub.status === 'reviewed' ? 'badge-success' : 
                    sub.status === 'pending' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {sub.status === 'reviewed' ? 'Reviewed' : sub.status === 'pending' ? 'Pending' : 'Rejected'}
                  </span>
                </div>
                
                <h3 className="text-sm font-bold text-brand-text-primary mb-2 truncate">{sub.projectTitle}</h3>
                <p className="text-xs text-brand-text-secondary line-clamp-2 mb-6">
                  {sub.description || 'No description provided by the participant.'}
                </p>

                <div className="space-y-2 border-t border-brand-border pt-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Users size={12} className="text-brand-secondary" />
                    <span className="text-[11px] font-medium text-brand-text-primary truncate">{sub.userId?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-brand-secondary" />
                    <span className="text-[11px] text-brand-text-secondary truncate">{sub.userId?.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link to={`/evaluate/${sub._id}`} className="flex-1 btn-primary text-center">
                  Assessment
                </Link>
                <button className="btn-secondary !p-2" title="Quick View">
                   <Layout size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JudgeSubmissions;
