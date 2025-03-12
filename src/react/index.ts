import { useEffect, useState } from "react";
import { DATA_CENTRE } from "../modal";
import { OptionSelectProps } from "../types";

export const useOptionSelect = <T extends { subItems?: T[] }>({
  items,
  getId,
  onSelectionChange,
}: OptionSelectProps<T>) => {
  const [store] = useState(
    () => new DATA_CENTRE(items, getId)
  );
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setVersion((v) => v + 1));
    return unsubscribe;
  }, [store]);

  useEffect(() => {
    if (version && onSelectionChange) {
      onSelectionChange(store.getSelectedItems());
    }
  }, [onSelectionChange, version, store]);

  return {
    getAllItems: () => store.getAllItems(items),
    selectAll: () => store.selectAll(),
    deselectAll: () => store.deselectAll(),
    getSelectedItems: () => store.getSelectedItems(),
  };
};
