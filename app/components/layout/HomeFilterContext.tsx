"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface HomeFilterContextValue {
  isHomeFilterOpen: boolean;
  openHomeFilter: () => void;
  closeHomeFilter: () => void;
  toggleHomeFilter: () => void;
}

const HomeFilterContext = createContext<HomeFilterContextValue | null>(null);

export function HomeFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHomeFilterOpen, setIsHomeFilterOpen] = useState(true);

  const openHomeFilter = useCallback(() => {
    setIsHomeFilterOpen(true);
  }, []);

  const closeHomeFilter = useCallback(() => {
    setIsHomeFilterOpen(false);
  }, []);

  const toggleHomeFilter = useCallback(() => {
    setIsHomeFilterOpen((current) => !current);
  }, []);

  const value = useMemo(
    () => ({
      isHomeFilterOpen,
      openHomeFilter,
      closeHomeFilter,
      toggleHomeFilter,
    }),
    [closeHomeFilter, isHomeFilterOpen, openHomeFilter, toggleHomeFilter],
  );

  return (
    <HomeFilterContext.Provider value={value}>
      {children}
    </HomeFilterContext.Provider>
  );
}

export function useHomeFilter() {
  const context = useContext(HomeFilterContext);

  if (!context) {
    throw new Error("useHomeFilter must be used within HomeFilterProvider");
  }

  return context;
}
