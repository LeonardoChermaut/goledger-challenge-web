import { useMemo, useState } from "react";

type AssetSearchProps<T> = {
  data: T[] | undefined;
  searchKey?: keyof T;
  onFilterChange?: (term: string) => void;
  customFilter?: (item: T, term: string) => boolean;
};

export const useAssetSearch = <T>({
  data,
  searchKey = "title" as keyof T,
  customFilter,
  onFilterChange,
}: AssetSearchProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilterChange?.(value);
  };

  const filteredData = useMemo(() => {
    if (!data) {
      return [];
    }

    if (!searchTerm) {
      return data;
    }

    const term = searchTerm.toLowerCase();

    return data.filter((item) => {
      if (customFilter) {
        return customFilter(item, term);
      }

      const itemValue = item[searchKey];
      if (typeof itemValue === "string") {
        return itemValue.toLowerCase().includes(term);
      }

      return false;
    });
  }, [data, searchTerm, searchKey, customFilter]);

  return {
    searchTerm,
    filteredData,
    setSearchTerm,
    handleSearchChange,
  };
};
