# Coinbase API and Webhook Integration

This Node.js project demonstrates how to integrate with the Coinbase API and handle incoming webhook events.

## Features

- Connect to Coinbase API endpoints (e.g., accounts)
- Handle incoming Coinbase webhook events with signature verification
- Express.js-based webhook endpoint

## Setup

1. Install dependencies: `npm install`
2. Set your Coinbase API credentials in environment variables
3. Run the application: `node index.js`

## Files

- `index.js` - Main file for connecting to Coinbase API
- `webhook.js` - Webhook handler for Coinbase events
- `package.json` - Project dependencies

## Requirements

- Node.js 14+
- Coinbase API key and secret
- Express.js for webhook handling
