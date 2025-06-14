/**
 * items: your item array
 * getId: unique id selector
 * onSelectionChange?: callback function to invoke when selection changes happen
 */
export interface OptionSelectProps<T> {
  items: T[];
  getId: (item: T) => string;
  onSelectionChange?: (items: T[]) => void;
}

/**
 * OptionItem<T> wraps your item with selection state and helpers.
 * - item: The original item.
 * - isSelected: Whether the item is selected.
 * - toggleSelection: Function to toggle selection.
 */
export interface OptionItem<T> {
  item: T;
  isSelected: boolean;
  toggleSelection: () => void;
}

export type Subscriber = () => void;