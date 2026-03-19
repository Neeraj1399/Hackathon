import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div className="mesh-glow" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="athiva-card responsive-card-padding w-full max-w-md" 
        style={{ padding: '48px', position: 'relative', zIndex: 10, backgroundColor: 'rgba(15,15,15,0.8)', backdropFilter: 'blur(10px)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#A3FF12', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', transform: 'rotate(-10deg)', boxShadow: '0 0 30px rgba(163,255,18,0.3)' }}>
            <div style={{ width: '28px', height: '28px', border: '4px solid black', borderRightColor: 'transparent', borderRadius: '50%', transform: 'rotate(45deg)' }} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em', color: 'white', marginBottom: '12px' }}>Take Control.</h1>
          <p style={{ color: '#666', fontWeight: 500 }}>Athiva Identity Gateway</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '13px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>Work Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
              <input type="email" required className="athiva-input" style={{ paddingLeft: '52px' }} placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#B3B3B3', marginLeft: '4px' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '12px', fontWeight: 700, color: '#A3FF12', textDecoration: 'none' }}>Forgot?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
              <input type={showPassword ? 'text' : 'password'} required className="athiva-input" style={{ paddingLeft: '52px' }} placeholder="Your security key" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="athiva-button" style={{ width: '100%', padding: '16px', marginTop: '32px', justifyContent: 'center' }}>
            {isLoading ? 'Processing...' : 'Access Dashboard'} <ArrowRight size={20} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: '#666', fontWeight: 500 }}>
          New to the portal? <Link to="/register" style={{ color: 'white', fontWeight: 900, textDecoration: 'none' }}>Enroll Now</Link>
        </p>
      </motion.div>

      {/* Aesthetic Accents */}
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(163,255,18,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
    </div>
  );
};

export default Login;
