import { ID, Option } from "../types";

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
