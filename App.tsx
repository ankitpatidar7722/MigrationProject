
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Database,
  Settings,
  Search,
  Moon,
  Sun,
  Plus,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  AlertTriangle,
  Cog,
  Calculator,
  FileText,
  ShoppingBag,
  Folder,
  Mail,
  Table
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import DynamicModulePage from './pages/DynamicModulePage';
import ModuleMasterManager from './pages/ModuleMasterManager';
import WebTableManager from './pages/WebTableManager';
import FieldManager from './pages/FieldManager';
import Login from './pages/Login';
import TransferChecks from './pages/TransferChecks';
import VerificationList from './pages/VerificationList';
import MigrationIssues from './pages/MigrationIssues';
import CustomizationPoints from './pages/CustomizationPoints';
import EmailDocumentation from './pages/EmailDocumentation';
import { api } from './services/api';
import { ModuleMaster } from './types';
import { RefreshProvider, useRefresh } from './services/RefreshContext';
import { RotateCw } from 'lucide-react';

const RefreshButton: React.FC = () => {
  const { triggerRefresh, isRefreshing } = useRefresh();
  return (
    <button
      onClick={triggerRefresh}
      disabled={isRefreshing}
      className={`p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all ${isRefreshing ? 'animate-spin' : ''}`}
      title="Refresh Page Data"
    >
      <RotateCw size={18} />
    </button>
  );
};

