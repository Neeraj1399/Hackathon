import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

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
        setError('Failed to synchronize with event registry.');
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
      setError(err.response?.data?.message || 'Registry update failed.');
    } finally { setUpdating(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-brand-text-secondary">Syncing track data...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <header>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-xs font-bold text-brand-text-secondary hover:text-brand-primary uppercase tracking-widest mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <h1 className="text-xl font-bold text-brand-text-primary">Edit Hackathon Details</h1>
        <p className="text-sm text-brand-text-secondary mt-1">Update the rules, timeline, or objectives for this event.</p>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-md text-brand-danger text-sm font-medium flex items-center gap-2">
           <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-lg p-8 shadow-sm space-y-6">
        <div className="form-group">
          <label className="label-enterprise">Hackathon Title</label>
          <input 
            type="text" 
            required 
            className="input-enterprise" 
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          />
        </div>

        <div className="form-group">
          <label className="label-enterprise">Description & Objective</label>
          <textarea 
            required 
            rows={4} 
            className="input-enterprise resize-none" 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
          />
        </div>

        <div className="form-group">
          <label className="label-enterprise">Hackathon Rules</label>
          <textarea 
            required 
            rows={3} 
            className="input-enterprise resize-none" 
            value={formData.rules} 
            onChange={(e) => setFormData({ ...formData, rules: e.target.value })} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="label-enterprise">Start Date</label>
            <input 
              type="datetime-local" 
              required 
              className="input-enterprise" 
              value={formData.startDate} 
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label className="label-enterprise">End Date</label>
            <input 
              type="datetime-local" 
              required 
              className="input-enterprise" 
              value={formData.endDate} 
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} 
            />
          </div>
        </div>

        <div className="form-group border-t border-brand-border pt-6">
          <label className="label-enterprise text-brand-primary">Submission Deadline</label>
          <input 
            type="datetime-local" 
            required 
            className="input-enterprise border-brand-primary/20 focus:border-brand-primary" 
            value={formData.submissionDeadline} 
            onChange={(e) => setFormData({ ...formData, submissionDeadline: e.target.value })} 
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={updating} 
            className="w-full btn-primary !py-3 flex justify-center items-center gap-2 font-bold uppercase tracking-widest text-xs"
          >
            {updating ? 'Updating...' : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHackathon;
