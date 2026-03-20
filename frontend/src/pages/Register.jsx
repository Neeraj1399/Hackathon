import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'participant' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await API.post('auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Access enrollment failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-primary text-white rounded-lg flex items-center justify-center mx-auto text-xl font-bold shadow-lg shadow-brand-primary/20">
            A
          </div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Create Account</h1>
          <p className="text-sm text-brand-text-secondary font-medium">Join the innovation network</p>
        </div>

        <div className="bg-white border border-brand-border rounded-lg p-8 shadow-sm">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-md text-brand-danger text-xs font-medium mb-6 flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="label-enterprise">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" size={16} />
                <input 
                  type="text" 
                  required 
                  className="input-enterprise pl-10" 
                  placeholder="John Doe" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label-enterprise">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" size={16} />
                <input 
                  type="email" 
                  required 
                  className="input-enterprise pl-10" 
                  placeholder="name@company.com" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label-enterprise">Primary Role</label>
              <select 
                className="input-enterprise bg-white cursor-pointer"
                value={formData.role} 
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="participant">Participant</option>
                <option value="judge">Judge</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label-enterprise">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" size={16} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
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
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full btn-primary !py-3 font-bold uppercase tracking-widest text-xs"
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-brand-text-secondary font-medium">
            Already have an account? <Link to="/login" className="text-brand-text-primary font-bold hover:text-brand-primary transition-colors">Sign In Instead</Link>
          </p>
        </div>

        <div className="text-center">
           <p className="text-[10px] font-bold text-brand-text-secondary/40 uppercase tracking-widest">
             Athiva Enterprise Security &bull; SSL Encrypted
           </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
