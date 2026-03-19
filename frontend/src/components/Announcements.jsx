import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { Megaphone, Trash2, Plus } from 'lucide-react';

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
      fetchAnnouncements();
    } catch (err) {
      alert('Error creating announcement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await API.delete(`announcements/${id}`);
        fetchAnnouncements();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Megaphone className="text-indigo-500" /> Announcements
        </h2>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition flex items-center gap-1"
          >
            {showForm ? 'Cancel' : <><Plus size={14} /> New</>}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-900 p-6 rounded-xl border border-gray-800">
          <input
            type="text"
            placeholder="Announcement Title"
            className="w-full bg-black border border-gray-700 text-white px-4 py-2 rounded mb-4 focus:ring-1 focus:ring-indigo-500"
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Message..."
            className="w-full bg-black border border-gray-700 text-white px-4 py-2 rounded mb-4 focus:ring-1 focus:ring-indigo-500"
            rows="3"
            value={newAnnouncement.message}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
            required
          ></textarea>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">
            Post Announcement
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : announcements.length === 0 ? (
        <p className="text-gray-500 italic">No announcements yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a._id} className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex justify-between items-start">
              <div>
                <h3 className="text-indigo-400 font-bold mb-1">{a.title}</h3>
                <p className="text-gray-400 text-sm whitespace-pre-wrap">{a.message}</p>
                <span className="text-[10px] text-gray-600 mt-2 block italic">
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </div>
              {user?.role === 'admin' && (
                <button onClick={() => handleDelete(a._id)} className="text-gray-600 hover:text-red-500 transition">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Announcements;
