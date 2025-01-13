import { ID, Option } from "../types";

// don't use anymore
export const toggleItem = <T extends ID>(
  array: Option<T>[],
  item: Option<T>,
  value: boolean
): Option<T>[] => {
  const index = array.findIndex(
    (existingItem) => existingItem.id === item.id
  );
  if (index === -1 && !!value) {
    // Item does not exist, add it
    return [...array, item];
  } else {
    // Item exists, remove it
    return array.filter(
      (existingItem) => existingItem.id !== item.id
    );
  }
};

export const toggleIsSelectedRecursively = <T extends ID>(
  option: Option<T>,
  value: boolean
): T => {
  const newOption = deepCopy(option);
  newOption.isSelected = value;
  if (!newOption.subOptions?.length) {
    return newOption;
  }
  newOption.subOptions = newOption.subOptions.map((subOp) => {
    return toggleIsSelectedRecursively(subOp, value);
  });

  return newOption;
};

export const findAndtoggleIsSelectedRecursively = <T extends ID>(
  options: Option<T>[],
  option: Option<T>,
  value: boolean
) => {
  const newOptions = deepCopy(options);
  return newOptions.map((op) => {
    if (op.id == option.id) {
      return toggleIsSelectedRecursively(op, value);
    }
    if (!!op.subOptions?.length) {
      op.subOptions = findAndtoggleIsSelectedRecursively(
        op.subOptions,
        option,
        value
      );
    }
    return op;
  });

};

export const getSelectedOptionRecursively = <T extends ID>(
  options: Option<T>[]
) => {
  return options.filter((op) => {
    if (!!op.subOptions?.length) {
      op.subOptions = getSelectedOptionRecursively(op.subOptions);
    }
    return op.isSelected;
  });
};

export const setToggleSelectedFunctionRecursively = <T extends ID>(
  options: Option<T>[],
  fun: (option: Option<T>, value: boolean) => void
): Option<T>[] => {
  const newOptions = deepCopy(options);
  return newOptions.map((op) => {
    op.toggleSelected = (value: boolean) => fun(op, value);
    if (!!op.subOptions?.length) {
      op.subOptions = setToggleSelectedFunctionRecursively(op.subOptions, fun);
    }
    return op;
  });
};

const deepCopy = <T>(obj: T): T => {
  if (typeof obj !== "object" || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopy(item)) as T; // Recursively copy array elements
  }

  const copiedObject: T = {} as T;
  for (const key in obj) {
    //check Safe Property Access
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copiedObject[key] = deepCopy(obj[key]); // Recursively copy each property
    }
  }

  return copiedObject;
};