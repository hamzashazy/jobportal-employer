import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ArrowLeft, User, Mail, FileText, Calendar, Check, X, Eye, UserCheck, Briefcase, RefreshCw, DollarSign, Clock, Star, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'https://workky-backend.vercel.app/api';

const ApplicationList = ({ jobId, jobTitle, onBack }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(null);
  const [expandedProposals, setExpandedProposals] = useState({});

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Handle paginated response format { success, count, data }
      const applicationsData = res.data.data || res.data;
      setApplications(Array.isArray(applicationsData) ? applicationsData : []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    }
  }, [jobId, fetchApplications]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    const statusLabels = {
      viewed: 'Mark as Viewed',
      shortlisted: 'Add to Shortlist',
      interview: 'Schedule Interview',
      offer: 'Extend Offer',
      hired: 'Hire Applicant',
      rejected: 'Reject Application'
    };

    if (!window.confirm(`Are you sure you want to ${statusLabels[newStatus]}?`)) {
      return;
    }

    try {
      setUpdateLoading(applicationId);
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert(err.response?.data?.msg || err.response?.data?.message || 'Failed to update application status');
    } finally {
      setUpdateLoading(null);
    }
  };

  const toggleProposalExpanded = (applicationId) => {
    setExpandedProposals(prev => ({
      ...prev,
      [applicationId]: !prev[applicationId]
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      viewed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      shortlisted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      interview: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      offer: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      hired: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      rejected: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      withdrawn: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getBidTypeLabel = (bidType) => {
    const labels = {
      hourly: '/hour',
      fixed: ' (fixed)',
      monthly: '/month'
    };
    return labels[bidType] || '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-rose-400" />
          </div>
          <p className="text-lg font-semibold text-white mb-2">Error Loading Applications</p>
          <p className="text-slate-400 mb-6">{error}</p>
          <button 
            onClick={fetchApplications}
            className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:shadow-glow transition font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-teal-400 hover:text-emerald-400 font-medium mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Job Details
          </button>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-2">
            Applications for {jobTitle || 'Job'}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'} received
          </p>
        </motion.div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center max-w-md">
              <div className="bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <Briefcase className="w-16 h-16 text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Applications Yet</h3>
              <p className="text-slate-400">
                This job posting hasn't received any applications yet. Check back later!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applications.map((application, index) => (
              <motion.div
                key={application._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl overflow-hidden card-hover"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 p-6 border-b border-slate-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-teal-500 to-emerald-500 p-3 rounded-full shadow-glow">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {application.applicant?.name || 'Applicant'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-slate-400">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{application.applicant?.email || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    {application.employerRating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < application.employerRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>

                  {/* Proposal Section */}
                  {application.proposal && (
                    <div className="glass-light rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-teal-400 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Proposal
                        </h4>
                        <button
                          onClick={() => toggleProposalExpanded(application._id)}
                          className="text-slate-400 hover:text-white transition"
                        >
                          {expandedProposals[application._id] ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      
                      {/* Bid Info */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {application.proposal.bidAmount && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-400" />
                            <span className="text-slate-300">
                              ${application.proposal.bidAmount}{getBidTypeLabel(application.proposal.bidType)}
                            </span>
                          </div>
                        )}
                        {application.proposal.availableHoursPerWeek && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-cyan-400" />
                            <span className="text-slate-300">
                              {application.proposal.availableHoursPerWeek} hrs/week available
                            </span>
                          </div>
                        )}
                        {application.proposal.availableToStart && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            <span className="text-slate-300">
                              Start: {application.proposal.availableToStart.replace(/_/g, ' ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Cover Letter (Expandable) */}
                      <AnimatePresence>
                        {expandedProposals[application._id] && application.proposal.coverLetter && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3 border-t border-slate-700/50">
                              <p className="text-sm text-slate-400 font-medium mb-2">Cover Letter:</p>
                              <p className="text-sm text-slate-300 whitespace-pre-line">
                                {application.proposal.coverLetter}
                              </p>
                            </div>
                            
                            {/* Highlighted Skills */}
                            {application.proposal.highlightedSkills && application.proposal.highlightedSkills.length > 0 && (
                              <div className="pt-3 mt-3 border-t border-slate-700/50">
                                <p className="text-sm text-slate-400 font-medium mb-2">Highlighted Skills:</p>
                                <div className="flex flex-wrap gap-2">
                                  {application.proposal.highlightedSkills.map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Resume Link */}
                  {application.resume && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <a 
                        href={application.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-teal-400 hover:text-emerald-400 transition truncate"
                      >
                        View Resume
                      </a>
                    </div>
                  )}

                  {/* Applied Date */}
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Applied {formatDate(application.appliedAt)}</span>
                  </div>

                  {/* Employer Notes */}
                  {application.employerNotes && (
                    <div className="pt-2 border-t border-slate-700/50">
                      <p className="text-sm text-slate-500 mb-1">Your Notes:</p>
                      <p className="text-sm text-slate-400 italic">{application.employerNotes}</p>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {application.status === 'applied' && (
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'viewed')}
                        disabled={updateLoading === application._id}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-purple-500/10 text-purple-400 rounded-xl hover:bg-purple-500/20 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Eye className="w-4 h-4" />
                        Mark Viewed
                      </button>
                    )}
                    {!['shortlisted', 'interview', 'offer', 'hired', 'rejected', 'withdrawn'].includes(application.status) && (
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'shortlisted')}
                        disabled={updateLoading === application._id}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Star className="w-4 h-4" />
                        Shortlist
                      </button>
                    )}
                    {!['interview', 'offer', 'hired', 'rejected', 'withdrawn'].includes(application.status) && (
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'interview')}
                        disabled={updateLoading === application._id}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-amber-500/10 text-amber-400 rounded-xl hover:bg-amber-500/20 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserCheck className="w-4 h-4" />
                        Interview
                      </button>
                    )}
                    {application.status === 'interview' && (
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'offer')}
                        disabled={updateLoading === application._id}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-teal-500/10 text-teal-400 rounded-xl hover:bg-teal-500/20 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FileText className="w-4 h-4" />
                        Send Offer
                      </button>
                    )}
                    {!['hired', 'rejected', 'withdrawn'].includes(application.status) && (
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'hired')}
                        disabled={updateLoading === application._id}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="w-4 h-4" />
                        Hire
                      </button>
                    )}
                    {!['rejected', 'hired', 'withdrawn'].includes(application.status) && (
                      <button
                        onClick={() => handleStatusUpdate(application._id, 'rejected')}
                        disabled={updateLoading === application._id}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-500/10 text-rose-400 rounded-xl hover:bg-rose-500/20 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationList;
