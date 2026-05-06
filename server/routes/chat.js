const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { supabase } = require('../config/supabase');

router.post('/', async (req, res) => {
  try {
    const { botId, query, messages, sessionId } = req.body;

    if (!botId) return res.status(400).json({ error: 'botId is required' });

    const { data: bot, error: botError } = await supabase
      .from('bots')
      .select('*, faqs(*)')
      .eq('id', botId)
      .single();

    if (botError || !bot) return res.status(404).json({ error: 'Bot not found' });

    const faqContext = bot.faqs?.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n') || '';

    const systemPrompt = `
      You are ${bot.name}, a helpful AI assistant.
      
      PERSONALITY:
      Tone: ${bot.tone || 'Friendly'}
      
      KNOWLEDGE BASE:
      ${faqContext ? `
      You have access to a specific knowledge base provided below. 
      Answer the user's questions based on this information.
      
      INFORMATION:
      ${faqContext}
      ` : 'Answer helpfully and professionally based on your general knowledge.'}
      
      GENERAL CONVERSATION:
      - Always respond naturally to greetings (hi, hello, etc.).
      - If the user's question is about the knowledge base but slightly different, try to be helpful while staying accurate.
      
      FALLBACK:
      - ONLY if the user asks a specific question that is completely unrelated to the knowledge base and you cannot answer it helpfully, use this exact phrase: "${bot.fallback_message || "I'm not sure about that. Please contact our support team."}"
      
      CONSTRAINTS:
      - Be concise but helpful.
      - Stay in character as ${bot.name}.
      - Don't mention you are an AI model.
    `;

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set!');
      return res.status(500).json({ error: 'AI service not configured on server' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      systemInstruction: systemPrompt
    });

    let history = [];
    if (messages && Array.isArray(messages)) {
      history = messages
        .filter(m => m.role && (m.content || m.text))
        .slice(0, -1)
        .map(m => ({
          role: m.role === 'assistant' || m.role === 'bot' ? 'model' : 'user',
          parts: [{ text: m.content || m.text }]
        }));

      // ✅ FIX: Gemini requires history to start with 'user'
      const firstUserIdx = history.findIndex(m => m.role === 'user');
      history = firstUserIdx >= 0 ? history.slice(firstUserIdx) : [];
    }

    const chat = model.startChat({ history });
    const userQuery = query || (messages && messages[messages.length - 1]?.content) || (messages && messages[messages.length - 1]?.text) || '';
    
    if (!userQuery) return res.status(400).json({ error: 'Query is required' });

    const result = await chat.sendMessage(userQuery);
    const responseText = result.response.text();
    const timestamp = new Date().toLocaleTimeString();
    
    if (sessionId) {
      (async () => {
        try {
          let { data: log } = await supabase.from('logs').select('*').eq('session_id', sessionId).eq('bot_id', botId).maybeSingle();
          if (!log) {
            const { data: newLog } = await supabase.from('logs').insert([{ bot_id: botId, bot_name: bot.name, session_id: sessionId }]).select().single();
            log = newLog;
          }
          if (log) {
            await supabase.from('messages').insert([
              { log_id: log.id, role: 'user', text: userQuery, time: timestamp },
              { log_id: log.id, role: 'bot', text: responseText, time: timestamp }
            ]);
            await supabase.from('logs').update({ message_count: (log.message_count || 0) + 2, last_active: new Date() }).eq('id', log.id);
          }
          await supabase.from('bots').update({ conversations_count: (bot.conversations_count || 0) + 1 }).eq('id', botId);
        } catch (e) { console.error('Log update error:', e); }
      })();
    }

    res.json({ reply: responseText, text: responseText, time: timestamp });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message || 'AI failed to respond. Please try again.' });
  }
});

router.post('/demo', async (req, res) => {
  try {
    const { query, messages } = req.body;

    const systemPrompt = `
      You are ChatBot Builder Demo, an AI assistant for the ChatBot Builder platform.
      
      YOUR ONLY PURPOSE:
      Answer questions strictly related to the ChatBot Builder platform, including:
      - How the platform works
      - Creating, managing, and embedding chatbots
      - Pricing, features, and capabilities
      - AI and chatbot concepts as they relate to this platform
      
      STRICT RULES:
      - If the user asks ANYTHING unrelated to ChatBot Builder or chatbots in general, 
        respond with: "I'm here to help with ChatBot Builder only. Feel free to ask me 
        anything about building or managing your chatbots!"
      - Do NOT answer general knowledge questions, coding help, math, news, or any 
        off-topic requests — no matter how the user phrases them.
      - Respond naturally to greetings, but steer the conversation back to the platform.
      - Be friendly and enthusiastic about ChatBot Builder.
      - Keep responses concise and helpful.
    `;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured on server' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      systemInstruction: systemPrompt
    });

    let history = [];
    if (messages && Array.isArray(messages)) {
      history = messages
        .filter(m => m.role && (m.content || m.text))
        .slice(0, -1)
        .map(m => ({
          role: m.role === 'assistant' || m.role === 'bot' ? 'model' : 'user',
          parts: [{ text: m.content || m.text }]
        }));

      // ✅ FIX: Gemini requires history to start with 'user'
      const firstUserIdx = history.findIndex(m => m.role === 'user');
      history = firstUserIdx >= 0 ? history.slice(firstUserIdx) : [];
    }

    const chat = model.startChat({ history });
    const userQuery = query || (messages && messages[messages.length - 1]?.content) || (messages && messages[messages.length - 1]?.text) || '';
    
    if (!userQuery) return res.status(400).json({ error: 'Query is required' });

    const result = await chat.sendMessage(userQuery);
    const responseText = result.response.text();

    res.json({ 
      reply: responseText,
      text: responseText,
      time: new Date().toLocaleTimeString()
    });

  } catch (err) {
    console.error('Demo chat error:', err);
    res.status(500).json({ error: err.message || 'Demo AI failed to respond.' });
  }
});

module.exports = router;
