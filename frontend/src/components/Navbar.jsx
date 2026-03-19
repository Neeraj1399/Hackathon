import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ArrowUpRight, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <>
      <nav style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid #1A1A1A', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#A3FF12', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-10deg)', boxShadow: '0 0 20px rgba(163,255,18,0.2)' }}>
            <div style={{ width: '18px', height: '18px', border: '3px solid black', borderRightColor: 'transparent', borderRadius: '50%', transform: 'rotate(45deg)' }} />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>Athiva <span style={{ color: '#A3FF12' }}>Hack.</span></div>
        </Link>

        {/* Desktop Center Links */}
        <div className="nav-center-links" style={{ display: 'flex', gap: '32px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Link to="/dashboard" style={{ fontSize: '14px', fontWeight: 600, color: '#B3B3B3', textDecoration: 'none', transition: 'color 0.2s' }}>Events</Link>
          {user?.role === 'admin' && (
            <Link to="/admin/users" style={{ fontSize: '14px', fontWeight: 600, color: '#B3B3B3', textDecoration: 'none', transition: 'color 0.2s' }}>Users</Link>
          )}
          {user?.role === 'judge' && (
            <Link to="/judge/join" style={{ fontSize: '14px', fontWeight: 600, color: '#B3B3B3', textDecoration: 'none', transition: 'color 0.2s' }}>Join Judging</Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="nav-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="nav-user-details" style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '12px', borderRight: '1px solid #1A1A1A' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>{user?.name}</div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#666666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.role}</div>
            </div>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#1A1A1A', border: '1px solid #333333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#A3FF12' }}>
              {user?.name?.charAt(0)}
            </div>
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#666666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
            Sign Out <LogOut style={{ width: '16px', height: '16px' }} />
          </button>
          <Link to="/dashboard" className="athiva-button" style={{ padding: '8px 20px', fontSize: '13px' }}>
            Join Event <ArrowUpRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none', background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '8px', alignItems: 'center', justifyContent: 'center' }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Fullscreen Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={28} />
          </button>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#A3FF12', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{user?.name} · {user?.role}</div>
          <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Events</Link>
          {user?.role === 'admin' && (
            <Link to="/admin/users" onClick={() => setMobileOpen(false)}>Admin Console</Link>
          )}
          <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Join Event</Link>
          <button onClick={handleLogout} style={{ color: '#EF4444' }}>Sign Out</button>
        </div>
      )}
    </>
  );
};

export default Navbar;
