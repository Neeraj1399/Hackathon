import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-primary text-white rounded-lg flex items-center justify-center mx-auto text-xl font-bold shadow-lg shadow-brand-primary/20">
            A
          </div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Welcome Back</h1>
          <p className="text-sm text-brand-text-secondary font-medium">Access your hackathon dashboard</p>
        </div>

        <div className="bg-white border border-brand-border rounded-lg p-8 shadow-sm">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-md text-brand-danger text-xs font-medium mb-6 flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="label-enterprise">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" size={16} />
                <input 
                  type="email" 
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
                <label className="label-enterprise !mb-0">Security Key</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-semibold text-brand-primary hover:text-blue-700 transition-colors">Forgot key?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" size={16} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
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
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full btn-primary !py-3 font-bold uppercase tracking-widest text-xs flex justify-center items-center gap-2"
              >
                {isLoading ? 'Verifying...' : 'Sign In'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-brand-text-secondary font-medium">
            New to the platform? <Link to="/register" className="text-brand-text-primary font-bold hover:text-brand-primary transition-colors">Create Hub Account</Link>
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