export const AppContext = React.createContext<any>(null);

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState<any>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (!savedUser || savedUser === 'undefined' || savedUser === 'null') return null;
      return JSON.parse(savedUser);
    } catch (e) {
      console.warn('Failed to parse user from localStorage', e);
      localStorage.removeItem('user'); // Clean up corrupt data
      return null;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogin = (userData: any, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <AppContext.Provider value={{ isDarkMode, toggleTheme, user, handleLogout }}>
      <RefreshProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/emails" element={<EmailDocumentation />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />

              {/* Module Pages */}
              <Route path="/projects/:projectId/transfer" element={<TransferChecks />} />
              <Route path="/projects/:projectId/verification" element={<VerificationList />} />
              <Route path="/projects/:projectId/issues" element={<MigrationIssues />} />
              <Route path="/projects/:projectId/customization" element={<CustomizationPoints />} />
              <Route path="/projects/:projectId/emails" element={<EmailDocumentation />} />
              <Route path="/admin/fields" element={<FieldManager />} />
              <Route path="/admin/modules" element={<ModuleMasterManager />} />
              <Route path="/admin/webtables" element={<WebTableManager />} />
              <Route path="/projects/:projectId/module/:moduleName" element={<DynamicModulePage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </HashRouter>
      </RefreshProvider>
    </AppContext.Provider>
  );
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse the current path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPage = pathParts[pathParts.length - 1] || '';

  // Determine the back navigation path
  const getBackPath = () => {
    // If we're in a project module (e.g., /projects/:id/transfer)
    if (pathParts.length >= 3 && pathParts[0] === 'projects') {
      // Go back to project detail page
      return `/projects/${pathParts[1]}`;
    }
    // Otherwise go to dashboard
    return '/';
  };

  // Format the current page name
  const formatPageName = (page: string) => {
    if (!page) return 'Dashboard';
    const nameMap: Record<string, string> = {
      'transfer': 'Data Transfer Checks',
      'verification': 'Verification List',
      'issues': 'Migration Issues',
      'customization': 'Customization Points',
      'emails': 'Email Documentation',
      'projects': 'Projects'
    };
    return nameMap[page] || page.replace('-', ' ');
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => navigate(getBackPath())}
        className="text-white/60 hover:text-white transition-colors"
      >
        MigraTrack
      </button>
      <ChevronRight size={14} className="text-white/40" />
      <span className="font-semibold text-white capitalize">
        {formatPageName(currentPage) || 'Dashboard'}
      </span>
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { isDarkMode, toggleTheme, handleLogout } = React.useContext(AppContext);
  const [moduleGroups, setModuleGroups] = useState<Record<string, ModuleMaster[]>>({});
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname === path;

  // Extract Project ID to determine context
  const projectMatch = location.pathname.match(/\/projects\/(\d+)/);
  const projectId = projectMatch ? parseInt(projectMatch[1]) : null;

  useEffect(() => {
    // Load modules once and keep them in state
    api.moduleMaster.getAll().then(data => {
      const grouped = data.reduce((acc, curr) => {
        if (!acc[curr.moduleName]) acc[curr.moduleName] = [];
        acc[curr.moduleName].push(curr);
        return acc;
      }, {} as Record<string, ModuleMaster[]>);
      setModuleGroups(grouped);
    }).catch(err => console.error("Failed to load modules", err));
  }, []);

  // Icon mapping for known modules
  const getModuleIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('master')) return <Database size={20} />;
    if (n.includes('order')) return <LayoutDashboard size={20} />;
    if (n.includes('production')) return <Settings size={20} />;
    if (n.includes('account')) return <ShieldCheck size={20} />;
    if (n.includes('estimat')) return <Calculator size={20} />;
    if (n.includes('quote')) return <FileText size={20} />;
    if (n.includes('catalog')) return <ShoppingBag size={20} />;
    return <Folder size={20} />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] dark:bg-[#050505]">
      {/* Sidebar - specific Navy Blue theme requested */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-20 bg-[#0f294d] text-white transition-all duration-300 ease-in-out flex flex-col shadow-xl`}>
        <div className="h-16 flex items-center justify-center border-b border-white/10 shrink-0">
          <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center font-bold text-white transition-transform hover:scale-110 cursor-pointer" title="MigraTrack">
            M
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-2 notion-scrollbar flex flex-col items-center">
          {/* Global Nav */}
          <Link to="/" className={`flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-colors group/item ${isActive('/') ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <LayoutDashboard size={20} />
            <span className="text-[10px] mt-1 font-medium">Dashboard</span>
          </Link>
          <Link to="/projects" className={`flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-colors group/item ${location.pathname === '/projects' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <Users size={20} />
            <span className="text-[10px] mt-1 font-medium">Projects</span>
          </Link>
          <Link to="/emails" className={`flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-colors group/item ${location.pathname === '/emails' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <Mail size={20} />
            <span className="text-[10px] mt-1 font-medium">Email</span>
          </Link>
          <Link to="/admin/fields" className={`flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-colors group/item ${location.pathname === '/admin/fields' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <Settings size={20} />
            <span className="text-[10px] mt-1 font-medium">Fields</span>
          </Link>
          <Link to="/admin/modules" className={`flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-colors group/item ${location.pathname === '/admin/modules' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <Database size={20} />
            <span className="text-[10px] mt-1 font-medium">Modules</span>
          </Link>
          <Link to="/admin/webtables" className={`flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-colors group/item ${location.pathname === '/admin/webtables' ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <Table size={20} />
            <span className="text-[10px] mt-1 font-medium">Tables</span>
          </Link>

          {/* Project Specific Modules */}
          {projectId && Object.keys(moduleGroups).length > 0 && (
            <>
              {/* Project Tools */}
              <div className="w-12 border-t border-white/10 my-1" />
              <Link to={`/projects/${projectId}/customization`} className={`flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-colors group/item ${isActive(`/projects/${projectId}/customization`) ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                <Plus size={20} />
                <span className="text-[10px] mt-1 font-medium">Custom</span>
              </Link>
              <Link to={`/projects/${projectId}/issues`} className={`flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-colors group/item ${isActive(`/projects/${projectId}/issues`) ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                <AlertTriangle size={20} />
                <span className="text-[10px] mt-1 font-medium">Issues</span>
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-white/10 bg-[#0a1d36] flex flex-col items-center gap-2">
          <button onClick={toggleTheme} className="flex flex-col items-center justify-center w-16 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors group/item">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-[10px] mt-1 font-medium">Mode</span>
          </button>
          <button onClick={handleLogout} className="flex flex-col items-center justify-center w-16 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors group/item">
            <LogOut size={20} />
            <span className="text-[10px] mt-1 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden ml-20">
        <header className="h-14 flex items-center justify-between px-6 bg-[#0f294d] text-white shadow-md z-40 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger would go here */}
            <Breadcrumb />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={14} />
              <input
                type="text"
                placeholder="Search modules..."
                className="pl-9 pr-4 py-1.5 bg-[#1a3b66] border border-transparent focus:border-blue-400 rounded text-sm text-white placeholder-white/50 outline-none w-64 transition-all"
              />
            </div>
            <RefreshButton />
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold ring-2 ring-white/20">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 bg-[#f0f2f5] dark:bg-[#050505] notion-scrollbar">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default App;
