import { useState } from "react";


export interface Selection<T> {
  selection: {
    items: T[];
    firstItem?: T;
    isSingleSelection: boolean;
    hasSelection: boolean;
    selectItems: (items: T[]) => void;
  }
}

export function useSelection<T>(): Selection<T> {
  const [items, setItems] = useState<T[]>([]);

  const hasSelection = items.length > 0;
  const firstItem = hasSelection ? items[0] : undefined;
  const isSingleSelection = hasSelection && items.length === 1;

  const selectItems = (items: T[]) => {
    setItems(items);
  }

  return { selection: { 
    items, firstItem, isSingleSelection, hasSelection, selectItems 
  } }
}