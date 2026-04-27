# AGENT OS SDK

A production-ready TypeScript SDK for the **Terminal** and **Token Creator (SOL)** utilities from the AGENT OS web project.

This SDK intentionally ignores the other AGENT OS utilities and exposes only:

- Terminal
- Token Creator (SOL)

Source web project: `https://agent-os-0.1-lime.vercel.app`

## Features

- Fully typed TypeScript API
- Terminal command adapter
- Solana token draft builder
- Small app/window lifecycle helper for Terminal and Token Creator only
- Event bus for UI integrations
- Build, test, lint, and CI configuration included
- Ready to push to GitHub

## Installation

```bash
npm install agent-os-0.1-sdk
```

For local development:

```bash
git clone https://github.com/YOUR_USERNAME/agent-os-0.1-sdk.git
cd agent-os-0.1-sdk
npm install
npm run build
npm test
```

## Quick Start

```ts
import { AgentOSClient } from 'agent-os-0.1-sdk';

const agentOS = new AgentOSClient({
  baseUrl: 'https://agent-os-0.1-lime.vercel.app'
});

await agentOS.openApp('terminal');
const status = await agentOS.runTerminalCommand('status');
console.log(status.output);

await agentOS.openApp('tokenCreator');
const token = await agentOS.createTokenDraft({
  name: 'Agent Token',
  symbol: 'AGENT',
  supply: 1_000_000,
  decimals: 9,
  description: 'Utility token draft for AGENT OS'
});
console.log(token);
```

## API

### `new AgentOSClient(config?)`

```ts
const client = new AgentOSClient({
  baseUrl: 'https://agent-os-0.1-lime.vercel.app',
  apiKey: process.env.AGENT_OS_API_KEY,
  timeoutMs: 15000
});
```

### Supported app IDs

```ts
terminal
tokenCreator
```

### Terminal

```ts
const result = await client.runTerminalCommand('help');

console.log(result.command);
console.log(result.output);
console.log(result.exitCode);
console.log(result.executedAt);
```

Built-in local commands:

```text
help
status
apps
clear
```

### Token Creator Draft

```ts
const token = await client.createTokenDraft({
  name: 'Agent Token',
  symbol: 'AGENT',
  supply: 1_000_000,
  decimals: 9,
  description: 'Utility token draft for AGENT OS'
});
```

This method creates a validated Solana token draft payload only. Actual blockchain deployment should be handled by a wallet/provider integration with explicit user approval.

### Events

```ts
const unsubscribe = client.events.on('terminal:command', ({ command, exitCode }) => {
  console.log(command, exitCode);
});

unsubscribe();
```

Available events:

```ts
'app:open'
'app:close'
'window:focus'
'window:minimize'
'terminal:command'
'token:draft'
```

### Generic HTTP Request Helper

```ts
const data = await client.request('/api/status');
```

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## GitHub Upload

```bash
git init
git add .
git commit -m "Initial AGENT OS SDK"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/agent-os-0.1-sdk.git
git push -u origin main
```

## Project Structure

```text
agent-os-0.1-sdk/
├── src/
│   ├── apps/
│   │   ├── terminal.ts
│   │   └── tokenCreator.ts
│   ├── core/
│   │   ├── AgentOSClient.ts
│   │   └── EventBus.ts
│   ├── index.ts
│   └── types.ts
├── examples/
├── tests/
├── .github/workflows/ci.yml
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
