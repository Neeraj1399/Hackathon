import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axiosInstance';
import { ArrowLeft, Plus, AlertCircle, Calendar, Clock } from 'lucide-react';

const DateTimeInput = ({ value, onChange, className }) => {
  const dateStr = value ? value.split('T')[0] : '';
  const timeStr = value && value.includes('T') ? value.split('T')[1].substring(0,5) : '';

  return (
    <div className={`flex items-center bg-white border border-brand-border rounded-xl px-[4%] py-[0.625rem] transition-all focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/5 shadow-inner ${className}`}>
      <div className="flex items-center gap-[4%] w-[60%] border-r border-brand-border pr-[3%]">
        <Calendar size={14} className="text-brand-secondary shrink-0" />
        <input 
          type="date" 
          className="bg-transparent outline-none w-full text-xs font-black text-brand-dark" 
          value={dateStr}
          onChange={(e) => {
            const newDate = e.target.value;
            onChange(newDate ? `${newDate}T${timeStr || '12:00'}` : '');
          }}
        />
      </div>
      <div className="flex items-center gap-[4%] w-[40%] pl-[3%]">
        <Clock size={14} className="text-brand-secondary shrink-0" />
        <input 
          type="time" 
          className="bg-transparent outline-none w-full text-xs font-black text-brand-dark" 
          value={timeStr}
          onChange={(e) => {
            const newTime = e.target.value;
            onChange(dateStr ? `${dateStr}T${newTime}` : value);
          }}
        />
      </div>
    </div>
  );
};

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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('hackathons', formData);
      toast.success('Track registry initialized successfully.', { icon: '🏆' });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initialize track registry.');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20">
      <header>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-4 text-xs font-bold text-brand-text-secondary hover:text-brand-primary uppercase tracking-widest mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <h1 className="text-xl font-bold text-brand-text-primary">Host New Hackathon</h1>
        <p className="text-sm text-brand-text-secondary mt-1">Set up the details, rules, and timeline for your hackathon event.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-lg p-8 shadow-sm space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="label-enterprise">Start Date & Time</label>
            <DateTimeInput 
              value={formData.startDate} 
              onChange={(val) => setFormData({ ...formData, startDate: val })} 
            />
          </div>
          <div className="form-group">
            <label className="label-enterprise">End Date & Time</label>
            <DateTimeInput 
               value={formData.endDate} 
               onChange={(val) => setFormData({ ...formData, endDate: val })} 
            />
          </div>
        </div>

        <div className="form-group border-t border-brand-border pt-6">
          <label className="label-enterprise text-brand-primary">Submission Deadline</label>
          <DateTimeInput 
             className="border-brand-primary/20"
             value={formData.submissionDeadline} 
             onChange={(val) => setFormData({ ...formData, submissionDeadline: val })} 
          />
          <p className="text-[11px] text-brand-text-secondary mt-2">Entries will be automatically locked at this timestamp.</p>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full btn-primary !py-3 flex justify-center items-center gap-4 font-bold uppercase tracking-widest text-xs"
          >
            {loading ? 'Initializing...' : <><Plus size={16} /> Launch Hackathon</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateHackathon;
