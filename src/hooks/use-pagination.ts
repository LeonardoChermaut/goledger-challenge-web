import { useCallback, useMemo, useRef, useState } from "react";

interface UsePaginationOptions<T> {
  data: T[] | undefined;
  itemsPerPage?: number;
}

export const usePagination = <T>({
  data,
  itemsPerPage = 9,
}: UsePaginationOptions<T>) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const resetPaginationRef = useRef(() => setCurrentPage(1));

  const { totalPages, paginatedData } = useMemo(() => {
    const totalCount = data?.length || 0;
    const count = Math.ceil(totalCount / itemsPerPage);

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = data?.slice(start, end) || [];

    return {
      totalPages: count,
      paginatedData: paginated,
    };
  }, [data, currentPage, itemsPerPage]);

  const onPageChange = useCallback((page: number) => setCurrentPage(page), []);

  const resetPagination = useCallback(() => resetPaginationRef.current(), []);

  return {
    currentPage,
    totalPages,
    paginatedData,
    onPageChange,
    resetPagination,
  };
};
