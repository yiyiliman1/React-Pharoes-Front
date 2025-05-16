import { createContext, useContext, useEffect, useState } from "react";

interface INavigationContext {
  resetMenuItemsExpand: (omit?: string) => void;
  isMenuItemExpanded: (label: string) => boolean;
  setMenuItemExpanded: (label: string, expanded: boolean) => void;
  toggleMenuItemExpansion: (label: string) => void;
}

export const NavigationContext = createContext<INavigationContext>({ data: [] } as any);

interface NavigationProviderProps {
  children: React.ReactChild | React.ReactChild[];
}

type MenuItemsExpandMap = Record<string, boolean>;

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const [expandMap, setExpandMap] = useState<MenuItemsExpandMap>({});

  function isMenuItemExpanded(label: string): boolean {
    return expandMap[label] ?? false;
  }

  function setMenuItemExpanded(label: string, expanded: boolean): void {
    const newMap = { ...expandMap, [label]: expanded };
    setExpandMap(newMap);
  }

  function toggleMenuItemExpansion(label: string): void {
    const newMap = { ...expandMap, [label]: !expandMap[label] };
    setExpandMap(newMap);
  }

  function resetMenuItemsExpand(omit?: string) {
    const newMap = Object.keys(expandMap).reduce((newMap, label) => {
      const opened = label === omit ? expandMap[label] : false;
      newMap[label] = opened;
      return newMap;
    }, {} as MenuItemsExpandMap);
    setExpandMap(newMap);
  }

  return <NavigationContext.Provider value={{ isMenuItemExpanded, setMenuItemExpanded, resetMenuItemsExpand, toggleMenuItemExpansion }}>{children}</NavigationContext.Provider>;
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigationContext must be used within a NavigationProvider.");
  }
  return context;
};
