import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check, ChevronDown, ChevronUp, Code2, ExternalLink, Globe, Layout, Smartphone } from 'lucide-react';
import { Card } from '../../components/ui/card';
import Button from '../../components/ui/Button';
import ChatWidget from '../../components/chatbot/ChatWidget';
import FadeIn from '../../components/ui/FadeIn';
import { useBots } from '../../context/BotContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';
import { generateEmbedCode } from '../../utils/generateEmbedCode';
import { motion, AnimatePresence } from 'framer-motion';

const BotEmbed = () => {
  const { botId } = useParams();
  const { getBot } = useBots();
  const { isDark } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const bot = getBot(botId);
  const [copied, setCopied] = useState(null);
  const [openGuide, setOpenGuide] = useState(null);
  const [showWidget, setShowWidget] = useState(false);

  if (!bot) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <p className="text-text-secondary mb-6 font-bold uppercase tracking-widest text-xs">Bot not found</p>
        <Button onClick={() => navigate('/dashboard/bots')}>Return to Dashboard</Button>
      </div>
    );
  }

  const { scriptTag, reactComponent, iframeEmbed } = generateEmbedCode(bot.id, bot.name);

  const copyCode = (code, label) => {
    navigator.clipboard.writeText(code);
    setCopied(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const codeBlocks = [
    { label: 'Script Tag', code: scriptTag, desc: 'Recommended for most websites. Paste inside <head> or before </body>.', icon: Globe },
    { label: 'React Integration', code: reactComponent, desc: 'Optimized for modern React applications using our SDK.', icon: Layout },
    { label: 'iFrame Embed', code: iframeEmbed, desc: 'Embed the bot directly into a specific section of your page.', icon: Smartphone },
  ];

  const guides = [
    { name: 'WordPress', steps: ['Login to WP Admin', 'Go to Appearance > Theme File Editor', 'Select footer.php on the right', 'Paste the script tag before the </body> tag', 'Click Update File'] },
    { name: 'Shopify', steps: ['Go to Online Store > Themes', 'Click ... > Edit Code', 'Open layout/theme.liquid', 'Paste the script tag before </body>', 'Save changes'] },
    { name: 'Webflow', steps: ['Open Site Settings', 'Navigate to the Custom Code tab', 'Find the Footer Code section', 'Paste the script tag', 'Publish your site'] },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <FadeIn direction="none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-2">Embed {bot.name}</h2>
            <p className="text-text-secondary text-sm">Deploy your AI assistant to any platform with these simple code snippets.</p>
          </div>
          <Button variant="outline" icon={ExternalLink} onClick={() => setShowWidget(true)} className="border-border hover:bg-surface-raised">
            Live Preview
          </Button>
        </div>
      </FadeIn>

      {/* Code Blocks */}
      <div className="space-y-6">
        {codeBlocks.map((block, i) => (
          <FadeIn key={i} delay={0.1 + (i * 0.1)}>
            <Card className="border-border/60 overflow-hidden">
              <div className="p-6 pb-0 flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <block.icon className="w-5.5 h-5.5 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-1">{block.label}</h3>
                    <p className="text-xs text-text-muted leading-relaxed max-w-md">{block.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => copyCode(block.code, block.label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    copied === block.label 
                      ? 'bg-success text-white shadow-lg shadow-success/20' 
                      : 'bg-surface-overlay hover:bg-border text-text-primary border border-border shadow-sm'
                  }`}
                >
                  {copied === block.label ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Code</>}
                </button>
              </div>
              <div className="p-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-brand/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <pre className="relative rounded-2xl p-6 text-[13px] font-mono leading-relaxed overflow-x-auto bg-gray-950 border border-white/5 custom-scrollbar shadow-inner">
                    <code className="text-emerald-400">
                      {block.code}
                    </code>
                  </pre>
                </div>
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>

      {/* Installation Guides */}
      <FadeIn delay={0.4}>
        <Card className="border-border/60 bg-surface-raised/30">
          <div className="p-6">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3">
              <Code2 className="w-5 h-5 text-brand" /> CMS Installation Guides
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {guides.map((guide, i) => (
                <div key={i} className="space-y-4">
                  <button 
                    onClick={() => setOpenGuide(openGuide === i ? null : i)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      openGuide === i ? 'bg-brand border-brand text-white shadow-glow-brand' : 'bg-surface border-border hover:border-brand/50'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest">{guide.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openGuide === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openGuide === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-3 px-2 py-2">
                          {guide.steps.map((s, si) => (
                            <li key={si} className="flex gap-3 text-xs leading-relaxed text-text-secondary">
                              <span className="font-black text-brand tabular-nums">{si + 1}.</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </FadeIn>

      {showWidget && (
        <ChatWidget
          botId={bot.id}
          isOpen={true}
          onToggle={() => setShowWidget(false)}
        />
      )}
    </div>
  );
};

export default BotEmbed;
