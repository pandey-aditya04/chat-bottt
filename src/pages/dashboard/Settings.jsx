import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FadeIn from '../../components/ui/FadeIn';
import { CreditCard, Shield, User, Settings as SettingsIcon, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import api from '../../lib/api';

const Settings = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    // Check if returned from stripe
    const query = new URLSearchParams(window.location.search);
    if (query.get('checkout') === 'success') {
      toast.success('Subscription updated successfully!');
      // remove query param
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleUpgrade = async (plan) => {
    try {
      setBillingLoading(true);
      const { data } = await api.post('/billing/create-checkout', { plan });
      window.location.href = data.url;
    } catch (error) {
      toast.error('Failed to initiate checkout');
      setBillingLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setBillingLoading(true);
      const { data } = await api.post('/billing/portal');
      window.location.href = data.url;
    } catch (error) {
      toast.error('Failed to open billing portal');
      setBillingLoading(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <FadeIn direction="none">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-brand" /> Settings
          </h2>
          <p className="text-text-secondary text-sm">Manage your account preferences and subscription.</p>
        </div>
      </FadeIn>

      <div className="flex gap-2 p-1 bg-surface-raised rounded-2xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'account' && (
            <FadeIn delay={0.1}>
              <Card className="border-border/60 p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-1">Profile Information</h3>
                  <p className="text-xs text-text-secondary">Update your account details here.</p>
                </div>
                
                <div className="space-y-4">
                  <Input label="Email Address" value={user?.email || ''} readOnly disabled className="opacity-70" />
                  <Input label="Full Name" placeholder="John Doe" />
                </div>
                
                <Button>Save Changes</Button>
              </Card>
            </FadeIn>
          )}

          {activeTab === 'billing' && (
            <FadeIn delay={0.1}>
              <Card className="border-border/60 p-8 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-1">Current Plan</h3>
                    <p className="text-xs text-text-secondary">You are currently on the <span className="font-bold text-brand uppercase">{user?.plan_tier || 'Free'}</span> plan.</p>
                  </div>
                  {(user?.plan_tier !== 'free') && (
                    <Button variant="outline" size="sm" onClick={handleManageBilling} loading={billingLoading} icon={ExternalLink}>
                      Manage Billing
                    </Button>
                  )}
                </div>

                {/* Usage Stats */}
                <div className="bg-surface-raised rounded-2xl p-6 space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">Current Usage</h4>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-text-secondary">Messages this month</span>
                      <span className="font-bold">{user?.messages_used_this_month || 0} / {user?.plan_limits?.messages_per_month === 999999 ? 'Unlimited' : user?.plan_limits?.messages_per_month}</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-brand h-full rounded-full" 
                        style={{ width: `${Math.min(((user?.messages_used_this_month || 0) / (user?.plan_limits?.messages_per_month || 50)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {user?.plan_tier === 'free' && (
                  <div className="p-6 rounded-2xl border border-brand/30 bg-brand/5 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-brand" />
                      Upgrade to Pro
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Get up to 5 bots, 5,000 messages/month, and premium support. Perfect for growing businesses.
                    </p>
                    <Button onClick={() => handleUpgrade('pro')} loading={billingLoading}>
                      Upgrade Now ($19/mo)
                    </Button>
                  </div>
                )}
              </Card>
            </FadeIn>
          )}

          {activeTab === 'security' && (
            <FadeIn delay={0.1}>
              <Card className="border-border/60 p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-1">Change Password</h3>
                  <p className="text-xs text-text-secondary">Ensure your account is using a long, random password to stay secure.</p>
                </div>
                
                <div className="space-y-4">
                  <Input type="password" label="Current Password" placeholder="••••••••" />
                  <Input type="password" label="New Password" placeholder="••••••••" />
                </div>
                
                <Button>Update Password</Button>
              </Card>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
