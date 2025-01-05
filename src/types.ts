export interface OptionSelectProps<T extends ID> {
  options: Option<T>[];
}

export interface OptionSelectReturnProps<T extends ID> {
  getOptions: () => Option<T>[];
  getSelectedOptions: () => Option<T>[];
  onSelectionChange: (fn: (options: Option<T>[]) => void) => void;
}

export type Option<T extends ID> = {
  children?: T[];
  toggleSelected?: (value: boolean) => void;
  isSelected?: boolean;
} & T;
export interface ID {
  id: number;
}

export interface DATA_CENTRE_TYPE<T extends ID> {
  options: Option<T>[];
}

export type Listener = () => void;