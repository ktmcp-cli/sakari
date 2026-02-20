#!/usr/bin/env node

/**
 * Sakari CLI - Main Entry Point
 *
 * Production-ready CLI for Sakari API
 * SMS messaging platform
 */

import('../src/index.js').catch(err => {
  console.error('Failed to start CLI:', err);
  process.exit(1);
});
