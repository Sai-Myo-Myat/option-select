import { useEffect, useState } from "react";
import { DATA_CENTRE } from "../modal";

export const useOptionSelect = <T extends { subItems?: T[] }>(
  items: T[],
  getId: (item: T) => string
) => {
  const [store] = useState(() => new DATA_CENTRE(items, getId));
  const [_, setVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setVersion((v) => v + 1));
    return unsubscribe;
  }, [store]);

  return {
    getAllItems: () => store.getAllItems(items),
    selectAll: () => store.selectAll(),
    deselectAll: () => store.deselectAll(),
  };
};
