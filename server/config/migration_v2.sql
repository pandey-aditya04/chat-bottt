-- Migration v2
-- Add this to Supabase SQL Editor to support the new features

-- 1. New columns on bots table
ALTER TABLE bots ADD COLUMN IF NOT EXISTS system_prompt TEXT;
ALTER TABLE bots ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE bots ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#0d0d1a';
ALTER TABLE bots ADD COLUMN IF NOT EXISTS model TEXT DEFAULT 'gemini-flash-latest';
ALTER TABLE bots ADD COLUMN IF NOT EXISTS quick_prompts JSONB DEFAULT '[]';

-- 2. New columns on users table for billing
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_limits JSONB DEFAULT '{"bots":1,"messages_per_month":50,"sources":10}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS messages_used_this_month INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS billing_cycle_start TIMESTAMPTZ DEFAULT NOW();

-- 3. Create training_sources table
CREATE TABLE IF NOT EXISTS training_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_id UUID REFERENCES bots(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('url', 'file', 'text', 'sitemap')),
  name TEXT NOT NULL,
  content TEXT,
  source_url TEXT,
  file_path TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','ready','failed')),
  char_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Set up RLS for training_sources
ALTER TABLE training_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own training sources" ON training_sources FOR SELECT 
USING (EXISTS (SELECT 1 FROM bots WHERE bots.id = training_sources.bot_id AND bots.user_id = auth.uid()));

CREATE POLICY "Users can insert own training sources" ON training_sources FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM bots WHERE bots.id = training_sources.bot_id AND bots.user_id = auth.uid()));

CREATE POLICY "Users can update own training sources" ON training_sources FOR UPDATE 
USING (EXISTS (SELECT 1 FROM bots WHERE bots.id = training_sources.bot_id AND bots.user_id = auth.uid()));

CREATE POLICY "Users can delete own training sources" ON training_sources FOR DELETE 
USING (EXISTS (SELECT 1 FROM bots WHERE bots.id = training_sources.bot_id AND bots.user_id = auth.uid()));
