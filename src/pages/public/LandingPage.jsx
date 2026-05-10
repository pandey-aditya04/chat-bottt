import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bot, Zap, Palette, BarChart2, Layers, Settings2,
  ArrowRight, Check, MessageCircle, ChevronRight,
  Share2, Link as LinkIcon, Globe, Play, Star, ExternalLink,
  Menu, X, Moon, Sun
} from 'lucide-react';
import { pricingPlans } from '../../data/pricingPlans';
import { mockBots } from '../../data/mockBots';
import ChatWidget from '../../components/chatbot/ChatWidget';
import FadeIn from '../../components/ui/FadeIn';
import { InteractiveRobotSpline } from '../../components/ui/interactive-3d-robot';
import { LiquidButton } from '../../components/ui/liquid-glass-button';
import { SpotlightHover } from '../../components/ui/spotlight-hover';
import { Boxes } from '../../components/ui/background-boxes';
import { FeaturesSection } from '../../components/ui/features-5';
import { WavePath } from '../../components/ui/wave-path';
import { ContainerScroll } from '../../components/ui/container-scroll-animation';
import { PricingCard } from '../../components/ui/animated-glassy-pricing';
import { RobotFlyby } from '../../components/ui/robot-flyby';
import HeroFuturistic from '../../components/ui/hero-futuristic';
import StickyFooter from '../../components/ui/footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const features = [
  { icon: MessageCircle, title: 'FAQ Knowledge Base', description: 'Add your FAQs and let your chatbot answer them instantly.' },
  { icon: Zap, title: 'Instant Deploy', description: 'Deploy your chatbot with a single line of code in under a minute.' },
  { icon: Palette, title: 'Custom Branding', description: "Match your chatbot's look and feel to your brand." },
  { icon: BarChart2, title: 'Analytics Dashboard', description: 'Track conversations, popular questions, and performance.' },
  { icon: Layers, title: 'Multi-Bot Support', description: 'Create and manage multiple chatbots for different sites.' },
  { icon: Settings2, title: 'No-Code Setup', description: 'Build your chatbot through our intuitive visual interface.' },
];

