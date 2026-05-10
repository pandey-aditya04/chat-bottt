import { Check } from 'lucide-react';
import Button from '../components/ui/Button';
import FadeIn from '../components/ui/FadeIn';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = async (plan) => {
    if (!user) {
      navigate('/signup');
      return;
    }
    try {
      const { data } = await api.post('/billing/create-checkout', { plan });
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
    }
  };

  const plans = [
    {
      name: 'Free Trial',
      price: '$0',
      description: 'Perfect for testing out the platform.',
      features: ['1 Chatbot', '50 Messages/month', '10 Knowledge Sources', 'Basic Support'],
      action: () => navigate('/signup'),
      buttonText: 'Get Started'
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      popular: true,
      description: 'Ideal for small businesses and growing teams.',
      features: ['5 Chatbots', '5,000 Messages/month', '100 Knowledge Sources', 'Custom Branding', 'Priority Support'],
      action: () => handleUpgrade('pro'),
      buttonText: 'Upgrade to Pro'
    },
    {
      name: 'Business',
      price: '$49',
      period: '/month',
      description: 'For high-volume operations requiring dedicated resources.',
      features: ['Unlimited Chatbots', 'Unlimited Messages', 'Unlimited Knowledge Sources', 'Advanced Analytics', 'Dedicated Account Manager'],
      action: () => handleUpgrade('business'),
      buttonText: 'Contact Sales'
    }
  ];

  return (
    <div className="py-24 sm:py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">Simple, Transparent Pricing</h1>
            <p className="text-lg text-text-secondary">Choose the perfect plan for your business. Upgrade or downgrade at any time.</p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1} className="h-full">
              <div className={`relative h-full flex flex-col rounded-3xl p-8 bg-surface border ${plan.popular ? 'border-brand shadow-2xl shadow-brand/20' : 'border-border'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <span className="bg-brand text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-lg font-black uppercase tracking-widest mb-2">{plan.name}</h3>
                  <p className="text-sm text-text-secondary mb-6">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">{plan.price}</span>
                    {plan.period && <span className="text-text-muted">{plan.period}</span>}
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-text-secondary">
                        <Check className="w-5 h-5 text-brand shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={plan.action}
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {plan.buttonText}
                </Button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
