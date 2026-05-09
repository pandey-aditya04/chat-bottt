import { useState, useEffect } from 'react';
import { Search, Download, Bot, User, MessageSquare } from 'lucide-react';
import { Card } from '../../components/ui/card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import FadeIn from '../../components/ui/FadeIn';

const API_URL = import.meta.env.VITE_API_URL || 'https://chat-bottt.onrender.com/api';

const ChatLogs = () => {
  const { isDark } = useTheme();
  const { token } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
        if (data.length > 0) setSelected(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      toast.error('Failed to load chat logs');
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter(log =>
    (log.botName || '').toLowerCase().includes(search.toLowerCase()) ||
    (log.sessionId || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <div className="space-y-3"><Skeleton className="h-20" count={5} /></div>
        <div className="lg:col-span-2"><Skeleton className="h-full" /></div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 animate-fade-in" style={{ height: 'calc(100vh - 160px)' }}>
      {/* Left - Conversation List */}
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-raised border border-border focus-within:border-brand/50 transition-all">
            <Search className="w-4 h-4 text-text-muted" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search by session or bot..." 
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted text-text-primary" 
            />
          </div>
          <Button variant="outline" size="sm" icon={Download} onClick={() => toast.info('Export coming soon!')}>Export</Button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filtered.map(log => (
            <div
              key={log._id}
              onClick={() => setSelected(log)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                selected?._id === log._id
                  ? 'bg-brand/10 border-brand shadow-glow-brand/20'
                  : 'bg-surface-raised border-border hover:border-brand/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-brand">{log.sessionId?.slice(0, 12)}...</span>
                <Badge variant="default" size="sm" className="bg-surface-overlay border-border">{log.messageCount} msgs</Badge>
              </div>
              <h4 className="text-sm font-bold text-text-primary truncate">{log.botName}</h4>
              <p className="text-[10px] mt-1 text-text-muted font-bold uppercase tracking-tighter">{new Date(log.createdAt).toLocaleString()}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 bg-surface-raised/50 rounded-3xl border border-dashed border-border">
              <MessageSquare className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-20" />
              <p className="text-sm text-text-muted">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right - Chat View */}
      <div className="lg:col-span-2 h-full overflow-hidden">
        {selected ? (
          <FadeIn direction="none" className="h-full">
            <Card padding="none" className="h-full flex flex-col border-border overflow-hidden bg-surface-raised/30">
              <div className="p-5 border-b border-border bg-surface-raised">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-text-primary">{selected.sessionId}</h3>
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">
                      {selected.botName} · {new Date(selected.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="success" className="bg-success/10 text-success border-success/20">Active Session</Badge>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0d0d1a]/50">
                {selected.messages.map((msg, i) => (
                  <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'bot' && (
                      <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                        <Bot className="w-5 h-5 text-brand" />
                      </div>
                    )}
                    <div className="max-w-[80%]">
                      <div className={`rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-brand text-white rounded-tr-none'
                          : 'bg-surface-overlay text-text-primary border border-border rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`flex items-center gap-3 mt-1.5 px-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] text-text-muted font-bold uppercase">{msg.time}</span>
                        {msg.matched !== undefined && (
                          <Badge variant={msg.matched ? 'success' : 'danger'} size="sm" className="text-[8px] h-4 py-0 font-black">
                            {msg.matched ? 'MATCHED' : 'UNMATCHED'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-9 h-9 rounded-xl bg-surface-overlay border border-border flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                        <User className="w-5 h-5 text-text-secondary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-surface-raised/20 rounded-3xl border border-dashed border-border p-12">
            <div className="w-16 h-16 rounded-3xl bg-brand/5 flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 text-brand/30" />
            </div>
            <h3 className="text-lg font-black text-text-primary mb-2">No Conversation Selected</h3>
            <p className="text-sm text-text-muted max-w-xs text-center leading-relaxed">Select a session from the list on the left to review the conversation history.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLogs;
