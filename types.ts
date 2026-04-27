export type AgentOSAppId = 'terminal' | 'tokenCreator';

export interface AgentOSConfig {
  baseUrl?: string;
  apiKey?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export interface AgentOSWindow {
  id: string;
  appId: AgentOSAppId;
  title: string;
  isMinimized: boolean;
  isFocused: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AgentOSNetworkStatus {
  connection: 'active' | 'inactive' | 'unknown';
  ipAddress?: string;
  webSocket: 'connecting' | 'connected' | 'disconnected' | 'unknown';
  bandwidth?: string;
}

export interface TerminalCommandResult {
  command: string;
  output: string;
  exitCode: number;
  executedAt: string;
}

export interface TokenCreatorInput {
  name: string;
  symbol: string;
  decimals?: number;
  supply: bigint | number | string;
  description?: string;
  imageUrl?: string;
}

export interface TokenCreatorOutput extends Required<Pick<TokenCreatorInput, 'name' | 'symbol' | 'decimals'>> {
  supply: string;
  description?: string;
  imageUrl?: string;
  chain: 'solana';
  createdAt: string;
}

export type AgentOSEventMap = {
  'app:open': { appId: AgentOSAppId; windowId: string };
  'app:close': { appId: AgentOSAppId; windowId: string };
  'window:focus': { windowId: string };
  'window:minimize': { windowId: string };
  'terminal:command': TerminalCommandResult;
  'token:draft': TokenCreatorOutput;
};
