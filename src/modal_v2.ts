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
  if (item?.subItems?.length) {
    const allChildrenSelected = getAllChildIds(item, getId).every((childId) =>
      selectedIds.has(childId)
    );
    if (allChildrenSelected && selectedIds.has(id)) {
      selectedIds.add(id);
    }
    if (!allChildrenSelected) {
      selectedIds.delete(id);
    }
    return allChildrenSelected;
  }
  return selectedIds.has(id);
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