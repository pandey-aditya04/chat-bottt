import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, Activity, Zap, Plus, ArrowRight, Sparkles, Check } from 'lucide-react';
import StatsCard from '../../components/analytics/StatsCard';
import { Card } from '../../components/ui/card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import FadeIn from '../../components/ui/FadeIn';
import { useBots } from '../../context/BotContext';
import { useTheme } from '../../context/ThemeContext';
import { formatDate } from '../../utils/formatDate';

const DashboardHome = () => {
  const { bots, loading, getBotStats } = useBots();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const stats = getBotStats();
  const recentBots = bots.slice(0, 3);
  const hasBots = bots.length > 0;

  const statusVariant = { Active: 'success', Draft: 'warning', Paused: 'default' };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Message */}
      <FadeIn direction="none" delay={0.1}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Welcome back, creator!</h2>
            <p className="text-text-secondary text-sm">Here's what's happening with your AI assistants today.</p>
          </div>
          <Button icon={Plus} onClick={() => navigate('/dashboard/bots/new')} className="shadow-lg shadow-brand/20">
            Create New Bot
          </Button>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <FadeIn delay={0.2} direction="up">
          <StatsCard 
            title="Total Bots" 
            value={stats.totalBots} 
            icon={Bot} 
            color="primary" 
            trend={hasBots ? "up" : null} 
            trendValue={hasBots ? "Active" : ""} 
          />
        </FadeIn>
        <FadeIn delay={0.25} direction="up">
          <StatsCard 
            title="Total Conversations" 
            value={stats.totalConversations} 
            icon={MessageSquare} 
            color="accent" 
            trend={hasBots && stats.totalConversations > 0 ? "up" : null} 
            trendValue={hasBots && stats.totalConversations > 0 ? "+0%" : ""} 
          />
        </FadeIn>
        <FadeIn delay={0.3} direction="up">
          <StatsCard 
            title="Total FAQs" 
            value={stats.totalFaqs} 
            icon={Activity} 
            color="success" 
            trend={hasBots ? "stable" : null} 
            trendValue={hasBots ? "Curated" : ""} 
          />
        </FadeIn>
        <FadeIn delay={0.35} direction="up">
          <StatsCard 
            title="Active Bots" 
            value={stats.activeBots} 
            icon={Zap} 
            color="warning" 
            trend={hasBots ? "stable" : null} 
            trendValue={hasBots ? "Online" : ""} 
          />
        </FadeIn>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Bots */}
        <div className="lg:col-span-2">
          <FadeIn delay={0.4} direction="up" className="h-full">
            <Card padding="none" className="h-full border-border/60">
              <div className="p-6 pb-4 flex items-center justify-between border-b border-border/50">
                <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Recent Chatbots</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/bots')} className="text-xs">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              {hasBots ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-surface-overlay/30">
                        {['Name','Status','Created','Actions'].map(h => (
                          <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest px-6 py-4 text-text-muted">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {recentBots.map(bot => (
                        <tr key={bot.id} className="hover:bg-surface-overlay/30 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Bot className="w-5.5 h-5.5 text-brand" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-text-primary">{bot.name}</p>
                                <p className="text-xs text-text-muted">{bot.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <Badge variant={statusVariant[bot.status]}>{bot.status}</Badge>
                          </td>
                          <td className="px-6 py-5 text-xs font-medium text-text-secondary">
                            {formatDate(bot.created_at || bot.created)}
                          </td>
                          <td className="px-6 py-5">
                            <button 
                              onClick={() => navigate(`/dashboard/bots/${bot.id}/embed`)}
                              className="text-xs font-bold text-brand hover:text-brand-hover transition-colors"
                            >
                              Embed Bot
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-surface-overlay flex items-center justify-center mx-auto mb-6">
                    <Bot className="w-10 h-10 text-text-muted" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Build your first AI assistant</h4>
                  <p className="text-sm text-text-secondary mb-8 max-w-xs mx-auto">It only takes a few minutes to transform your FAQs into a chatbot.</p>
                  <Button icon={Plus} onClick={() => navigate('/dashboard/bots/new')} className="px-8 shadow-xl shadow-brand/20">
                    Get Started
                  </Button>
                </div>
              )}
            </Card>
          </FadeIn>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          <FadeIn delay={0.5} direction="right">
            <Card className="bg-gradient-to-br from-brand/10 to-accent/5 border-brand/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
              <div className="flex items-center gap-3 mb-4 relative">
                <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand" />
                </div>
                <h4 className="font-black text-xs uppercase tracking-widest">Growth Tip</h4>
              </div>
              <p className="text-sm leading-relaxed mb-6 relative text-text-secondary">
                Bots with <span className="text-text-primary font-bold">10+ FAQ entries</span> see 40% higher visitor engagement. Add more questions to improve accuracy.
              </p>
              <Button 
                variant="outline" 
                className="w-full bg-surface-raised/50 hover:bg-surface-raised border-border relative"
                onClick={() => navigate('/dashboard/bots')}
              >
                Improve Your Bots
              </Button>
            </Card>
          </FadeIn>

          <FadeIn delay={0.6} direction="right">
            <Card className="border-border/60">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-6">Onboarding Progress</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Create your first bot', done: hasBots },
                  { label: 'Add 5+ FAQ entries', done: bots.some(b => b.faqCount >= 5) },
                  { label: 'Custom branding', done: true },
                  { label: 'Embed on website', done: false },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      item.done 
                        ? 'bg-success/20 text-success' 
                        : 'bg-surface-overlay text-text-muted group-hover:bg-brand/10 group-hover:text-brand'
                    }`}>
                      {item.done ? <Check className="w-3.5 h-3.5 font-bold" /> : <div className="w-1 h-1 rounded-full bg-current" />}
                    </div>
                    <span className={`text-sm font-medium ${
                      item.done 
                        ? 'text-text-secondary line-through decoration-text-muted/30' 
                        : 'text-text-primary'
                    }`}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
