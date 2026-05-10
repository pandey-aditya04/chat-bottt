import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Minus, Loader2 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

const API_URL = (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) 
  ? import.meta.env.VITE_API_URL 
  : 'https://chat-bottt.onrender.com/api';

const ChatWidget = ({
  botId,
  faqs: initialFaqs = [],
  primaryColor: initialColor = '#6366f1',
  backgroundColor: initialBgColor = '#0d0d1a',
  position: initialPosition = 'Right',
  welcomeMessage: initialWelcome = 'Hi! How can I help you today?',
  chatWindowTitle: initialTitle = 'Support Chat',
  fallbackMessage: initialFallback = "I'm not sure about that. Please contact our support team.",
  launcherIcon = 'Chat Bubble',
  isOpen: controlledOpen,
  onToggle,
  inline = false,
  isDemo = false,
  className = '',
}) => {
  // Config state
  const [config, setConfig] = useState({
    faqs: initialFaqs,
    primaryColor: initialColor,
    backgroundColor: initialBgColor,
    position: initialPosition,
    welcomeMessage: initialWelcome,
    chatWindowTitle: initialTitle,
    fallbackMessage: initialFallback
  });

  const [isOpenState, setIsOpenState] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : isOpenState;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(!!botId);
  const [sessionId] = useState(() => `session_${Math.random().toString(36).substr(2, 9)}`);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch bot config if botId is provided
  useEffect(() => {
    if (botId) {
      const fetchConfig = async () => {
        try {
          const res = await fetch(`${API_URL}/bots/public/${botId}`);
          if (res.ok) {
            const data = await res.json();
            setConfig({
              faqs: data.faqs || [],
              primaryColor: data.primaryColor || initialColor,
              backgroundColor: data.backgroundColor || initialBgColor,
              position: data.position || initialPosition,
              welcomeMessage: data.welcomeMessage || initialWelcome,
              chatWindowTitle: data.chatWindowTitle || initialTitle,
              fallbackMessage: data.fallbackMessage || initialFallback
            });
            // Set initial message from fetched config
            setMessages([
              { 
                id: 'welcome', 
                role: 'bot', 
                text: data.welcomeMessage || initialWelcome, 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              }
            ]);
          }
        } catch (err) {
          console.error('Failed to fetch bot config:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchConfig();
    } else {
      // If no botId, just set initial message from props
      setMessages([
        { 
          id: 'welcome', 
          role: 'bot', 
          text: config.welcomeMessage, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    }
  }, [botId]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !inline && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, inline]);

  // Scroll to bottom
  useEffect(() => {
    // Only scroll if there's more than just the welcome message, or if typing
    if (messages.length > 1 || isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    if (botId || isDemo) {
      // Server-side interaction
      try {
        const endpoint = isDemo ? `${API_URL}/chat/demo` : `${API_URL}/chat`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            botId, 
            query: currentInput, 
            messages: messages.map(m => ({ role: m.role, content: m.text })),
            sessionId 
          })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Server responded with an error');
        }

        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'bot',
          text: data.reply || data.text || "I'm sorry, I couldn't process that.",
          time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } catch (err) {
        console.error('ChatWidget error:', err);
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'bot',
          text: `⚠️ Error: ${err.message || "Couldn't connect to AI. Please check if the server is running."}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } else {
      // Local interaction (fallback/demo/preview)
      setTimeout(() => {
        const match = matchFAQ(currentInput);
        setIsTyping(false);
        
        let responseText = match ? match.answer : config.fallbackMessage;
        
        // If it's a preview (no botId), add a hint
        if (!botId && !isDemo) {
          responseText = `(PREVIEW) ${responseText}\n\n💡 Save your bot to test real AI responses!`;
        }

        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'bot',
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 800);
    }
  };

  const matchFAQ = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    const words = lowerQuery.replace(/[?!.,]/g, '').split(/\s+/).filter(w => w.length >= 2);
    let bestMatch = null;
    let bestScore = 0;

    for (const faq of config.faqs) {
      const faqWords = faq.question.toLowerCase().replace(/[?!.,]/g, '').split(/\s+/);
      let score = 0;
      for (const word of words) {
        if (faqWords.some(fw => fw.includes(word) || word.includes(fw))) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    }
    return bestScore >= 1 ? bestMatch : null;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleOpen = () => {
    if (onToggle) onToggle();
    else setIsOpenState(prev => !prev);
  };

  const LauncherIcons = {
    'Chat Bubble': MessageCircle,
    'Robot': Bot,
    'Headphones': MessageCircle,
    'Custom': MessageCircle,
  };
  const LauncherIcon = LauncherIcons[launcherIcon] || MessageCircle;

  const positionClasses = config.position === 'Left' ? 'left-5' : 'right-5';

  if (isLoading) return null;

  const content = (
    <div className={`flex flex-col shadow-2xl transition-all duration-300 ${inline ? 'w-full h-full rounded-2xl' : 'rounded-2xl h-[520px] w-[380px]'}`}
      style={{ backgroundColor: config.backgroundColor, border: `1px solid ${config.primaryColor}30` }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: config.primaryColor }}>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold text-sm">{config.chatWindowTitle}</h4>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/70 text-xs">Online</span>
          </div>
        </div>
        {!inline && (
          <div className="flex gap-1">
            <button onClick={toggleOpen} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <Minus className="w-4 h-4 text-white" />
            </button>
            <button onClick={toggleOpen} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} primaryColor={config.primaryColor} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10 focus-within:border-white/30 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-1.5 rounded-lg transition-all disabled:opacity-30 disabled:scale-95"
            style={{ backgroundColor: input.trim() && !isTyping ? config.primaryColor : 'transparent' }}
          >
            {isTyping ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
          </button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-[9px] text-white/20 uppercase tracking-widest font-black">Powered by ChatBot Builder</span>
        </div>
      </div>
    </div>
  );

  if (inline) return <div className={`w-full max-w-sm mx-auto ${className}`} style={{ height: '480px' }}>{content}</div>;

  return (
    <div className={`fixed bottom-5 ${positionClasses} z-50`}>
      {isOpen && (
        <div className={`absolute bottom-16 ${config.position === 'Left' ? 'left-0' : 'right-0'} animate-chat-open`}>
          {content}
        </div>
      )}
      <button
        onClick={toggleOpen}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse-glow"
        style={{ backgroundColor: config.primaryColor }}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <LauncherIcon className="w-6 h-6 text-white" />}
      </button>
    </div>
  );
};

export default ChatWidget;
