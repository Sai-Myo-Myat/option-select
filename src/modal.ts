import { ID, Option } from "./types";
import { toggleItem } from "./utils";

export class DATA_CENTRE<T extends ID> {
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
