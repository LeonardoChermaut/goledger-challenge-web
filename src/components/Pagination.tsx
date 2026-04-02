import { cn } from "@/lib/lib";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { FunctionComponent } from "react";

type PaginationProps = {
  totalPages: number;
  className?: string;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export const Pagination: FunctionComponent<PaginationProps> = ({
  currentPage,
  totalPages,
  className,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showMax = 5;

    if (totalPages <= showMax + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div
      className={cn("flex items-center justify-center gap-1 py-6", className)}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:pointer-events-none active:scale-95"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1 mx-2">
        {getPageNumbers().map((page, idx) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-9 w-9 items-center justify-center text-muted-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-all active:scale-95",
                currentPage === page
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border border-transparent hover:border-input hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:pointer-events-none active:scale-95"
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
