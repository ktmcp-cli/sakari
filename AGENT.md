# Sakari CLI - Agent Guide

This CLI provides access to the Sakari API for SMS messaging.

## Quick Start

```bash
# Configure credentials
sakari config set clientId YOUR_CLIENT_ID
sakari config set clientSecret YOUR_CLIENT_SECRET
sakari config set accountId YOUR_ACCOUNT_ID

# Send SMS
sakari messages send --to "+12345678900" --from "+10987654321" --body "Hello World" --json

# List messages
sakari messages list --limit 50 --json

# List contacts
sakari contacts list --limit 50 --json

# Create contact
sakari contacts create --mobile "+12345678900" --first "John" --last "Doe" --json

# List accounts
sakari accounts list --json
```

## Available Commands

- `config` - Manage configuration (set, get, list, clear)
- `messages` - Send and manage SMS messages (send, list, get)
- `contacts` - Manage contacts (list, create, get)
- `accounts` - Manage accounts (list, get)

## Output Format

All commands support `--json` flag for machine-readable output. Use this flag when calling from AI agents.

## Error Handling

If a command fails, it will exit with code 1 and print an error message to stderr.

## Authentication

The CLI uses client ID and client secret for authentication via Basic Auth. Set them using:
- `sakari config set clientId <id>`
- `sakari config set clientSecret <secret>`
- `sakari config set accountId <account-id>`
- Or environment variables: `SAKARI_CLIENT_ID`, `SAKARI_CLIENT_SECRET`, `SAKARI_ACCOUNT_ID`

Get your API credentials from: https://hub.sakari.io/
