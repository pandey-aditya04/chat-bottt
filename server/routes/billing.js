const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const billingController = require('../controllers/billingController');

// Need raw body for Stripe webhook signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), billingController.webhook);

router.use(express.json()); // Apply JSON parsing for the rest

router.get('/status', authenticate, billingController.getStatus);
router.post('/create-checkout', authenticate, billingController.createCheckout);
router.post('/portal', authenticate, billingController.createPortal);

module.exports = router;
