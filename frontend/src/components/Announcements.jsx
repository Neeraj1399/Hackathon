import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../api/axiosInstance';
import { Megaphone, Trash2, Plus, X, Bell, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Announcements = ({ user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '' });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get('announcements');
      setAnnouncements(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('announcements', newAnnouncement);
      setNewAnnouncement({ title: '', message: '' });
      setShowForm(false);
      toast.success('Broadcast successfully deployed to the registry.', { icon: '📣' });
      fetchAnnouncements();
    } catch (err) {
      toast.error('Registry broadcast failed.');
    }
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-1 text-sm font-bold text-brand-dark">
        <p>Strike this announcement from the registry?</p>
        <div className="flex justify-end gap-4 mt-2">
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-black text-brand-muted hover:bg-slate-100 rounded-md transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await API.delete(`announcements/${id}`);
                toast.success('Announcement deleted.');
                fetchAnnouncements();
              } catch (err) {
                toast.error('Deletion failed.');
              }
            }} 
            className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-black bg-brand-danger text-white hover:bg-red-700 rounded-md transition-all shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    ), { duration: Infinity, style: { minWidth: '300px' } });
  };

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-border">
        <h2 className="text-xl font-bold text-brand-dark flex items-center gap-4">
          <Bell className="text-brand-primary" size={20} /> Corporate Broadcasts
        </h2>
        {user?.systemRole === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`btn-primary !py-1.5 !px-4 !text-xs flex items-center gap-4 transition-all ${showForm ? '!bg-brand-danger shadow-brand-danger/20' : ''}`}
          >
            {showForm ? <><X size={14} /> Close</> : <><Plus size={14} /> New Entry</>}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <form onSubmit={handleSubmit} className="card-corp !bg-gray-50 border-brand-primary/10">
              <div className="space-y-4">
                <div>
                  <label className="label-corp">Broadcast Heading</label>
                  <input
                    type="text"
                    placeholder="e.g., Q4 Roadmap Update"
                    className="input-corp"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label-corp">Communication Details</label>
                  <textarea
                    placeholder="Provide essential updates for the ecosystem..."
                    className="input-corp resize-none"
                    rows="3"
                    value={newAnnouncement.message}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary w-full shadow-lg shadow-brand-primary/10">
                  Deploy Broadcast
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
           {[1, 2].map(i => <div key={i} className="h-24 bg-white border border-brand-border rounded-xl animate-pulse" />)}
        </div>
      ) : announcements.length === 0 ? (
        <div className="p-10 text-center bg-white border border-dashed border-brand-border rounded-xl">
           <p className="text-brand-secondary font-medium italic text-sm text-brand-muted/50">No active broadcasts in the current cycle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((a) => (
            <motion.div 
              key={a._id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-corp !p-6 relative group border-brand-border hover:border-brand-primary/20"
            >
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary">
                       <Bell size={16} />
                    </div>
                    <h3 className="text-sm font-black text-brand-dark uppercase tracking-tight line-clamp-1">{a.title}</h3>
                 </div>
                {user?.systemRole === 'admin' && (
                  <button 
                    onClick={() => handleDelete(a._id)} 
                    className="p-2 text-brand-muted hover:text-brand-danger transition-colors bg-brand-danger/5 rounded-lg border border-transparent hover:border-brand-danger/20"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <p className="text-brand-muted text-xs leading-relaxed font-medium mb-6 whitespace-pre-wrap line-clamp-4 italic">
                "{a.message}"
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-brand-border/60 text-[9px] font-black text-brand-secondary/40 uppercase tracking-[0.2em]">
                 <span className="flex items-center gap-4.5"><Calendar size={10} className="text-brand-primary/40" /> {new Date(a.createdAt).toLocaleDateString('en-GB')}</span>
                 <span className="flex items-center gap-4.5"><Clock size={10} className="text-brand-primary/40" /> {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </motion.div>
          ))}
        </div>

      )}
    </section>
  );
};

export default Announcements;
