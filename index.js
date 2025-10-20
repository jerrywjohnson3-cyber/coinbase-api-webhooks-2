// Coinbase API Integration Example
// This file demonstrates connecting to Coinbase accounts endpoint

const axios = require('axios');
require('dotenv').config();

// Coinbase API configuration
const COINBASE_API_URL = 'https://api.coinbase.com/v2';
const API_KEY = process.env.COINBASE_API_KEY || 'YOUR_API_KEY_HERE';
const API_SECRET = process.env.COINBASE_API_SECRET || 'YOUR_API_SECRET_HERE';

/**
 * Fetch user accounts from Coinbase
 */
async function getCoinbaseAccounts() {
  try {
    const response = await axios.get(`${COINBASE_API_URL}/accounts`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('Coinbase Accounts:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error fetching Coinbase accounts:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('Connecting to Coinbase API...');
  console.log('API URL:', COINBASE_API_URL);
  
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.warn('⚠️  Warning: Using placeholder API key. Please set COINBASE_API_KEY in your environment variables.');
  }

  try {
    await getCoinbaseAccounts();
  } catch (error) {
    console.error('Failed to connect to Coinbase API');
    process.exit(1);
  }
}

// Run the main function
if (require.main === module) {
  main();
}

module.exports = { getCoinbaseAccounts };
