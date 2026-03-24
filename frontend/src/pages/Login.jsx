import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password);
    if (result.success) {
      toast.success('Login successful.', { icon: '🔐' });
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login failed.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-brand-primary text-white rounded-lg flex items-center justify-center mx-auto text-xl font-bold shadow-lg shadow-brand-primary/20">
            A
          </div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Welcome Back</h1>
          <p className="text-sm text-brand-text-secondary font-medium">Access your hackathon dashboard</p>
        </div>

        <div className="bg-white border border-brand-border rounded-lg p-8 shadow-sm">

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <label className="label-enterprise !mb-0">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-semibold text-brand-primary hover:text-blue-700 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" size={16} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  autoComplete="current-password"
                  required 
                  className="input-enterprise pl-10 pr-10" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
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

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full btn-primary !py-3 font-bold uppercase tracking-widest text-xs flex justify-center items-center gap-4"
              >
                {isLoading ? 'Verifying...' : 'Sign In'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-brand-text-secondary font-medium">
            New to the platform? <Link to="/register" className="text-brand-text-primary font-bold hover:text-brand-primary transition-colors">Create Account</Link>
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

export default Login;
