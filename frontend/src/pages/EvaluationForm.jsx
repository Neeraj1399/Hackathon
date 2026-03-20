import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { 
  ArrowLeft, 
  Target, 
  Cpu, 
  Zap,
  Info
} from 'lucide-react';

const EvaluationForm = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scores, setScores] = useState({
    innovation: 5,
    impact: 5,
    technical: 5
  });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await API.get(`submissions/${submissionId}`);
        setSubmission(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [submissionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('evaluations', {
        submissionId,
        innovation: parseInt(scores.innovation),
        impact: parseInt(scores.impact),
        technical: parseInt(scores.technical),
        feedback
      });
      navigate(-1);
    } catch (err) {
      alert(err.response?.data?.message || 'Transaction failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-brand-text-secondary">Loading evaluation framework...</p>
    </div>
  );

  const totalScore = (Number(scores.innovation) + Number(scores.impact) + Number(scores.technical)) / 3;
  const isComplete = feedback.trim().length > 10;

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-20">
      <header>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-brand-text-secondary hover:text-brand-primary uppercase tracking-widest mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Entries
        </button>
        <h1 className="text-xl font-bold text-brand-text-primary">Evaluation Framework</h1>
        <p className="text-sm text-brand-text-secondary mt-1">Assess project viability, impact, and engineering quality.</p>
      </header>

      {/* Project Overview Card */}
      <div className="card-enterprise !p-5 bg-brand-section/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white border border-brand-border rounded flex items-center justify-center text-brand-primary font-bold">
            {submission?.projectTitle?.charAt(0)}
          </div>
          <div>
            <h2 className="text-sm font-bold text-brand-text-primary">{submission?.projectTitle}</h2>
            <p className="text-xs text-brand-text-secondary">{submission?.userId?.name}</p>
          </div>
        </div>
        <p className="text-xs text-brand-text-secondary italic">"{submission?.description || submission?.projectDescription}"</p>
      </div>

      {/* Scoring Matrix */}
      <form onSubmit={handleSubmit} className="card-enterprise space-y-8">
        {[
          { id: 'innovation', label: 'Innovation & Novelty', icon: <Cpu size={16} /> },
          { id: 'impact', label: 'Business Impact', icon: <Target size={16} /> },
          { id: 'technical', label: 'Technical Engineering', icon: <Zap size={16} /> }
        ].map((metric) => (
          <div key={metric.id} className="form-group">
            <label className="label-enterprise flex items-center gap-2 mb-3">
              <span className="text-brand-primary">{metric.icon}</span>
              {metric.label}
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              className="w-full h-1.5 bg-brand-section rounded-lg appearance-none cursor-pointer accent-brand-primary"
              value={scores[metric.id]}
              onChange={(e) => setScores({ ...scores, [metric.id]: e.target.value })}
            />
            <div className="flex justify-between text-[10px] font-bold text-brand-text-secondary uppercase mt-2">
               <span>Minimal</span>
               <span className="text-brand-primary bg-blue-50 px-2 py-0.5 rounded">Rating: {scores[metric.id]}</span>
               <span>Exceptional</span>
            </div>
          </div>
        ))}

        <div className="form-group border-t border-brand-border pt-6">
          <label className="label-enterprise mb-3">Qualitative Assessment</label>
          <textarea 
            rows="5"
            required
            className="input-enterprise min-h-[120px] resize-none"
            placeholder="Document your observations and recommendations (min 10 characters)..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-wider">Aggregate Index</p>
            <div className="flex items-baseline gap-1 mt-1">
               <span className="text-2xl font-black text-brand-text-primary">{totalScore.toFixed(1)}</span>
               <span className="text-sm font-bold text-brand-text-secondary">/ 10</span>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={!isComplete || submitting}
            className={`btn-primary px-10 py-3 font-bold uppercase tracking-widest ${(!isComplete || submitting) ? 'opacity-50 cursor-not-allowed shadow-none' : 'shadow-md shadow-brand-primary/10'}`}
          >
            {submitting ? 'Committing...' : 'Submit Assessment'}
          </button>
        </div>
      </form>

      <div className="flex items-start gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
        <Info size={16} className="text-brand-primary mt-0.5 shrink-0" />
        <p className="text-[11px] text-brand-text-secondary leading-relaxed">
          Evaluations are final once committed. Ensure qualitative feedback provides sufficient justification for the assigned scores.
        </p>
      </div>
    </div>
  );
};

export default EvaluationForm;
