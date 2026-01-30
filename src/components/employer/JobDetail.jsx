import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Edit2, Save, X, Trash2, MapPin, DollarSign, Calendar, Building, Briefcase, FileText, CheckCircle, Users, Globe, Clock, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = 'https://workky-backend.vercel.app/api';

const JobDetail = ({ job: jobProp, jobId, onBack, onJobUpdated, onJobDeleted, onViewApplications }) => {
  const [job, setJob] = useState(jobProp);
  const [isEditing, setIsEditing] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!jobProp && jobId);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    requirements: [''],
    location: '',
    salary: '',
    jobType: 'remote',
    workArrangement: 'monthly',
    businessType: 'hybrid',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Handle both array response and object response with categories property
        const data = res.data;
        const categoriesArray = Array.isArray(data) ? data : (data?.categories || data?.data || []);
        setCategories(categoriesArray);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch job if accessed via URL with jobId
  useEffect(() => {
    if (!jobProp && jobId) {
      const fetchJob = async () => {
        try {
          setFetchLoading(true);
          const token = localStorage.getItem('token');
          const res = await axios.get(`${API_BASE_URL}/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setJob(res.data);
        } catch (err) {
          setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to load job');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchJob();
    } else if (jobProp) {
      setJob(jobProp);
    }
  }, [jobProp, jobId]);

  useEffect(() => {
    if (job) {
      // Handle requirements - could be string or array
      let requirements = [''];
      if (Array.isArray(job.requirements)) {
        requirements = job.requirements.length > 0 ? job.requirements : [''];
      } else if (typeof job.requirements === 'string' && job.requirements) {
        requirements = [job.requirements];
      }
      
      setFormData({
        title: job.title || '',
        description: job.description || '',
        company: job.company || '',
        requirements,
        location: job.location || '',
        salary: job.salary || '',
        jobType: job.jobType || 'remote',
        workArrangement: job.workArrangement || 'monthly',
        businessType: job.businessType || 'hybrid',
        status: job.status || 'active'
      });
    }
  }, [job]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }));
  };

  const removeRequirement = (index) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, requirements: newRequirements }));
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      
      // Filter empty requirements
      const filteredRequirements = formData.requirements.filter(r => r.trim());
      
      const submitData = {
        ...formData,
        requirements: filteredRequirements.length > 0 ? filteredRequirements : undefined
      };
      
      const res = await axios.put(`${API_BASE_URL}/jobs/${job._id}`, submitData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccess('Job updated successfully!');
      setIsEditing(false);
      setJob(res.data);
      
      if (onJobUpdated) {
        onJobUpdated(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to update job');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/jobs/${job._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (onJobDeleted) {
        onJobDeleted(job._id);
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to delete job');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getJobTypeBadge = (jobType) => {
    const badges = {
      remote: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Remote' },
      on_site: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'On-Site' },
      hybrid: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Hybrid' }
    };
    return badges[jobType] || badges.remote;
  };

  const getWorkArrangementBadge = (arrangement) => {
    const badges = {
      monthly: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'Monthly' },
      weekly: { bg: 'bg-teal-500/20', text: 'text-teal-400', label: 'Weekly' },
      project: { bg: 'bg-rose-500/20', text: 'text-rose-400', label: 'Project-Based' }
    };
    return badges[arrangement] || badges.monthly;
  };

  const inputClasses = "w-full px-4 py-3 text-base rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed";
  const selectClasses = `${inputClasses} appearance-none cursor-pointer`;

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-400">Job not found</p>
      </div>
    );
  }

  const jobTypeBadge = getJobTypeBadge(job.jobType);
  const arrangementBadge = getWorkArrangementBadge(job.workArrangement);

  return (
    <div className="w-full p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-teal-400 hover:text-emerald-400 font-medium mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Jobs
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-2">
                {isEditing ? 'Edit Job' : 'Job Details'}
              </h2>
              <p className="text-slate-400 text-base sm:text-lg">
                {isEditing ? 'Update the job information below' : 'View and manage this job posting'}
              </p>
            </div>
            
            {!isEditing && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => onViewApplications && onViewApplications(job)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition font-medium"
                >
                  <Users className="w-4 h-4" />
                  Applications
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-teal-500/10 text-teal-400 rounded-xl hover:bg-teal-500/20 transition font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 text-rose-400 rounded-xl hover:bg-rose-500/20 transition font-medium disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl"
          >
            {error}
          </motion.div>
        )}

        {/* Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 border-glow"
        >
          {isEditing ? (
            // Edit Form
            <form onSubmit={handleUpdate} className="space-y-6">
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
                      value={formData.company}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              <div className="glass-light rounded-2xl p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Job Type & Arrangement
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Job Type
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      disabled={loading}
                      className={selectClasses}
                    >
                      <option value="remote">Remote</option>
                      <option value="on_site">On-Site</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Work Arrangement
                    </label>
                    <select
                      name="workArrangement"
                      value={formData.workArrangement}
                      onChange={handleChange}
                      disabled={loading}
                      className={selectClasses}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="project">Project-Based</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      disabled={loading}
                      className={selectClasses}
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="closed">Closed</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="glass-light rounded-2xl p-6">
                <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location & Compensation
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
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
                      value={formData.salary}
                      onChange={handleChange}
                      disabled={loading}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              <div className="glass-light rounded-2xl p-6">
                <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Description & Requirements
                </h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Description <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      name="description"
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
                      Requirements
                    </label>
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) => handleRequirementChange(index, e.target.value)}
                          placeholder={`Requirement ${index + 1}`}
                          disabled={loading}
                          className={inputClasses}
                        />
                        {formData.requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="px-3 py-2 bg-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/30 transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addRequirement}
                      disabled={loading}
                      className="mt-2 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition text-sm"
                    >
                      + Add Requirement
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-lg font-bold rounded-xl shadow-lg transition ${
                    loading
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-400 hover:to-emerald-400 hover:shadow-glow"
                  }`}
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    if (job) {
                      let requirements = [''];
                      if (Array.isArray(job.requirements)) {
                        requirements = job.requirements.length > 0 ? job.requirements : [''];
                      } else if (typeof job.requirements === 'string' && job.requirements) {
                        requirements = [job.requirements];
                      }
                      setFormData({
                        title: job.title || '',
                        description: job.description || '',
                        company: job.company || '',
                        requirements,
                        location: job.location || '',
                        salary: job.salary || '',
                        jobType: job.jobType || 'remote',
                        workArrangement: job.workArrangement || 'monthly',
                        businessType: job.businessType || 'hybrid',
                        status: job.status || 'active'
                      });
                    }
                  }}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 text-lg font-semibold text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700 transition disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // View Mode
            <div className="space-y-6">
              {/* Job Header */}
              <div className="border-b border-slate-700/50 pb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">{job.title}</h3>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${jobTypeBadge.bg} ${jobTypeBadge.text}`}>
                    {jobTypeBadge.label}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${arrangementBadge.bg} ${arrangementBadge.text}`}>
                    {arrangementBadge.label}
                  </span>
                  {job.status && (
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      job.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      job.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                      job.status === 'closed' ? 'bg-slate-500/20 text-slate-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Building className="w-5 h-5 text-teal-400" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-5 h-5 text-teal-400" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.category && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      <span>{job.category.name || job.category}</span>
                    </div>
                  )}
                  {job.salary && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">Posted {formatDate(job.postedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="glass-light rounded-xl p-6">
                <h4 className="text-lg font-bold text-teal-400 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Job Description
                </h4>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>

              {/* Requirements */}
              <div className="glass-light rounded-xl p-6">
                <h4 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Requirements
                </h4>
                {Array.isArray(job.requirements) ? (
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <span className="text-teal-400 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{job.requirements}</p>
                )}
              </div>

              {/* Skills */}
              {job.skillsRequired && job.skillsRequired.length > 0 && (
                <div className="glass-light rounded-xl p-6">
                  <h4 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Skills Required
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-sm">
                        {skill.skill} {skill.level && skill.level !== 'intermediate' && `(${skill.level})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Compensation */}
              {job.compensation && (
                <div className="glass-light rounded-xl p-6">
                  <h4 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Compensation Details
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    {job.workArrangement === 'monthly' && job.compensation.monthly && (
                      <>
                        {job.compensation.monthly.hoursPerMonth && (
                          <div>
                            <span className="text-slate-500">Hours/Month:</span>
                            <span className="ml-2 text-slate-300">{job.compensation.monthly.hoursPerMonth}</span>
                          </div>
                        )}
                        {job.compensation.monthly.hourlyRate && (
                          <div>
                            <span className="text-slate-500">Hourly Rate:</span>
                            <span className="ml-2 text-slate-300">${job.compensation.monthly.hourlyRate}</span>
                          </div>
                        )}
                        {job.compensation.monthly.totalMonthlyBudget && (
                          <div>
                            <span className="text-slate-500">Monthly Budget:</span>
                            <span className="ml-2 text-slate-300">${job.compensation.monthly.totalMonthlyBudget}</span>
                          </div>
                        )}
                      </>
                    )}
                    {job.workArrangement === 'weekly' && job.compensation.weekly && (
                      <>
                        {job.compensation.weekly.hoursPerWeek && (
                          <div>
                            <span className="text-slate-500">Hours/Week:</span>
                            <span className="ml-2 text-slate-300">{job.compensation.weekly.hoursPerWeek}</span>
                          </div>
                        )}
                        {job.compensation.weekly.hourlyRate && (
                          <div>
                            <span className="text-slate-500">Hourly Rate:</span>
                            <span className="ml-2 text-slate-300">${job.compensation.weekly.hourlyRate}</span>
                          </div>
                        )}
                        {job.compensation.weekly.weeklyBudget && (
                          <div>
                            <span className="text-slate-500">Weekly Budget:</span>
                            <span className="ml-2 text-slate-300">${job.compensation.weekly.weeklyBudget}</span>
                          </div>
                        )}
                      </>
                    )}
                    {job.workArrangement === 'project' && job.compensation.project && (
                      <>
                        {job.compensation.project.expectedTotalHours && (
                          <div>
                            <span className="text-slate-500">Est. Hours:</span>
                            <span className="ml-2 text-slate-300">{job.compensation.project.expectedTotalHours}</span>
                          </div>
                        )}
                        {job.compensation.project.totalBudget && (
                          <div>
                            <span className="text-slate-500">Total Budget:</span>
                            <span className="ml-2 text-slate-300">${job.compensation.project.totalBudget}</span>
                          </div>
                        )}
                        {job.compensation.project.projectDuration && (
                          <div>
                            <span className="text-slate-500">Duration:</span>
                            <span className="ml-2 text-slate-300">{job.compensation.project.projectDuration}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetail;
