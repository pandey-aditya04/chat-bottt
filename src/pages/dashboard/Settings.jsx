import { useState } from 'react';
import { User, Shield, CreditCard, Bell, Save, Upload, Camera, Check } from 'lucide-react';
import { Card } from '../../components/ui/card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import FadeIn from '../../components/ui/FadeIn';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useBots } from '../../context/BotContext';
import { useToast } from '../../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { bots, getBotStats } = useBots();
  const { isDark } = useTheme();
  const toast = useToast();
  const stats = getBotStats();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    timezone: user?.timezone || 'UTC' 
  });
  const [security, setSecurity] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '', 
    twoFa: false 
  });
  const [notifications, setNotifications] = useState({ 
    weeklyReport: true, 
    newConversation: true, 
    botErrors: true 
  });

  const handleSaveProfile = async () => { 
    await updateProfile({ name: profile.name }); 
    toast.success('Profile settings updated! 🎉'); 
  };

  const handleSaveSecurity = () => {
    if (security.newPassword && security.newPassword !== security.confirmPassword) { 
      toast.error('Passwords do not match'); 
      return; 
    }
    toast.success('Security settings saved!');
    setSecurity({ ...security, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const billingStats = [
    { label: 'Total Chatbots', used: stats.totalBots, total: 5, color: 'bg-brand' },
    { label: 'Monthly Conversations', used: stats.totalConversations, total: 5000, color: 'bg-accent' },
    { label: 'Knowledge Base entries', used: stats.totalFaqs, total: 999, color: 'bg-success' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <FadeIn direction="none">
        <div className="mb-2">
          <h2 className="text-3xl font-black tracking-tight mb-2">Settings</h2>
          <p className="text-text-secondary text-sm">Manage your account preferences and security.</p>
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.1} direction="none">
        <div className="flex p-1.5 rounded-2xl bg-surface-raised border border-border shadow-sm">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab.id 
                  ? 'text-white' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute inset-0 bg-brand rounded-xl shadow-glow-brand" 
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? 'text-white' : ''}`} />
              <span className="hidden sm:inline relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'profile' && (
            <Card className="border-border/60 shadow-xl shadow-black/10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-8 mb-10 pb-8 border-b border-border/40">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-brand flex items-center justify-center shadow-glow-brand group-hover:scale-105 transition-transform duration-500">
                    <span className="text-3xl font-black text-white">{user?.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <button 
                    onClick={() => toast.info('Photo upload coming soon!')} 
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-surface-raised border border-border flex items-center justify-center shadow-xl hover:bg-brand hover:text-white transition-all hover:scale-110"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <h4 className="text-xl font-black tracking-tight mb-1">{user?.name}</h4>
                  <p className="text-sm text-text-secondary mb-4">{user?.email}</p>
                  <Badge variant="purple" className="px-4 py-1 font-black text-[10px] tracking-widest">{user?.plan || 'Personal'} Plan</Badge>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Input label="Full Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} id="settings-name" />
                <Input label="Email Address" value={profile.email} disabled id="settings-email" className="opacity-70" />
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-text-secondary">Timezone</label>
                  <select value={profile.timezone} onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))} className="w-full rounded-xl px-4 py-3 text-sm bg-surface-overlay border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none">
                    {['America/New_York','America/Chicago','America/Denver','America/Los_Angeles','Europe/London','Europe/Paris','Asia/Tokyo','Asia/Kolkata','UTC'].map(tz => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                </div>
              </div>
              <Button icon={Save} onClick={handleSaveProfile} className="shadow-lg shadow-brand/20">Save Changes</Button>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="border-border/60 shadow-xl shadow-black/10">
              <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-8">Security Configuration</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                  <Input label="Current Password" type="password" value={security.currentPassword} onChange={e => setSecurity(p => ({ ...p, currentPassword: e.target.value }))} id="sec-current" />
                </div>
                <Input label="New Password" type="password" value={security.newPassword} onChange={e => setSecurity(p => ({ ...p, newPassword: e.target.value }))} id="sec-new" />
                <Input label="Confirm New Password" type="password" value={security.confirmPassword} onChange={e => setSecurity(p => ({ ...p, confirmPassword: e.target.value }))} id="sec-confirm" />
              </div>
              <div className="flex items-center justify-between p-6 rounded-2xl bg-surface-overlay border border-border mb-8 group hover:border-brand/30 transition-colors">
                <div>
                  <p className="text-sm font-black text-text-primary mb-1">Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-text-secondary">Protect your account with an additional verification layer.</p>
                </div>
                <button 
                  onClick={() => { setSecurity(p => ({ ...p, twoFa: !p.twoFa })); toast.info('2FA integration coming soon!'); }} 
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${security.twoFa ? 'bg-brand' : 'bg-surface-raised border border-border'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-lg bg-white shadow-lg transition-transform duration-300 ${security.twoFa ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
              </div>
              <Button icon={Save} onClick={handleSaveSecurity} className="shadow-lg shadow-brand/20">Update Password</Button>
            </Card>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <Card className="border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-3">Subscription Status</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black">{user?.plan || 'Personal'}</span>
                      <span className="text-xs font-bold text-text-muted">/ Monthly</span>
                    </div>
                  </div>
                  <Button variant="outline" className="border-brand text-brand hover:bg-brand hover:text-white transition-all shadow-lg shadow-brand/10">Upgrade Plan</Button>
                </div>
                <div className="space-y-6">
                  {billingStats.map((item, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between text-xs font-bold mb-2.5">
                        <span className="text-text-secondary uppercase tracking-widest">{item.label}</span>
                        <span className="text-text-primary">{item.used.toLocaleString()} <span className="text-text-muted">/ {item.total === 999 ? 'Unlimited' : item.total.toLocaleString()}</span></span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-overlay overflow-hidden border border-border/40">
                        <motion.div 
                          className={`h-full ${item.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((item.used / item.total) * 100, 100)}%` }}
                          transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-border/60">
                <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-6">Payment Method</h3>
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-surface-overlay border border-border group hover:border-brand/30 transition-colors">
                  <div className="w-14 h-9 bg-gradient-to-br from-indigo-600 to-brand rounded-lg flex items-center justify-center text-white text-[10px] font-black tracking-widest shadow-lg">VISA</div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-text-primary mb-1">•••• •••• •••• 4242</p>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Expires 12/2026</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">Update</Button>
                </div>
              </Card>

              <Card className="border-border/60">
                <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-6">Invoice History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-surface-overlay/50">
                        {['Billing Date','Amount','Status'].map(h => (
                          <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest px-6 py-4 text-text-muted">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {[{ date: 'Apr 1, 2024', amount: '$19.00', status: 'Paid' }, { date: 'Mar 1, 2024', amount: '$19.00', status: 'Paid' }, { date: 'Feb 1, 2024', amount: '$19.00', status: 'Paid' }].map((inv, i) => (
                        <tr key={i} className="hover:bg-surface-overlay/30 transition-colors">
                          <td className="px-6 py-4 text-xs font-bold text-text-primary">{inv.date}</td>
                          <td className="px-6 py-4 text-xs font-black text-text-primary">{inv.amount}</td>
                          <td className="px-6 py-4"><Badge variant="success" className="px-3 py-0.5 font-black text-[9px] uppercase tracking-widest">{inv.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <Card className="border-border/60 shadow-xl shadow-black/10">
              <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-8">Notification Preferences</h3>
              <div className="space-y-4 mb-8">
                {[
                  { key: 'weeklyReport', label: 'Performance Summary', desc: 'Detailed weekly metrics and audience engagement reports.' },
                  { key: 'newConversation', label: 'Lead Notifications', desc: 'Instant alerts when a new potential customer starts a chat.' },
                  { key: 'botErrors', label: 'System Health Alerts', desc: 'Priority notifications for any script errors or downtime.' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-6 rounded-2xl bg-surface-overlay border border-border group hover:border-brand/30 transition-colors">
                    <div>
                      <p className="text-sm font-black text-text-primary mb-1">{item.label}</p>
                      <p className="text-xs text-text-secondary leading-relaxed max-w-sm">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key] }))} 
                      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${notifications[item.key] ? 'bg-brand' : 'bg-surface-raised border border-border'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 rounded-lg bg-white shadow-lg transition-transform duration-300 ${notifications[item.key] ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <Button icon={Save} onClick={() => toast.success('Notification preferences updated!')} className="shadow-lg shadow-brand/20">Save Preferences</Button>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Settings;
