import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import { Trophy, Award, Medal, ArrowLeft, Users, BarChart3 } from 'lucide-react';

const Leaderboard = () => {
  const { hackathonId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const [leaderRes, hackRes] = await Promise.all([
          API.get(`evaluations/leaderboard/${hackathonId}`),
          API.get(`hackathons/${hackathonId}`)
        ]);
        setLeaderboard(leaderRes.data.data);
        setHackathon(hackRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [hackathonId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-brand-text-secondary">Calculating rankings...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-xs font-bold text-brand-text-secondary hover:text-brand-primary uppercase tracking-widest mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-xl font-bold text-brand-text-primary">Innovation Leaderboard</h1>
          <p className="text-sm text-brand-text-secondary mt-1">
            Real-time rankings for <span className="text-brand-primary font-semibold">{hackathon?.title}</span> entries.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-brand-primary text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-wider">
           <Trophy size={14} /> Global Standing
        </div>
      </header>

      {/* Podium */}
      {leaderboard.length >= 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-12">
           {/* 2nd */}
           {leaderboard[1] && (
             <div className="bg-white border border-brand-border p-6 rounded-lg shadow-sm text-center md:order-1 h-fit">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 border border-slate-200">
                   <Medal size={20} />
                </div>
                <div className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest mb-1">Rank 02</div>
                <div className="text-sm font-bold text-brand-text-primary truncate">{leaderboard[1].participantName}</div>
                <div className="text-lg font-black text-brand-primary mt-2">{leaderboard[1].averageScore.toFixed(1)}</div>
             </div>
           )}

           {/* 1st */}
           <div className="bg-white border-2 border-brand-primary p-8 rounded-lg shadow-lg shadow-brand-primary/5 text-center md:order-2 z-10 relative">
              <div className="absolute top-0 right-0 p-4">
                 <Award size={32} className="text-brand-primary/10" />
              </div>
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary ring-4 ring-blue-50">
                 <Trophy size={28} />
              </div>
              <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-1">Top Innovator</div>
              <div className="text-lg font-black text-brand-text-primary truncate mb-1">{leaderboard[0].participantName}</div>
              <div className="text-xs text-brand-text-secondary italic line-clamp-1 mb-4">"{leaderboard[0].projectTitle}"</div>
              <div className="text-3xl font-black text-brand-primary">{leaderboard[0].averageScore.toFixed(1)}</div>
           </div>

           {/* 3rd */}
           {leaderboard[2] && (
             <div className="bg-white border border-brand-border p-6 rounded-lg shadow-sm text-center md:order-3 h-fit">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-400 border border-orange-100">
                   <Medal size={20} />
                </div>
                <div className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest mb-1">Rank 03</div>
                <div className="text-sm font-bold text-brand-text-primary truncate">{leaderboard[2].participantName}</div>
                <div className="text-lg font-black text-brand-primary mt-2">{leaderboard[2].averageScore.toFixed(1)}</div>
             </div>
           )}
        </div>
      )}

      {/* Full Rankings List */}
      <div className="bg-white border border-brand-border rounded-lg shadow-sm overflow-hidden">
        <div className="bg-brand-section px-6 py-3 border-b border-brand-border flex items-center justify-between">
           <h2 className="text-[10px] font-bold text-brand-text-primary uppercase tracking-widest">Full Merit Registry</h2>
           <div className="flex items-center gap-2 text-[10px] font-bold text-brand-text-secondary uppercase">
              <Users size={12} /> {leaderboard.length} Entries
           </div>
        </div>

        <div className="divide-y divide-brand-border">
          {leaderboard.length === 0 ? (
             <div className="p-16 text-center text-sm text-brand-text-secondary italic">
                No rankings available yet. Assessments in progress.
             </div>
          ) : (
            leaderboard.map((item, idx) => (
              <div key={item._id} className="list-row group px-6 py-4">
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold border transition-colors ${
                    item.rank === 1 ? 'bg-brand-primary text-white border-brand-primary' : 
                    item.rank <= 3 ? 'bg-blue-50 text-brand-primary border-blue-100' : 
                    'bg-brand-section text-brand-text-secondary border-brand-border'
                  }`}>
                    {String(item.rank).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-brand-text-primary truncate">{item.participantName}</p>
                    <p className="text-[11px] text-brand-text-secondary italic truncate">{item.projectTitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                   <div className="hidden sm:block text-right">
                      <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-tighter">Peer Review</p>
                      <p className="text-xs font-medium text-brand-text-primary">{item.evalCount} Specialized Audits</p>
                   </div>
                   <div className="w-24 text-right">
                      <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-tighter">Aggregate</p>
                      <p className="text-base font-black text-brand-primary">{item.averageScore.toFixed(2)}</p>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
