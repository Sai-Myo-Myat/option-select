export interface OptionSelectProps<T extends ID> {
  options: Option<T>[];
}

export interface OptionSelectReturnProps<T extends ID> {
  getOptions: () => Option<T>[];
  getSelectedOptions: () => Option<T>[];
  onSelectionChange: (fn: (options: Option<T>[]) => void) => void;
}

export interface Option<T extends ID> {
  data: T;
  children?: T[];
  toggleSelected?: (value: boolean) => void;
  isSelected?: boolean;
}

export interface ID {
  id: number;
}

export interface DATA_CENTRE_TYPE<T extends ID> {
  options: Option<T>[];
}
