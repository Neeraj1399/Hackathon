import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';

const JudgeJoin = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await API.get('hackathons');
        setHackathons(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  const handleRequestJoin = async (id) => {
    try {
      await API.post(`hackathons/${id}/judge-request`);
      alert('Request sent successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending request');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Hackathons to Judge</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((h) => (
          <div key={h._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold mb-2">{h.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{h.description}</p>
            <button
              onClick={() => handleRequestJoin(h._id)}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
            >
              Request to Join as Judge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JudgeJoin;
