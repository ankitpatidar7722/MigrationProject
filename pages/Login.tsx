import React, { useState } from 'react';
import { Database, ArrowRight } from 'lucide-react';

const Login: React.FC<{ onLogin: (cred: any) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f294d] to-[#204c84] p-6">
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 max-w-5xl w-full">

        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-4 mb-2">
            {/* Stylized Logo 'A' approximation */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-white clip-triangle-up" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
              <div className="absolute top-8 left-0 right-0 h-3 bg-[#0f294d] -skew-y-12"></div>
              {/* This is a rough CSS approximation of the 'A' logo, replaced with an Icon for simplicity if needed, but trying to be visual */}
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-6xl">
                {/* Fallback to simple icon if CSS shapes are too complex for guaranteed render */}
              </div>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-full outline-none focus:ring-2 focus:ring-[#0f294d]/50 focus:border-[#0f294d] transition-all text-slate-700 placeholder:text-slate-400"
                placeholder="Company Name"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-full outline-none focus:ring-2 focus:ring-[#0f294d]/50 focus:border-[#0f294d] transition-all text-slate-700 placeholder:text-slate-400"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0f294d] hover:bg-[#0a1d36] text-white rounded-full font-bold text-lg shadow-lg shadow-[#0f294d]/30 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* CSS for custom logo shape approximation */}
      <style>{`
        .clip-triangle-up {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  );
};

export default Login;
