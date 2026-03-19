import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import { Mail, ArrowLeft, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMessage(res.data.message); // This will now be the "admin approval" message
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div className="mesh-glow" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="athiva-card responsive-card-padding w-full max-w-md" style={{ padding: '48px', position: 'relative', zIndex: 10, backgroundColor: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(10px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#A3FF12', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', transform: 'rotate(-5deg)' }}>
            <ShieldCheck size={28} color="black" />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em', color: 'white', marginBottom: '12px' }}>Access Recovery.</h1>
          <p style={{ color: '#666', fontWeight: 500 }}>Identify yourself to reset your credentials</p>
        </div>

        {message ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(163,255,18,0.05)', border: '1px solid rgba(163,255,18,0.2)', borderRadius: '20px', color: '#A3FF12' }}>
            <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '24px' }}>{message}</p>
            <Link to="/login" className="athiva-button" style={{ width: '100%', justifyContent: 'center' }}>Return to Portal</Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '13px', fontWeight: 600 }}>{error}</div>
            )}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
                <input type="email" required className="athiva-input" style={{ paddingLeft: '52px' }} placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="athiva-button" style={{ width: '100%', padding: '16px', justifyContent: 'center', marginBottom: '24px' }}>
              {isLoading ? 'Processing...' : 'Request Recovery Signal'}
            </button>
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#666', textDecoration: 'none', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
