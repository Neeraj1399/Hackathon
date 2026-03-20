import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react';

const CreateHackathon = () => {
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    rules: '', 
    startDate: '', 
    endDate: '', 
    submissionDeadline: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('hackathons', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize track registry.');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <header>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-xs font-bold text-brand-text-secondary hover:text-brand-primary uppercase tracking-widest mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <h1 className="text-xl font-bold text-brand-text-primary">Host New Hackathon</h1>
        <p className="text-sm text-brand-text-secondary mt-1">Set up the details, rules, and timeline for your innovation event.</p>
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
            placeholder="e.g. Strategic Data Framework v2" 
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          />
        </div>

        <div className="form-group">
          <label className="label-enterprise">Event Description & Abstract</label>
          <textarea 
            required 
            rows={4} 
            className="input-enterprise resize-none" 
            placeholder="Define the problem space and expected deliverables..." 
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
            placeholder="Specify eligibility and constraints..." 
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
          <p className="text-[11px] text-brand-text-secondary mt-2">Entries will be automatically locked at this timestamp.</p>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full btn-primary !py-3 flex justify-center items-center gap-2 font-bold uppercase tracking-widest text-xs"
          >
            {loading ? 'Initializing...' : <><Plus size={16} /> Launch Hackathon</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateHackathon;
