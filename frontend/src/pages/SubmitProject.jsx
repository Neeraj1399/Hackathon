import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Mail,
  Search,
  ExternalLink,
  Zap,
  Layout,
  Users,
  ClipboardCheck
} from 'lucide-react';

const SubmitProject = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [formData, setFormData] = useState({ 
    projectTitle: '', 
    description: '', 
    techStack: '',
    githubLink: '', 
    demoLink: '' 
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const res = await API.get(`hackathons/${hackathonId}`);
        setHackathon(res.data.data);
        const deadline = new Date(res.data.data.submissionDeadline).getTime();
        const interval = setInterval(() => {
          const now = Date.now();
          const distance = deadline - now;
          if (distance < 0) { 
            clearInterval(interval); 
            setTimeLeft('EXPIRED'); 
          } else {
            const d = Math.floor(distance / 86400000);
            const h = Math.floor((distance % 86400000) / 3600000);
            const m = Math.floor((distance % 3600000) / 60000);
            setTimeLeft(`${d}d ${h}h ${m}m remaining`);
          }
        }, 1000);
        return () => clearInterval(interval);
      } catch (err) {
        setMessage({ type: 'error', text: 'Registry connection disrupted.' });
      } finally { setLoading(false); }
    };
    fetchHackathon();
  }, [hackathonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      await API.post('submissions', { ...formData, hackathonId });
      setMessage({ type: 'success', text: 'Project successfully submitted.' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Submission failed.' });
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-brand-text-secondary">Connecting to submission portal...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-xs font-bold text-brand-text-secondary hover:text-brand-primary uppercase tracking-widest mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <h1 className="text-xl font-bold text-brand-text-primary">Project Submission</h1>
        <p className="text-sm text-brand-text-secondary mt-1">Submit your solution for the {hackathon?.title} event.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Track Info */}
        <div className="space-y-6">
          <div className="card-enterprise !p-5 bg-blue-50/30 border-blue-100">
             <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-wider mb-3">
                <Clock size={14} /> Deadline Info
             </div>
             <p className="text-xl font-black text-brand-text-primary">{timeLeft}</p>
             <p className="text-[11px] text-brand-text-secondary mt-1">
                Closes: {new Date(hackathon?.submissionDeadline).toLocaleString()}
             </p>
          </div>

          <div className="card-enterprise !p-5">
             <h3 className="text-xs font-bold text-brand-text-primary uppercase tracking-wider mb-3">Hackathon Objective</h3>
             <p className="text-xs text-brand-text-secondary leading-relaxed line-clamp-4">
                {hackathon?.description}
             </p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-brand-section rounded-lg border border-brand-border">
             <Info size={16} className="text-brand-primary mt-0.5 shrink-0" />
             <p className="text-[11px] text-brand-text-secondary leading-relaxed">
                Ensure project repository is public or properly shared with the review board.
             </p>
          </div>
        </div>

        {/* Submission Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-lg p-8 shadow-sm space-y-6">
            {message.text && (
              <div className={`p-4 rounded-md flex items-center gap-2 text-sm font-medium ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-brand-danger border border-red-100'
              }`}>
                {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {message.text}
              </div>
            )}

            {/* Project Concept (Idea Phase) */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest border-l-2 border-brand-primary pl-3">
                Project Concept
              </h3>
              
              <div className="form-group">
                <label className="label-enterprise">Project Title</label>
                <input 
                  type="text" 
                  required 
                  className="input-enterprise" 
                  placeholder="e.g. Nexus Framework" 
                  value={formData.projectTitle} 
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label className="label-enterprise">Description & Objective</label>
                <textarea 
                  required 
                  rows={4}
                  className="input-enterprise resize-none" 
                  placeholder="What problem does this solve and what is the core value proposition?" 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label className="label-enterprise">Tech Stack</label>
                <input 
                  type="text" 
                  required 
                  className="input-enterprise" 
                  placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS" 
                  value={formData.techStack} 
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })} 
                />
              </div>
            </div>

            {/* Final Deliverables (Final Phase) */}
            <div className="space-y-6 pt-6 border-t border-brand-border">
              <h3 className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest border-l-2 border-brand-primary pl-3">
                Final Deliverables
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="label-enterprise">GitHub Repository URL</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" size={14} />
                    <input 
                      type="url" 
                      required 
                      className="input-enterprise pl-9" 
                      placeholder="https://github.com/..." 
                      value={formData.githubLink} 
                      onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label-enterprise">Demo URL (Optional)</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" size={14} />
                    <input 
                      type="url" 
                      className="input-enterprise pl-9" 
                      placeholder="https://..." 
                      value={formData.demoLink} 
                      onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
            </div>


            <div className="pt-4">
              <button 
                type="submit" 
                disabled={submitting || timeLeft.includes('EXPIRED')} 
                className="w-full btn-primary !py-3 flex justify-center items-center gap-2 font-bold uppercase tracking-widest text-xs"
              >
                {submitting ? 'Transmitting...' : timeLeft.includes('EXPIRED') ? 'Submission Window Closed' : 'Submit Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitProject;
