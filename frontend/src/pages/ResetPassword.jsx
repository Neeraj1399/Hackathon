import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      await API.post(`auth/reset-password/${token}`, { password });
      setMessage('Password updated successfully.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed.');
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
          <h1 className="text-2xl font-bold text-brand-text-primary">New Password</h1>
          <p className="text-sm text-brand-text-secondary font-medium">Create a new secure key</p>
        </div>

        <div className="bg-white border border-brand-border rounded-lg p-8 shadow-sm">
          {message && (
            <div className="text-center py-4 space-y-4">
               <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100">
                  <CheckCircle size={24} />
               </div>
               <p className="text-sm font-bold text-brand-text-primary">{message}</p>
               <p className="text-xs text-brand-text-secondary">Redirecting to sign in...</p>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-md text-brand-danger text-sm font-medium flex items-center gap-2 mb-6">
               <AlertCircle size={16} /> {error}
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="label-enterprise">New Security Key</label>
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
                  className="w-full btn-primary !py-3 font-bold uppercase tracking-widest text-xs"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-brand-border text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-brand-text-primary font-bold hover:text-brand-primary transition-colors text-xs uppercase tracking-wider">
               <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
