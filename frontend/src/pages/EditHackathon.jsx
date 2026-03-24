import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axiosInstance';
import { ArrowLeft, Save, AlertCircle, Calendar, Clock } from 'lucide-react';

const DateTimeInput = ({ value, onChange, className }) => {
  const dateStr = value ? value.split('T')[0] : '';
  const timeStr = value && value.includes('T') ? value.split('T')[1].substring(0,5) : ''; // Handle HH:MM:ss

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

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const res = await API.get(`hackathons/${id}`);
        const data = res.data.data;
        const formatForInput = (date) => {
          if (!date) return '';
          const d = new Date(date);
          const offset = d.getTimezoneOffset() * 60000;
          return new Date(d.getTime() - offset).toISOString().slice(0, 16);
        };
        setFormData({
          title: data.title,
          description: data.description,
          rules: data.rules,
          startDate: formatForInput(data.startDate),
          endDate: formatForInput(data.endDate),
          submissionDeadline: formatForInput(data.submissionDeadline),
        });
      } catch (err) {
        toast.error('Failed to synchronize with event registry.');
      } finally {
        setLoading(false);
      }
    };
    fetchHackathon();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await API.put(`hackathons/${id}`, formData);
      toast.success('Event registry updated successfully.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registry update failed.');
    } finally { setUpdating(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-brand-text-secondary">Syncing track data...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20">
      <header>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-4 text-xs font-bold text-brand-text-secondary hover:text-brand-primary uppercase tracking-widest mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <h1 className="text-xl font-bold text-brand-text-primary">Edit Hackathon Details</h1>
        <p className="text-sm text-brand-text-secondary mt-1">Update the rules, timeline, or objectives for this event.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-lg p-8 shadow-sm space-y-4">
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
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={updating} 
            className="w-full btn-primary !py-3 flex justify-center items-center gap-4 font-bold uppercase tracking-widest text-xs"
          >
            {updating ? 'Updating...' : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHackathon;
