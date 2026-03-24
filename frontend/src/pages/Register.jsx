import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axiosInstance';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Briefcase, Award } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '', position: '', systemRole: 'participant' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await API.post('auth/register', formData);
      toast.success('Account created successfully.', { icon: '👤' });
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access enrollment failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-brand-primary text-white rounded-lg flex items-center justify-center mx-auto text-xl font-bold shadow-lg shadow-brand-primary/20">
            A
          </div>
          <h1 className="text-2xl font-bold text-brand-text-primary uppercase tracking-tight">Create Account</h1>
          <p className="text-sm text-brand-text-secondary font-medium">Join the internal hackathon ecosystem</p>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-8 shadow-sm">

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex p-1.5 bg-brand-bg border border-brand-border rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, systemRole: 'participant' })}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  formData.systemRole === 'participant' ? 'bg-white shadow-sm text-brand-primary' : 'text-brand-muted hover:text-brand-dark'
                }`}
              >
                Participant User
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, systemRole: 'judge' })}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  formData.systemRole === 'judge' ? 'bg-white shadow-sm text-brand-primary' : 'text-brand-muted hover:text-brand-dark'
                }`}
              >
                Review Judge
              </button>
            </div>

            <div className="form-group">
              <label className="label-enterprise">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" size={16} />
                <input 
                  type="text" 
                  name="name"
                  autoComplete="name"
                  required 
                  className="input-enterprise pl-10" 
                  placeholder="John Doe" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label-enterprise">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" size={16} />
                <input 
                  type="email" 
                  name="email"
                  autoComplete="email"
                  required 
                  className="input-enterprise pl-10" 
                  placeholder="name@company.com" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
              </div>
            </div>



            <div className="form-group">
              <label className="label-enterprise">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" size={16} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  autoComplete="off"
                  required 
                  className="input-enterprise pl-10 pr-10" 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-secondary hover:text-brand-text-primary p-1 transition-colors"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-border">
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full btn-primary !py-3.5 font-black uppercase tracking-[0.15em] text-xs shadow-lg shadow-brand-primary/20"
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-brand-text-secondary font-bold">
            Acknowledged? <Link to="/login" className="text-brand-primary font-black hover:underline transition-all">Login</Link>
          </p>
        </div>

        <div className="text-center">
           <p className="text-[10px] font-black text-brand-text-secondary/30 uppercase tracking-[0.2em]">
             Athiva Registry Security &bull; SSL TLS 1.3
           </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
