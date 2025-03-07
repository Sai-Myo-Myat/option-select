import { ID, Subscriber } from "./types";

export class DATA_CENTRE<T extends ID> {
  private selectedIds = new Set<string>();
  private subscribers: Subscriber[] = [];

  constructor(private items: T[], private getId: (item: T) => string) {}

  // subscription model implementation
  private notify() {
    this.subscribers.forEach((callback) => callback());
  }

  subscribe(callback: Subscriber) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }
}
