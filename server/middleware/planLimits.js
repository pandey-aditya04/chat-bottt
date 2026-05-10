const { supabase } = require('../config/supabase');

const checkBotLimit = async (req, res, next) => {
  try {
    const { data: user } = await supabase.from('users').select('plan_limits').eq('id', req.user.id).single();
    const { count: currentBots } = await supabase.from('bots').select('*', { count: 'exact', head: true }).eq('user_id', req.user.id);
    
    if (currentBots >= user.plan_limits.bots) {
      return res.status(403).json({ error: `Plan limit reached. You can only create ${user.plan_limits.bots} bot(s). Please upgrade your plan.` });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const checkSourceLimit = async (req, res, next) => {
  try {
    const botId = req.params.id;
    const { data: bot } = await supabase.from('bots').select('user_id').eq('id', botId).single();
    const { data: user } = await supabase.from('users').select('plan_limits').eq('id', bot.user_id).single();
    const { count: currentSources } = await supabase.from('training_sources').select('*', { count: 'exact', head: true }).eq('bot_id', botId);
    
    if (currentSources >= user.plan_limits.sources) {
      return res.status(403).json({ error: `Plan limit reached. You can only add ${user.plan_limits.sources} sources per bot. Please upgrade your plan.` });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkBotLimit, checkSourceLimit };
