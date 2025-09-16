import { GetIdFunctionType, OptionItemWithSubItems } from "./types";

function getAllChildIds<T>(
  item: OptionItemWithSubItems<T>,
  getId: GetIdFunctionType<T>
): (string | number)[] {
  if (!item.subItems) return [];
  return item.subItems.flatMap((sub) => [
    getId(sub),
    ...getAllChildIds(sub, getId),
  ]);
}

export function getAllItemIds<T>(
  items: OptionItemWithSubItems<T>[],
  getId: GetIdFunctionType<T>
): (string | number)[] {
  return items.flatMap((item) => [getId(item), ...getAllChildIds(item, getId)]);
}

export function isSelected<T>(
  id: string | number,
  getId: GetIdFunctionType<T>,
  item: OptionItemWithSubItems<T>,
  selectedIds: Set<string | number>
) {
  const newSelectedIds = new Set(selectedIds);
  if (item?.subItems?.length) {
    const allChildrenSelected = getAllChildIds(item, getId).every((childId) =>
      newSelectedIds.has(childId)
    );
    if (allChildrenSelected && newSelectedIds.has(id)) {
      newSelectedIds.add(id);
    }
    if (!allChildrenSelected) {
      newSelectedIds.delete(id);
    }
    return allChildrenSelected;
  }
  return newSelectedIds.has(id);
}

export function getSelectedItems<T>(
  items: OptionItemWithSubItems<T>[],
  selectedIds: Set<number | string>,
  getId: GetIdFunctionType<T>
): T[] {
  return items
    .map((item) => {
      const subItems = item.subItems
        ? getSelectedItems(item.subItems, selectedIds, getId)
        : undefined;
      const isSelected = selectedIds.has(getId(item));

      if (isSelected || (subItems && subItems.length > 0)) {
        return { ...item, isSelected, subItems };
      }
      return null;
    })
    .filter(Boolean) as T[];
}

export function toggleSelection<T>(
  id: string | number,
  item: OptionItemWithSubItems<T>,
  getId: GetIdFunctionType<T>,
  items: T[],
  selectedIds: Set<number | string>,
  selectedRootItemIds: (string | number)[],
  limit: number
): {
  selectedIds: Set<number | string>;
  selectedRootItemIds: (string | number)[];
  item: OptionItemWithSubItems<T>;
} {
  const newSelectedIds = new Set(selectedIds);
  const newItem = item;
  let newSelectedRootItemIds = selectedRootItemIds;
  const isSelected = newSelectedIds.has(id);
  // Check if this is a root-level item
  const isRootLevel = newItem
    ? items.some((root) => getId(root) === id)
    : false;
  if (isSelected) {
    newSelectedIds.delete(id);
    if (isRootLevel) {
      newSelectedRootItemIds = newSelectedRootItemIds.filter(
        (rootId) => rootId !== id
      );
    }
    if (newItem)
      getAllChildIds(newItem, getId).forEach((childId) =>
        newSelectedIds.delete(childId)
      );
  } else {
    // If root-level and limit is set, enforce limit by replacing oldest
    if (isRootLevel && limit > 0) {
      if (newSelectedRootItemIds.length >= limit) {
        const oldestId = newSelectedRootItemIds.shift();
        if (oldestId !== undefined) {
          // Remove the oldest root and its children
          const oldestRoot = items.find((root) => getId(root) === oldestId);
          newSelectedIds.delete(oldestId);
          if (oldestRoot) {
            getAllChildIds(oldestRoot, getId).forEach((childId) =>
              newSelectedIds.delete(childId)
            );
          }
        }
      }
    }
    newSelectedRootItemIds.push(id);
    newSelectedIds.add(id);
    if (newItem)
      getAllChildIds(newItem, getId).forEach((childId) =>
        newSelectedIds.add(childId)
      );
  }

  return {
    selectedIds: newSelectedIds,
    selectedRootItemIds: newSelectedRootItemIds,
    item: newItem,
  };
}
