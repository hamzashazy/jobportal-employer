import React, { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import JobPost from "./employer/JobPost.jsx";
import JobList from "./employer/JobList.jsx";
import JobDetail from "./employer/JobDetail.jsx";
import EmployerProfile from "./employer/EmployerProfile.jsx";
import ApplicationList from "./employer/ApplicationList.jsx";

const Superpanel = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const modules = [
    {
      key: "postjob",
      title: "Post Job",
      icon: <PlusCircle className="w-6 h-6" />,
      component: <JobPost onSuccess={() => setActiveModule("myjobs")} />,
      gradient: "from-teal-500 to-emerald-500",
      description: "Create and publish new job listings for your company.",
    },
    {
      key: "myjobs",
      title: "My Jobs",
      icon: <Briefcase className="w-6 h-6" />,
      component: <JobList 
        onViewJob={(job) => {
          setSelectedJob(job);
          setActiveModule("jobdetail");
        }}
        onEditJob={(job) => {
          setSelectedJob(job);
          setActiveModule("jobdetail");
        }}
      />,
      gradient: "from-cyan-500 to-teal-500",
      description: "View and manage all your posted job listings.",
    },
    {
      key: "profile",
      title: "Profile",
      icon: <User className="w-6 h-6" />,
      component: <EmployerProfile />,
      gradient: "from-emerald-500 to-green-500",
      description: "Update your company profile and account information.",
    },
  ];

  const renderDashboard = () => (
    <div className="flex flex-col items-center w-full px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold gradient-text mb-4">
          Welcome Back
        </h2>
        <p className="text-slate-400 text-lg">
          Manage your job postings and find the perfect candidates
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {modules.map((mod, index) => (
          <motion.div
            key={mod.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveModule(mod.key)}
            className="relative group glass rounded-2xl p-6 cursor-pointer overflow-hidden card-hover"
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Icon */}
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${mod.gradient} mb-4 shadow-glow`}>
              <span className="text-white">{mod.icon}</span>
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
              {mod.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              {mod.description}
            </p>
            
            {/* Arrow indicator */}
            <div className="flex items-center text-teal-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Open</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderModule = () => {
    if (activeModule === "dashboard") return renderDashboard();
    if (activeModule === "jobdetail") {
      return (
        <JobDetail 
          job={selectedJob} 
          onBack={() => setActiveModule("myjobs")}
          onJobUpdated={(updatedJob) => {
            setSelectedJob(updatedJob);
          }}
          onJobDeleted={() => {
            setActiveModule("myjobs");
            setSelectedJob(null);
          }}
          onViewApplications={(job) => {
            setSelectedJob(job);
            setActiveModule("applicationlist");
          }}
        />
      );
    }
    if (activeModule === "applicationlist") {
      return (
        <ApplicationList
          jobId={selectedJob?._id}
          jobTitle={selectedJob?.title}
          onBack={() => setActiveModule("jobdetail")}
        />
      );
    }
    const mod = modules.find((m) => m.key === activeModule);
    return <div className="flex-1">{mod?.component}</div>;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-gradient-to-br from-teal-500 to-emerald-500 p-2 rounded-xl shadow-glow">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-xl gradient-text">Joblify</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        <button
          onClick={() => {
            setActiveModule("dashboard");
            setSidebarOpen(false);
          }}
          className={`relative flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
            activeModule === "dashboard"
              ? "bg-teal-500/20 text-teal-400"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          {activeModule === "dashboard" && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-gradient-to-b from-teal-400 to-emerald-400 rounded-r-full"></span>
          )}
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          <span className="font-medium">Dashboard</span>
        </button>

        {modules.map((mod) => (
          <button
            key={mod.key}
            onClick={() => {
              setActiveModule(mod.key);
              setSidebarOpen(false);
            }}
            className={`relative flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
              activeModule === mod.key
                ? "bg-teal-500/20 text-teal-400"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {activeModule === mod.key && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-gradient-to-b from-teal-400 to-emerald-400 rounded-r-full"></span>
            )}
            <span className="shrink-0">{mod.icon}</span>
            <span className="font-medium">{mod.title}</span>
          </button>
        ))}
      </nav>

      {/* Logout button */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("isLogged");
            window.location.href = "/login";
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 glass-dark p-6 md:sticky top-0 h-screen border-r border-slate-800/50">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 glass-dark border-b border-slate-800/50">
        <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-lg gradient-text">Joblify</span>
        <div className="w-6"></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 glass-dark z-50 p-6 border-r border-slate-800/50 md:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto pt-16 md:pt-0">
        {renderModule()}
      </main>
    </div>
  );
};

export default Superpanel;
