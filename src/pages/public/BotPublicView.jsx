import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ChatWidget from '../../components/chatbot/ChatWidget';
import { Bot, Loader2 } from 'lucide-react';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) 
  ? import.meta.env.VITE_API_URL 
  : 'https://chat-bottt.onrender.com/api';

const BotPublicView = () => {
  const { botId } = useParams();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${API_URL}/bots/${botId}/public`);
        if (!res.ok) {
          throw new Error('Bot not found or is currently inactive.');
        }
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [botId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05050a] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand animate-spin mb-4" />
        <p className="text-text-secondary font-black uppercase tracking-widest text-sm">Loading Chatbot...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#05050a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-danger/10 flex items-center justify-center mb-6">
          <Bot className="w-10 h-10 text-danger" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Oops!</h1>
        <p className="text-text-secondary">{error}</p>
      </div>
    );
  }

  // Fallback defaults
  const bgColor = config.background_color || '#0d0d1a';
  const primaryColor = config.primary_color || '#6366f1';

  return (
    <>
      <Helmet>
        <title>{config.chat_window_title || config.name || 'ChatBot'}</title>
        <meta name="theme-color" content={bgColor} />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-8" style={{ backgroundColor: bgColor }}>
        <div className="w-full max-w-4xl h-[85vh] min-h-[500px] flex rounded-3xl overflow-hidden shadow-2xl" style={{ border: `1px solid ${primaryColor}40` }}>
          
          {/* Chat Side */}
          <div className="flex-1 relative bg-black/20">
            <ChatWidget
              botId={botId}
              primaryColor={primaryColor}
              backgroundColor="transparent"
              welcomeMessage={config.welcome_message}
              chatWindowTitle={config.chat_window_title}
              fallbackMessage={config.fallback_message}
              inline
              className="h-full rounded-none border-none shadow-none"
            />
          </div>
          
        </div>
      </div>
    </>
  );
};

export default BotPublicView;
