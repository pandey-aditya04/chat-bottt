import { useState } from 'react';
import { NavLink, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Bot, BarChart2, MessageSquare, Code2,
  Settings, ChevronLeft, ChevronRight, LogOut, Sparkles, X, Database, TerminalSquare
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
  { label: 'My Bots', icon: Bot, route: '/dashboard/bots' },
  { label: 'Analytics', icon: BarChart2, route: '/dashboard/analytics' },
  { label: 'Chat Logs', icon: MessageSquare, route: '/dashboard/logs' },
  { label: 'Settings', icon: Settings, route: '/dashboard/settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { botId } = useParams();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const bgClass = isDark ? 'bg-surface border-r border-border' : 'light bg-surface border-r border-border';
  const textClass = 'text-text-primary';
  const secondaryTextClass = 'text-text-secondary';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      } ${bgClass} ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-6 h-20`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shadow-glow-brand">
                <Bot className="w-5.5 h-5.5 text-white" />
              </div>
              <span className={`font-bold text-lg tracking-tight ${textClass}`}>
                ChatBot<span className="gradient-text">Builder</span>
              </span>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-glow-brand">
              <Bot className="w-6 h-6 text-white" />
            </div>
          )}
          <button className="lg:hidden p-2 hover:bg-surface-overlay rounded-lg transition-colors" onClick={onClose}>
            <X className={`w-5 h-5 ${secondaryTextClass}`} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
          {menuItems.map(item => (
            <NavLink
              key={item.route + item.label}
              to={item.route}
              end={item.route === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? `bg-brand/10 text-brand font-bold`
                    : `text-text-secondary hover:text-text-primary hover:bg-surface-overlay`
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}

          {/* Dynamic Bot Links if we are inside a bot's subpage */}
          {botId && (
            <div className="pt-4 mt-4 border-t border-border">
              <p className={`px-4 text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 ${collapsed ? 'hidden' : 'block'}`}>
                Active Bot
              </p>
              <NavLink
                to={`/dashboard/bots/${botId}/embed`}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm group
                  ${isActive ? 'bg-brand/10 text-brand' : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'}
                `}
                title={collapsed ? "Deploy/Embed" : ""}
              >
                <TerminalSquare className={`w-5 h-5 shrink-0 ${location.pathname.includes('/embed') ? 'text-brand' : 'text-text-muted group-hover:text-text-primary'}`} />
                {!collapsed && <span>Deploy & Embed</span>}
              </NavLink>
              <NavLink
                to={`/dashboard/bots/${botId}/train`}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm group mt-1
                  ${isActive ? 'bg-brand/10 text-brand' : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'}
                `}
                title={collapsed ? "Knowledge Base" : ""}
              >
                <Database className={`w-5 h-5 shrink-0 ${location.pathname.includes('/train') ? 'text-brand' : 'text-text-muted group-hover:text-text-primary'}`} />
                {!collapsed && <span>Knowledge Base</span>}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Upgrade Card */}
        {!collapsed && (
          <div className="px-4 pb-6">
            <div className="bg-gradient-to-br from-brand/10 to-accent/5 rounded-2xl p-5 border border-brand/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center gap-2 mb-2 relative">
                <Sparkles className="w-4 h-4 text-brand" />
                <span className={`text-sm font-black uppercase tracking-widest ${textClass}`}>
                  Upgrade
                </span>
              </div>
              <p className={`text-xs mb-4 relative ${secondaryTextClass}`}>
                Unlock unlimited bots & advanced analytics.
              </p>
              <button
                onClick={() => { navigate('/pricing'); onClose?.(); }}
                className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-brand/20 relative"
              >
                Go Pro
              </button>
            </div>
          </div>
        )}

        {/* User Section */}
        <div className={`p-4 border-t border-border`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-4'}`}>
            <div className="w-10 h-10 rounded-full bg-surface-overlay border border-border flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
              <span className="text-text-primary text-sm font-black">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${textClass}`}>
                  {user?.name || 'User'}
                </p>
                <p className={`text-[10px] uppercase tracking-wider truncate font-medium ${secondaryTextClass}`}>
                  {user?.role || 'Free Plan'}
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl transition-all hover:bg-danger/10 text-text-muted hover:text-danger group"
                title="Logout"
              >
                <LogOut className="w-4.5 h-4.5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Collapse Toggle - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden lg:flex absolute -right-3.5 top-20 w-7 h-7 rounded-full items-center justify-center bg-surface-raised border border-border text-text-muted hover:text-brand shadow-sm transition-all hover:scale-110`}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
