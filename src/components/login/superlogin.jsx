import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Superlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://workky-backend.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role: 'employer' }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLogged", "true");
        setMessage("Login successful!");
        setTimeout(() => navigate("/Superpanel"), 1000);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 px-4 overflow-hidden relative">
      {/* Animated floating orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-teal-500/30 to-emerald-500/30 blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-cyan-500/30 to-teal-500/30 blur-3xl animate-float pointer-events-none" style={{ animationDelay: '-3s' }}></div>
      <div className="absolute top-[50%] left-[50%] w-48 h-48 rounded-full bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 blur-3xl animate-float pointer-events-none" style={{ animationDelay: '-1.5s' }}></div>

      {/* Login card */}
      <div className="relative glass rounded-3xl p-8 sm:p-10 w-full max-w-lg flex flex-col items-center z-10 animate-fade-in border-glow">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-2xl p-4 mb-4 shadow-glow">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-2 text-center">
            Joblify Employer
          </h1>
          <p className="text-slate-400 text-base sm:text-lg text-center">
            Sign in to manage your job postings
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 w-full text-center text-base font-medium px-4 py-3 rounded-xl border transition duration-300 ${
              message.includes("successful")
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-rose-500/20 text-rose-400 border-rose-500/30"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label className="block text-base font-semibold text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoFocus
              className="w-full text-base px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full text-base px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transform transition duration-300 ${
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
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-base">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-teal-400 hover:text-emerald-400 font-semibold transition"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-slate-600 text-sm text-center">
          © 2026 Joblify Employer Portal
        </p>
      </div>
    </main>
  );
};

export default Superlogin;
