import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Check } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="athiva-card"
          style={{ width: '100%', maxWidth: '440px', padding: '40px', border: '1px solid #1F1F1F', boxShadow: '0 24px 48px -12px rgba(163,255,18,0.1)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: type === 'warning' ? 'rgba(163,255,18,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${type === 'warning' ? 'rgba(163,255,18,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={24} color={type === 'warning' ? '#A3FF12' : '#EF4444'} />
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer' }} className="hover:text-white">
              <X size={20} />
            </button>
          </div>

          <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'white', marginBottom: '12px', letterSpacing: '-0.03em' }}>{title}</h3>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6, fontWeight: 500, marginBottom: '32px' }}>{message}</p>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={onClose} className="athiva-button-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button onClick={onConfirm} className="athiva-button" style={{ flex: 1, justifyContent: 'center' }}>
              Confirm <Check size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
