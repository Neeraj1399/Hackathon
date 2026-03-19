import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axiosInstance';
import { ExternalLink, CheckCircle } from 'lucide-react';

const JudgeSubmissions = () => {
  const { hackathonId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await API.get(`submissions/hackathon/${hackathonId}`);
        setSubmissions(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [hackathonId]);

  if (loading) return <div className="p-8 text-white">Loading submissions...</div>;

  return (
    <div className="bg-black min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Review Submissions</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissions.map((sub) => (
            <div key={sub._id} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-indigo-400">{sub.projectTitle}</h2>
                  <span className="text-xs text-gray-500 italic">By {sub.userId.name}</span>
                </div>
                <p className="text-gray-400 text-sm mb-6 line-clamp-3">{sub.description}</p>
                
                <div className="flex gap-4 mb-6">
                  <a href={sub.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white flex items-center gap-1 text-sm transition">
                    GitHub <ExternalLink size={14} />
                  </a>
                  {sub.demoLink && (
                    <a href={sub.demoLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white flex items-center gap-1 text-sm transition">
                      Demo <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              <Link 
                to={`/evaluate/${sub._id}`}
                className="athiva-button w-full justify-center"
              >
                Grade Project <CheckCircle size={18} />
              </Link>
            </div>
          ))}
        </div>

        {submissions.length === 0 && (
          <div className="text-center py-20 bg-gray-900 rounded-3xl border border-dashed border-gray-800">
            <p className="text-gray-500">No projects submitted yet for this hackathon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgeSubmissions;
