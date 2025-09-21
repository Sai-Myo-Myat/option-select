import { useState, useCallback } from "react";
import {
  getAllItemIds,
  getSelectedItems,
  toggleSelection,
} from "../../modal_v2";
import {
  OptionItem,
  OptionItemWithSubItems,
  OptionSelectProps,
  Result,
} from "../../types";

export function useOptionSelect<T>({
  items,
  getId,
  onSelectionChange,
  limit = 0,
}: OptionSelectProps<T>): Result<T> {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set()
  );
  const [selectedRootItemIds, setSelectedRootItemIds] = useState<
    (string | number)[]
  >([]);

  // Select all items up to limit
  const selectAll = useCallback(() => {
    let newSelectedIds: Set<string | number>;
    let newSelectedRootOrder: (string | number)[];
    if (limit > 0) {
      const canSelectCount = limit - selectedRootItemIds.length;
      const selectedRootSet = new Set(selectedRootItemIds);
      const unselectedRoots = items.filter(
        (item) => !selectedRootSet.has(getId(item))
      );
      const toSelect = unselectedRoots.slice(0, canSelectCount);
      newSelectedIds = new Set(selectedIds);
      newSelectedRootOrder = [...selectedRootItemIds];
      toSelect.forEach((item) => {
        const id = getId(item);
        newSelectedRootOrder.push(id);
        newSelectedIds.add(id);
        getAllItemIds(item.subItems || [], getId).forEach((childId) =>
          newSelectedIds.add(childId)
        );
      });
    } else {
      const allIds = getAllItemIds(items, getId);
      newSelectedIds = new Set(allIds);
      newSelectedRootOrder = items.map((item) => getId(item));
    }
    setSelectedIds(newSelectedIds);
    setSelectedRootItemIds(newSelectedRootOrder);
    if (onSelectionChange) {
      onSelectionChange(getSelectedItems(items, newSelectedIds, getId));
    }
  }, [items, selectedIds, selectedRootItemIds, limit, getId, onSelectionChange]);

  // Deselect all items
  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
    setSelectedRootItemIds([]);
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  }, [onSelectionChange]);

  // Toggle selection for an item
  const handleToggleSelection = useCallback(
    (item: OptionItemWithSubItems<T>) => {
      const result = toggleSelection(
        item,
        getId,
        items,
        selectedIds,
        selectedRootItemIds,
        limit
      );
      setSelectedIds(result.selectedIds);
      setSelectedRootItemIds(result.selectedRootItemIds);
      if (onSelectionChange) {
        onSelectionChange(getSelectedItems(items, result.selectedIds, getId));
      }
    },
    [items, getId, selectedIds, selectedRootItemIds, limit, onSelectionChange]
  );

  // Recursively get all items with selection state and toggleSelection
  const buildItemTree = useCallback(
    (item: OptionItemWithSubItems<T>): OptionItem<T> => {
      return {
        item,
        isSelected: selectedIds.has(getId(item)),
        toggleSelection: () => handleToggleSelection(item),
        subItems: item.subItems
          ? item.subItems.map((sub) => buildItemTree(sub))
          : undefined,
      };
    },
    [selectedIds, getId, handleToggleSelection]
  );

  const getAllItems = useCallback(() => {
    return items.map((item) => buildItemTree(item));
  }, [items, buildItemTree]);

  // Get currently selected items
  const getSelectedItemsCallback = useCallback(() => {
    return getSelectedItems(items, selectedIds, getId);
  }, [items, selectedIds, getId]);

  return {
    getAllItems,
    selectAll,
    deselectAll,
    getSelectedItems: getSelectedItemsCallback,
  };
}
