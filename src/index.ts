import {
  ID,
  Option,
  OptionSelectProps,
  OptionSelectReturnProps,
} from "./types";

class DATA_CENTRE<T extends ID> {
  private options: Option<T>[];
  private selectedOptions: Option<T>[];
  constructor(options: Option<T>[], selectedOptions: Option<T>[]) {
    this.options = options;
    this.selectedOptions = selectedOptions;
  }

  toggleSelect(option: Option<T>, value: boolean) {
    this.selectedOptions = toggleItem(this.selectedOptions, option, value);
  }

  isSelected(option: Option<T>) {
    return option.isSelected;
  }

  getSelectedOptions(): Option<T>[] {
    return this.selectedOptions;
  }

  getOptions(): Option<T>[] {
    return this.options;
  }
}

export const useOptionSelect = <T extends ID>(
  props: OptionSelectProps<T>
): OptionSelectReturnProps<T> => {
  const { options } = props;

  const selectedOptions = options.filter(
    (option) => option.isSelected === true
  );

  const data = new DATA_CENTRE(options, selectedOptions);

  const optionsFromDataCentre = data.getOptions();

  optionsFromDataCentre.map((option) => {
    option.toggleSelected = (value: boolean) =>
      data.toggleSelect(option, value);
    option.isSelected = data.isSelected(option);
  });

  const getSelectedOptions = () => {
    return data.getSelectedOptions();
  };

  const onSelectionChange = (fn: (options: Option<T>[]) => void) => {
    fn(data.getSelectedOptions());
  };

  const getOptions = () => {
    return data.getOptions();
  };

  return {
    getOptions,
    getSelectedOptions,
    onSelectionChange,
  };
};

export const toggleItem = <T extends ID>(
  array: Option<T>[],
  item: Option<T>,
  value: boolean
): Option<T>[] => {
  const index = array.findIndex(
    (existingItem) => existingItem.data.id === item.data.id
  );

  if (index === -1 && !!value) {
    // Item does not exist, add it
    item.isSelected = value;
    return [...array, item];
  } else {
    // Item exists, remove it
    return array.filter(
      (existingItem) => existingItem.data.id !== item.data.id
    );
  }
};
