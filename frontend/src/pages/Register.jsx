import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'participant' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await register(formData);
    if (result.success) navigate('/login');
    else setError(result.message);
    setIsLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div className="mesh-glow" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="athiva-card w-full max-w-md" 
        style={{ padding: '48px', position: 'relative', zIndex: 10, backgroundColor: 'rgba(15,15,15,0.8)', backdropFilter: 'blur(10px)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#A3FF12', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', transform: 'rotate(-10deg)', boxShadow: '0 0 30px rgba(163,255,18,0.3)' }}>
            <div style={{ width: '28px', height: '28px', border: '4px solid black', borderRightColor: 'transparent', borderRadius: '50%', transform: 'rotate(45deg)' }} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em', color: 'white', marginBottom: '12px' }}>Join the Network.</h1>
          <p style={{ color: '#666', fontWeight: 500 }}>Create your company account</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '13px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
              <input type="text" required className="athiva-input" style={{ paddingLeft: '52px' }} placeholder="Jane Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>Work Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
              <input type="email" required className="athiva-input" style={{ paddingLeft: '52px' }} placeholder="name@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', width: '20px', height: '20px' }} />
              <input type={showPassword ? 'text' : 'password'} required className="athiva-input" style={{ paddingLeft: '52px' }} placeholder="Must be secure" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#B3B3B3', marginBottom: '10px', marginLeft: '4px' }}>Joining As</label>
            <select className="athiva-input" style={{ appearance: 'none', cursor: 'pointer' }} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="participant">Participant</option>
              <option value="judge">Judge</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading} className="athiva-button" style={{ width: '100%', padding: '16px', justifyContent: 'center' }}>
            {isLoading ? 'Creating Account...' : 'Enroll in Portal'} <ArrowRight size={20} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: '#666', fontWeight: 500 }}>
          Already signed up? <Link to="/login" style={{ color: 'white', fontWeight: 900, textDecoration: 'none' }}>Access Here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
