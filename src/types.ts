export interface OptionSelectProps<T> {
  items: T[];
  getId: (item: T) => string;
  onSelectionChange?: (items: T[]) => void;
}
   
export interface OptionItem<T> {
  item: T;
  isSelected: boolean;
  toggleSelection: () => void;
  subItems?: OptionItem<T>[];
}

export type Subscriber = () => void;