import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { Clock, CheckCircle, AlertCircle, ArrowLeft, Github, Globe, Zap, Trophy, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const SubmitProject = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [formData, setFormData] = useState({ projectTitle: '', description: '', githubLink: '', demoLink: '' });
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
          if (distance < 0) { clearInterval(interval); setTimeLeft('EXPIRED'); }
          else {
            const d = Math.floor(distance / 86400000);
            const h = Math.floor((distance % 86400000) / 3600000);
            const m = Math.floor((distance % 3600000) / 60000);
            setTimeLeft(`${d}d ${h}h ${m}m`);
          }
        }, 1000);
        return () => clearInterval(interval);
      } catch (err) {
        setMessage({ type: 'error', text: 'Connection to track registry lost' });
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
      setMessage({ type: 'success', text: 'Transmission successful. Project recorded.' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Transmission failed' });
    } finally { setSubmitting(false); }
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
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 40px' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px', padding: 0 }}>
          <ArrowLeft size={16} /> Back to track
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '48px', alignItems: 'start' }}>
          {/* Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="athiva-card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#A3FF12', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={24} color="black" />
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px', color: 'white', letterSpacing: '-0.03em' }}>{hackathon?.title}</h2>
                <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6, fontWeight: 500, marginBottom: '24px' }}>{hackathon?.description}</p>
                
                <p style={{ color: '#666', fontWeight: 500, fontSize: '16px' }}>Complete your entry for this track within the Athiva ecosystem.</p>
                <div style={{ paddingTop: '24px', borderTop: '1px solid #1A1A1A' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Zap size={16} color="#A3FF12" />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operating Rules</span>
                  </div>
                  <div style={{ color: '#B3B3B3', fontSize: '14px', lineHeight: 1.6, backgroundColor: '#000', padding: '16px', borderRadius: '12px', border: '1px solid #141414', whiteSpace: 'pre-wrap' }}>
                    {hackathon?.rules}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="athiva-card" style={{ padding: '32px', backgroundColor: 'rgba(163,255,18,0.05)', borderColor: 'rgba(163,255,18,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Clock size={20} color="#A3FF12" />
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#A3FF12', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Submission Window</span>
              </div>
              <div style={{ fontSize: '40px', fontWeight: 900, color: 'white', letterSpacing: '-0.05em', marginBottom: '8px' }}>{timeLeft}</div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#444' }}>Closing: {new Date(hackathon?.submissionDeadline).toLocaleString()}</p>
            </div>
          </div>

          {/* Submission Form */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="athiva-card" style={{ padding: '48px', backgroundColor: 'rgba(15,15,15,0.8)', backdropFilter: 'blur(10px)' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '40px', color: 'white', letterSpacing: '-0.03em' }}>Project Transmission</h2>

            {message.text && (
              <div style={{ padding: '16px 20px', borderRadius: '16px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 700, ...(message.type === 'success' ? { backgroundColor: 'rgba(163,255,18,0.1)', border: '1px solid rgba(163,255,18,0.2)', color: '#A3FF12' } : { backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }) }}>
                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Project Title</label>
                <input type="text" required className="athiva-input" placeholder="e.g. Neural Nexus Architecture" value={formData.projectTitle} onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })} />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>GitHub Link</label>
                <div style={{ position: 'relative' }}>
                  <Github style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
                  <input type="url" required className="athiva-input" style={{ paddingLeft: '52px' }} placeholder="https://github.com/..." value={formData.githubLink} onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })} />
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Demo URL (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <Globe style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
                  <input type="url" className="athiva-input" style={{ paddingLeft: '52px' }} placeholder="https://demo.vercel.app/..." value={formData.demoLink} onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })} />
                </div>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Project Description</label>
                <textarea required className="athiva-input" style={{ minHeight: '120px', resize: 'vertical' }} placeholder="How does this solution address the challenge?" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <button type="submit" disabled={submitting || timeLeft === 'EXPIRED'} className="athiva-button" style={{ width: '100%', padding: '16px', justifyContent: 'center' }}>
                {submitting ? 'Transmitting...' : timeLeft === 'EXPIRED' ? 'Window Closed' : 'Transmit Solution'} <ShieldCheck size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SubmitProject;
