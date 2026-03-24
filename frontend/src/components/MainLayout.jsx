import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import API from '../api/axiosInstance';
import { 
  LayoutDashboard, 
  FolderSearch,
  Users, 
  LogOut, 
  Bell,
  Search,
  User,
  X,
  Mail,
  Briefcase,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({ 
    name: user?.name || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ 
        name: user.name,
        email: user.email
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.put('auth/updatedetails', formData);
      if (res.data.success) {
        onUpdate(res.data.data);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-brand-border">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-brand-text-primary tracking-tight">My Profile</h2>
              <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mt-0.5">Edit Dossier Configurations</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20} /></button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] font-black flex items-center gap-4">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {success ? (
          <div className="py-12 text-center space-y-4">
             <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
               <CheckCircle size={32} />
             </div>
             <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">Registry Updated</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4.5 group focus-within:text-brand-primary">
              <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={16} />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-brand-dark transition-all outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/5"
                  required
                />
              </div>
            </div>

            <div className="space-y-4.5 group focus-within:text-brand-primary">
              <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={16} />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-brand-bg border border-brand-border rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-brand-dark transition-all outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/5"
                  required
                />
              </div>
            </div>



            <div className="flex gap-4 pt-6 border-t border-brand-border">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 btn-primary !py-3.5 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-brand-primary/20"
              >
                {loading ? 'Encrypting...' : 'Commit Changes'}
              </button>
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 btn-secondary !py-3.5 font-black uppercase text-[10px] tracking-widest text-brand-muted"
              >
                Discard
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const MainLayout = () => {
  const { user, logout, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    toast.success('Logged out successfully', { icon: '🔒' });
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Browse Projects', path: '/projects', icon: <FolderSearch size={18} /> },
    ...(user?.systemRole === 'admin' ? [
      { name: 'Users List', path: '/admin/users', icon: <Users size={18} /> }
    ] : [])
  ];

  return (
    <div className="flex min-h-screen bg-brand-bg text-brand-text-primary">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-brand-border flex flex-col z-30 shadow-sm transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-brand-border bg-white shrink-0">
          <div className="flex items-center gap-4.5">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black text-lg shadow-brand-primary/20 shadow-lg">
              A
            </div>
            <span className="text-lg font-black tracking-tight text-brand-dark">Athiva</span>
          </div>
          <button 
            className="md:hidden p-2 text-brand-muted hover:bg-slate-50 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-4.5">
          <div className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] px-3 mb-4">
            Main Menu
          </div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`sidebar-link flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                location.pathname === item.path 
                ? 'bg-brand-primary/5 text-brand-primary border border-brand-primary/10' 
                : 'text-brand-muted hover:bg-slate-50 hover:text-brand-dark'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-xs uppercase tracking-widest">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-brand-border bg-slate-50/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-4 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-danger bg-red-50/50 hover:bg-red-50 border border-red-100 transition-all hover:shadow-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-brand-border flex items-center justify-between px-4 sm:px-10 sticky top-0 z-10 w-full">
          <div className="flex items-center gap-4 sm:gap-4 flex-1">
            <button 
              className="md:hidden p-2 -ml-2 text-brand-dark hover:bg-slate-50 rounded-xl transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="relative w-full max-w-md group max-h-10 hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-brand-primary transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search for registry entries..." 
                className="w-full bg-slate-50/80 border border-transparent rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold focus:bg-white focus:border-brand-primary/20 focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 text-brand-muted hover:text-brand-primary hover:bg-brand-bg rounded-xl transition-all border border-transparent hover:border-brand-border">
              <Bell size={20} />
            </button>
            <div className="h-6 w-[1px] bg-brand-border" />
            
            <div 
              onClick={() => setIsProfileOpen(true)}
              className="group flex items-center gap-4 pr-2 py-1.5 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-brand-border px-3"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black text-brand-dark leading-tight group-hover:text-brand-primary transition-colors">{user?.name}</p>
                <p className="text-[9px] font-black text-brand-muted uppercase tracking-widest">{user?.systemRole || 'Unauthorized'}</p>
              </div>
              <div className="w-10 h-10 bg-white border border-brand-border rounded-xl flex items-center justify-center text-brand-primary text-sm font-black shadow-inner group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-4 sm:p-10 overflow-x-hidden w-full">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>

        <footer className="mt-auto py-6 sm:py-8 px-4 sm:px-10 border-t border-brand-border bg-white flex items-center justify-center">
          <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] text-center leading-relaxed">
            &copy; {new Date().getFullYear()} Athiva Technology. All rights reserved.
          </p>
        </footer>
      </div>

      <EditProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user} 
        onUpdate={updateUser} 
      />
    </div>
  );
};

export default MainLayout;
