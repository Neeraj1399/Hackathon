import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';

const EvaluationForm = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    innovation: 5,
    impact: 5,
    technical: 5,
    feedback: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('evaluations', {
        submissionId,
        innovation: parseInt(formData.innovation),
        impact: parseInt(formData.impact),
        technical: parseInt(formData.technical),
        feedback: formData.feedback
      });
      alert('Evaluation submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting evaluation');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Project Evaluation</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="space-y-6">
          {['innovation', 'impact', 'technical'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 capitalize mb-2">
                {field} (0-10)
              </label>
              <input
                type="range"
                name={field}
                min="0"
                max="10"
                value={formData[field]}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span className="text-indigo-600 font-bold text-lg">{formData[field]}</span>
                <span>10</span>
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Feedback</label>
            <textarea
              name="feedback"
              required
              rows="4"
              value={formData.feedback}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="What are the strengths and weaknesses of this project?"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition transform hover:scale-[1.02]"
          >
            Submit Evaluation
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvaluationForm;
