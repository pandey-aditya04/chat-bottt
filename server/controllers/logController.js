const { supabase } = require('../config/supabase');

const getLogs = async (req, res, next) => {
  try {
    const { botId, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Get all bots owned by the user
    let botQuery = supabase.from('bots').select('id');
    if (req.user.role !== 'admin') {
      botQuery = botQuery.eq('user_id', req.user.id);
    }
    const { data: userBots, error: botError } = await botQuery;
    if (botError) throw botError;

    const botIds = userBots.map(b => b.id);
    
    // Check if requested bot belongs to user
    if (botId && !botIds.includes(botId)) {
      return res.status(403).json({ error: 'Access denied to this bot\'s logs' });
    }

    const targetBotIds = botId ? [botId] : botIds;

    // Get logs for those bots with pagination
    let logQuery = supabase
      .from('logs')
      .select('*, messages(*)', { count: 'exact' })
      .in('bot_id', targetBotIds)
      .order('created_at', { ascending: false });

    // Optional: add date filters if needed here

    // Apply pagination
    logQuery = logQuery.range(offset, offset + limit - 1);

    const { data: logs, error: logError, count } = await logQuery;
    if (logError) throw logError;

    // Optional: filter by search query (since supabase doesn't easily deep search JSON without specific setup, we filter in memory or we could do a text search on a specific column)
    let filteredLogs = logs;
    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredLogs = logs.filter(log => {
        return log.messages.some(m => m.text?.toLowerCase().includes(lowerSearch));
      });
    }

    res.json({
      data: filteredLogs,
      count: search ? filteredLogs.length : count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil((search ? filteredLogs.length : count) / limit)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLogs };
