import { useState, useEffect } from 'react';
import { BarChart2, MessageSquare, Users, Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Legend } from 'recharts';
import StatsCard from '../../components/analytics/StatsCard';
import TopQuestionsTable from '../../components/analytics/TopQuestionsTable';
import { Card } from '../../components/ui/card';
import Skeleton from '../../components/ui/Skeleton';
import { messagesPerDay, conversationsPerBot, questionMatchData, topQuestions, analyticsStats } from '../../data/mockAnalytics';
import { useBots } from '../../context/BotContext';
import { useTheme } from '../../context/ThemeContext';

const Analytics = () => {
  const { isDark } = useTheme();
  const { bots } = useBots();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [selectedBot, setSelectedBot] = useState('all');

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t); }, []);

  const filteredData = messagesPerDay.slice(-parseInt(dateRange));

  const chartTooltipStyle = {
    backgroundColor: isDark ? '#1a1a2e' : '#fff',
    border: `1px solid ${isDark ? '#2d2d50' : '#e2e8f0'}`,
    borderRadius: '12px',
    color: isDark ? '#e2e8f0' : '#0f172a',
    fontSize: '12px',
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32" count={4} />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select value={dateRange} onChange={e => setDateRange(e.target.value)} className={`rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${isDark ? 'bg-dark-surface border border-dark-border text-dark-text' : 'bg-light-surface border border-light-border text-light-text'}`}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
        <select value={selectedBot} onChange={e => setSelectedBot(e.target.value)} className={`rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${isDark ? 'bg-dark-surface border border-dark-border text-dark-text' : 'bg-light-surface border border-light-border text-light-text'}`}>
          <option value="all">All Bots</option>
          {bots.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Messages" value={analyticsStats.totalMessages} icon={MessageSquare} color="primary" trend="up" trendValue="+12%" />
        <StatsCard title="Unique Conversations" value={analyticsStats.uniqueConversations} icon={Users} color="accent" trend="up" trendValue="+8%" />
        <StatsCard title="Match Rate" value={`${analyticsStats.avgMatchRate}%`} icon={TrendingUp} color="success" trend="up" trendValue="+3%" />
        <StatsCard title="Most Active Day" value={analyticsStats.mostActiveDay} icon={Calendar} color="warning" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Messages Per Day</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2d2d50' : '#e2e8f0'} />
              <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} tickLine={false} />
              <RTooltip contentStyle={chartTooltipStyle} />
              <Line type="monotone" dataKey="messages" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Conversations Per Bot</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={conversationsPerBot}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2d2d50' : '#e2e8f0'} />
              <XAxis dataKey="bot" tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} tickLine={false} />
              <RTooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="conversations" radius={[8, 8, 0, 0]}>
                {conversationsPerBot.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center">
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>Match Rate</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={questionMatchData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" strokeWidth={0}>
                {questionMatchData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend formatter={(value) => <span className={`text-sm ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <div className="lg:col-span-2">
          <TopQuestionsTable questions={topQuestions} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
