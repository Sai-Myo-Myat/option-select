export interface OptionSelectProps<T> {
  options: T[];
  getId: (item: T) => string;
}

export interface OptionSelectReturnProps<T extends ID> {
  getOptions: () => Option<T>[];
  getSelectedOptions: () => Option<T>[];
  onSelectionChange: (fn: (options: Option<T>[]) => void) => void;
}

export type Option<T extends ID> = {
  subOptions?: Option<T>[];
  toggleSelected?: (value: boolean) => void;
  isSelected?: boolean;
} & T;

export interface ID {
  id: number;
}

export interface DATA_CENTRE_TYPE<T extends ID> {
  options: Option<T>[];
}

export type Subscriber = () => void;