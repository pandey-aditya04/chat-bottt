import { ModernPricingPage } from '../../components/ui/animated-glassy-pricing';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
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

  const myPricingPlans = [
    {
      planName: 'Free Trial',
      price: '0',
      description: 'Perfect for testing out the platform.',
      features: ['1 Chatbot', '50 Messages/month', '10 Knowledge Sources', 'Basic Support'],
      onClick: () => navigate('/signup'),
      buttonText: 'Get Started',
      buttonVariant: 'secondary'
    },
    {
      planName: 'Pro',
      price: '19',
      isPopular: true,
      description: 'Ideal for small businesses and growing teams.',
      features: ['5 Chatbots', '5,000 Messages/month', '100 Knowledge Sources', 'Custom Branding', 'Priority Support'],
      onClick: () => handleUpgrade('pro'),
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'primary'
    },
    {
      planName: 'Business',
      price: '49',
      description: 'For high-volume operations requiring dedicated resources.',
      features: ['Unlimited Chatbots', 'Unlimited Messages', 'Unlimited Knowledge Sources', 'Advanced Analytics', 'Dedicated Account Manager'],
      onClick: () => handleUpgrade('business'),
      buttonText: 'Contact Sales',
      buttonVariant: 'primary'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
        <ModernPricingPage
        title={<>Simple, <span className="text-cyan-400">Transparent</span> Pricing</>}
        subtitle="Choose the perfect plan for your business needs. All plans include 24/7 AI-powered support."
        plans={myPricingPlans}
        showAnimatedBackground={true}
        />
    </div>
  );
};

export default PricingPage;
