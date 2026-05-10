import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Globe, Layout, Code2, Link as LinkIcon, Check, Copy } from 'lucide-react';
import { Card } from '../../components/ui/card';
import Button from '../../components/ui/Button';
import ChatWidget from '../../components/chatbot/ChatWidget';
import FadeIn from '../../components/ui/FadeIn';
import { useBots } from '../../context/BotContext';
import { useToast } from '../../hooks/useToast';
import { generateEmbedCode } from '../../utils/generateEmbedCode';

const BotEmbed = () => {
  const { botId } = useParams();
  const { getBot } = useBots();
  const toast = useToast();
  const navigate = useNavigate();
  const bot = getBot(botId);
  const [copied, setCopied] = useState(null);

  if (!bot) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <p className="text-text-secondary mb-6 font-bold uppercase tracking-widest text-xs">Bot not found</p>
        <Button onClick={() => navigate('/dashboard/bots')}>Return to Dashboard</Button>
      </div>
    );
  }

  const { scriptTag, reactComponent, iframeEmbed } = generateEmbedCode(bot.id, bot.name);
  const publicUrl = `${window.location.origin}/bot/${bot.id}`;

  const copyCode = (code, label) => {
    navigator.clipboard.writeText(code);
    setCopied(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const codeBlocks = [
    { label: 'Script Tag', code: scriptTag, desc: 'Paste inside <head> or before </body> on any website.', icon: Globe },
    { label: 'React Integration', code: reactComponent, desc: 'Optimized for React, Next.js, and Vite apps.', icon: Layout },
    { label: 'iFrame Embed', code: iframeEmbed, desc: 'Embed the bot in a specific container on your page.', icon: Code2 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <FadeIn direction="none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-2">Deploy {bot.name}</h2>
            <p className="text-text-secondary text-sm">Add this chatbot to your website or share it via link.</p>
          </div>
          <Button variant="outline" icon={Share2} onClick={() => copyCode(publicUrl, 'Public URL')} className="border-border hover:bg-surface-raised">
            Share Link
          </Button>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Public Link Card */}
          <FadeIn delay={0.1}>
            <Card className="border-brand/30 bg-gradient-to-br from-brand/10 to-transparent">
              <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-4 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-brand" /> Shareable Link
              </h3>
              <p className="text-sm text-text-secondary mb-4">Share this direct link to let users chat with your bot without embedding it.</p>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={publicUrl} 
                  readOnly 
                  className="flex-1 bg-surface-overlay border border-border rounded-xl px-4 py-3 text-sm text-text-primary outline-none"
                />
                <Button 
                  onClick={() => copyCode(publicUrl, 'Public URL')} 
                  variant={copied === 'Public URL' ? 'success' : 'primary'}
                >
                  {copied === 'Public URL' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="outline" onClick={() => window.open(publicUrl, '_blank')}>
                  Open
                </Button>
              </div>
            </Card>
          </FadeIn>

          {/* Embed Codes */}
          {codeBlocks.map((block, i) => (
            <FadeIn key={i} delay={0.2 + (i * 0.1)}>
              <Card className="border-border/60">
                <div className="p-1 pb-4 flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                      <block.icon className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-1">{block.label}</h3>
                      <p className="text-xs text-text-muted">{block.desc}</p>
                    </div>
                  </div>
                  <Button 
                    variant={copied === block.label ? 'success' : 'outline'} 
                    size="sm" 
                    onClick={() => copyCode(block.code, block.label)}
                    className="text-xs shrink-0"
                  >
                    {copied === block.label ? <><Check className="w-3.5 h-3.5 mr-1" /> Copied</> : <><Copy className="w-3.5 h-3.5 mr-1" /> Copy</>}
                  </Button>
                </div>
                <div className="relative group">
                  <pre className="relative rounded-2xl p-4 text-[12px] font-mono leading-relaxed overflow-x-auto bg-gray-950 border border-white/5 custom-scrollbar">
                    <code className="text-emerald-400">{block.code}</code>
                  </pre>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Live Preview Side */}
        <div className="md:col-span-1">
          <FadeIn delay={0.3} className="h-full">
            <Card className="border-border/60 h-full flex flex-col p-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-6">Live Preview</h3>
              <div className="flex-1 min-h-[500px] relative rounded-3xl overflow-hidden border border-border shadow-2xl bg-surface-overlay p-2">
                <ChatWidget 
                  botId={bot.id} 
                  faqs={bot.faqs} 
                  primaryColor={bot.primaryColor || bot.primary_color} 
                  backgroundColor={bot.backgroundColor || bot.background_color}
                  welcomeMessage={bot.welcomeMessage || bot.welcome_message} 
                  chatWindowTitle={bot.chatWindowTitle || bot.chat_window_title} 
                  fallbackMessage={bot.fallbackMessage || bot.fallback_message} 
                  launcherIcon={bot.launcherIcon || bot.launcher_icon} 
                  inline 
                />
              </div>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default BotEmbed;
