import { describe, expect, it } from 'vitest';
import { AgentOSClient, createSolanaTokenDraft } from '../src';

describe('AgentOSClient', () => {
  it('only opens Terminal and Token Creator apps', async () => {
    const client = new AgentOSClient();
    const terminal = await client.openApp('terminal');
    const tokenCreator = await client.openApp('tokenCreator');

    expect(terminal.title).toBe('Terminal');
    expect(tokenCreator.title).toBe('Token Creator (SOL)');
    expect(client.listWindows()).toHaveLength(2);
  });

  it('runs terminal commands', async () => {
    const client = new AgentOSClient();
    const result = await client.runTerminalCommand('help');

    expect(result.exitCode).toBe(0);
    expect(result.output).toContain('Available commands');
  });

  it('creates Solana token drafts', async () => {
    const token = createSolanaTokenDraft({ name: 'Agent Token', symbol: 'agent', supply: 1_000_000 });

    expect(token.chain).toBe('solana');
    expect(token.symbol).toBe('AGENT');
    expect(token.decimals).toBe(9);
  });
});
