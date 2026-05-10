import { useState, useEffect } from 'react';
import { MessageSquare, Calendar, ChevronDown, Download, Filter, Search, Loader2 } from 'lucide-react';
import { Card } from '../../components/ui/card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import FadeIn from '../../components/ui/FadeIn';
import { useBots } from '../../context/BotContext';
import { formatDate } from '../../utils/formatDate';
import api from '../../lib/api';

const ChatLogs = () => {
  const { bots } = useBots();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState(null);
  
  // Filters
  const [selectedBot, setSelectedBot] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let url = `/logs?page=${page}&limit=20`;
      if (selectedBot !== 'all') url += `&botId=${selectedBot}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      
      const { data } = await api.get(url);
      setLogs(data.data || data); // handle both old array format and new paginated format
      if (data.totalPages) setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedBot, page]); // Only re-fetch on these changes, search is handled by button/enter

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const exportCSV = () => {
    const headers = ['Bot', 'Session ID', 'Date', 'User Query', 'Bot Response', 'Matched Knowledge Base'];
    const rows = [];

    logs.forEach(log => {
      const msgs = log.messages || [];
      for (let i = 0; i < msgs.length; i += 2) {
        const userMsg = msgs[i]?.role === 'user' ? msgs[i].text : '';
        const botMsg = msgs[i+1]?.role === 'bot' ? msgs[i+1].text : '';
        const matched = msgs[i+1]?.matched ? 'Yes' : 'No';
        
        rows.push([
          `"${log.bot_name}"`,
          `"${log.session_id}"`,
          `"${formatDate(log.created_at)}"`,
          `"${userMsg.replace(/"/g, '""')}"`,
          `"${botMsg.replace(/"/g, '""')}"`,
          matched
        ].join(','));
      }
    });

    const csvContent = headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `chat_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <FadeIn direction="none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-2">Conversation Logs</h2>
            <p className="text-text-secondary text-sm">Review past conversations to improve your bot's knowledge base.</p>
          </div>
          <Button icon={Download} onClick={exportCSV} className="shadow-lg shadow-brand/20">
            Export CSV
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card className="border-border/60">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <form onSubmit={handleSearch}>
                <Input 
                  icon={Search} 
                  placeholder="Search in messages..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </form>
            </div>
            <div className="flex gap-4">
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select 
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-overlay border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/50 appearance-none transition-all"
                  value={selectedBot}
                  onChange={(e) => { setSelectedBot(e.target.value); setPage(1); }}
                >
                  <option value="all">All Chatbots</option>
                  {bots.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="w-8 h-8 text-brand animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-20 text-text-secondary">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No conversations found.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-overlay/50">
                    <th className="text-left text-[10px] font-black uppercase tracking-widest px-6 py-4 text-text-muted">Session Info</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest px-6 py-4 text-text-muted">Preview</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest px-6 py-4 text-text-muted">Messages</th>
                    <th className="text-left text-[10px] font-black uppercase tracking-widest px-6 py-4 text-text-muted">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {logs.map((log) => (
                    <React.Fragment key={log.id}>
                      <tr 
                        className="hover:bg-surface-overlay/30 transition-colors cursor-pointer group"
                        onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                              <MessageSquare className="w-4 h-4 text-brand" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-text-primary">{log.bot_name}</p>
                              <p className="text-[10px] text-text-muted font-mono">{log.session_id?.substring(0,8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs text-text-secondary line-clamp-1 max-w-xs">
                            {log.messages?.[0]?.text || "No messages"}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <Badge variant="outline" className="px-2 py-0.5 text-[10px]">
                            {log.message_count} msgs
                          </Badge>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(log.created_at)}
                          </div>
                        </td>
                      </tr>
                      {expandedLog === log.id && (
                        <tr>
                          <td colSpan="4" className="bg-black/20 p-6 border-b border-border/40">
                            <div className="max-w-3xl space-y-4">
                              {log.messages?.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                                    msg.role === 'user' 
                                      ? 'bg-brand text-white rounded-tr-sm' 
                                      : 'bg-surface-overlay border border-border text-text-primary rounded-tl-sm'
                                  }`}>
                                    <p className="text-xs leading-relaxed">{msg.text}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className={`text-[9px] font-mono opacity-70 ${msg.role === 'user' ? 'text-white/70' : 'text-text-muted'}`}>
                                        {msg.time}
                                      </span>
                                      {msg.role === 'bot' && (
                                        <Badge variant={msg.matched ? 'success' : 'warning'} className="text-[8px] px-1.5 py-0 border-none">
                                          {msg.matched ? 'KB Match' : 'Fallback'}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <span className="flex items-center px-4 text-xs text-text-muted">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          )}
        </Card>
      </FadeIn>
    </div>
  );
};

import React from 'react'; // ensure React is imported for React.Fragment
export default ChatLogs;
