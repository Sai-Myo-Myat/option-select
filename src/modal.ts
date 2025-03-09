import { Subscriber } from "./types";

export class DATA_CENTRE<T extends { subItems?: T[] }> {
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

  private getAllChildIds(item: T): string[] {
    if (!item.subItems) return [];
    return item.subItems.flatMap((sub) => [
      this.getId(sub),
      ...this.getAllChildIds(sub),
    ]);
  }

  toggleSelection(id: string, item?: T) {
    const isSelected = this.selectedIds.has(id);
    if (isSelected) {
      this.selectedIds.delete(id);
      if (item)
        this.getAllChildIds(item).forEach((childId) =>
          this.selectedIds.delete(childId)
        );
    } else {
      this.selectedIds.add(id);
      if (item)
        this.getAllChildIds(item).forEach((childId) =>
          this.selectedIds.add(childId)
        );
    }
    this.notify();
  }

  isSelected(id: string, item?: T) {
    if (item?.subItems?.length) {
      const allChildrenSelected = this.getAllChildIds(item).every((childId) =>
        this.selectedIds.has(childId)
      );
      if (allChildrenSelected && !this.selectedIds.has(id)) {
        this.selectedIds.add(id);
      }
      if (!allChildrenSelected) {
        this.selectedIds.delete(id);
      }
      return allChildrenSelected;
    }
    return this.selectedIds.has(id);
  }

  getAllItems(items: T[]): any[] {
    return items.map((item) => ({
      item,
      isSelected: this.isSelected(this.getId(item), item),
      toggleSelection: () => this.toggleSelection(this.getId(item), item),
      subItems: item.subItems ? this.getAllItems(item.subItems) : undefined,
    }));
  }
}
