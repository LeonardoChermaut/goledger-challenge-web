import { Breadcrumb } from "@/components/Breadcrumb";
import { QueryResult } from "@/components/QueryResult";
import { LucideIcon } from "lucide-react";
import { FunctionComponent, ReactNode } from "react";

type BreadcrumbItem = { label: string; href?: string };

type DetailHeroProps = {
  breadcrumbs: BreadcrumbItem[];
  gradient: string;
  Icon: LucideIcon;
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  emptyMessage?: string;
  actions?: ReactNode;
  children: ReactNode;
  onRetry: () => void;
};

export const DetailHero: FunctionComponent<DetailHeroProps> = ({
  breadcrumbs,
  gradient,
  Icon,
  isLoading,
  error,
  isEmpty,
  emptyMessage = "Item não encontrado.",
  actions,
  children,
  onRetry,
}) => (
  <section className="relative overflow-hidden">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />

    <div className="container relative py-10 lg:py-12">
      <Breadcrumb items={breadcrumbs} />

      <QueryResult
        loading={isLoading}
        error={error}
        empty={isEmpty}
        emptyMessage={emptyMessage}
        onRetry={onRetry}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}
            >
              <Icon className="h-7 w-7 text-white/30" />
            </div>
            <div className="min-w-0 flex-1">{children}</div>
          </div>

          {actions && <div className="shrink-0 pt-1">{actions}</div>}
        </div>
      </QueryResult>
    </div>

    {!isLoading && !error && !isEmpty && (
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
    )}
  </section>
);
