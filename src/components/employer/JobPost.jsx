import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, Briefcase, MapPin, DollarSign, FileText, CheckCircle } from 'lucide-react';

const API_BASE_URL = 'https://workky-backend.vercel.app/api';

const JobPost = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    requirements: '',
    location: '',
    salary: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/jobs`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccess('Job posted successfully!');
      setFormData({
        title: '',
        description: '',
        company: '',
        requirements: '',
        location: '',
        salary: ''
      });
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 text-base rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 sm:p-10 border-glow"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-500 p-3 rounded-xl shadow-glow">
              <Send className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text">
              Post a New Job
            </h2>
          </div>
          <p className="text-slate-400 text-base sm:text-lg">
            Fill out the details to create a new job posting
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-base rounded-xl flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {success}
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-rose-500/20 border border-rose-500/30 text-rose-400 text-base rounded-xl"
          >
            {error}
          </motion.div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Details Section */}
          <div className="glass-light rounded-2xl p-6">
            <h3 className="text-lg font-bold text-teal-400 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Job Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Job Title <span className="text-rose-400">*</span>
                </label>
                <input 
                  type="text" 
                  name="title" 
                  placeholder="e.g., Senior Software Engineer" 
                  value={formData.title}
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                  className={inputClasses}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Business Name <span className="text-rose-400">*</span>
                </label>
                <input 
                  type="text" 
                  name="company" 
                  placeholder="Business name" 
                  value={formData.company}
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Location & Salary Section */}
          <div className="glass-light rounded-2xl p-6">
            <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location & Compensation
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Location <span className="text-rose-400">*</span>
                </label>
                <input 
                  type="text" 
                  name="location" 
                  placeholder="e.g., Remote, New York, Hybrid" 
                  value={formData.location}
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Salary Range
                </label>
                <input 
                  type="text" 
                  name="salary" 
                  placeholder="e.g., $50k-70k, Competitive" 
                  value={formData.salary}
                  onChange={handleChange} 
                  disabled={loading}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="glass-light rounded-2xl p-6">
            <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Job Description
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description <span className="text-rose-400">*</span>
                </label>
                <textarea 
                  name="description" 
                  placeholder="Describe the role, responsibilities, and what you're looking for..." 
                  value={formData.description}
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                  rows="5"
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Requirements <span className="text-rose-400">*</span>
                </label>
                <textarea 
                  name="requirements" 
                  placeholder="List the key requirements, skills, and qualifications needed..." 
                  value={formData.requirements}
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                  rows="4"
                  className={`${inputClasses} resize-none`}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 text-lg font-bold rounded-xl shadow-lg transition-all transform ${
              loading
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-400 hover:to-emerald-400 hover:shadow-glow hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting Job...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Post Job
              </span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default JobPost;
