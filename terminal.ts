import type { AgentOSNetworkStatus, TerminalCommandResult } from '../types';

export interface TerminalAdapterOptions {
  getNetworkStatus: () => AgentOSNetworkStatus;
  listApps: () => string[];
}

export class TerminalAdapter {
  constructor(private readonly options: TerminalAdapterOptions) {}

  run(command: string): TerminalCommandResult {
    const trimmed = command.trim();
    const output = this.execute(trimmed);
    return {
      command: trimmed,
      output,
      exitCode: output.startsWith('Command not found') ? 127 : 0,
      executedAt: new Date().toISOString()
    };
  }

  private execute(command: string): string {
    switch (command) {
      case 'help':
        return 'Available commands: help, status, apps, clear';
      case 'status':
        return JSON.stringify(this.options.getNetworkStatus(), null, 2);
      case 'apps':
        return this.options.listApps().join('\n') || 'No open apps.';
      case 'clear':
        return '';
      default:
        return `Command not found: ${command}`;
    }
  }
}
