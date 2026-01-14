
import React, { useState } from 'react';
import { Database, Lock, User, ArrowRight } from 'lucide-react';

const Login: React.FC<{ onLogin: (cred: any) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#050505]">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
            <Database size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">MigraTrack Pro</h1>
          <p className="text-slate-500 dark:text-zinc-500 mt-2">Enterprise Data Migration Suite</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
            >
              Sign In to Dashboard
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 dark:text-zinc-600">
              Demo Credentials: admin / password
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-xs text-slate-400">
          &copy; 2024 MigraTrack Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
