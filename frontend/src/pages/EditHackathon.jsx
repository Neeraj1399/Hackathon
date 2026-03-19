import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import Navbar from '../components/Navbar';
import { Calendar, Clock, Layout, ArrowLeft, Trophy, ListChecks, ArrowRight, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const EditHackathon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    rules: '', 
    startDate: '', 
    endDate: '', 
    submissionDeadline: '' 
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const res = await API.get(`hackathons/${id}`);
        const data = res.data.data;
        // Format dates for datetime-local input
        const formatForInput = (date) => new Date(date).toISOString().slice(0, 16);
        setFormData({
          title: data.title,
          description: data.description,
          rules: data.rules,
          startDate: formatForInput(data.startDate),
          endDate: formatForInput(data.endDate),
          submissionDeadline: formatForInput(data.submissionDeadline),
        });
      } catch (err) {
        setError('Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };
    fetchHackathon();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    try {
      await API.put(`hackathons/${id}`, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update track');
    } finally { setUpdating(false); }
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
      <main className="responsive-main" style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '40px', padding: 0 }}>
          <ArrowLeft size={16} /> Back to track list
        </button>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="athiva-card responsive-card-padding" 
          style={{ padding: '48px', backgroundColor: 'rgba(15,15,15,0.8)', backdropFilter: 'blur(10px)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '48px' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: '#A3FF12', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-5deg)' }}>
              <Trophy style={{ width: '28px', height: '28px', color: 'black' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em', color: 'white' }}>Refine track module</h1>
              <p style={{ color: '#666', fontWeight: 500, fontSize: '16px' }}>Synchronize and refine track parameters within the Athiva ecosystem.</p>
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '16px', borderRadius: '12px', marginBottom: '32px', fontSize: '14px', fontWeight: 600 }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>Track Title</label>
              <div style={{ position: 'relative' }}>
                <Layout style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
                <input type="text" required className="athiva-input" style={{ paddingLeft: '52px' }} placeholder="e.g., Q3 Financial Optimization" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>Context & Objective</label>
              <textarea required rows={4} className="athiva-input" style={{ padding: '16px' }} placeholder="Describe the problem space..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>Operating Rules</label>
              <div style={{ position: 'relative' }}>
                <ListChecks style={{ position: 'absolute', left: '16px', top: '16px', color: '#444', width: '20px', height: '20px' }} />
                <textarea required rows={3} className="athiva-input" style={{ padding: '16px 16px 16px 52px' }} placeholder="Submission criteria, constraints, and eligibility..." value={formData.rules} onChange={(e) => setFormData({ ...formData, rules: e.target.value })} />
              </div>
            </div>

            <div className="responsive-date-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>Activation Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
                  <input type="datetime-local" required className="athiva-input" style={{ paddingLeft: '52px' }} value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>Sunset Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
                  <input type="datetime-local" required className="athiva-input" style={{ paddingLeft: '52px' }} value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '48px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>Final Submission Deadline</label>
              <div style={{ position: 'relative' }}>
                <Clock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
                <input type="datetime-local" required className="athiva-input" style={{ paddingLeft: '52px' }} value={formData.submissionDeadline} onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })} />
              </div>
            </div>

            <div style={{ paddingTop: '32px', borderTop: '1px solid #1A1A1A' }}>
              <button type="submit" disabled={updating} className="athiva-button" style={{ width: '100%', padding: '16px', justifyContent: 'center' }}>
                {updating ? 'Synchronizing...' : 'Apply Registry Update'} <Save size={20} />
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default EditHackathon;
