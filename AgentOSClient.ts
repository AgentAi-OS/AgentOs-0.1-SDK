import { EventBus } from './EventBus';
import { TerminalAdapter } from '../apps/terminal';
import { createSolanaTokenDraft } from '../apps/tokenCreator';
import type {
  AgentOSAppId,
  AgentOSConfig,
  AgentOSEventMap,
  AgentOSNetworkStatus,
  AgentOSWindow,
  TerminalCommandResult,
  TokenCreatorInput,
  TokenCreatorOutput
} from '../types';

const DEFAULT_BASE_URL = 'https://agentos01.xyz';
const DEFAULT_TIMEOUT_MS = 15_000;

export class AgentOSClient {
  readonly baseUrl: string;
  readonly events = new EventBus<AgentOSEventMap>();
  private readonly timeoutMs: number;
  private readonly apiKey?: string;
  private readonly fetchImpl: typeof fetch;
  private readonly terminal: TerminalAdapter;
  private windows = new Map<string, AgentOSWindow>();

  constructor(config: AgentOSConfig = {}) {
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.apiKey = config.apiKey;
    this.fetchImpl = config.fetchImpl ?? fetch;
    this.terminal = new TerminalAdapter({
      getNetworkStatus: () => this.getNetworkStatus(),
      listApps: () => this.listWindows().map((window) => `${window.id} ${window.title}`)
    });
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const headers = new Headers(init.headers);
    headers.set('Content-Type', headers.get('Content-Type') ?? 'application/json');
    if (this.apiKey) headers.set('Authorization', `Bearer ${this.apiKey}`);

    try {
      const response = await this.fetchImpl(new URL(path, this.baseUrl), {
        ...init,
        headers,
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`AGENT OS request failed: ${response.status} ${response.statusText}`);
      return (await response.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  async openApp(appId: AgentOSAppId, title = this.titleFor(appId)): Promise<AgentOSWindow> {
    const windowId = crypto.randomUUID?.() ?? `${appId}-${Date.now()}`;
    const window: AgentOSWindow = {
      id: windowId,
      appId,
      title,
      isMinimized: false,
      isFocused: true,
      x: 80,
      y: 80,
      width: appId === 'tokenCreator' ? 640 : 720,
      height: appId === 'tokenCreator' ? 520 : 480
    };

    for (const item of this.windows.values()) item.isFocused = false;
    this.windows.set(windowId, window);
    await this.events.emit('app:open', { appId, windowId });
    return window;
  }

  async closeWindow(windowId: string): Promise<void> {
    const window = this.mustGetWindow(windowId);
    this.windows.delete(windowId);
    await this.events.emit('app:close', { appId: window.appId, windowId });
  }

  async focusWindow(windowId: string): Promise<AgentOSWindow> {
    const window = this.mustGetWindow(windowId);
    for (const item of this.windows.values()) item.isFocused = false;
    window.isFocused = true;
    window.isMinimized = false;
    await this.events.emit('window:focus', { windowId });
    return { ...window };
  }

  async minimizeWindow(windowId: string): Promise<AgentOSWindow> {
    const window = this.mustGetWindow(windowId);
    window.isMinimized = true;
    window.isFocused = false;
    await this.events.emit('window:minimize', { windowId });
    return { ...window };
  }

  listWindows(): AgentOSWindow[] {
    return Array.from(this.windows.values()).map((window) => ({ ...window }));
  }

  async runTerminalCommand(command: string): Promise<TerminalCommandResult> {
    const result = this.terminal.run(command);
    await this.events.emit('terminal:command', result);
    return result;
  }

  async createTokenDraft(input: TokenCreatorInput): Promise<TokenCreatorOutput> {
    const token = createSolanaTokenDraft(input);
    await this.events.emit('token:draft', token);
    return token;
  }

  getNetworkStatus(): AgentOSNetworkStatus {
    return {
      connection: 'active',
      ipAddress: '192.168.1.100',
      webSocket: 'connecting',
      bandwidth: '~1.2 KB/s'
    };
  }

  private mustGetWindow(windowId: string): AgentOSWindow {
    const window = this.windows.get(windowId);
    if (!window) throw new Error(`Window not found: ${windowId}`);
    return window;
  }

  private titleFor(appId: AgentOSAppId): string {
    const titles: Record<AgentOSAppId, string> = {
      terminal: 'Terminal',
      tokenCreator: 'Token Creator (SOL)'
    };
    return titles[appId];
  }
}
