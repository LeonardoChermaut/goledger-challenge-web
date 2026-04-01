import { useMemo } from "react";

interface IUseGroupedAssetsOptions<T> {
  data: T[] | undefined;
  groupBy: (item: T) => string;
}

export const useGroupedAssets = <T>({
  data,
  groupBy,
}: IUseGroupedAssetsOptions<T>) => {
  const groups = useMemo(() => {
    if (!data) {
      return [];
    }

    const grouped: Record<string, T[]> = {};

    data.forEach((item) => {
      const key = groupBy(item);

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    return Object.entries(grouped);
  }, [data, groupBy]);

  return { groups };
};
