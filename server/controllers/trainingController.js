const { supabase } = require('../config/supabase');
const axios = require('axios');
const cheerio = require('cheerio');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { parse } = require('csv-parse/sync');

// GET /api/bots/:id/sources
const getSources = async (req, res, next) => {
  try {
    const botId = req.params.id;
    const { data, error } = await supabase
      .from('training_sources')
      .select('*')
      .eq('bot_id', botId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/bots/:id/sources/:sourceId
const deleteSource = async (req, res, next) => {
  try {
    const { id: botId, sourceId } = req.params;
    const { error } = await supabase
      .from('training_sources')
      .delete()
      .eq('id', sourceId)
      .eq('bot_id', botId);

    if (error) throw error;
    res.json({ message: 'Source deleted' });
  } catch (error) {
    next(error);
  }
};

// POST /api/bots/:id/train/text
const trainWithText = async (req, res, next) => {
  try {
    const botId = req.params.id;
    const { name, text } = req.body;

    if (!name || !text) return res.status(400).json({ error: 'Name and text are required' });

    const charCount = text.length;

    const { data, error } = await supabase
      .from('training_sources')
      .insert([{
        bot_id: botId,
        type: 'text',
        name,
        content: text,
        status: 'ready',
        char_count: charCount
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// POST /api/bots/:id/train/url
const trainWithUrl = async (req, res, next) => {
  try {
    const botId = req.params.id;
    const { url } = req.body;

    if (!url) return res.status(400).json({ error: 'URL is required' });

    // Initial insert as processing
    let { data: source, error: insertError } = await supabase
      .from('training_sources')
      .insert([{
        bot_id: botId,
        type: 'url',
        name: url,
        source_url: url,
        status: 'processing'
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    // Async processing to not block
    (async () => {
      try {
        const response = await axios.get(url, { timeout: 10000 });
        const $ = cheerio.load(response.data);
        
        // Remove scripts, styles, etc.
        $('script, style, noscript, iframe, img, svg, nav, footer').remove();
        
        const content = $('body').text()
          .replace(/\s+/g, ' ')
          .trim();

        await supabase
          .from('training_sources')
          .update({
            content,
            status: 'ready',
            char_count: content.length,
            name: $('title').text() || url // update name to title if available
          })
          .eq('id', source.id);

      } catch (err) {
        console.error('Scraping error:', err);
        await supabase
          .from('training_sources')
          .update({ status: 'failed' })
          .eq('id', source.id);
      }
    })();

    res.json(source);
  } catch (error) {
    next(error);
  }
};

// POST /api/bots/:id/train/file
const trainWithFile = async (req, res, next) => {
  try {
    const botId = req.params.id;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const name = file.originalname;
    let content = '';

    const mimeType = file.mimetype;
    
    // Insert initial record
    let { data: source, error: insertError } = await supabase
      .from('training_sources')
      .insert([{
        bot_id: botId,
        type: 'file',
        name,
        status: 'processing'
      }])
      .select()
      .single();

    if (insertError) throw insertError;

    res.json(source); // respond quickly

    // Process file asynchronously
    (async () => {
      try {
        if (mimeType === 'application/pdf') {
          const data = await pdfParse(file.buffer);
          content = data.text;
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          content = result.value;
        } else if (mimeType === 'text/csv') {
          const records = parse(file.buffer, { columns: false, skip_empty_lines: true });
          content = records.map(row => row.join(', ')).join('\n');
        } else if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
          content = file.buffer.toString('utf8');
        } else {
          throw new Error('Unsupported file type');
        }

        content = content.replace(/\s+/g, ' ').trim();

        await supabase
          .from('training_sources')
          .update({
            content,
            status: 'ready',
            char_count: content.length
          })
          .eq('id', source.id);

      } catch (err) {
        console.error('File parsing error:', err);
        await supabase
          .from('training_sources')
          .update({ status: 'failed' })
          .eq('id', source.id);
      }
    })();

  } catch (error) {
    next(error);
  }
};

// POST /api/bots/:id/retrain
const retrainBot = async (req, res, next) => {
  try {
    // Retrain typically means recompiling the vectors or context, 
    // but since we just pull ready sources at query time, we can just return success for now.
    res.json({ message: 'Bot successfully retrained and knowledge base synced.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSources,
  deleteSource,
  trainWithText,
  trainWithUrl,
  trainWithFile,
  retrainBot
};
