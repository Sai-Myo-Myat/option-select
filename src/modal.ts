import { OptionItem, Subscriber } from "./types";

export class DATA_CENTRE<T extends { subItems?: T[]; isSelected?: boolean }> {
  private selectedIds = new Set<string | number>();
  private subscribers: Subscriber[] = [];
  private limit = 0;
  private selectedRootOrder: (string | number)[] = [];

  constructor(
    private items: T[],
    private getId: (item: T) => string | number,
    limit?: number
  ) {
    this.limit = limit ?? 0;
    this.items.forEach((item) => {
      if (item.isSelected) {
        const id = this.getId(item);
        this.selectedIds.add(id);
        this.selectedRootOrder.push(id);
      }
      if (item.subItems) {
        item.subItems.forEach((sub) => {
          if (sub.isSelected) {
            this.selectedIds.add(this.getId(sub));
          }
        });
      }
    });
  }
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

  private getAllItemIds(items: T[]): (string | number)[] {
    return items.flatMap((item) => [
      this.getId(item),
      ...this.getAllChildIds(item),
    ]);
  }

  selectAll() {
    this.selectedIds = new Set(this.getAllItemIds(this.items));
    this.selectedRootOrder = this.items.map((item) => this.getId(item));
    this.notify();
  }

  deselectAll() {
    this.selectedIds.clear();
    this.selectedRootOrder = [];
    this.notify();
  }

  private getAllChildIds(item: T): (string | number)[] {
    if (!item.subItems) return [];
    return item.subItems.flatMap((sub) => [
      this.getId(sub),
      ...this.getAllChildIds(sub),
    ]);
  }

  toggleSelection(id: string | number, item?: T) {
    const isSelected = this.selectedIds.has(id);
    // Check if this is a root-level item
    const isRootLevel = item
      ? this.items.some((root) => this.getId(root) === id)
      : false;
    if (isSelected) {
      this.selectedIds.delete(id);
      if (isRootLevel) {
        this.selectedRootOrder = this.selectedRootOrder.filter(
          (rootId) => rootId !== id
        );
      }
      if (item)
        this.getAllChildIds(item).forEach((childId) =>
          this.selectedIds.delete(childId)
        );
    } else {
      // If root-level and limit is set, enforce limit by replacing oldest
      if (isRootLevel && this.limit > 0) {
        if (this.selectedRootOrder.length >= this.limit) {
          const oldestId = this.selectedRootOrder.shift();
          if (oldestId !== undefined) {
            // Remove the oldest root and its children
            const oldestRoot = this.items.find(
              (root) => this.getId(root) === oldestId
            );
            this.selectedIds.delete(oldestId);
            if (oldestRoot) {
              this.getAllChildIds(oldestRoot).forEach((childId) =>
                this.selectedIds.delete(childId)
              );
            }
          }
        }
      }
      this.selectedRootOrder.push(id);
      this.selectedIds.add(id);
      if (item)
        this.getAllChildIds(item).forEach((childId) =>
          this.selectedIds.add(childId)
        );
    }
    this.notify();
  }

  isSelected(id: string | number, item?: T) {
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

  getSelectedItems(items: T[] = this.items): T[] {
    return items
      .map((item) => {
        const subItems = item.subItems
          ? this.getSelectedItems(item.subItems)
          : undefined;
        const isSelected = this.selectedIds.has(this.getId(item));

        if (isSelected || (subItems && subItems.length > 0)) {
          return { ...item, isSelected, subItems };
        }
        return null;
      })
      .filter(Boolean) as T[];
  }

  getAllItems(items: T[]): OptionItem<T>[] {
    return items.map((item) => ({
      item,
      isSelected: this.isSelected(this.getId(item), item),
      toggleSelection: () => this.toggleSelection(this.getId(item), item),
      subItems: item.subItems ? this.getAllItems(item.subItems) : undefined,
    }));
  }
}
