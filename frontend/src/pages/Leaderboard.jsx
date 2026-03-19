import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axiosInstance';

const Leaderboard = () => {
  const { hackathonId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get(`evaluations/leaderboard/${hackathonId}`);
        setLeaderboard(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [hackathonId]);

  if (loading) return <div className="p-8 text-center text-xl">Loading Leaderboard...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Hackathon Leaderboard</h1>
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Participant</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider">Project</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-center">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaderboard.length > 0 ? (
              leaderboard.map((item) => (
                <tr key={item.submissionId} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      item.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                      item.rank === 2 ? 'bg-gray-200 text-gray-700' : 
                      item.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'
                    }`}>
                      {item.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.participantName}</td>
                  <td className="px-6 py-4 text-gray-600">{item.projectTitle}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">
                      {item.score}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-500 italic">
                  No submissions evaluated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
