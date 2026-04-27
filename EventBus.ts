export type EventMap = Record<string, unknown>;
export type EventHandler<TPayload> = (payload: TPayload) => void | Promise<void>;

export class EventBus<TEvents extends EventMap> {
  private listeners = new Map<keyof TEvents, Set<EventHandler<any>>>();

  on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): () => void {
    const handlers = this.listeners.get(event) ?? new Set<EventHandler<TEvents[K]>>();
    handlers.add(handler);
    this.listeners.set(event, handlers as Set<EventHandler<any>>);
    return () => this.off(event, handler);
  }

  off<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
    this.listeners.get(event)?.delete(handler);
  }

  async emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): Promise<void> {
    const handlers = Array.from(this.listeners.get(event) ?? []);
    await Promise.all(handlers.map((handler) => handler(payload)));
  }

  clear(): void {
    this.listeners.clear();
  }
}
