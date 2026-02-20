/**
 * Configuration Management
 *
 * Handles API key storage and configuration using conf package
 */

import Conf from 'conf';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

const config = new Conf({
  projectName: 'sakari-cli',
  defaults: {
    clientId: process.env.SAKARI_CLIENT_ID || '',
    clientSecret: process.env.SAKARI_CLIENT_SECRET || '',
    accountId: process.env.SAKARI_ACCOUNT_ID || '',
    baseUrl: process.env.SAKARI_BASE_URL || 'https://api.sakari.io/v1',
  },
});

/**
 * Get configuration value
 * @param {string} key - Configuration key
 * @returns {*} Configuration value
 */
export function getConfig(key) {
  return config.get(key);
}

/**
 * Set configuration value
 * @param {string} key - Configuration key
 * @param {*} value - Configuration value
 */
export function setConfig(key, value) {
  config.set(key, value);
}

/**
 * Get all configuration
 * @returns {Object} All configuration values
 */
export function getAllConfig() {
  return config.store;
}

/**
 * Delete configuration value
 * @param {string} key - Configuration key
 */
export function deleteConfig(key) {
  config.delete(key);
}

/**
 * Clear all configuration
 */
export function clearConfig() {
  config.clear();
}

/**
 * Get client ID from config or environment
 * @returns {string} Client ID
 * @throws {Error} If client ID is not configured
 */
export function getClientId() {
  const clientId = getConfig('clientId') || process.env.SAKARI_CLIENT_ID;

  if (!clientId) {
    throw new Error(
      'Client ID not configured. Set it with: sakari config set clientId <your-client-id>\n' +
      'Or set SAKARI_CLIENT_ID environment variable.\n' +
      'Get your credentials at: https://hub.sakari.io/'
    );
  }

  return clientId;
}

/**
 * Get client secret from config or environment
 * @returns {string} Client secret
 * @throws {Error} If client secret is not configured
 */
export function getClientSecret() {
  const clientSecret = getConfig('clientSecret') || process.env.SAKARI_CLIENT_SECRET;

  if (!clientSecret) {
    throw new Error(
      'Client secret not configured. Set it with: sakari config set clientSecret <your-client-secret>\n' +
      'Or set SAKARI_CLIENT_SECRET environment variable.\n' +
      'Get your credentials at: https://hub.sakari.io/'
    );
  }

  return clientSecret;
}

/**
 * Get account ID from config or environment
 * @returns {string} Account ID
 */
export function getAccountId() {
  return getConfig('accountId') || process.env.SAKARI_ACCOUNT_ID || '';
}

/**
 * Get base URL from config or environment
 * @returns {string} Base URL
 */
export function getBaseUrl() {
  return getConfig('baseUrl') || process.env.SAKARI_BASE_URL || 'https://api.sakari.io/v1';
}
