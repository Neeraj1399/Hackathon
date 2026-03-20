import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Check, Info, AlertTriangle, HelpCircle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) => {
  if (!isOpen) return null;

  const isDestructive = type === 'danger';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-dark/20 backdrop-blur-md"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-brand-border"
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                isDestructive ? 'bg-brand-danger/10 text-brand-danger' : 'bg-brand-primary/10 text-brand-primary'
              }`}>
                {isDestructive ? <AlertTriangle size={28} /> : <HelpCircle size={28} />}
              </div>
              <button onClick={onClose} className="p-2 text-brand-secondary hover:bg-gray-50 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <h3 className="text-2xl font-black text-brand-dark tracking-tight mb-3">{title}</h3>
            <p className="text-brand-muted text-sm font-medium leading-relaxed mb-10">
               {message}
            </p>

            <div className="flex gap-4">
              <button 
                onClick={onClose} 
                className="btn-secondary flex-1 py-3.5 !rounded-2xl"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm} 
                className={`flex-1 py-3.5 !rounded-2xl font-bold text-sm text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                  isDestructive 
                  ? 'bg-brand-danger hover:bg-brand-danger/90 shadow-brand-danger/20' 
                  : 'bg-brand-primary hover:bg-brand-primary/90 shadow-brand-primary/20'
                }`}
              >
                Confirm Action <Check size={18} />
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50/50 py-4 px-8 border-t border-brand-border flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary/30 animate-pulse" />
             <span className="text-[10px] font-black text-brand-secondary/40 uppercase tracking-widest italic">
                Authorized Operation Required
             </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
