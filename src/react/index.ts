import { useEffect, useState } from "react";
import { DATA_CENTRE } from "../modal";
import { OptionSelectProps } from "../types";

export const useOptionSelect = <T extends { subItems?: T[] }>({
  items,
  getId,
}: OptionSelectProps<T>) => {
  const [store] = useState(() => new DATA_CENTRE(items, getId));
  const [_, setVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setVersion((v) => v + 1));
    return unsubscribe;
  }, [store]);

  return {
    getAllItems: () => store.getAllItems(items),
    selectAll: () => store.toggleSelection("all"),
    deselectAll: () => store.toggleSelection("none"),
  };
};
