import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosInstance';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  LogOut, 
  ChevronRight,
  User as UserIcon,
  Bell,
  Search,
  User,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    email: user?.email || '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.put('auth/updatedetails', formData);
      if (res.data.success) {
        onUpdate(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-brand-border"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Edit Profile</h2>
            <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest mt-0.5">Identity Configuration</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-brand-danger/5 border border-brand-danger/20 rounded-xl mb-6 flex items-center gap-3 text-brand-danger text-sm font-bold">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <label className="label-enterprise">Full Name</label>
            <input 
              type="text" 
              required 
              className="input-enterprise" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label className="label-enterprise">Email Address</label>
            <input 
              type="email" 
              required 
              className="input-enterprise" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 btn-secondary !py-3 font-black text-xs uppercase"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 btn-primary !py-3 font-black text-xs uppercase"
            >
              {loading ? 'Discarding...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const MainLayout = () => {
  const { user, logout, updateUser } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Do you want to logout?')) {
      await logout();
      navigate('/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    ...(user?.role === 'admin' ? [
      { name: 'User Management', path: '/admin/users', icon: <Users size={18} /> }
    ] : [])
  ];

  return (
    <div className="flex min-h-screen bg-brand-bg text-brand-text-primary">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-brand-border flex flex-col z-30">
        <div className="h-16 flex items-center px-6 border-b border-brand-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="text-lg font-bold tracking-tight">Athiva Registry</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="text-[11px] font-semibold text-brand-secondary uppercase tracking-wider px-3 mb-2">
            Main Menu
          </div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'sidebar-link-active' : ''}`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-brand-section flex items-center justify-center text-brand-primary font-bold border border-brand-border">
              {user?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-[11px] text-brand-secondary truncate uppercase font-bold tracking-wide">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium text-brand-danger hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-brand-border flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary" size={16} />
              <input 
                type="text" 
                placeholder="Search for events..." 
                className="w-full bg-brand-section border border-transparent rounded-md py-2 pl-10 pr-4 text-sm focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-brand-secondary hover:text-brand-primary hover:bg-brand-bg rounded-md transition-all">
              <Bell size={18} />
            </button>
            <div className="h-6 w-[1px] bg-brand-border mx-1" />
            <button 
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-3 pl-1 hover:opacity-80 transition-opacity"
            >
              <span className="text-sm font-medium hidden md:block">{user?.name}</span>
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs ring-2 ring-brand-bg">
                {user?.name?.charAt(0)}
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-8 max-w-6xl">
          <Outlet />
        </main>
      </div>
      <EditProfileModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        user={user}
        onUpdate={(newData) => updateUser(newData)}
      />
    </div>
  );
};


export default MainLayout;
