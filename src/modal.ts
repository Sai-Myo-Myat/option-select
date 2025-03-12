import { OptionItem, Subscriber } from "./types";

export class DATA_CENTRE<T extends { subItems?: T[]; isSelected?: boolean }> {
  private selectedIds = new Set<string>();
  private subscribers: Subscriber[] = [];

  constructor(private items: T[], private getId: (item: T) => string) {
    this.items.forEach((item) => {
      if (item.isSelected) {
        this.selectedIds.add(this.getId(item));
      }

      if (item.subItems) {
        item.subItems.forEach((item) => {
          if (item.isSelected) {
            this.selectedIds.add(this.getId(item));
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

  private getAllItemIds(items: T[]): string[] {
    return items.flatMap((item) => [
      this.getId(item),
      ...this.getAllChildIds(item),
    ]);
  }

  selectAll() {
    this.selectedIds = new Set(this.getAllItemIds(this.items));
    this.notify();
  }

  deselectAll() {
    this.selectedIds.clear();
    this.notify();
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
