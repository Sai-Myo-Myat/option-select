export interface OptionSelectProps<T> {
  items: OptionItemWithSubItems<T>[];
  getId: (item: T) => string | number;
  onSelectionChange?: (items: T[]) => void;
  limit?: number;
}

export type OptionItemWithSubItems<T> = T & {
  subItems?: OptionItemWithSubItems<T>[];
  isSelected?: boolean;
};

export interface OptionItem<T> {
  item: T;
  isSelected: boolean;
  toggleSelection: () => void;
  subItems?: OptionItem<T>[];
}

export type Subscriber = () => void;

export interface Result<T> {
  getAllItems: () => OptionItem<T>[];
  selectAll: () => void;
  deselectAll: () => void;
  getSelectedItems: () => OptionItemWithSubItems<T>[];
}
