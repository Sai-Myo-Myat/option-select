import { ID, Listener, Option } from "./types";
import {
  getSelectedOptionRecursively,
  setToggleSelectedFunctionRecursively,
  toggleIsSelectedRecursively,
} from "./utils";

export class DATA_CENTRE<T extends ID> {
  private options: Option<T>[];
  private selectedOptions: Option<T>[];
  private listeners: Set<Listener>;
  constructor(options: Option<T>[], selectedOptions: Option<T>[]) {
    this.options = options;
    this.selectedOptions =
      selectedOptions || getSelectedOptionRecursively(options);
    this.listeners = new Set();
  }

  toggleSelected(option: Option<T>, value: boolean) {
    this.options = this.options.map((op) => {
      if (op.id === option.id) {
        toggleIsSelectedRecursively(op, value);
      }
      return op;
    });
    this.selectedOptions = getSelectedOptionRecursively(this.options);
    this.notifyListeners();
  }

  setToggleSelectedFunction(options: Option<T>[]) {
    setToggleSelectedFunctionRecursively(options, this.toggleSelected);
  }

  //don't use
  isSelected(option: Option<T>) {
    return option.isSelected;
  }

  getSelectedOptions(): Option<T>[] {
    return [...this.selectedOptions]; // return new instance every time
  }

  getOptions(): Option<T>[] {
    return [...this.options]; // return new instance every time
  }

  //listeners
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.unsubscribe(listener); // Return an unsubscribe function
  }

  // Remove a listener
  unsubscribe(listener: Listener) {
    this.listeners.delete(listener);
  }

  // Notify all listeners of a state change
  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}
