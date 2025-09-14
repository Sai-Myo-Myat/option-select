import { useEffect, useState } from "react";
import { DATA_CENTRE } from "../modal";
import { OptionSelectProps, Result } from "../types";

/**
 * React hook for managing selectable options with nested sub-items.
 *
 * @template T - The type of each item.
 * @param {Object} props - The props for the hook.
 * @param {T[]} props.items - The array of items to manage selection for.
 * @param {(item: T) => string | number} props.getId - Function to get a unique ID for each item.
 * @param {(selected: T[]) => void} [props.onSelectionChange] - Optional callback fired when selection changes.
 * @returns {Object} Hook API for interacting with the selection state.
 * @returns {() => T[]} getAllItems - Returns all items (including nested sub-items).
 * @returns {() => void} selectAll - Selects all items.
 * @returns {() => void} deselectAll - Deselects all items.
 * @returns {() => T[]} getSelectedItems - Returns currently selected items.
 */
export const useOptionSelect = <T>({
  items,
  getId,
  onSelectionChange,
  limit,
}: OptionSelectProps<T>): Result<T> => {
  const [store] = useState(() => new DATA_CENTRE(items, getId, limit));
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setVersion((v) => v + 1));
    return unsubscribe;
  }, [store]);

  useEffect(() => {
    if (version && onSelectionChange) {
      onSelectionChange(store.getSelectedItems());
    }
  }, [onSelectionChange, version, store]);

  return {
    /**
     * Returns all items, including nested sub-items.
     */
    getAllItems: () => store.getAllItems(items),
    /**
     * Selects all items.
     */
    selectAll: () => store.selectAll(),
    /**
     * Deselects all items.
     */
    deselectAll: () => store.deselectAll(),
    /**
     * Returns currently selected items.
     */
    getSelectedItems: () => store.getSelectedItems(),
  };
};
