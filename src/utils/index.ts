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
) => {
  option.isSelected = value;
  if (!option.subOptions?.length) {
    return;
  }
  if (!!value) {
    option.subOptions.map((subOp) => {
      toggleIsSelectedRecursively(subOp, true);
      return { ...subOp, isSelected: true };
    });
  } else {
    option.subOptions.map((subOp) => {
      toggleIsSelectedRecursively(subOp, false);
      return { ...subOp, isSelected: false };
    });
  }
};

export const getSelectedOptionRecursively = <T extends ID>(options: Option<T>[]) => {
  return options.filter(op => {
    if(!!op.subOptions?.length) {
      op.subOptions = getSelectedOptionRecursively(op.subOptions)
    }
    return op.isSelected;
  })
}

export const setToggleSelectedFunctionRecursively = <T extends ID>(
  options: Option<T>[],
  fun: (option: Option<T>, value: boolean) => void
) => {
  return options.map((op) => {
    op.toggleSelected = (value: boolean) => fun(op, value);
    if (!op.subOptions?.length) return;
    setToggleSelectedFunctionRecursively(op.subOptions, fun);
  });
};