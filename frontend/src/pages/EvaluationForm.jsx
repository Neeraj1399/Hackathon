import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance';
import { 
  ArrowLeft, 
  Target, 
  Cpu, 
  Zap,
  Info,
  Github,
  Globe,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Award,
  BarChart3,
  User,
  Layout,
  ChevronDown,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EvaluationForm = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [scores, setScores] = useState({
    innovation: 5,
    impact: 5,
    technical: 5
  });
  const [feedback, setFeedback] = useState('');
    const [isEdit, setIsEdit] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        
        // Single atomic call for primary data to avoid Promise.all overall failure
        const subRes = await API.get(`submissions/${submissionId}`);
        setSubmission(subRes.data.data);
        
        // Secondary call for evaluation data
        try {
          if (user?.systemRole === 'admin') {
            // Admins fetch ALL evaluations to see cumulative progress
            const evalRes = await API.get(`evaluations/submission/${submissionId}`);
            if (evalRes.data.data && evalRes.data.data.length > 0) {
              const allEvals = evalRes.data.data;
              const avg = (id) => allEvals.reduce((a, c) => a + c[id], 0) / allEvals.length;
              setScores({
                innovation: avg('innovation').toFixed(1),
                impact: avg('impact').toFixed(1),
                technical: avg('technical').toFixed(1)
              });
              setFeedback(`Cumulative summary of ${allEvals.length} judicial reviews.`);
              setIsEdit(true);
            }
          } else {
            // Judges fetch their specific audit
            const evalRes = await API.get(`submissions/judge-audit/${submissionId}`);
            if (evalRes.data.data) {
              const ev = evalRes.data.data;
              setScores({
                innovation: ev.innovation,
                impact: ev.impact,
                technical: ev.technical
              });
              setFeedback(ev.feedback || '');
              setIsEdit(true);
            }
          }
        } catch (e) {
          console.warn('--- Review Registry Lookup ---');
        }
      } catch (err) {
        console.error('--- Critical Registry Synchronization Failure ---', err);
        setErrorMsg('Primary project registry could not be synchronized.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      toast.success(isEdit ? 'Assessment refinement successfully committed.' : 'New assessment successfully committed to the registry.', { icon: '🏆' });
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Synchronizing Registry...</p>
    </div>
  );

  if (errorMsg) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
       <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center border border-red-100">
          <AlertTriangle size={40} />
       </div>
       <h3 className="text-xl font-black text-brand-dark">Review Access Error</h3>
       <p className="text-sm font-bold text-brand-muted uppercase tracking-widest">{errorMsg}</p>
       <button onClick={() => navigate(-1)} className="btn-secondary">Return to Board</button>
    </div>
  );

  const totalScore = (Number(scores.innovation) + Number(scores.impact) + Number(scores.technical)) / 3;
  const isComplete = true; // Feedback is optional per spec
  
  // Requirement: Scores hidden until announcement (completed)
  const showEvaluationsForParticipant = user?.systemRole === 'participant' && submission?.hackathonId?.isCompleted;
  const showEvaluationsForAdmin = user?.systemRole === 'admin';
  const showEvaluationsForJudge = user?.systemRole === 'judge';

  const handleAddComment = async (e) => {
    e.preventDefault();
    const text = e.target.comment.value;
    if (!text.trim()) return;
    try {
      await API.post(`submissions/${submissionId}/comment`, { text });
      toast.success('Comment sent to registry.');
      e.target.reset();
      // Reload submission to show new comment
      const subRes = await API.get(`submissions/${submissionId}`);
      setSubmission(subRes.data.data);
    } catch (err) { toast.error('Comment failed.'); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-8 space-y-4">
      {/* Navigation */}
      <nav className="py-2">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-4 text-[10px] font-black text-brand-muted hover:text-brand-primary uppercase tracking-[0.2em] transition-all"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Registry Board
        </button>
      </nav>

      {/* 1. PROJECT DETAILS SECTION */}
      <section className="bg-white border border-brand-border rounded-[2.5rem] shadow-sm overflow-hidden min-h-[400px] flex flex-col">
         <div className="p-8 md:p-12 space-y-4 flex-1">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
               <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-brand-primary/5 border border-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary font-black text-3xl shadow-inner uppercase">
                     {submission?.projectTitle?.charAt(0) || 'P'}
                  </div>
                  <div className="space-y-4">
                     <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-dark tracking-tighter">{submission?.projectTitle || 'Loading Project...'}</h1>
                     <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-4 px-3 py-1 bg-slate-100 rounded-full">
                           <User size={12} className="text-brand-muted" />
                           <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest">
                               {submission?.userId?.name || 'Anonymous Submitter'}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">
                           {submission?.hackathonId?.title || 'Hackathon Track'}
                        </span>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  submission?.status === 'reviewed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {submission?.status === 'reviewed' ? 'Evaluation Recorded' : 'Pending Review'}
                </div>
             </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 pt-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] flex items-center gap-4">
                     <Layout size={16} className="text-brand-primary" /> Project Brief & Value Proposition
                  </label>
                  <div className="bg-slate-50 border border-brand-border rounded-[2rem] p-8 text-base font-bold text-brand-dark leading-relaxed italic shadow-inner">
                     "{submission?.description || submission?.projectDescription || 'No detailed brief committed to this registry entry.'}"
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] flex items-center gap-4">
                     <Globe size={16} className="text-brand-primary" /> Interactive Deliverables
                  </label>
                  <div className="flex flex-col md:flex-row gap-4">
                     <a href={submission?.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-between p-6 bg-white border border-brand-border rounded-2xl hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all group shadow-sm">
                        <div className="flex items-center gap-4">
                           <Github size={24} className="text-brand-primary" />
                           <div>
                              <span className="block text-[10px] font-black text-brand-dark uppercase tracking-widest">Source Code</span>
                              <span className="text-[10px] font-bold text-brand-muted">GitHub Repository</span>
                           </div>
                        </div>
                        <ExternalLink size={18} className="text-brand-muted group-hover:text-brand-primary" />
                     </a>
                     {submission?.demoLink && (
                       <a href={submission?.demoLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-between p-6 bg-white border border-brand-border rounded-2xl hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all group shadow-sm">
                          <div className="flex items-center gap-4">
                             <Globe size={24} className="text-brand-primary" />
                             <div>
                                <span className="block text-[10px] font-black text-brand-dark uppercase tracking-widest">Live Sandbox</span>
                                <span className="text-[10px] font-bold text-brand-muted">Deployment/Demo</span>
                             </div>
                          </div>
                          <ExternalLink size={18} className="text-brand-muted group-hover:text-brand-primary" />
                       </a>
                     )}
                  </div>
               </div>
            </div>
         </div>

          {user?.systemRole === 'judge' && !showScoreForm && (
            <div className="p-6 sm:p-8 bg-slate-50 border-t border-brand-border flex justify-center">
              <button 
                onClick={() => setShowScoreForm(true)}
                className="btn-primary w-full sm:w-auto !px-10 sm:!px-16 !py-4 sm:!py-5 flex items-center justify-center gap-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20 hover:scale-[1.05] transition-transform"
              >
                 <Zap size={18} /> {isEdit ? 'Edit Evaluation' : 'Evaluate This Project'}
              </button>
            </div>
          )}
      </section>

      {/* 2. SCORING SECTION (Hidden/Shown based on rules) */}
      <AnimatePresence>
        {(showEvaluationsForAdmin || (showScoreForm && user?.systemRole === 'judge') || (showEvaluationsForParticipant && submission?.userId?._id === user?.id)) && (
          <motion.form 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit} 
            className="bg-white border border-brand-border rounded-[2.5rem] shadow-xl overflow-hidden relative"
          >
             <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary via-indigo-500 to-brand-primary" />
             
             <div className={`p-6 md:p-8 space-y-4 ${user?.systemRole !== 'judge' ? 'pb-2' : 'pb-8'}`}>
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-brand-border pb-8 gap-4">
                   <div className="space-y-4 text-center sm:text-left">
                      <h2 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight italic">
                        {user?.systemRole === 'admin' ? 'Cumulative Judicial Index' : 
                         user?.systemRole === 'participant' ? 'Official Merits Unlocked' :
                         `Score: ${submission?.projectTitle}`}
                      </h2>
                      <p className="text-[10px] sm:text-xs font-bold text-brand-muted uppercase tracking-widest flex items-center justify-center sm:justify-start gap-4">
                         {user?.systemRole === 'admin' ? 'Combined Reviewer Data' : 
                          user?.systemRole === 'participant' ? 'Review feedback is now available for your review.' :
                          <>Assessing participant: <span className="text-brand-primary">{submission?.userId?.name}</span></>}
                      </p>
                   </div>
                   <div className="bg-slate-900 rounded-2xl px-6 py-4 text-white text-center min-w-[120px] w-full sm:w-auto">
                      <p className="text-[8px] font-black uppercase tracking-widest text-brand-primary mb-1">{user?.systemRole === 'judge' ? 'Live Index' : 'Final Aggregate'}</p>
                      <span className="text-2xl font-black tabular-nums">{totalScore.toFixed(1)}</span>
                   </div>
                </div>

                <div className="space-y-4">
                   {[
                     { id: 'innovation', label: 'Conceptual Novelty', icon: <Cpu size={20} />, color: 'text-rose-500', desc: 'Is the solution creatively engineered and technically unique?' },
                     { id: 'impact', label: 'Strategic Impact', icon: <Target size={20} />, color: 'text-brand-primary', desc: 'Organizational value, potential for implementation, and scalability.' },
                     { id: 'technical', label: 'Technical Execution', icon: <Zap size={20} />, color: 'text-amber-500', desc: 'Engineering execution, code stability, and system architecture.' }
                   ].map((metric) => (
                     <div key={metric.id} className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                           <div className="max-w-xl">
                              <label className="text-sm font-black text-brand-dark uppercase tracking-[0.15em] flex items-center gap-4">
                                 <span className={metric.color}>{metric.icon}</span> {metric.label}
                              </label>
                              {user?.systemRole === 'judge' && <p className="text-[11px] sm:text-xs text-brand-muted mt-2 font-bold leading-relaxed">{metric.desc}</p>}
                           </div>
                           <div className="w-16 h-12 flex items-center justify-center bg-brand-bg border border-brand-border rounded-xl text-xl font-black text-brand-primary shadow-inner shrink-0 self-start sm:self-auto">
                              {scores[metric.id]}
                           </div>
                        </div>
                        {user?.systemRole === 'judge' && (
                          <input 
                            type="range" 
                            min="1" 
                            max="10" 
                            step="1"
                            className="w-full h-2 bg-brand-bg rounded-lg appearance-none cursor-pointer accent-brand-primary shadow-inner"
                            disabled={submission?.hackathonId?.isCompleted}
                            value={scores[metric.id]}
                            onChange={(e) => setScores({ ...scores, [metric.id]: e.target.value })}
                          />
                        )}
                        {user?.systemRole === 'judge' && (
                          <div className="flex justify-between text-[10px] font-black text-brand-muted uppercase tracking-[0.3em] px-2">
                             <span>Base</span>
                             <span>Qualified</span>
                             <span>Exceptional</span>
                          </div>
                        )}
                     </div>
                   ))}
                </div>

                <div className="space-y-4 pt-10 border-t border-brand-border">
                   <label className="text-xs font-black text-brand-dark uppercase tracking-widest flex items-center gap-4">
                      <BarChart3 size={18} className="text-brand-primary" /> {user?.systemRole === 'judge' ? 'Judged Feedback' : 'Audit Observations'}
                   </label>
                   <textarea 
                     rows={user?.systemRole !== 'judge' ? 2 : 6}
                     className={`w-full bg-brand-bg/50 border border-brand-border rounded-[2rem] px-10 text-base font-bold text-brand-dark transition-all outline-none focus:bg-white focus:border-brand-primary focus:ring-8 focus:ring-brand-primary/5 resize-none shadow-inner ${user?.systemRole !== 'judge' ? 'py-4' : 'py-8'}`}
                     placeholder={user?.systemRole === 'judge' ? "Document your technical observations..." : "Administrative summary."}
                     disabled={user?.systemRole !== 'judge' || submission?.hackathonId?.isCompleted}
                     value={feedback}
                     onChange={(e) => setFeedback(e.target.value)}
                   />
                </div>

                   {user?.systemRole === 'judge' && !submission?.hackathonId?.isCompleted && (
                     <div className="pt-10 flex flex-col items-center sm:items-stretch lg:flex-row justify-end gap-4">
                       <button 
                         type="submit" 
                         disabled={!isComplete || submitting}
                         className={`h-16 px-8 sm:px-16 rounded-[2rem] flex items-center gap-4 font-black uppercase tracking-[0.25em] text-[10px] sm:text-xs transition-all duration-300 shadow-2xl w-full sm:min-w-[320px] justify-center ${
                           (!isComplete || submitting) 
                           ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                           : 'bg-brand-primary text-white hover:bg-brand-primary/95 hover:shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98]'
                         }`}
                       >
                         {submitting ? (
                            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                         ) : (
                            <>
                               <Zap size={18} /> 
                               <span>{isEdit ? 'Commit Refinements' : 'Submit Score'}</span>
                               <ChevronRight size={18} />
                            </>
                         )}
                       </button>
                     </div>
                   )}
             </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* 3. COMMUNITY COMMENTS SECTION */}
      <section className="bg-white border border-brand-border rounded-[2.5rem] shadow-sm overflow-hidden p-8 md:p-12 space-y-10">
         <div className="flex items-center justify-between border-b border-brand-border pb-6">
            <h2 className="text-xl font-black text-brand-dark tracking-tight flex items-center gap-4">
               <MessageSquare size={24} className="text-brand-primary" /> Community Dialogue
            </h2>
            <div className="text-[10px] font-black text-brand-muted uppercase tracking-widest">{submission?.comments?.length || 0} Records</div>
         </div>

         <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {submission?.comments?.length === 0 ? (
               <div className="py-20 text-center italic text-brand-muted text-xs font-bold uppercase tracking-widest">
                  No comments yet.
               </div>
            ) : (
               submission?.comments?.map((comment, i) => (
                  <div key={i} className="flex gap-4 group">
                     <div className="w-10 h-10 rounded-xl bg-brand-bg border border-brand-border flex items-center justify-center text-brand-primary font-black shrink-0">
                        {comment.userName?.charAt(0)}
                     </div>
                     <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-4">
                           <span className="text-[11px] font-black text-brand-dark uppercase tracking-widest">{comment.userName}</span>
                           <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString('en-GB')}</span>
                        </div>
                        <div className="bg-white border border-brand-border p-4 rounded-2xl rounded-tl-none shadow-sm text-sm font-medium text-brand-dark group-hover:border-brand-primary/20 transition-all">
                           {comment.text}
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>

         <form onSubmit={handleAddComment} className="pt-8 border-t border-brand-border space-y-4">
            <div className="relative">
               <textarea 
                  name="comment"
                  required
                   placeholder="Collaborate on this project. Add your thoughts to the registry..."
                   className="w-full bg-brand-bg border border-brand-border rounded-3xl p-6 text-sm font-medium text-brand-dark outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all resize-none shadow-inner"
                  rows="3"
               />
            </div>
            <div className="flex justify-end">
               <button 
                  type="submit"
                  className="btn-primary !py-3 !px-10 !text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/20 flex items-center gap-4 group"
               >
                  <span>Send</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
         </form>
      </section>
    </div>
  );
};

export default EvaluationForm;
