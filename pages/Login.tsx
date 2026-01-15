import React, { useState } from 'react';
import { Database, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

const Login: React.FC<{ onLogin: (user: any, token: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.auth.login({ username, password });
      onLogin(response.user, response.token);
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f294d] to-[#204c84] p-6">
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 max-w-5xl w-full">

        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-white clip-triangle-up" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
              <div className="absolute top-8 left-0 right-0 h-3 bg-[#0f294d] -skew-y-12"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none">
                INDAS
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold text-[#4da6ff] tracking-tight leading-none mt-1">
                ANALYTICS
              </h2>
            </div>
          </div>
          <p className="text-blue-200 text-xl mt-4 font-medium tracking-wide border-t-2 border-blue-400/30 pt-4 w-full md:w-auto">
            Print Process Automation Partner
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-10 shadow-2xl w-full max-w-[400px] animate-in slide-in-from-bottom duration-700 delay-200 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#0f294d]/10 rounded-full blur-3xl"></div>

          <h3 className="text-3xl font-bold text-[#0f294d] text-center mb-8">
            Welcome
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-full outline-none focus:ring-2 focus:ring-[#0f294d]/50 focus:border-[#0f294d] transition-all text-slate-700 placeholder:text-slate-400"
                placeholder="Enter User Name"
                autoComplete="off"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-full outline-none focus:ring-2 focus:ring-[#0f294d]/50 focus:border-[#0f294d] transition-all text-slate-700 placeholder:text-slate-400"
                placeholder="Enter Password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0f294d] hover:bg-[#0a1d36] text-white rounded-full font-bold text-lg shadow-lg shadow-[#0f294d]/30 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .clip-triangle-up {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  );
};

export default Login;
