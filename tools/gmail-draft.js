#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Gmail Draft Composer
 * Creates draft emails directly in your Gmail account
 *
 * Setup:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing
 * 3. Enable Gmail API: APIs & Services > Enable APIs > Gmail API
 * 4. Create OAuth credentials: APIs & Services > Credentials > Create Credentials > OAuth client ID
 *    - Application type: Desktop app
 *    - Download the JSON and save as `credentials.json` in this tools folder
 * 5. Run: npm install googleapis
 * 6. Run: node gmail-draft.js --setup (first time only, to authorize)
 *
 * Usage:
 *   node gmail-draft.js --to "recipient@example.com" --subject "Hello" --body "Message body"
 *   node gmail-draft.js --to "a@example.com,b@example.com" --subject "Hi" --body "Hello all"
 *   node gmail-draft.js --interactive
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Paths
const TOOLS_DIR = __dirname;
const CREDENTIALS_PATH = path.join(TOOLS_DIR, 'credentials.json');
const TOKEN_PATH = path.join(TOOLS_DIR, 'token.json');

// Scopes for Gmail API
const SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];

async function loadGoogleApis() {
  try {
    return require('googleapis');
  } catch {
    console.error('Error: googleapis package not installed.');
    console.error('Run: npm install googleapis');
    process.exit(1);
  }
}

async function authorize() {
  const { google } = await loadGoogleApis();

  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('Error: credentials.json not found in tools folder.');
    console.error('Download OAuth credentials from Google Cloud Console.');
    console.error('See setup instructions at top of this file.');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check for existing token
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  }

  // Get new token
  return getNewToken(oAuth2Client);
}

async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('\n=== Gmail Authorization Required ===\n');
  console.log('1. Open this URL in your browser:\n');
  console.log(authUrl);
  console.log('\n2. Authorize the application');
  console.log('3. Copy the authorization code and paste it below\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Enter the authorization code: ', async (code) => {
      rl.close();
      try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('\nToken saved to', TOKEN_PATH);
        resolve(oAuth2Client);
      } catch (err) {
        reject(new Error('Error retrieving access token: ' + err.message));
      }
    });
  });
}

function createMimeMessage(to, subject, body, from = 'me') {
  const boundary = '----=_Part_' + Date.now().toString(36);

  const mimeMessage = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Content-Type: text/plain; charset="UTF-8"`,
    '',
    body,
  ].join('\r\n');

  // Base64 encode for Gmail API
  return Buffer.from(mimeMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function createDraft(auth, to, subject, body) {
  const { google } = await loadGoogleApis();
  const gmail = google.gmail({ version: 'v1', auth });

  const raw = createMimeMessage(to, subject, body);

  try {
    const response = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: raw,
        },
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to create draft: ' + error.message);
  }
}

async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) =>
    new Promise((resolve) => rl.question(prompt, resolve));

  console.log('\n=== Gmail Draft Composer ===\n');

  const to = await question('To (comma-separated for multiple): ');
  const subject = await question('Subject: ');

  console.log('Body (enter empty line to finish):');
  const bodyLines = [];
  let line;
  while ((line = await question('')) !== '') {
    bodyLines.push(line);
  }
  const body = bodyLines.join('\n');

  rl.close();

  return { to, subject, body };
}

function parseArgs(args) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--to' && args[i + 1]) {
      result.to = args[++i];
    } else if (arg === '--subject' && args[i + 1]) {
      result.subject = args[++i];
    } else if (arg === '--body' && args[i + 1]) {
      result.body = args[++i];
    } else if (arg === '--interactive') {
      result.interactive = true;
    } else if (arg === '--setup') {
      result.setup = true;
    } else if (arg === '--help' || arg === '-h') {
      result.help = true;
    }
  }
  return result;
}

function showHelp() {
  console.log(`
Gmail Draft Composer

Usage:
  node gmail-draft.js [options]

Options:
  --to <emails>      Recipient email(s), comma-separated
  --subject <text>   Email subject
  --body <text>      Email body
  --interactive      Interactive mode (prompts for input)
  --setup            Run OAuth setup
  --help, -h         Show this help

Examples:
  node gmail-draft.js --to "user@example.com" --subject "Hello" --body "Hi there!"
  node gmail-draft.js --interactive
  node gmail-draft.js --setup

Setup:
  1. Create a Google Cloud project: https://console.cloud.google.com/
  2. Enable Gmail API
  3. Create OAuth 2.0 credentials (Desktop app)
  4. Download credentials.json to this tools folder
  5. Run: node gmail-draft.js --setup
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  // Authorize
  const auth = await authorize();

  if (args.setup) {
    console.log('\nSetup complete! You can now create drafts.');
    process.exit(0);
  }

  let to, subject, body;

  if (args.interactive) {
    const input = await interactiveMode();
    to = input.to;
    subject = input.subject;
    body = input.body;
  } else {
    to = args.to;
    subject = args.subject;
    body = args.body;
  }

  if (!to || !subject || !body) {
    console.error('Error: Missing required fields (to, subject, body)');
    console.error('Use --help for usage information');
    process.exit(1);
  }

  console.log('\nCreating draft...');

  try {
    const draft = await createDraft(auth, to, subject, body);
    console.log('\n✓ Draft created successfully!');
    console.log('  Draft ID:', draft.id);
    console.log('  Message ID:', draft.message.id);
    console.log('\nOpen Gmail to view and send your draft.');
  } catch (error) {
    console.error('\nError:', error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
