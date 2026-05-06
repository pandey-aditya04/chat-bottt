const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { supabase } = require('../config/supabase');

// Helper to map camelCase (frontend) to snake_case (DB)
const mapToSnakeCase = (data) => ({
  name: data.name,
  website: data.website,
  primary_color: data.color || data.primaryColor || data.primary_color || '#6366f1',
  welcome_message: data.welcomeMessage || data.welcome_message,
  tone: data.tone || 'Friendly',
  fallback_message: data.fallbackMessage || data.fallback_message,
  chat_position: data.chatPosition || data.chat_position || 'Right',
  launcher_icon: data.launcherIcon || data.launcher_icon || 'Chat Bubble',
  chat_window_title: data.chatWindowTitle || data.chat_window_title || data.name || 'Chat',
  max_response_length: data.maxResponseLength || data.max_response_length || 'Medium',
  status: data.status || 'Active'
});

// GET /api/bots - List user's bots
router.get('/', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bots')
      .select('*, faqs(*)')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch bots error:', error);
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bots - Create bot
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, faqs } = req.body;
    console.log('Creating bot for user:', req.userId, 'name:', name);

    if (!name?.trim()) {
      return res.status(400).json({ error: 'Bot name is required' });
    }

    const dataToInsert = {
      ...mapToSnakeCase(req.body),
      user_id: req.userId
    };

    console.log('Inserting bot data:', dataToInsert);

    const { data: bot, error: botError } = await supabase
      .from('bots')
      .insert([dataToInsert])
      .select()
      .single();

    if (botError) {
      console.error('Supabase bot insert error:', botError);
      throw botError;
    }

    // Insert FAQs if any
    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      const faqsToInsert = faqs.map(faq => ({
        bot_id: bot.id,
        question: faq.question,
        answer: faq.answer
      }));

      const { error: faqError } = await supabase.from('faqs').insert(faqsToInsert);
      if (faqError) {
        console.error('Supabase FAQ insert error:', faqError);
        // We don't throw here to avoid failing the whole bot creation if just FAQs fail
      }
    }

    // Return bot with FAQs
    const { data: finalBot } = await supabase
      .from('bots')
      .select('*, faqs(*)')
      .eq('id', bot.id)
      .single();

    console.log('Bot created successfully:', finalBot.id);
    res.status(201).json(finalBot);
  } catch (err) {
    console.error('Bot creation crash:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/bots/:id - Update bot
router.put('/:id', authenticate, async (req, res) => {
  try {
    const botId = req.params.id;
    const { faqs } = req.body;

    const dataToUpdate = mapToSnakeCase(req.body);

    const { data: bot, error: botError } = await supabase
      .from('bots')
      .update(dataToUpdate)
      .eq('id', botId)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (botError) throw botError;

    // Update FAQs (Delete and re-insert)
    if (faqs && Array.isArray(faqs)) {
      await supabase.from('faqs').delete().eq('bot_id', botId);
      
      if (faqs.length > 0) {
        const faqsToInsert = faqs.map(faq => ({
          bot_id: botId,
          question: faq.question,
          answer: faq.answer
        }));
        await supabase.from('faqs').insert(faqsToInsert);
      }
    }

    res.json(bot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/bots/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { error } = await supabase
      .from('bots')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
