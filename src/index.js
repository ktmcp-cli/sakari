/**
 * Sakari CLI - Main Command Interface
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import * as api from './lib/api.js';
import { setConfig, getConfig, getAllConfig, clearConfig, getAccountId } from './lib/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

// Configure main program
program
  .name('sakari')
  .description(chalk.cyan('Sakari API CLI - SMS messaging platform'))
  .version(packageJson.version, '-v, --version', 'output the current version')
  .addHelpText('after', `
${chalk.bold('Examples:')}
  $ sakari config set clientId <your-client-id>
  $ sakari config set clientSecret <your-client-secret>
  $ sakari config set accountId <your-account-id>
  $ sakari messages send --to "+12345678900" --from "+10987654321" --body "Hello World"
  $ sakari messages list --limit 50
  $ sakari contacts list --limit 50
  $ sakari accounts list

${chalk.bold('API Documentation:')}
  ${chalk.blue('https://developers.sakari.io/')}

${chalk.bold('Get API Credentials:')}
  ${chalk.blue('https://hub.sakari.io/')}
`);

// Config commands
const config = program.command('config').description('Manage configuration');

config
  .command('set')
  .description('Set a configuration value')
  .argument('<key>', 'Configuration key')
  .argument('<value>', 'Configuration value')
  .action((key, value) => {
    setConfig(key, value);
    console.log(chalk.green(`✓ Set ${key} = ${value}`));
  });

config
  .command('get')
  .description('Get a configuration value')
  .argument('<key>', 'Configuration key')
  .action((key) => {
    const value = getConfig(key);
    console.log(value || chalk.gray('(not set)'));
  });

config
  .command('list')
  .description('List all configuration')
  .action(() => {
    const cfg = getAllConfig();
    console.log(JSON.stringify(cfg, null, 2));
  });

config
  .command('clear')
  .description('Clear all configuration')
  .action(() => {
    clearConfig();
    console.log(chalk.green('✓ Configuration cleared'));
  });

// Messages commands
const messages = program.command('messages').description('Manage SMS messages');

messages
  .command('send')
  .description('Send an SMS message')
  .requiredOption('--to <number>', 'Recipient phone number (E.164 format)')
  .requiredOption('--from <number>', 'Sender phone number')
  .requiredOption('--body <text>', 'Message body')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Sending message...').start();
    try {
      const accountId = getAccountId();
      const data = await api.post(`/accounts/${accountId}/messages`, {
        to: options.to,
        from: options.from,
        body: options.body,
      });
      spinner.succeed('Message sent');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to send message');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

messages
  .command('list')
  .description('List messages')
  .option('--limit <number>', 'Number of messages to retrieve', '50')
  .option('--offset <number>', 'Offset for pagination', '0')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching messages...').start();
    try {
      const accountId = getAccountId();
      const data = await api.get(`/accounts/${accountId}/messages`, {
        limit: parseInt(options.limit),
        offset: parseInt(options.offset),
      });
      spinner.succeed('Messages retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch messages');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

messages
  .command('get')
  .description('Get message by ID')
  .argument('<id>', 'Message ID')
  .option('--json', 'Output as JSON')
  .action(async (id, options) => {
    const spinner = ora(`Fetching message ${id}...`).start();
    try {
      const accountId = getAccountId();
      const data = await api.get(`/accounts/${accountId}/messages/${id}`);
      spinner.succeed('Message retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch message');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Contacts commands
const contacts = program.command('contacts').description('Manage contacts');

contacts
  .command('list')
  .description('List contacts')
  .option('--limit <number>', 'Number of contacts to retrieve', '50')
  .option('--offset <number>', 'Offset for pagination', '0')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching contacts...').start();
    try {
      const accountId = getAccountId();
      const data = await api.get(`/accounts/${accountId}/contacts`, {
        limit: parseInt(options.limit),
        offset: parseInt(options.offset),
      });
      spinner.succeed('Contacts retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch contacts');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

contacts
  .command('create')
  .description('Create a contact')
  .requiredOption('--mobile <number>', 'Mobile number (E.164 format)')
  .option('--first <name>', 'First name')
  .option('--last <name>', 'Last name')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Creating contact...').start();
    try {
      const accountId = getAccountId();
      const data = await api.post(`/accounts/${accountId}/contacts`, {
        mobile: options.mobile,
        firstName: options.first,
        lastName: options.last,
      });
      spinner.succeed('Contact created');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to create contact');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

contacts
  .command('get')
  .description('Get contact by ID')
  .argument('<id>', 'Contact ID')
  .option('--json', 'Output as JSON')
  .action(async (id, options) => {
    const spinner = ora(`Fetching contact ${id}...`).start();
    try {
      const accountId = getAccountId();
      const data = await api.get(`/accounts/${accountId}/contacts/${id}`);
      spinner.succeed('Contact retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch contact');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Accounts commands
const accounts = program.command('accounts').description('Manage accounts');

accounts
  .command('list')
  .description('List accounts')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const spinner = ora('Fetching accounts...').start();
    try {
      const data = await api.get('/accounts');
      spinner.succeed('Accounts retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch accounts');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

accounts
  .command('get')
  .description('Get account by ID')
  .argument('<id>', 'Account ID')
  .option('--json', 'Output as JSON')
  .action(async (id, options) => {
    const spinner = ora(`Fetching account ${id}...`).start();
    try {
      const data = await api.get(`/accounts/${id}`);
      spinner.succeed('Account retrieved');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to fetch account');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Global error handler
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unhandled error:'), error);
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);
