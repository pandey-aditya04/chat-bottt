const { supabase } = require('../config/supabase');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const PLANS = {
  free: { bots: 1, messages_per_month: 50, sources: 10, priceId: null },
  pro: { bots: 5, messages_per_month: 5000, sources: 100, priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_placeholder_pro' },
  business: { bots: 999, messages_per_month: 999999, sources: 999, priceId: process.env.STRIPE_BUSINESS_PRICE_ID || 'price_placeholder_business' }
};

const getStatus = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('plan_tier, plan_limits, messages_used_this_month, stripe_customer_id')
      .eq('id', req.user.id)
      .single();
      
    if (error) throw error;
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const createCheckout = async (req, res, next) => {
  try {
    const { plan } = req.body; // 'pro' or 'business'
    if (!PLANS[plan] || plan === 'free') {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const { data: user } = await supabase.from('users').select('*').eq('id', req.user.id).single();
    
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      // Create a stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: req.user.id }
      });
      customerId = customer.id;
      await supabase.from('users').update({ stripe_customer_id: customerId }).eq('id', req.user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.ALLOWED_ORIGIN || 'http://localhost:5173'}/dashboard/settings?checkout=success`,
      cancel_url: `${process.env.ALLOWED_ORIGIN || 'http://localhost:5173'}/dashboard/settings?checkout=canceled`,
      metadata: { user_id: req.user.id, plan_tier: plan }
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

const createPortal = async (req, res, next) => {
  try {
    const { data: user } = await supabase.from('users').select('stripe_customer_id').eq('id', req.user.id).single();
    if (!user.stripe_customer_id) return res.status(400).json({ error: 'No billing history' });

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.ALLOWED_ORIGIN || 'http://localhost:5173'}/dashboard/settings`,
    });
    
    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

const webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata.user_id;
      const planTier = session.metadata.plan_tier;
      
      await supabase.from('users').update({
        plan_tier: planTier,
        plan_limits: PLANS[planTier],
        stripe_subscription_id: session.subscription,
        billing_cycle_start: new Date().toISOString()
      }).eq('id', userId);
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      
      await supabase.from('users').update({
        plan_tier: 'free',
        plan_limits: PLANS.free,
        stripe_subscription_id: null
      }).eq('stripe_customer_id', customerId);
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
  }

  res.json({ received: true });
};

module.exports = { getStatus, createCheckout, createPortal, webhook, PLANS };
