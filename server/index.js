require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { supabase } = require('./config/supabase');

const app = express();

// Startup health check
console.log('=== SERVER STARTING ===');
console.log('SUPABASE:', !!process.env.SUPABASE_URL);
console.log('GEMINI:', !!process.env.GEMINI_API_KEY);
console.log('JWT:', !!process.env.JWT_SECRET);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // We'll manage CORS and basic security mostly via other means for the API
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
app.use(morgan('dev'));

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight for all routes
app.use(function(req, res, next) {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    gemini: !!process.env.GEMINI_API_KEY,
    supabase: !!process.env.SUPABASE_URL
  })
})

// Public widget endpoints — must allow any origin
app.use('/api/chat', cors({ origin: '*' }));
app.use('/api/bots/:botId/public', cors({ origin: '*' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bots', require('./routes/bot'));
app.use('/api/bots', require('./routes/training')); // Added training routes
app.use('/api/chat', require('./routes/chat'));
app.use('/api/logs', require('./routes/log'));
app.use('/api/billing', require('./routes/billing')); // Billing webhooks & routes

// ─── PUBLIC: Get bot config (for embed widget) ─────────────────
app.get('/api/bots/:botId/public', async (req, res) => {
  try {
    const { data: bot, error } = await supabase
      .from('bots')
      .select('name, primary_color, welcome_message, tone, fallback_message, chat_window_title, launcher_icon')
      .eq('id', req.params.botId)
      .single();

    if (error || !bot) return res.status(404).json({ error: 'Bot not found' });

    res.json({
      name: bot.name,
      color: bot.primary_color,
      welcomeMessage: bot.welcome_message,
      tone: bot.tone,
      fallbackMessage: bot.fallback_message,
      chatWindowTitle: bot.chat_window_title,
      launcherIcon: bot.launcher_icon
    });
  } catch (err) {
    console.error('Public config error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
