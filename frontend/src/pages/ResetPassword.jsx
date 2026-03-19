import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Mismatch in credential verification');
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      await API.put(`/auth/reset-password/${token}`, { password });
      setMessage('Security credentials updated successfully.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
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
            <Lock size={28} color="black" />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em', color: 'white', marginBottom: '12px' }}>New Credentials.</h1>
          <p style={{ color: '#666', fontWeight: 500 }}>Establish your new access keys</p>
        </div>

        {message ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '24px', backgroundColor: 'rgba(163,255,18,0.05)', border: '1px solid rgba(163,255,18,0.2)', borderRadius: '20px', color: '#A3FF12' }}>
            <CheckCircle size={40} style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', fontWeight: 800 }}>{message}</p>
            <p style={{ fontSize: '11px', color: '#666', fontWeight: 800, marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Re-routing to portal...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '13px', fontWeight: 600 }}>{error}</div>
            )}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>New Security Key</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
                <input type={showPassword ? 'text' : 'password'} required className="athiva-input" style={{ paddingLeft: '52px' }} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>Confirm Recovery Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
                <input type={showPassword ? 'text' : 'password'} required className="athiva-input" style={{ paddingLeft: '52px' }} placeholder="Repeat new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="athiva-button" style={{ width: '100%', padding: '16px', justifyContent: 'center' }}>
              {isLoading ? 'Updating...' : 'Set Credentials'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
