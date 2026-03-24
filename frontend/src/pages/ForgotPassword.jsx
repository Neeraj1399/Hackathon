import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      await API.post('auth/forgot-password', { email });
      setMessage('Recovery request sent. Check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Recovery request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-brand-primary text-white rounded-lg flex items-center justify-center mx-auto text-xl font-bold shadow-lg shadow-brand-primary/20">
            A
          </div>
          <h1 className="text-2xl font-bold text-brand-text-primary">Reset Password</h1>
          <p className="text-sm text-brand-text-secondary font-medium">Recover your account access</p>
        </div>

        <div className="bg-white border border-brand-border rounded-lg p-8 shadow-sm">
          {message && (
            <div className="p-4 bg-green-50 border border-green-100 rounded-md text-green-700 text-sm font-medium flex items-center gap-4 mb-6">
               <CheckCircle size={16} /> {message}
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-md text-brand-danger text-sm font-medium flex items-center gap-4 mb-6">
               <AlertCircle size={16} /> {error}
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-brand-text-secondary text-xs font-medium leading-relaxed">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <div className="form-group">
                <label className="label-enterprise">Email</label>
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

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full btn-primary !py-3 font-bold uppercase tracking-widest text-xs"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-brand-border text-center">
            <Link to="/login" className="inline-flex items-center gap-4 text-brand-text-primary font-bold hover:text-brand-primary transition-colors text-xs uppercase tracking-wider">
               <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
