// Coinbase Webhook Handler
// This file demonstrates handling incoming Coinbase webhook events with signature verification

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.COINBASE_WEBHOOK_SECRET || 'YOUR_WEBHOOK_SECRET_HERE';

// Use raw body parser for webhook signature verification
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString('utf8');
  }
}));

/**
 * Verify Coinbase webhook signature
 * @param {string} signature - The signature from the request header
 * @param {string} payload - The raw request body
 * @param {string} secret - Your webhook secret
 * @returns {boolean} - Whether the signature is valid
 */
function verifyWebhookSignature(signature, payload, secret) {
  if (!signature || !payload || !secret) {
    return false;
  }

  try {
    // Coinbase uses HMAC SHA256 for webhook signatures
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Error verifying signature:', error.message);
    return false;
  }
}

/**
 * Webhook endpoint to handle Coinbase events
 */
app.post('/webhook/coinbase', (req, res) => {
  const signature = req.headers['x-coinbase-signature'];
  const payload = req.rawBody;

  console.log('Received webhook event');

  // Verify the webhook signature
  if (WEBHOOK_SECRET !== 'YOUR_WEBHOOK_SECRET_HERE') {
    const isValid = verifyWebhookSignature(signature, payload, WEBHOOK_SECRET);
    
    if (!isValid) {
      console.error('❌ Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    console.log('✓ Webhook signature verified');
  } else {
    console.warn('⚠️  Warning: Using placeholder webhook secret. Signature verification skipped.');
  }

  // Process the webhook event
  const event = req.body;
  console.log('Event type:', event.type);
  console.log('Event data:', JSON.stringify(event, null, 2));

  // Handle different event types
  switch (event.type) {
    case 'wallet:addresses:new-payment':
      console.log('New payment received:', event.data);
      // Add your payment handling logic here
      break;

    case 'wallet:buys:completed':
      console.log('Buy completed:', event.data);
      // Add your buy completion logic here
      break;

    case 'wallet:sells:completed':
      console.log('Sell completed:', event.data);
      // Add your sell completion logic here
      break;

    default:
      console.log('Unhandled event type:', event.type);
  }

  // Respond to Coinbase to acknowledge receipt
  res.status(200).json({ received: true });
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'coinbase-webhook-handler' });
});

/**
 * Start the server
 */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Webhook server running on port ${PORT}`);
    console.log(`Webhook endpoint: http://localhost:${PORT}/webhook/coinbase`);
    
    if (WEBHOOK_SECRET === 'YOUR_WEBHOOK_SECRET_HERE') {
      console.warn('⚠️  Warning: Using placeholder webhook secret. Please set COINBASE_WEBHOOK_SECRET in your environment variables.');
    }
  });
}

module.exports = app;
