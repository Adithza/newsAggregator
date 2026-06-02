"use client";

import { createContext, useContext, useState } from "react";

const SearchContext = createContext<{
  searchTerm: string;
  setSearchTerm: (value: string) => void;
} | null>(null);

export function SearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch must be used inside SearchProvider");
  }

  return context;
}