const steps = [
  { num: '01', title: 'Add Your FAQs', description: 'Enter your questions and answers. Import from CSV or type them in.' },
  { num: '02', title: 'Customize Your Bot', description: 'Choose colors, set the tone, and preview live changes.' },
  { num: '03', title: 'Embed on Your Website', description: "Copy a script tag and paste it. You're live in seconds." },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);
  const demoBot = mockBots[0];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-surface text-text-primary' : 'light bg-surface text-text-primary'}`}>
      <Helmet>
        <title>ChatBot Builder | Build AI Chatbots for Your Website</title>
        <meta name="description" content="Transform your static FAQ into an intelligent, interactive assistant in minutes. No-code AI platform for building custom chatbots." />
        <meta property="og:title" content="ChatBot Builder | No-Code AI Assistant" />
        <meta property="og:description" content="Build AI Chatbots your visitors actually talk to. Transform your static FAQ into an interactive assistant." />
      </Helmet>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 ${isDark ? 'bg-surface/80' : 'bg-surface/80'} backdrop-blur-xl border-b border-border`}>
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-glow-brand">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">ChatBot<span className="gradient-text">Builder</span></span>
            </Link>
            
            <div className="hidden md:flex items-center gap-10">
              {['Features', 'How It Works', 'Pricing'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-surface-overlay transition-colors border border-border">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {isAuthenticated ? (
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/login')} 
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-surface-overlay transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigate('/signup')} 
                    className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-text-primary">
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface-raised border-t border-border overflow-hidden"
            >
              <div className="px-6 py-8 space-y-5">
                {['Features', 'How It Works', 'Pricing'].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                    onClick={() => setMobileMenu(false)}
                    className="block text-lg font-medium"
                  >
                    {item}
                  </a>
                ))}
                <div className="flex flex-col gap-4 pt-4">
                  <button onClick={() => { navigate('/login'); setMobileMenu(false); }} className="w-full py-3 text-center font-semibold rounded-xl bg-surface-overlay">Login</button>
                  <button onClick={() => { navigate('/signup'); setMobileMenu(false); }} className="w-full py-3 text-center font-semibold rounded-xl bg-brand text-white">Get Started</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <HeroFuturistic onExplore={() => navigate('/signup')} />

      {/* How It Works */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-surface-raised/30">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="mb-4">How It <span className="gradient-text">Works</span></h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">Three simple steps to deploy your AI assistant</p>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1} className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-2xl font-black mb-8 group-hover:scale-110 group-hover:shadow-glow-brand transition-all duration-500">
                  {step.num}
                </div>
                <h3 className="mb-4 text-xl">{step.title}</h3>
                <p className="text-text-secondary leading-relaxed">{step.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive 3D Flyby */}
      <section className="relative z-10 -mt-10 mb-10">
        <RobotFlyby />
      </section>

      {/* Dashboard Preview with Scroll Animation */}
      <section className="bg-surface overflow-hidden">
        <ContainerScroll
          titleComponent={
            <div className="mb-10">
              <h2 className="text-4xl md:text-5xl font-semibold gradient-text mb-4">
                Monitor Everything in Real-Time
              </h2>
              <p className="text-text-secondary text-lg">
                Get deep insights into your chatbot's performance and customer interactions.
              </p>
            </div>
          }
        >
          <img
            src="/chatbot_analytics_dashboard.png"
            alt="Dashboard Analytics Preview"
            className="w-full h-full object-cover object-left-top rounded-2xl"
            draggable={false}
          />
        </ContainerScroll>
      </section>

      {/* Features */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="mb-4">Everything You <span className="gradient-text">Need</span></h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">Powerful features built for conversion and scale</p>
            </FadeIn>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.08} className="p-8 rounded-2xl bg-surface-raised border border-border hover:border-brand/50 hover:shadow-card-hover transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-brand/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-brand" />
                </div>
                <h3 className="mb-3">{f.title}</h3>
                <p className="text-text-secondary">{f.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Scaling Features */}
      <FeaturesSection />

      {/* Interactive Separator */}
      <section className="w-full flex flex-col items-center justify-center py-16 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/5 to-transparent pointer-events-none" />
        <div className="flex w-[80vw] md:w-[70vw] flex-col items-center relative z-10">
          <WavePath className="mb-12" />
          <div className="flex w-full flex-col items-center text-center max-w-2xl">
            <p className="text-brand font-black uppercase tracking-widest text-xs mb-4">Fluid Interaction</p>
            <p className="text-text-secondary text-xl md:text-2xl leading-relaxed">
              Experience natural, flowing dialogue powered by advanced AI. Hover the line above to feel the responsiveness.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 lg:py-32 bg-surface-raised/50 overflow-hidden relative">
        {/* Ambient background glow for the bot */}
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] -translate-y-1/2 bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="mb-4">Try It <span className="gradient-text">Live</span></h2>
              <p className="text-text-secondary text-lg">Experience the smooth, instant responses for yourself</p>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Interactive Bot Side */}
            <FadeIn delay={0.2} className="hidden md:block relative h-[500px] w-full">
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-8">
                <div className="bg-surface/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl text-sm font-medium shadow-xl">
                  👋 Hover over me! I'm watching your cursor.
                </div>
              </div>
              <InteractiveRobotSpline 
                scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
                className="w-full h-full"
              />
            </FadeIn>

            {/* Chat Widget Side */}
            <FadeIn delay={0.3} className="flex justify-center md:justify-start">
              <div className="w-full max-w-lg shadow-2xl rounded-3xl overflow-hidden border border-border bg-surface relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand to-accent rounded-[26px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative">
                  <ChatWidget 
                    faqs={demoBot.faqs} 
                    primaryColor="#6366f1" 
                    welcomeMessage="Hi! 👋 I'm your interactive demo bot. Ask me anything about ChatBot Builder!" 
                    chatWindowTitle="Live Demo" 
                    isDemo={true}
                    inline 
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="mb-4">Simple <span className="text-cyan-400">Pricing</span></h2>
              <p className="text-text-secondary text-lg">Start free, upgrade as you grow</p>
            </FadeIn>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            {pricingPlans.map((plan, i) => (
              <PricingCard
                key={i}
                planName={plan.name}
                description={plan.description}
                price={plan.price.replace('$', '')}
                features={plan.features}
                buttonText={plan.cta}
                isPopular={plan.highlight}
                buttonVariant={plan.highlight ? 'primary' : 'secondary'}
                onClick={() => navigate('/signup')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <StickyFooter />
    </div>
  );
};

export default LandingPage;
